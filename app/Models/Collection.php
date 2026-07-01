<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Collection extends Model
{
    protected $fillable = [
        'booking_id',

        'receipt_number',

        'payment_date',

        'amount',

        'payment_mode',

        'transaction_number',

        'bank_name',

        'remarks',

        'received_by',

        'status',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'double',
    ];

    public function booking()
    {
        return $this->belongsTo(
            Booking::class,
            'booking_id'
        );
    }

    public function receivedBy()
    {
        return $this->belongsTo(
            User::class,
            'received_by'
        );
    }
}