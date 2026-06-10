<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Tower extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'towers';

    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [

        'project_id',
        'name',
        'type',
        'units',
        'total_floors',
        'total_units',
        'floor_designs',
        'unit_ranges',
        'status',
    ];

  

    public $timestamps = true;

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', '_id');
    }

  

    public function getUnitTypeIds()
    {
        return collect($this->floor_designs ?? [])
            ->pluck('unit_type_id')
            ->filter()
            ->unique()
            ->values()
            ->toArray();
    }


    public function getPropertyTypeIds()
    {
        return collect($this->floor_designs ?? [])
            ->pluck('property_type_id')
            ->filter()
            ->unique()
            ->values()
            ->toArray();
    }

}