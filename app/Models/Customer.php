<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Traits\HasOwnership;
class Customer extends Model
{
    use HasApiTokens, Notifiable, HasOwnership;

    protected $connection = 'mongodb';
    protected $collection = 'customers';

    protected $fillable = [
        'created_by_id',
        'created_by_type',
        'first_name',
        'last_name',
        'email',
        'mobile',
        'alternate_mobile',
        'password',
        'profile_image',

        'gender',
        'dob',
        'marital_status',

        'country',
        'state',
        'city',
        'address',
        'pincode',

        'occupation',
        'company_name',
        'annual_income',

        'pan_number',
        'aadhaar_number',

        'is_verified',
        'email_verified_at',
        'mobile_verified_at',

        'preferred_property_type',
        'preferred_city',
        'budget_min',
        'budget_max',

        'status',
        'source',

        'last_login_at',
        'device_id',
        'fcm_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}