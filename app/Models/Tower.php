<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Tower extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'towers';
    protected $primaryKey = '_id';

    protected $fillable = [

        'project_id',

        'name',
        'type',

        'configuration_ids',

        'total_floors',
        'total_units',

        'floor_designs',

        'units', // ✅ Auto Generated Units

        'status',
    ];

    protected $casts = [

        'configuration_ids' => 'array',

        'floor_designs' => 'array',

        'units' => 'array', // ✅ Important


        'total_floors' => 'integer',

        'total_units' => 'integer',

        'status' => 'boolean',

        'created_at' => 'datetime',

        'updated_at' => 'datetime',
    ];

    public $timestamps = true;



    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', '_id');
    }


    public function configurations()
    {
        return Configuration::whereIn('_id', $this->configuration_ids ?? []);
    }

}