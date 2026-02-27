<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\State;
use App\Models\City;
use Carbon\Carbon;

class GujaratCitySeeder extends Seeder
{
    public function run(): void
    {
        // Gujarat state find karo
        $state = State::where('code', 'GJ')->first();

        if (!$state) {
            $this->command->error('Gujarat state not found. Please seed states first.');
            return;
        }

        $now = Carbon::now();

        $cities = [
            ['name' => 'Ahmedabad', 'latitude' => 23.0225, 'longitude' => 72.5714],
            ['name' => 'Surat', 'latitude' => 21.1702, 'longitude' => 72.8311],
            ['name' => 'Vadodara', 'latitude' => 22.3072, 'longitude' => 73.1812],
            ['name' => 'Rajkot', 'latitude' => 22.3039, 'longitude' => 70.8022],
            ['name' => 'Bhavnagar', 'latitude' => 21.7645, 'longitude' => 72.1519],
            ['name' => 'Jamnagar', 'latitude' => 22.4707, 'longitude' => 70.0577],
            ['name' => 'Gandhinagar', 'latitude' => 23.2156, 'longitude' => 72.6369],
            ['name' => 'Junagadh', 'latitude' => 21.5222, 'longitude' => 70.4579],
            ['name' => 'Anand', 'latitude' => 22.5645, 'longitude' => 72.9289],
            ['name' => 'Morbi', 'latitude' => 22.8173, 'longitude' => 70.8377],
        ];

        foreach ($cities as $city) {
            City::updateOrCreate(
                [
                    'state_id' => $state->_id,
                    'name'     => $city['name'],
                ],
                [
                    'latitude'   => $city['latitude'],
                    'longitude'  => $city['longitude'],
                    'status'     => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $this->command->info('Gujarat cities seeded successfully.');
    }
}