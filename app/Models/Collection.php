<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Collection extends Model
{
    protected $fillable = [

        /*
        |--------------------------------------------------------------------------
        | Relations
        |--------------------------------------------------------------------------
        */

        'booking_id',
        'customer_id',
        'project_id',

        /*
        |--------------------------------------------------------------------------
        | Receipt
        |--------------------------------------------------------------------------
        */

        'receipt_number',

        /*
        |--------------------------------------------------------------------------
        | Payment
        |--------------------------------------------------------------------------
        */

        'payment_date',

        'amount',

        'payment_mode',

        'transaction_number',

        'cheque_number',

        'bank_name',

        'branch_name',

        /*
        |--------------------------------------------------------------------------
        | Attachment
        |--------------------------------------------------------------------------
        */

        'payment_receipt',

        /*
        |--------------------------------------------------------------------------
        | Remarks
        |--------------------------------------------------------------------------
        */

        'remarks',

        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

        'received_by',
        'verified_by',

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        'status',
    ];

    protected $casts = [

        'payment_date' => 'date',

        'amount' => 'double',
    ];

    protected static function booted()
    {
        static::creating(function ($collection) {

            $last = self::orderBy('created_at', 'desc')->first();

            if ($last) {

                $lastNo = (int) str_replace(
                    'RC',
                    '',
                    $last->receipt_number
                );

                $next = $lastNo + 1;

            } else {

                $next = 1;
            }

            $collection->receipt_number =
                'RC' .
                str_pad($next, 6, '0', STR_PAD_LEFT);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function booking()
    {
        return $this->belongsTo(
            Booking::class,
            'booking_id',
            '_id'
        );
    }

    public function customer()
    {
        return $this->belongsTo(
            Customer::class,
            'customer_id',
            '_id'
        );
    }

    public function project()
    {
        return $this->belongsTo(
            Project::class,
            'project_id',
            '_id'
        );
    }

    public function receivedBy()
    {
        return $this->belongsTo(
            User::class,
            'received_by',
            '_id'
        );
    }

    public function verifiedBy()
    {
        return $this->belongsTo(
            User::class,
            'verified_by',
            '_id'
        );
    }
}