<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LeadFollowup extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'lead_followups';

    protected $fillable = [
        'lead_id',
        'followup_date',
        'remark',
        'status',
    ];
}