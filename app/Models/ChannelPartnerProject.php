<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ChannelPartnerProject extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'channel_partner_projects';

    protected $fillable = [
        'channel_partner_id',
        'project_id',

        'commission_type',
        'commission_value',

        'status',

        'remarks',

        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'commission_value' => 'double',
        'status' => 'boolean',
    ];

    public function channelPartner()
    {
        return $this->belongsTo(
            ChannelPartner::class,
            'channel_partner_id'
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

    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function updatedBy()
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}