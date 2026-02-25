<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 


class Amenity extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'amenities';

    protected $fillable = [
        'name',
        'icon',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;
}