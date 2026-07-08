<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\HasApiTokens;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $table = 'admin_users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'mobile',
        'role',
        'manager_id',      // Employee kis manager ke under hai
        'permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    // Employee -> Manager
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id', '_id');
    }

    // Manager -> Employees
    public function employees()
    {
        return $this->hasMany(User::class, 'manager_id', '_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Role Helpers
    |--------------------------------------------------------------------------
    */

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SUPER_ADMIN;
    }

    public function isManager(): bool
    {
        return $this->role === UserRole::MANAGER;
    }

    public function isEmployee(): bool
    {
        return $this->role === UserRole::EMPLOYEE;
    }

    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    */

   public function getRolePermissions(): array
{
    $role = Role::where('name', $this->role)->first();

    return $role->permissions ?? [];
}

    public function hasPermission(string $permission): bool
    {
        // Super Admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        // User custom permissions
        if (in_array($permission, $this->permissions ?? [])) {
            return true;
        }

        // Role permissions
        return in_array($permission, $this->getRolePermissions());
    }

    /*
    |--------------------------------------------------------------------------
    | Data Visibility (Phase-2)
    |--------------------------------------------------------------------------
    */

    public function scopeVisibleTo($query, User $user)
    {
        switch ($user->role) {

            case UserRole::SUPER_ADMIN:
                return $query;

            case UserRole::MANAGER:
                return $query->where(function ($q) use ($user) {
                    $q->where('_id', $user->_id)
                      ->orWhere('manager_id', $user->_id);
                });

            case UserRole::EMPLOYEE:
                return $query->where('_id', $user->_id);

            default:
                return $query->whereRaw(['_id' => null]);
        }
    }
}