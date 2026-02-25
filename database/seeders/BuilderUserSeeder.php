<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BuilderUser;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class BuilderUserSeeder extends Seeder
{
    public function run(): void
    {

        BuilderUser::create([
            'name' => 'Super builder',
            'email' => 'builder@test.com',
            'phone' => '9876543210',
            'password' => Hash::make('123456'),
            'company_name' => 'KeyArea Builders',
            'address' => 'Mumbai, India',
            'logo' => null,
            'status' => 'active',
        ]);
    }
}