<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Promoter;
use App\Models\BuilderUser;

class PromoterSeeder extends Seeder
{
    public function run(): void
    {
        $builder = BuilderUser::first();

        if (!$builder) {
            $this->command->info('No BuilderUser found. Please seed BuilderUser first.');
            return;
        }

        Promoter::create([
            'created_by_id' => $builder->_id,
            'created_by_type' => BuilderUser::class,
            'name' => 'Rahul Sharma',
            'email' => 'rahul.promoter@test.com',
            'phone' => '9876543211',
            'designation' => 'Senior Promoter',
            'commission_percent' => 5.5,
            'status' => 'active',
        ]);

        Promoter::create([
            'created_by_id' => $builder->_id,
            'created_by_type' => BuilderUser::class,
            'name' => 'Amit Verma',
            'email' => 'amit.promoter@test.com',
            'phone' => '9876543212',
            'designation' => 'Field Executive',
            'commission_percent' => 3.0,
            'status' => 'active',
        ]);
    }
}