<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Commission extends Model
{
    protected $fillable = [
        'booking_id',
        'channel_partner_id',

        'commission_type',
        'commission_value',
        'commission_amount',

        'payment_status',
        'payment_date',

        'remarks',
        'created_by',
    ];

    protected $casts = [
        'commission_value' => 'double',
        'commission_amount' => 'double',
        'payment_date' => 'date',
    ];

    public function booking()
    {
        return $this->belongsTo(
            Booking::class,
            'booking_id'
        );
    }

    public function channelPartner()
    {
        return $this->belongsTo(
            ChannelPartner::class,
            'channel_partner_id'
        );
    }

    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}