<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Project;
use App\Models\ChannelPartner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Enums\UserRole;
use App\Models\Tower;
use App\Models\PropertyType;
use App\Models\UnitType;
use App\Models\Commission;
use Illuminate\Support\Facades\DB;
use App\Models\ChannelPartnerProject;
class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with([
            'customer',
            'project',
            'channelPartner',
            'collections'
        ])
            ->when($request->search, function ($q) use ($request) {
                $q->where('booking_number', 'like', "%{$request->search}%")
                    ->orWhereHas('customer', function ($cq) use ($request) {
                        $cq->where('first_name', 'like', "%{$request->search}%")
                            ->orWhere('last_name', 'like', "%{$request->search}%");
                    })
                    ->orWhere('unit_name', 'like', "%{$request->search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        // dd($bookings->toArray());
        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only('search'),
        ]);
    }
    public function show($id)
    {
        $booking = Booking::with([
            'customer',
            'project',
            'channelPartner',
            'assignedUser',
            'collections' // Ye line add karni hai
        ])->findOrFail($id);

        // dd($booking->toArray());

        return Inertia::render('Bookings/Show', [
            'booking' => $booking
        ]);
    }
    public function create()
    {
        return Inertia::render('Bookings/Create', [
            'customers' => Customer::select('_id', 'first_name', 'last_name')->get(),
            'projects' => Project::select('_id', 'name')->get(),
            'channelPartners' => ChannelPartner::select('_id', 'partner_name')->get(),

            'users' => User::select('_id', 'name')
                ->whereIn('role', [UserRole::MANAGER, UserRole::EMPLOYEE])
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateBooking($request);

        $validated['created_by'] = auth()->id();

        // Calculate all financials using the helper method
        $this->calculateBooking($validated);

        // Upload Files
        $files = ['booking_form', 'agreement_document', 'payment_receipt'];
        foreach ($files as $file) {
            if ($request->hasFile($file)) {
                $validated[$file] = $request->file($file)->store('bookings/docs', 'public');
            }
        }

        DB::beginTransaction();

        try {
            $booking = Booking::create($validated);

            // Create Commission if Channel Partner is assigned
            if (!empty($booking->channel_partner_id)) {
                Commission::create([
                    // Relation IDs
                    'booking_id' => $booking->id,
                    'customer_id' => $booking->customer_id,
                    'project_id' => $booking->project_id,
                    'channel_partner_id' => $booking->channel_partner_id,

                    // Booking Meta
                    'booking_number' => $booking->booking_number,
                    'total_sale_amount' => $booking->total_amount, // As per Commission Model

                    // Commission Data
                    'commission_type' => $booking->commission_type,
                    'commission_value' => $booking->commission_value,
                    'commission_amount' => $booking->commission_amount,

                    // Status & Tracking
                    'paid_amount' => 0, // Initial state
                    'due_amount' => $booking->commission_amount, // Due amount is initially the total commission
                    'payment_status' => $booking->commission_status ?? 'Pending',
                    'payment_date' => null,
                    'payment_mode' => null,
                    'transaction_number' => null,
                    'bank_name' => null,

                    'remarks' => 'Generated from Booking creation.',
                    'status' => 'active', // Assuming you have a default status field
                    'created_by' => auth()->id(),
                ]);
            }

            DB::commit();

            return redirect()->route('bookings.index')
                ->with('success', 'Booking created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withInput()
                ->with('error', $e->getMessage());
        }
    }

    public function edit(Booking $booking)
    {
        return Inertia::render('Bookings/Edit', [
            'booking' => $booking,
            'customers' => Customer::select('id', 'first_name', 'last_name')->get(),
            'projects' => Project::select('id', 'name')->get(),
            'channelPartners' => ChannelPartner::select('id', 'partner_name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $this->validateBooking($request, $booking->id);

        $validated['updated_by'] = auth()->id();

        // Calculate all financials using the helper method
        $this->calculateBooking($validated);

        // Upload Files & Delete Old Ones
        $fileFields = ['booking_form', 'agreement_document', 'payment_receipt'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                if (!empty($booking->$field)) {
                    Storage::disk('public')->delete($booking->$field);
                }
                // Store new file
                $validated[$field] = $request->file($field)->store('bookings/docs', 'public');
            }
        }

        DB::beginTransaction();

        try {
            // Update Booking
            $booking->update($validated);

            // Update or Create Commission
            if (!empty($booking->channel_partner_id)) {
                $commission = Commission::firstOrNew([
                    'booking_id' => $booking->id,
                ]);

                // Calculate the new due amount based on updated total and already paid amount
                $paidAmount = $commission->paid_amount ?? 0;
                $newDueAmount = $booking->commission_amount - $paidAmount;

                // Safety check: Due amount shouldn't be negative generally, but depends on your business logic
                if ($newDueAmount < 0)
                    $newDueAmount = 0;

                $commission->fill([
                    // Update basic relations just in case they changed
                    'customer_id' => $booking->customer_id,
                    'project_id' => $booking->project_id,
                    'channel_partner_id' => $booking->channel_partner_id,

                    // Update Meta
                    'booking_number' => $booking->booking_number,
                    'total_sale_amount' => $booking->total_amount,

                    // Update Commission Values
                    'commission_type' => $booking->commission_type,
                    'commission_value' => $booking->commission_value,
                    'commission_amount' => $booking->commission_amount,

                    // Update Tracking
                    'due_amount' => $newDueAmount,
                    'payment_status' => $commission->payment_status ?? ($booking->commission_status ?? 'Pending'),

                    'remarks' => $commission->remarks ?? 'Updated from Booking modification.',
                    'created_by' => $commission->created_by ?? auth()->id(),
                ]);

                $commission->save();
            }

            DB::commit();

            return redirect()->route('bookings.index')
                ->with('success', 'Booking updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withInput()
                ->with('error', $e->getMessage());
        }
    }
    private function calculateBooking(array &$validated): void
    {
        $basePrice = (float) ($validated['base_price'] ?? 0);
        $discount = (float) ($validated['discount_amount'] ?? 0);
        $other = (float) ($validated['other_amount'] ?? 0);
        $tax = (float) ($validated['tax_percentage'] ?? 0);
        $booking = (float) ($validated['booking_amount'] ?? 0);

        $subTotal = $basePrice - $discount + $other;

        $validated['tax_amount'] =
            ($subTotal * $tax) / 100;

        $validated['total_amount'] =
            $subTotal + $validated['tax_amount'];

        $validated['paid_amount'] =
            $booking;

        $validated['due_amount'] =
            $validated['total_amount'] - $booking;

        $validated['refund_amount'] =
            (float) ($validated['refund_amount'] ?? 0);

        if (
            !empty($validated['channel_partner_id']) &&
            !empty($validated['commission_value'])
        ) {

            if ($validated['commission_type'] === 'Percentage') {

                $validated['commission_amount'] =
                    (
                        $validated['total_amount']
                        *
                        (float) $validated['commission_value']
                    ) / 100;

            } else {

                $validated['commission_amount'] =
                    (float) $validated['commission_value'];
            }

            $validated['commission_status'] =
                $validated['commission_status']
                ?? 'Pending';

        } else {

            $validated['commission_amount'] = 0;
            $validated['commission_status'] = null;
        }
    }
    public function destroy(Booking $booking)
    {
        // Delete files
        $fileFields = ['booking_form', 'agreement_document', 'payment_receipt'];
        foreach ($fileFields as $field) {
            if ($booking->$field) {
                Storage::disk('public')->delete($booking->$field);
            }
        }

        $booking->delete();
        return back()->with('success', 'Booking deleted successfully.');
    }

    private function validateBooking(Request $request, $id = null)
    {
        return $request->validate([


            'customer_id' => 'required',

            'project_id' => 'required',

            'unit_id' => 'required',

            'channel_partner_id' => 'nullable',

            'assigned_user_id' => 'nullable',

            'booking_date' => 'required|date',

            'agreement_date' => 'nullable|date',

            'registration_date' => 'nullable|date',

            'followup_date' => 'nullable|date',

            'possession_date' => 'nullable|date',

            'cancellation_date' => 'nullable|date',

            'tower_name' => 'nullable|string',

            'floor_name' => 'nullable|string',

            'unit_name' => 'nullable|string',

            'property_type' => 'nullable|string',

            'unit_type' => 'nullable|string',

            'configuration' => 'nullable|string',

            'unit_size' => 'nullable',

            'unit_size_unit' => 'nullable|string',


            'base_price' => 'required|numeric',

            'booking_amount' => 'nullable|numeric',

            'discount_amount' => 'nullable|numeric',

            'other_amount' => 'nullable|numeric',

            'tax_percentage' => 'nullable|numeric',

            'tax_amount' => 'nullable|numeric',

            'total_amount' => 'nullable|numeric',

            'paid_amount' => 'nullable|numeric',

            'due_amount' => 'nullable|numeric',

            'refund_amount' => 'nullable|numeric',


            'commission_type' =>
                'nullable|in:Percentage,Fixed',

            'commission_value' =>
                'nullable|numeric',

            'commission_amount' =>
                'nullable|numeric',

            'commission_status' =>
                'nullable|string',

            'payment_plan' =>
                'nullable|string',

            'payment_status' =>
                'required|string',


            'booking_form' =>
                'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',

            'agreement_document' =>
                'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',

            'payment_receipt' =>
                'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',


            'remarks' =>
                'nullable|string',

            'cancellation_reason' =>
                'nullable|string',

            'status' =>
                'required|in:Pending,Confirmed,Completed,Cancelled',

        ]);
    }
    public function getProjectUnits($projectId)
    {
        $towers = Tower::where('project_id', $projectId)->get();

        $propertyTypes = PropertyType::select('_id', 'name')
            ->get()
            ->keyBy('_id');

        $unitTypes = UnitType::select('_id', 'name')
            ->get()
            ->keyBy('_id');

        $result = [];

        foreach ($towers as $tower) {

            $floors = [];

            foreach ($tower->units ?? [] as $unit) {

                if (
                    isset($unit['status']) &&
                    strtolower($unit['status']) !== 'available'
                ) {
                    continue;
                }

                $unitNumber =
                    $unit['unit_number']
                    ?? $unit['name']
                    ?? '';

                $floorNumber =
                    $unit['floor_number']
                    ?? null;

                $propertyTypeName = null;
                $unitTypeName = null;
                $roomSizes = [];
                $unitSize = null;


                $floorDesign = null;

                if (
                    !empty($tower->floor_designs) &&
                    $floorNumber !== null
                ) {
                    $floorDesign = collect(
                        $tower->floor_designs
                    )->first(function ($design) use ($floorNumber) {
                        return
                            $floorNumber >= ($design['from_floor'] ?? 0)
                            &&
                            $floorNumber <= ($design['to_floor'] ?? 0);
                    });
                }

                if ($floorDesign) {

                    $propertyType =
                        $propertyTypes->get(
                            $floorDesign['property_type_id']
                        );

                    $unitType =
                        $unitTypes->get(
                            $floorDesign['unit_type_id']
                        );

                    $propertyTypeName =
                        $propertyType?->name;

                    $unitTypeName =
                        $unitType?->name;

                    $roomSizes =
                        $floorDesign['room_sizes']
                        ?? [];

                    $unitSize =
                        $floorDesign['unit_size']
                        ?? null;
                }


                if (
                    !$floorDesign &&
                    !empty($tower->unit_ranges)
                ) {

                    $numericUnit = (int) preg_replace(
                        '/[^0-9]/',
                        '',
                        $unitNumber
                    );

                    $unitRange = collect(
                        $tower->unit_ranges
                    )->first(function ($range) use ($numericUnit) {
                        return
                            $numericUnit >= ($range['from_unit'] ?? 0)
                            &&
                            $numericUnit <= ($range['to_unit'] ?? 0);
                    });

                    if ($unitRange) {

                        $propertyType =
                            $propertyTypes->get(
                                $unitRange['property_type_id']
                            );

                        $unitType =
                            $unitTypes->get(
                                $unitRange['unit_type_id']
                            );

                        $propertyTypeName =
                            $propertyType?->name;

                        $unitTypeName =
                            $unitType?->name;

                        $roomSizes =
                            $unitRange['room_sizes']
                            ?? [];

                        $unitSize =
                            $unitRange['unit_size']
                            ?? null;
                    }
                }

                $unitData = [
                    'unit_id' =>
                        $unit['_id']
                        ?? $unitNumber,

                    'tower_name' =>
                        $tower->name,

                    'floor_name' =>
                        $floorNumber
                        ?? 'Ground',

                    'unit_name' =>
                        $unitNumber,

                    'property_type' =>
                        $propertyTypeName,

                    'configuration' =>
                        $unitTypeName,

                    'unit_type' =>
                        $unitTypeName,

                    'unit_size' =>
                        $unitSize
                        ?? $unit['unit_size']
                        ?? '',

                    'unit_size_unit' =>
                        $unit['unit_size_unit']
                        ?? 'Sq.Ft',

                    'room_sizes' =>
                        $roomSizes,

                    'status' =>
                        $unit['status']
                        ?? 'available',
                ];

                $groupFloor =
                    $floorNumber !== null
                    ? $floorNumber
                    : 'Ground';

                $floors[$groupFloor][] =
                    $unitData;
            }

            if (empty($floors)) {
                continue;
            }

            if ($tower->type === 'apartment') {
                krsort($floors);
            }

            $floorData = [];

            foreach ($floors as $floorName => $units) {
                $floorData[] = [
                    'floor_name' => $floorName,
                    'units' => array_values($units),
                ];
            }

            $result[] = [
                'tower_name' =>
                    $tower->name,

                'tower_type' =>
                    $tower->type,

                'total_floors' =>
                    $tower->total_floors,

                'total_units' =>
                    $tower->total_units,

                'floors' =>
                    $floorData,
            ];
        }
        // dd($result);
        return response()->json($result);
    }

    public function getCommission($partnerId, $projectId)
    {
        // dd($partnerId, $projectId);
        $commission = ChannelPartnerProject::where(
            'channel_partner_id',
            $partnerId
        )
            ->where(
                'project_id',
                $projectId
            )
            ->first();

        return response()->json($commission);
    }
}