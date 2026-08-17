<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Traits\HasOwnership;
class BuilderUser extends Authenticatable
{
    use HasApiTokens, Notifiable, HasOwnership;
    protected string $ownershipColumn = 'created_by_id';
    protected $connection = 'mongodb';
    protected $collection = 'builders_users';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role_id',
        'company_name',
        'address',
        'logo',
        'status',
        'created_by_id',
        'created_by_type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', '_id');
    }

    public function getRolePermissions()
    {
        return $this->role?->permissions ?? [];
    }

    public function hasPermission($permission)
    {
        if ($this->role?->name === 'super_admin') {
            return true;
        }

        return in_array($permission, $this->getRolePermissions());
    }
}