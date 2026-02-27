<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use App\Models\BuilderUser;
use App\Models\Amenity;
class Project extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'projects';

    protected $fillable = [
        'builder_id',
        'created_by_id',
        'created_by_type',

        'name',
        'slug',

        'reel',
        'brochure',
        'logo_image',

        'rera',

        'price',
        'type',
        'status',

        'location',

        'amenity_ids',
        'promoter_ids',

        'featured',
        'emerging_property',
        'emerging_area',
    ];

    protected $casts = [
        'rera' => 'array',
        'location' => 'array',
        'amenity_ids' => 'array',
        'promoter_ids' => 'array',

        'featured' => 'boolean',
        'emerging_property' => 'boolean',
        'emerging_area' => 'boolean',

        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    protected $primaryKey = '_id';



    public function builder()
    {
        return $this->belongsTo(BuilderUser::class, 'builder_id', '_id');
    }

    public function createdBy()
    {
        return $this->morphTo(__FUNCTION__, 'created_by_type', 'created_by_id');
    }

    public function amenities()
    {
        return Amenity::whereIn('_id', $this->amenity_ids ?? [])->get();
    }

    public function promoters()
    {
        return Promoter::whereIn('_id', $this->promoter_ids ?? [])->get();
    }
}