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
        'manager_id',      
        'permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];


    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id', '_id');
    }

    public function employees()
    {
        return $this->hasMany(User::class, 'manager_id', '_id');
    }


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


    public function getRolePermissions(): array
    {
        $role = Role::where('name', $this->role)->first();

        return $role->permissions ?? [];
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        if (in_array($permission, $this->permissions ?? [])) {
            return true;
        }

        return in_array($permission, $this->getRolePermissions());
    }


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

    public function accessibleUserIds(): array
    {
        if ($this->isSuperAdmin()) {
            return [];
        }

        if ($this->isEmployee()) {
            return [(string) $this->_id];
        }

        if ($this->isManager()) {

            $employeeIds = User::where(
                'manager_id',
                (string) $this->_id
            )
                ->get()
                ->map(function ($user) {
                    return (string) $user->_id;
                })
                ->toArray();

            return array_merge(
                [(string) $this->_id],
                $employeeIds
            );
        }

        return [(string) $this->_id];
    }
}