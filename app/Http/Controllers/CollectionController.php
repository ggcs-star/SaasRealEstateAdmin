<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CollectionController extends Controller
{
    // 1. List All Schedules & Payments
    public function index(Request $request)
    {
        $collections = Collection::with([
            'customer',
            'project',
            'booking.collections'
        ])
            ->when($request->search, function ($q) use ($request) {

                $q->where(function ($query) use ($request) {

                    $query->where('receipt_number', 'like', "%{$request->search}%")
                        ->orWhere('installment_name', 'like', "%{$request->search}%");

                });

            })
            ->orderBy('scheduled_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Collections/Index', [

            'collections' => $collections,

            'filters' => $request->only('search'),

        ]);
    }

    // 2. Create a Future Schedule (Installment)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required',
            'scheduled_date' => 'required|date',
            'scheduled_amount' => 'required|numeric|min:1',
            'installment_name' => 'required|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        // Booking se Customer aur Project nikal lenge
        $booking = Booking::findOrFail($validated['booking_id']);

        Collection::create([
            'booking_id' => $booking->id,
            'customer_id' => $booking->customer_id,
            'project_id' => $booking->project_id,

            'type' => 'Scheduled',
            'status' => 'Pending',

            'scheduled_date' => $validated['scheduled_date'],
            'scheduled_amount' => $validated['scheduled_amount'],
            'installment_name' => $validated['installment_name'],
            'remarks' => $validated['remarks'],

            'created_by' => auth()->id(), // optional field if you add it to model
        ]);

        return back()->with('success', 'Payment schedule created successfully.');
    }

    // 3. Receive Actual Payment (Convert Pending Schedule to Paid)
    public function receivePayment(Request $request, Collection $collection)
    {
        // Pehle check karo ki already paid to nahi hai
        if ($collection->status === 'Paid') {
            return back()->with('error', 'This installment is already paid.');
        }

        $validated = $request->validate([
            'payment_date' => 'required|date',
            'paid_amount' => 'required|numeric|min:1',
            'payment_mode' => 'required|string',
            'transaction_number' => 'nullable|string',
            'cheque_number' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'branch_name' => 'nullable|string',
            'payment_receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'remarks' => 'nullable|string',
        ]);

        // Upload Receipt Document
        if ($request->hasFile('payment_receipt')) {
            $validated['payment_receipt'] = $request->file('payment_receipt')->store('collections/receipts', 'public');
        }

        DB::beginTransaction();
        try {
            // Update the collection record
            $collection->update([
                'type' => 'Actual_Payment', // Ye change hote hi model boot function me receipt number generate hoga
                'status' => 'Paid',
                'payment_date' => $validated['payment_date'],
                'paid_amount' => $validated['paid_amount'],
                'payment_mode' => $validated['payment_mode'],
                'transaction_number' => $validated['transaction_number'],
                'cheque_number' => $validated['cheque_number'],
                'bank_name' => $validated['bank_name'],
                'branch_name' => $validated['branch_name'],
                'remarks' => $validated['remarks'] ?? $collection->remarks,
                'received_by' => auth()->id(),
            ]);

            // Optional: Update Booking Paid Amount
            $booking = Booking::find($collection->booking_id);
            if ($booking) {
                $booking->paid_amount += $validated['paid_amount'];
                $booking->due_amount -= $validated['paid_amount'];

                // Update booking status if fully paid
                if ($booking->due_amount <= 0) {
                    $booking->payment_status = 'Paid';
                } else {
                    $booking->payment_status = 'Partially Paid';
                }
                $booking->save();
            }

            DB::commit();

            return back()->with('success', 'Payment received successfully. Receipt No: ' . $collection->receipt_number);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    // In CollectionController.php
    public function storeBulk(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'booking_id' => 'required',
            'customer_id' => 'required',
            'project_id' => 'required',
            'schedules' => 'required|array|min:1',
            'schedules.*.installment_name' => 'required|string|max:255',
            'schedules.*.scheduled_date' => 'required|date',
            'schedules.*.scheduled_amount' => 'required|numeric|min:1',
            'schedules.*.remarks' => 'nullable|string',
            'deleted_ids' => 'nullable|array',

            'schedules.*.id' => 'nullable'
        ]);

        $collectionsData = [];

        foreach ($validated['schedules'] as $schedule) {
            $collectionsData[] = [
                'booking_id' => $validated['booking_id'],
                'customer_id' => $validated['customer_id'],
                'project_id' => $validated['project_id'],
                'type' => 'Scheduled',
                'status' => 'Pending',
                'scheduled_date' => $schedule['scheduled_date'],
                'scheduled_amount' => $schedule['scheduled_amount'],
                'installment_name' => $schedule['installment_name'],
                'remarks' => $schedule['remarks'] ?? null,
                'created_by' => auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Bulk insert array into MongoDB
        DB::beginTransaction();

        try {

            if (!empty($validated['deleted_ids'])) {

                Collection::whereIn(
                    'id',
                    $validated['deleted_ids']
                )->delete();

            }

            foreach ($validated['schedules'] as $schedule) {

                if (!empty($schedule['id'])) {

                    Collection::find($schedule['id'])
                        ->update([

                            'installment_name' => $schedule['installment_name'],

                            'scheduled_date' => $schedule['scheduled_date'],

                            'scheduled_amount' => $schedule['scheduled_amount'],

                            'remarks' => $schedule['remarks'] ?? null,

                        ]);

                } else {

                    Collection::create([

                        'booking_id' => $validated['booking_id'],

                        'customer_id' => $validated['customer_id'],

                        'project_id' => $validated['project_id'],

                        'type' => 'Scheduled',

                        'status' => 'Pending',

                        'installment_name' => $schedule['installment_name'],

                        'scheduled_date' => $schedule['scheduled_date'],

                        'scheduled_amount' => $schedule['scheduled_amount'],

                        'remarks' => $schedule['remarks'] ?? null,

                        'created_by' => auth()->id(),

                    ]);

                }

            }

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();

            throw $e;

        }

        return back()->with('success', count($collectionsData) . ' Payment schedules created successfully.');
    }
}