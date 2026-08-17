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
        $bookings = Booking::visibleTo(auth()->user())
            ->with([
                'customer',
                'project',
                'channelPartner',
                'collections'
            ])
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where(
                        'booking_number',
                        'like',
                        "%{$request->search}%"
                    )
                        ->orWhereHas('customer', function ($cq) use ($request) {
                            $cq->where(
                                'first_name',
                                'like',
                                "%{$request->search}%"
                            )
                                ->orWhere(
                                    'last_name',
                                    'like',
                                    "%{$request->search}%"
                                );
                        })
                        ->orWhere(
                            'unit_name',
                            'like',
                            "%{$request->search}%"
                        );
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only('search'),
        ]);
    }

    public function show($id)
    {
        $booking = Booking::visibleTo(auth()->user())
            ->with([
                'customer',
                'project',
                'channelPartner',
                'assignedUser',
                'collections'
            ])
            ->findOrFail($id);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking
        ]);
    }

    public function create()
    {
        $currentUser = auth()->user();
        $users = collect();

        if ($currentUser->isSuperAdmin()) {
            $users = User::whereIn(
                'role',
                [
                    UserRole::MANAGER,
                    UserRole::EMPLOYEE
                ]
            )
                ->select('_id', 'name', 'role')
                ->get();
        } elseif ($currentUser->isManager()) {
            $users = User::where(
                'manager_id',
                (string) $currentUser->_id
            )
                ->where(
                    'role',
                    UserRole::EMPLOYEE
                )
                ->select('_id', 'name', 'role')
                ->get();
        }

        return Inertia::render('Bookings/Create', [
            'customers' => Customer::visibleTo($currentUser)
                ->select('_id', 'first_name', 'last_name')
                ->get(),

            'projects' => Project::visibleTo($currentUser)
                ->select('_id', 'name')
                ->get(),

            'channelPartners' => ChannelPartner::select(
                '_id',
                'partner_name'
            )->get(),

            'users' => $users,

            'currentRole' => $currentUser->role,
            'currentUserId' => (string) $currentUser->_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateBooking($request);
        $currentUser = auth()->user();

        $validated['created_by_id'] = (string) $currentUser->_id;
        $validated['created_by_type'] = User::class;

        if ($currentUser->isEmployee()) {
            $validated['assigned_user_id'] = (string) $currentUser->_id;
        } else {
            $validated['assigned_user_id'] = $request->assigned_user_id;
        }

        $this->calculateBooking($validated);

        $files = ['booking_form', 'agreement_document', 'payment_receipt'];
        foreach ($files as $file) {
            if ($request->hasFile($file)) {
                $validated[$file] = $request->file($file)->store('bookings/docs', 'public');
            }
        }

        DB::beginTransaction();

        try {
            $booking = Booking::create($validated);
            // dd($booking->status);
            if (in_array($booking->status, ['Hold', 'Booked', 'Agreement Done', 'Completed'])) {
                $statusToSet = strtolower($booking->status) === 'hold' ? 'hold' : 'booked';
                $this->updateUnitStatus($booking, $statusToSet);
            } elseif ($booking->status === 'Registered') {
                $this->updateUnitStatus($booking, 'sold');
            }

            if (!empty($booking->channel_partner_id)) {
                Commission::create([
                    'booking_id' => $booking->id,
                    'customer_id' => $booking->customer_id,
                    'project_id' => $booking->project_id,
                    'channel_partner_id' => $booking->channel_partner_id,
                    'booking_number' => $booking->booking_number,
                    'total_sale_amount' => $booking->total_amount,
                    'commission_type' => $booking->commission_type,
                    'commission_value' => $booking->commission_value,
                    'commission_amount' => $booking->commission_amount,
                    'paid_amount' => 0,
                    'due_amount' => $booking->commission_amount,
                    'payment_status' => $booking->commission_status ?? 'Pending',
                    'payment_date' => null,
                    'payment_mode' => null,
                    'transaction_number' => null,
                    'bank_name' => null,
                    'remarks' => 'Generated from Booking creation.',
                    'status' => 'active',
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

    public function edit($id)
    {
        $booking = Booking::visibleTo(
            auth()->user()
        )->findOrFail($id);

        return Inertia::render('Bookings/Edit', [
            'booking' => $booking,
            'customers' => Customer::visibleTo(auth()->user())
                ->select('_id', 'first_name', 'last_name')
                ->get(),
            'projects' => Project::visibleTo(auth()->user())
                ->select('_id', 'name')
                ->get(),
            'channelPartners' => ChannelPartner::select('id', 'partner_name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::visibleTo(
            auth()->user()
        )->findOrFail($id);

        $validated = $this->validateBooking($request, $booking->id);

        $validated['updated_by_id'] = (string) auth()->id();
        $validated['updated_by_type'] = User::class;

        $this->calculateBooking($validated);

        $fileFields = ['booking_form', 'agreement_document', 'payment_receipt'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                if (!empty($booking->$field)) {
                    Storage::disk('public')->delete($booking->$field);
                }
                $validated[$field] = $request->file($field)->store('bookings/docs', 'public');
            }
        }

        DB::beginTransaction();

        try {
            $booking->update($validated);

            if ($booking->status === 'Registered') {
                $this->updateUnitStatus($booking, 'sold');
            } elseif ($booking->status === 'Cancelled' || $booking->status === 'Refunded') {
                $this->releaseUnit($booking);
            } elseif (in_array($booking->status, ['Hold', 'Booked', 'Agreement Done', 'Completed'])) {
                $statusToSet = strtolower($booking->status) === 'hold' ? 'hold' : 'booked';
                $this->updateUnitStatus($booking, $statusToSet);
            }

            if (!empty($booking->channel_partner_id)) {
                $commission = Commission::firstOrNew([
                    'booking_id' => $booking->id,
                ]);

                $paidAmount = $commission->paid_amount ?? 0;
                $newDueAmount = $booking->commission_amount - $paidAmount;

                if ($newDueAmount < 0) {
                    $newDueAmount = 0;
                }

                $commission->fill([
                    'customer_id' => $booking->customer_id,
                    'project_id' => $booking->project_id,
                    'channel_partner_id' => $booking->channel_partner_id,
                    'booking_number' => $booking->booking_number,
                    'total_sale_amount' => $booking->total_amount,
                    'commission_type' => $booking->commission_type,
                    'commission_value' => $booking->commission_value,
                    'commission_amount' => $booking->commission_amount,
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

    public function destroy($id)
    {
        $booking = Booking::visibleTo(
            auth()->user()
        )->findOrFail($id);

        $fileFields = ['booking_form', 'agreement_document', 'payment_receipt'];
        foreach ($fileFields as $field) {
            if ($booking->$field) {
                Storage::disk('public')->delete($booking->$field);
            }
        }

        $this->releaseUnit($booking);
        $booking->delete();

        return back()->with('success', 'Booking deleted successfully.');
    }

    // -- Helpers for Unit Status Updates -- //

    private function updateUnitStatus(Booking $booking, string $status)
    {
        //         dd([
//     'booking_unit_id' => $booking->unit_id,
//     'booking_unit_name' => $booking->unit_name,
//     'tower_name' => $booking->tower_name,
//     'project_id' => $booking->project_id,
// ]);
        $tower = Tower::where('name', $booking->tower_name)
            ->where('project_id', $booking->project_id)
            ->first();

        if (!$tower) {
            return;
        }

        $units = collect($tower->units)->map(function ($unit) use ($booking, $status) {
            // Check both ID and Name to support old & new architectures safely
            $unitIdentifier = $unit['unit_number'] ?? $unit['name'] ?? null;

            if (
                (isset($unit['_id']) && (string) $unit['_id'] === (string) $booking->unit_id) ||
                ($unitIdentifier && (string) $unitIdentifier === (string) $booking->unit_name)
            ) {
                $unit['status'] = $status;
                $unit['booking_id'] = (string) $booking->_id;
                $unit['customer_id'] = $booking->customer_id;
                $unit['assigned_user_id'] = $booking->assigned_user_id;
                $unit['booked_by_user_id'] = $booking->created_by_id;

                // Smart Timestamping - avoids overwriting original values
                $unit['booked_at'] = $unit['booked_at'] ?? now();

                if ($status === 'sold') {
                    $unit['registered_at'] = $unit['registered_at'] ?? now();
                }
            }
            return $unit;
        });

        $tower->units = $units->toArray();
        $tower->save();
    }

    private function releaseUnit(Booking $booking)
    {
        $tower = Tower::where('project_id', $booking->project_id)
            ->where('name', $booking->tower_name)
            ->first();

        if (!$tower) {
            return;
        }

        $units = collect($tower->units)->map(function ($unit) use ($booking) {
            // Check both ID and Name to support old & new architectures safely
            $unitIdentifier = $unit['unit_number'] ?? $unit['name'] ?? null;

            if (
                (isset($unit['_id']) && (string) $unit['_id'] === (string) $booking->unit_id) ||
                ($unitIdentifier && (string) $unitIdentifier === (string) $booking->unit_name)
            ) {
                $unit['status'] = 'available';
                $unit['booking_id'] = null;
                $unit['customer_id'] = null;
                $unit['assigned_user_id'] = null;
                $unit['booked_by_user_id'] = null;

                // Clear timestamps for the next person
                $unit['booked_at'] = null;
                $unit['registered_at'] = null;
                $unit['cancelled_at'] = null;
            }
            return $unit;
        });

        $tower->units = $units->toArray();
        $tower->save();
    }

    private function calculateBooking(array &$validated): void
    {
        $basePrice = (float) ($validated['base_price'] ?? 0);
        $discount = (float) ($validated['discount_amount'] ?? 0);
        $other = (float) ($validated['other_amount'] ?? 0);
        $tax = (float) ($validated['tax_percentage'] ?? 0);
        $booking = (float) ($validated['booking_amount'] ?? 0);

        $subTotal = $basePrice - $discount + $other;
        $validated['tax_amount'] = ($subTotal * $tax) / 100;
        $validated['total_amount'] = $subTotal + $validated['tax_amount'];
        $validated['paid_amount'] = $booking;
        $validated['due_amount'] = $validated['total_amount'] - $booking;
        $validated['refund_amount'] = (float) ($validated['refund_amount'] ?? 0);

        if (!empty($validated['channel_partner_id']) && !empty($validated['commission_value'])) {
            if ($validated['commission_type'] === 'Percentage') {
                $validated['commission_amount'] = ($validated['total_amount'] * (float) $validated['commission_value']) / 100;
            } else {
                $validated['commission_amount'] = (float) $validated['commission_value'];
            }
            $validated['commission_status'] = $validated['commission_status'] ?? 'Pending';
        } else {
            $validated['commission_amount'] = 0;
            $validated['commission_status'] = null;
        }
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
            'commission_type' => 'nullable|in:Percentage,Fixed',
            'commission_value' => 'nullable|numeric',
            'commission_amount' => 'nullable|numeric',
            'commission_status' => 'nullable|string',
            'payment_plan' => 'nullable|string',
            'payment_status' => 'required|string',
            'booking_form' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'agreement_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'payment_receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'remarks' => 'nullable|string',
            'cancellation_reason' => 'nullable|string',
            'status' => 'required|in:Enquiry,Hold,Booked,Agreement Done,Registered,Completed,Cancelled,Refunded',
        ]);
    }

    public function getProjectUnits($projectId)
    {
        $towers = Tower::where('project_id', $projectId)->get();

        $propertyTypes = PropertyType::select('_id', 'name')->get()->keyBy('_id');
        $unitTypes = UnitType::select('_id', 'name')->get()->keyBy('_id');

        $result = [];

        foreach ($towers as $tower) {
            $floors = [];

            foreach ($tower->units ?? [] as $unit) {

                $status = strtolower($unit['status'] ?? 'available');

                if ($status === 'cancelled') {
                    continue;
                }

                $unitNumber = $unit['unit_number'] ?? $unit['name'] ?? '';
                $floorNumber = $unit['floor_number'] ?? null;

                $propertyTypeName = null;
                $unitTypeName = null;
                $roomSizes = [];
                $unitSize = null;
                $floorDesign = null;

                if (!empty($tower->floor_designs) && $floorNumber !== null) {
                    $floorDesign = collect($tower->floor_designs)->first(function ($design) use ($floorNumber) {
                        return $floorNumber >= ($design['from_floor'] ?? 0) && $floorNumber <= ($design['to_floor'] ?? 0);
                    });
                }

                if ($floorDesign) {
                    $propertyType = $propertyTypes->get($floorDesign['property_type_id']);
                    $unitType = $unitTypes->get($floorDesign['unit_type_id']);
                    $propertyTypeName = $propertyType?->name;
                    $unitTypeName = $unitType?->name;
                    $roomSizes = $floorDesign['room_sizes'] ?? [];
                    $unitSize = $floorDesign['unit_size'] ?? null;
                }

                if (!$floorDesign && !empty($tower->unit_ranges)) {
                    $numericUnit = (int) preg_replace('/[^0-9]/', '', $unitNumber);
                    $unitRange = collect($tower->unit_ranges)->first(function ($range) use ($numericUnit) {
                        return $numericUnit >= ($range['from_unit'] ?? 0) && $numericUnit <= ($range['to_unit'] ?? 0);
                    });

                    if ($unitRange) {
                        $propertyType = $propertyTypes->get($unitRange['property_type_id']);
                        $unitType = $unitTypes->get($unitRange['unit_type_id']);
                        $propertyTypeName = $propertyType?->name;
                        $unitTypeName = $unitType?->name;
                        $roomSizes = $unitRange['room_sizes'] ?? [];
                        $unitSize = $unitRange['unit_size'] ?? null;
                    }
                }

                $unitData = [
                    'unit_id' => (string) ($unit['_id'] ?? $unitNumber),

                    'tower_name' => $tower->name,
                    'floor_name' => $floorNumber ?? 'Ground',

                    'unit_name' => $unitNumber,

                    'property_type' => $propertyTypeName,
                    'configuration' => $unitTypeName,
                    'unit_type' => $unitTypeName,

                    'unit_size' => $unitSize ?? ($unit['unit_size'] ?? ''),
                    'unit_size_unit' => $unit['unit_size_unit'] ?? 'Sq.Ft',

                    'room_sizes' => $roomSizes,

                    'status' => $status,

                    // Extra useful data for frontend
                    'booking_id' => $unit['booking_id'] ?? null,
                    'customer_id' => $unit['customer_id'] ?? null,
                    'booked_at' => $unit['booked_at'] ?? null,
                    'registered_at' => $unit['registered_at'] ?? null,
                ];

                $groupFloor = $floorNumber !== null ? $floorNumber : 'Ground';
                $floors[$groupFloor][] = $unitData;
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
                'tower_name' => $tower->name,
                'tower_type' => $tower->type,
                'total_floors' => $tower->total_floors,
                'total_units' => $tower->total_units,
                'floors' => $floorData,
            ];
        }
        // dd($result);
        return response()->json($result);
    }

    public function getCommission($partnerId, $projectId)
    {
        $commission = ChannelPartnerProject::where('channel_partner_id', $partnerId)
            ->where('project_id', $projectId)
            ->first();

        return response()->json($commission);
    }
}