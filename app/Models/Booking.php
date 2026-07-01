<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\BSON\ObjectId;

class Booking extends Model
{
    protected $fillable = [
        'booking_number',

        // Relations
        'customer_id',
        'project_id',
        'unit_id',
        'channel_partner_id',
        'assigned_user_id',

        // Booking Details
        'booking_date',
        'agreement_date',
        'followup_date',
        'possession_date',

        // Unit Information
        'tower_name',
        'floor_name',
        'unit_name',
        'unit_type',
        'configuration',
        'unit_size',
        'unit_size_unit',

        // Amounts
        'booking_amount',
        'other_amount',
        'discount_amount',
        'tax_amount',
        'total_amount',

        // Commission
        'commission_type',
        'commission_value',
        'commission_amount',

        // Payment
        'payment_plan',
        'payment_status',

        // Documents
        'booking_form',
        'agreement_document',
        'payment_receipt',

        // Remarks
        'remarks',
        'cancellation_reason',

        // Status
        'status',

        // Audit
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'agreement_date' => 'date',
        'followup_date' => 'date',
        'possession_date' => 'date',

        'booking_amount' => 'double',
        'other_amount' => 'double',
        'discount_amount' => 'double',
        'tax_amount' => 'double',
        'total_amount' => 'double',

        'commission_value' => 'double',
        'commission_amount' => 'double',
    ];

protected static function booted()
{
    static::creating(function ($booking) {

        $lastBooking = Booking::orderBy('created_at', 'desc')->first();

        if ($lastBooking && $lastBooking->booking_number) {
            $lastNumber = (int) str_replace(
                'BK',
                '',
                $lastBooking->booking_number
            );

            $next = $lastNumber + 1;
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
}