<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Unit extends Model
{
    protected $collection = 'units';
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', '_id');
    }
}
