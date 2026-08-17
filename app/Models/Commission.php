<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use App\Traits\HasOwnership;
class Commission extends Model
{
use HasOwnership;
    protected $fillable = [


        'booking_id',
        'customer_id',
        'project_id',
        'channel_partner_id',

        'booking_number',

        'total_sale_amount',

        'commission_type',

        'commission_value',

        'commission_amount',

        'paid_amount',

        'due_amount',

        'payment_status',

        'payment_date',

        'payment_mode',

        'transaction_number',

        'bank_name',

        'remarks',

        'approved_by',

        'paid_by',

        'created_by',

        'status',
    ];

    protected $casts = [

        'total_sale_amount' => 'double',

        'commission_value' => 'double',

        'commission_amount' => 'double',

        'paid_amount' => 'double',

        'due_amount' => 'double',

        'payment_date' => 'date',
    ];


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

    public function channelPartner()
    {
        return $this->belongsTo(
            ChannelPartner::class,
            'channel_partner_id',
            '_id'
        );
    }

    public function approvedBy()
    {
        return $this->belongsTo(
            User::class,
            'approved_by',
            '_id'
        );
    }

    public function paidBy()
    {
        return $this->belongsTo(
            User::class,
            'paid_by',
            '_id'
        );
    }

    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by',
            '_id'
        );
    }
}