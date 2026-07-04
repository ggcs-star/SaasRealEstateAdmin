<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Collection extends Model
{
    // Agar hum ek hi table use kar rahe hain, to usme Schedule aur Actual Payment dono ka data aayega.
    protected $fillable = [

        'booking_id',
        'customer_id',
        'project_id',
        
        // Isse pata chalega ki ye actual receipt hai ya bas ek scheduled installment plan ki entry hai
        'type', // e.g., 'Scheduled', 'Actual_Payment'

        // SCHEDULE DETAILS (Admin jo banayega)
        'scheduled_date',     // Jis date ko paisa aana hai (1 Tarikh, 3 Tarikh)
        'scheduled_amount',   // Kitna paisa aana hai (10 Rs, 50 Rs)
        'installment_name',   // (Optional) e.g., "Down Payment", "1st Installment", "On Plinth"

        // ACTUAL PAYMENT DETAILS (Jab customer paisa de de)
        'receipt_number',
        'payment_date',       // Kis din actual me paisa mila
        'paid_amount',        // Kitna paisa actual me mila
        
        'payment_mode',       // Cash, Cheque, NEFT, UPI
        'transaction_number',
        'cheque_number',
        'bank_name',
        'branch_name',
        'payment_receipt',    // Uploaded document

        'remarks',

        'received_by',
        'verified_by',

        // STATUS: Pending, Paid, Partially Paid, Overdue
        'status', 
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'payment_date' => 'date',

        'scheduled_amount' => 'double',
        'paid_amount' => 'double',
    ];

    protected static function booted()
    {
        static::creating(function ($collection) {

            // Receipt number sirf tab generate karo jab type 'Actual_Payment' ho
            if ($collection->type === 'Actual_Payment') {
                $last = self::where('type', 'Actual_Payment')
                            ->orderBy('created_at', 'desc')
                            ->first();

                if ($last && $last->receipt_number) {
                    $lastNo = (int) str_replace('RC', '', $last->receipt_number);
                    $next = $lastNo + 1;
                } else {
                    $next = 1;
                }

                $collection->receipt_number = 'RC' . str_pad($next, 6, '0', STR_PAD_LEFT);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', '_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', '_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', '_id');
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by', '_id');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by', '_id');
    }
}