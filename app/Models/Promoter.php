<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Promoter extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'promoters';

    protected $fillable = [
        'created_by_id',
        'created_by_type',
        'name',
        'email',
        'phone',
        'designation',
        'commission_percent',
        'status',
    ];

    protected $casts = [
        'commission_percent' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function createdBy()
    {
        return $this->morphTo();
    }
}