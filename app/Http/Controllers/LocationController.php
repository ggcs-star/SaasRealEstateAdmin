<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Area;

class LocationController extends Controller
{
    public function getCities($stateId)
    {
        $cities = City::where('state_id', $stateId)
            ->where('status', true)
            ->get()
            ->map(function ($city) {
                return [
                    '_id' => (string) $city->_id,
                    'name' => $city->name,
                ];
            });

        return response()->json($cities);
    }

    public function getAreas($cityId)
    {
        $areas = Area::where('city_id', $cityId)
            ->where('status', true)
            ->get()
            ->map(function ($area) {
                return [
                    '_id' => (string) $area->_id,
                    'name' => $area->name,
                ];
            });

        return response()->json($areas);
    }
}