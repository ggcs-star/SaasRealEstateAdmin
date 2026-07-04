<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_number',

        'customer_id',
        'project_id',
        'unit_id',
        'channel_partner_id',
        'assigned_user_id',

        'tower_name',
        'floor_name',
        'unit_name',
        'property_type',
        'unit_type',
        'configuration',
        'unit_size',
        'unit_size_unit',

        'booking_date',
        'agreement_date',
        'registration_date',
        'followup_date',
        'possession_date',
        'cancellation_date',

        'base_price',
        'booking_amount',
        'discount_amount',
        'tax_amount',
        'tax_percentage',
        'other_amount',
        'total_amount',

        'paid_amount',
        'due_amount',
        'refund_amount',

        'commission_type',
        'commission_value',
        'commission_amount',
        'commission_status',

        'payment_plan',
        'payment_status',

        'booking_form',
        'agreement_document',
        'payment_receipt',

        'remarks',
        'cancellation_reason',
        'status',

        'created_by',
        'updated_by',
    ];

    protected $casts = [

        'booking_date' => 'date',
        'agreement_date' => 'date',
        'registration_date' => 'date',
        'followup_date' => 'date',
        'possession_date' => 'date',
        'cancellation_date' => 'date',

        'base_price' => 'double',
        'booking_amount' => 'double',
        'discount_amount' => 'double',
        'tax_amount' => 'double',
        'other_amount' => 'double',
        'total_amount' => 'double',

        'paid_amount' => 'double',
        'due_amount' => 'double',
        'refund_amount' => 'double',

        'commission_value' => 'double',
        'commission_amount' => 'double',
    ];

    protected static function booted()
    {
        static::creating(function ($booking) {

            $lastBooking = self::orderBy('created_at', 'desc')->first();

            if ($lastBooking) {

                $last = (int) str_replace(
                    'BK',
                    '',
                    $lastBooking->booking_number
                );

                $next = $last + 1;

            } else {

                $next = 1;
            }

            $booking->booking_number =
                'BK' . str_pad($next, 6, '0', STR_PAD_LEFT);
        });
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

    public function assignedUser()
    {
        return $this->belongsTo(
            User::class,
            'assigned_user_id',
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

    public function updatedBy()
    {
        return $this->belongsTo(
            User::class,
            'updated_by',
            '_id'
        );
    }

    public function collections()
    {
        return $this->hasMany(
            Collection::class,
            'booking_id',
            '_id'
        );
    }

    public function commissions()
    {
        return $this->hasMany(
            Commission::class,
            'booking_id',
            '_id'
        );
    }


    public function latestCollection()
    {
        return $this->hasOne(
            Collection::class,
            'booking_id',
            '_id'
        )->latest();
    }

    public function latestCommission()
    {
        return $this->hasOne(
            Commission::class,
            'booking_id',
            '_id'
        )->latest();
    }


}