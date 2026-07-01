<?php

namespace App\Enums;

interface UserRole
{
    const SUPER_ADMIN = 'super_admin';
    const MANAGER     = 'manager';
    const EMPLOYEE    = 'employee';
}