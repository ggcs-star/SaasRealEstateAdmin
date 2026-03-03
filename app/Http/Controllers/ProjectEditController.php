<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Promoter;
use App\Models\Project;
use App\Models\Amenity;
use App\Models\BuilderUser;
use App\Models\State;
use App\Models\Configuration;
use App\Models\Category;
use App\Models\Tower;
class ProjectEditController extends Controller
{
    public function editBasic($id)
    {
        $project = Project::findOrFail($id);

        $builders = BuilderUser::select('_id', 'name')->get()
            ->map(fn($b) => [
                '_id' => (string) $b->_id,
                'name' => $b->name,
            ]);

        $amenities = Amenity::select('_id', 'name', 'icon_url')
            ->whereIn('status', [true, 1, '1'])
            ->get()
            ->map(fn($a) => [
                '_id' => (string) $a->_id,
                'name' => $a->name,
                'icon' => $a->icon_url,
            ]);

        $states = State::where('status', true)
            ->select('_id', 'name')
            ->get()
            ->map(fn($state) => [
                '_id' => (string) $state->_id,
                'name' => $state->name,
            ]);

        return Inertia::render('Project/Edit/EditBasic', [

            'project' => [
                ...$project->toArray(),
                '_id' => (string) $project->_id,

                'amenity_ids' => collect($project->amenity_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->values()
                    ->toArray(),

                'configurations' => [],
                'towers' => [],
            ],

            'builders' => $builders,
            'amenities' => $amenities,
            'states' => $states,

            'isEdit' => true,
            'editMode' => 'basic'

        ]);
    }

    public function updateBasic(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'builder_id' => 'required|string',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'project_type' => 'required|string',

            'price' => 'nullable|string',
            'carpet_area' => 'nullable|string',

            'state_id' => 'required|string',
            'city_id' => 'required|string',
            'area_id' => 'required|string',

            'State_name' => 'nullable|string',
            'city_name' => 'nullable|string',
            'area_name' => 'nullable|string',

            'address' => 'required|string',
            'pincode' => 'required|string',
            'latitude' => 'required',
            'longitude' => 'required',

            'rera_number' => 'required|string',
            'launch_date' => 'nullable|date',
            'possession_date' => 'nullable|date',
            'project_status' => 'required|string',

            'short_description' => 'nullable|string',
            'description' => 'nullable|string',

            'display_order' => 'nullable|numeric',

            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'meta_data' => 'nullable',

            'is_featured' => 'boolean',
            'is_emerging_property' => 'boolean',
            'is_emerging_area' => 'boolean',
            'is_new_launch' => 'boolean',
            'is_trending' => 'boolean',

            'status' => 'boolean',
        ]);

        // Force boolean values (important for MongoDB)
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_emerging_property'] = $request->boolean('is_emerging_property');
        $validated['is_emerging_area'] = $request->boolean('is_emerging_area');
        $validated['is_new_launch'] = $request->boolean('is_new_launch');
        $validated['is_trending'] = $request->boolean('is_trending');
        $validated['status'] = $request->boolean('status');

        $project->update($validated);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Basic details updated successfully');
    }

    public function editConfigurations($id)
    {
        $project = Project::findOrFail($id);

        $configIds = collect($project->configuration_ids ?? [])
            ->map(fn($id) => (string) $id)
            ->toArray();

        $configurations = Configuration::whereIn('_id', $configIds)
            ->get()
            ->map(function ($config) {

                // Convert configuration id
                $config->_id = (string) $config->_id;

                // Convert category_ids to string
                $config->category_ids = collect($config->category_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->toArray();

                return $config;
            });

        $project->_id = (string) $project->_id;

        $project->setRelation('configurations', $configurations);

        return Inertia::render('Project/Edit/EditConfigurations', [
            'project' => $project,
            'categories' => Category::select('_id', 'name')
                ->get()
                ->map(function ($cat) {
                    $cat->_id = (string) $cat->_id;
                    return $cat;
                }),
        ]);
    }


    public function updateConfigurations(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'configurations' => 'required|array|min:1',
            'configurations.*.name' => 'required|string',
            'configurations.*.type' => 'required|string',
            'configurations.*.type_size' => 'required|string',
            'configurations.*.total_configuration_size' => 'required|string',
        ]);

        $newConfigurationIds = [];

        foreach ($request->configurations as $config) {

            if (!empty($config['_id']) && !str_starts_with($config['_id'], 'cfg_')) {

                $existing = Configuration::find($config['_id']);

                if ($existing) {
                    $existing->update([
                        'category_ids' => $config['category_ids'] ?? [],
                        'name' => $config['name'],
                        'type' => $config['type'],
                        'type_size' => $config['type_size'],
                        'total_configuration_size' => $config['total_configuration_size'],
                        'room_sizes' => $config['room_sizes'] ?? [],
                        'description' => $config['description'] ?? null,
                        'status' => $config['status'] ?? true,
                    ]);

                    $newConfigurationIds[] = (string) $existing->_id;
                }

            } else {

                $created = Configuration::create([
                    'category_ids' => $config['category_ids'] ?? [],
                    'name' => $config['name'],
                    'type' => $config['type'],
                    'type_size' => $config['type_size'],
                    'total_configuration_size' => $config['total_configuration_size'],
                    'room_sizes' => $config['room_sizes'] ?? [],
                    'description' => $config['description'] ?? null,
                    'status' => $config['status'] ?? true,
                ]);

                $newConfigurationIds[] = (string) $created->_id;
            }
        }

        $oldIds = collect($project->configuration_ids ?? [])
            ->map(fn($id) => (string) $id)
            ->toArray();

        $deletedIds = array_diff($oldIds, $newConfigurationIds);

        if (!empty($deletedIds)) {
            Configuration::whereIn('_id', $deletedIds)->delete();
        }

        $project->update([
            'configuration_ids' => $newConfigurationIds
        ]);

        return redirect()->route('projects.index')
            ->with('success', 'Configurations updated successfully');
    }

    public function editTowers($id)
    {
        $project = Project::findOrFail($id);

        $towerIds = collect($project->tower_ids ?? [])
            ->map(fn($id) => (string) $id)
            ->toArray();

        $towers = Tower::whereIn('_id', $towerIds)
            ->get()
            ->map(function ($tower) {

                $tower->_id = (string) $tower->_id;

                $tower->floor_designs = collect($tower->floor_designs ?? [])
                    ->map(function ($floor) {
                        $floor['configuration_id'] = isset($floor['configuration_id'])
                            ? (string) $floor['configuration_id']
                            : "";
                        return $floor;
                    })
                    ->toArray();

                return $tower;
            });

        $configIds = collect($project->configuration_ids ?? [])
            ->map(fn($id) => (string) $id)
            ->toArray();

        $configurations = Configuration::whereIn('_id', $configIds)
            ->select('_id', 'name', 'type')
            ->get()
            ->map(function ($c) {
                $c->_id = (string) $c->_id;
                return $c;
            });

        $project->_id = (string) $project->_id;

        $project->setRelation('towers', $towers);

        return Inertia::render('Project/Edit/EditTowers', [
            'project' => $project,
            'configurations' => $configurations,
        ]);
    }
    public function updateTowers(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'towers' => 'required|array|min:1',
            'towers.*.name' => 'required|string',
            'towers.*.total_floors' => 'required|integer|min:1',
        ]);

        $newTowerIds = [];
        $projectTotalUnits = 0;

        foreach ($request->towers as $tower) {

            $floorDesignsRaw = $tower['floor_designs'] ?? [];

            $floorDesigns = [];
            $configurationIds = [];
            $totalUnits = 0;

            foreach ($floorDesignsRaw as $design) {

                $from = (int) ($design['from_floor'] ?? 0);
                $to = (int) ($design['to_floor'] ?? 0);
                $unitsPerFloor = (int) ($design['units_per_floor'] ?? 0);
                $configId = isset($design['configuration_id'])
                    ? (string) $design['configuration_id']
                    : "";

                if ($to >= $from) {
                    $floorsCount = ($to - $from) + 1;
                    $totalUnits += ($floorsCount * $unitsPerFloor);
                }

                if ($configId) {
                    $configurationIds[] = $configId;
                }

                $floorDesigns[] = [
                    'from_floor' => $from,
                    'to_floor' => $to,
                    'units_per_floor' => $unitsPerFloor,
                    'configuration_id' => $configId,
                ];
            }

            $projectTotalUnits += $totalUnits;

            $generatedUnits = $this->generateUnits(
                $tower['name'],
                $floorDesigns
            );

            $towerData = [
                'project_id' => (string) $project->_id,
                'type' => 'apartment',
                'name' => $tower['name'],
                'configuration_ids' => array_values(array_unique($configurationIds)),
                'total_floors' => (int) $tower['total_floors'],
                'floor_designs' => $floorDesigns,
                'units' => $generatedUnits,
                'total_units' => $totalUnits,
                'status' => $tower['status'] ?? true,
            ];

            if (!empty($tower['_id']) && !str_starts_with($tower['_id'], 'tw_')) {

                $existing = Tower::find($tower['_id']);

                if ($existing) {
                    $existing->update($towerData);
                    $newTowerIds[] = (string) $existing->_id;
                }

            } else {

                $created = Tower::create($towerData);
                $newTowerIds[] = (string) $created->_id;
            }
        }

        $oldIds = collect($project->tower_ids ?? [])
            ->map(fn($id) => (string) $id)
            ->toArray();

        $deletedIds = array_diff($oldIds, $newTowerIds);

        if (!empty($deletedIds)) {
            Tower::whereIn('_id', $deletedIds)->delete();
        }

        $project->update([
            'tower_ids' => $newTowerIds,
            'total_units' => $projectTotalUnits
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Towers & Units updated successfully');
    }

    private function generateUnits($towerName, $floorDesigns)
    {
        $units = [];

        foreach ($floorDesigns as $design) {

            $fromFloor = (int) $design['from_floor'];
            $toFloor = (int) $design['to_floor'];
            $unitsPerFloor = (int) $design['units_per_floor'];
            $configId = $design['configuration_id'];

            for ($floor = $fromFloor; $floor <= $toFloor; $floor++) {

                for ($unit = 1; $unit <= $unitsPerFloor; $unit++) {

                    $unitNumber = $towerName . "-" . $floor . str_pad($unit, 2, "0", STR_PAD_LEFT);

                    $units[] = [
                        'floor_number' => $floor,
                        'unit_number' => $unitNumber,
                        'configuration_id' => (string) $configId,
                        'status' => 'available'
                    ];
                }
            }
        }

        return $units;
    }

    public function editAmenities($id)
    {
        $project = Project::findOrFail($id);

        $project->_id = (string) $project->_id;

        return Inertia::render('Project/Edit/EditAmenities', [
            'project' => $project,
            'amenities' => Amenity::select('_id', 'name', 'icon_url')
                ->get()
                ->map(function ($a) {
                    $a->_id = (string) $a->_id;
                    return $a;
                }),
        ]);
    }

    public function updateAmenities(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'amenity_ids' => 'nullable|array',
        ]);

        $amenityIds = collect($request->amenity_ids ?? [])
            ->map(fn($id) => (string) $id)
            ->toArray();

        $project->update([
            'amenity_ids' => $amenityIds
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Amenities updated successfully');
    }

    public function editGallery($id)
{
    $project = Project::findOrFail($id);

    $project->_id = (string) $project->_id;

    return Inertia::render('Project/Edit/EditGallery', [
        'project' => $project
    ]);
}

public function updateGallery(Request $request, $id)
{
    $project = Project::findOrFail($id);

    $request->validate([
        'cover_image_url' => 'nullable|string',
        'gallery_images_url' => 'nullable|array',
        'floorPlans_images_url' => 'nullable|array',
        'slider_image_url' => 'nullable|array',
        'brochure_url' => 'nullable|string',
        'reel_url' => 'nullable|string',
    ]);

    $project->update([
        'cover_image_url' => $request->cover_image_url,
        'gallery_images_url' => $request->gallery_images_url ?? [],
        'floorPlans_images_url' => $request->floorPlans_images_url ?? [],
        'slider_image_url' => $request->slider_image_url ?? [],
        'brochure_url' => $request->brochure_url,
        'reel_url' => $request->reel_url,
    ]);

    return redirect()
        ->route('projects.index')
        ->with('success', 'Gallery updated successfully');
}
}