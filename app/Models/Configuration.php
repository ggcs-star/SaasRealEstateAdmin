<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Configuration extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'configurations';

    protected $primaryKey = '_id';

    protected $fillable = [
        'project_id',

        // Category
        'category',

        // Unit Type
        'title',

        // Basic Details
        'price',
        'size',
        'possession_date',

        // Room Details
        'rooms',

        // Images
        'imageslider',
        'floorPlans',
        'galleryImages',

        // Extra Fields
        'configuration_price',
    ];

    protected $casts = [
        'rooms' => 'array',
        'imageslider' => 'array',
        'floorPlans' => 'array',
        'galleryImages' => 'array',

        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;



    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', '_id');
    }
}