<?php

namespace App\Traits;

trait HasOwnership
{
    protected string $ownershipColumn = 'created_by_id';

    public function scopeVisibleTo($query, $user)
    {
        if ($user->isSuperAdmin()) {
            return $query;
        }

        return $query->whereIn(
            $this->ownershipColumn,
            $user->accessibleUserIds()
        );
    }
}