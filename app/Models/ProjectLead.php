<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ProjectLead extends Model
{
   protected $fillable = [
    'project_id',
    'name',
    'email',
    'country_code',
    'mobile',
    'looking_for',
    'preferred_bedrooms',

    'lead_status',
    'priority',

    'assigned_to',

    'followup_date',
    'remarks',

    'consent',
    'ip_address',
    'user_agent',
    'source',
    'status',
];

    public function project()
{
    return $this->belongsTo(Project::class, 'project_id', '_id');
}
}