<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\State;
use App\Models\City;
use App\Models\Area;
use Carbon\Carbon;

class AhmedabadAreaSeeder extends Seeder
{
    public function run(): void
    {
        // Gujarat state find karo
        $state = State::where('code', 'GJ')->first();

        if (!$state) {
            $this->command->error('Gujarat state not found.');
            return;
        }

        // Ahmedabad city find karo
        $city = City::where('name', 'Ahmedabad')
                    ->where('state_id', $state->_id)
                    ->first();

        if (!$city) {
            $this->command->error('Ahmedabad city not found.');
            return;
        }

        $now = Carbon::now();

        $areas = [
            ['name' => 'Navrangpura', 'pincode' => '380009', 'latitude' => 23.0330, 'longitude' => 72.5611],
            ['name' => 'Maninagar', 'pincode' => '380008', 'latitude' => 22.9967, 'longitude' => 72.6000],
            ['name' => 'Satellite', 'pincode' => '380015', 'latitude' => 23.0270, 'longitude' => 72.5100],
            ['name' => 'Bopal', 'pincode' => '380058', 'latitude' => 23.0395, 'longitude' => 72.4630],
            ['name' => 'Vastrapur', 'pincode' => '380015', 'latitude' => 23.0396, 'longitude' => 72.5290],
            ['name' => 'Chandkheda', 'pincode' => '382424', 'latitude' => 23.1070, 'longitude' => 72.5830],
            ['name' => 'Gota', 'pincode' => '382481', 'latitude' => 23.0900, 'longitude' => 72.5000],
            ['name' => 'Naranpura', 'pincode' => '380013', 'latitude' => 23.0600, 'longitude' => 72.5500],
            ['name' => 'Paldi', 'pincode' => '380007', 'latitude' => 23.0120, 'longitude' => 72.5650],
            ['name' => 'Thaltej', 'pincode' => '380054', 'latitude' => 23.0500, 'longitude' => 72.5100],
        ];

        foreach ($areas as $area) {
            Area::updateOrCreate(
                [
                    'city_id'  => $city->_id,
                    'name'     => $area['name'],
                ],
                [
                    'state_id'   => $state->_id,
                    'pincode'    => $area['pincode'],
                    'latitude'   => $area['latitude'],
                    'longitude'  => $area['longitude'],
                    'status'     => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $this->command->info('Ahmedabad areas seeded successfully.');
    }
}