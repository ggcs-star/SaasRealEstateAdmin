<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class ChannelPartner extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'channel_partners';

    protected $fillable = [
        'partner_code',
        'partner_name',
        'contact_number',
        'alternate_number',
        'email',
        'password',

        'date_of_birth',
        'gender',

        'aadhaar_number',
        'aadhaar_front',
        'aadhaar_back',

        'pan_number',
        'pan_image',

        'gst_number',
        'rera_number',

        'company_name',
        'company_type',

        'address',
        'city',
        'state',
        'country',
        'pincode',

        'bank_name',
        'account_holder_name',
        'account_number',
        'ifsc_code',
        'cancelled_cheque',

        'commission_type',
        'commission_value',

        'status',
        'approved_by',
        'approved_at',

        'last_login_at',
        'fcm_token',
    ];

    public function projectCommissions()
{
    return $this->hasMany(
        ChannelPartnerProject::class,
        'channel_partner_id'
    );
}
}