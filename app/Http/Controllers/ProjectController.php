<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\BuilderUser;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Configuration;
use App\Models\Tower;
use Illuminate\Support\Facades\Log;
use App\Models\Promoter;
use App\Models\State;
use App\Models\Category;
use Illuminate\Validation\ValidationException;
use App\Models\PropertyType;
use App\Models\UnitType;
use MongoDB\BSON\ObjectId;
class ProjectController extends Controller
{

    public function index()
    {
        $projects = Project::with('builder')
            ->latest()
            ->paginate(10);

        $projects->getCollection()->transform(function ($project) {
            return [
                '_id' => (string) $project->_id,
                'name' => $project->name,
                'slug' => $project->slug,
                'logo_image' => $project->logo_image,
                'status' => $project->status,
                'featured' => $project->featured ?? false,
                'builder' => $project->builder?->name,
                'builder_id' => (string) $project->builder_id,
                'promoter_ids' => $project->promoter_ids ?? [],
                'created_at' => $project->created_at?->format('d M Y'),
            ];
        });

        $builders = BuilderUser::where('status', '1')->get()->map(function ($builder) {
            return [
                '_id' => (string) $builder->_id,
                'name' => $builder->name,
                'email' => $builder->email,
            ];
        });
        // dd($builders);
        return Inertia::render('Project/Index', [
            'projects' => $projects,
            'builders' => $builders,
        ]);
    }
    public function assignPromoter(Request $request, $id)
    {
        // dd($request);
        $request->validate([
            'promoter_ids' => 'required|array'
        ]);

        $project = Project::findOrFail($id);

        $project->promoter_ids = array_map(
            fn($pid) => (string) $pid,
            $request->promoter_ids
        );

        $project->save();

        return back()->with('success', 'Promoters assigned successfully');
    }
    public function show($id)
    {
        $project = Project::with([
            'builder',
            'promoter',
            'state',
            'city',
            'area',
            'towers'
        ])->findOrFail($id);

        $amenities = Amenity::whereIn('_id', $project->amenity_ids ?? [])
            ->get()
            ->map(fn($a) => [
                '_id' => (string) $a->_id,
                'name' => $a->name,
                'status' => (bool) $a->status,
            ])->values();

        $categories = Category::whereIn('_id', $project->category_ids ?? [])
            ->get()
            ->map(fn($c) => [
                '_id' => (string) $c->_id,
                'name' => $c->name,
            ])->values();


        $towers = $project->towers->map(function ($tower) {

            $units = collect($tower->units ?? [])
                ->map(function ($unit) {
                    return [
                        'floor_number' => $unit['floor_number'] ?? null,
                        'unit_number' => $unit['unit_number'] ?? null,
                        'property_type_id' => $unit['property_type_id'] ?? null,
                        'unit_type_id' => $unit['unit_type_id'] ?? null,
                        'unit_size' => $unit['unit_size'] ?? null,
                        'room_sizes' => $unit['room_sizes'] ?? [],
                        'status' => $unit['status'] ?? 'available',
                    ];
                })->values();

            $floors = $units
                ->groupBy('floor_number')
                ->map(fn($floorUnits, $floorNumber) => [
                    'floor_number' => (int) $floorNumber,
                    'units' => $floorUnits->values()
                ])
                ->values();

            return [
                '_id' => (string) $tower->_id,
                'name' => $tower->name,
                'type' => $tower->type,
                'total_floors' => (int) $tower->total_floors,
                'total_units' => (int) $tower->total_units,
                'floor_designs' => $tower->floor_designs ?? [],
                'units' => $units,
                'floors' => $floors,
                'status' => (bool) $tower->status,
            ];
        })->values();


        $unitTypes = UnitType::select('_id', 'name')
            ->get()
            ->map(fn($u) => [
                '_id' => (string) $u->_id,
                'name' => $u->name
            ]);

        $propertyTypes = PropertyType::select('_id', 'name')
            ->get()
            ->map(fn($p) => [
                '_id' => (string) $p->_id,
                'name' => $p->name
            ]);


        return Inertia::render('Project/View', [

            'project' => [
                '_id' => (string) $project->_id,
                'name' => $project->name,
                'slug' => $project->slug,
                'project_type' => $project->project_type,
                'description' => $project->description,
                'short_description' => $project->short_description,
                'address' => $project->address,

                'price' => $project->price,
                'carpet_area' => $project->carpet_area,

                'state' => $project->state?->name,
                'city' => $project->city?->name,
                'area' => $project->area?->name,

                'pincode' => $project->pincode,
                'latitude' => $project->latitude,
                'longitude' => $project->longitude,

                'rera_number' => $project->rera_number,

                'launch_date' => $project->launch_date,
                'possession_date' => $project->possession_date,

                'project_status' => $project->project_status,

                'cover_image_url' => $project->cover_image_url,
                'gallery_images_url' => $project->gallery_images_url ?? [],
                'floorPlans_images_url' => $project->floorPlans_images_url ?? [],
                'slider_image_url' => $project->slider_image_url ?? [],

                'brochure_url' => $project->brochure_url,
                'reel_url' => $project->reel_url,

                'total_units' => $project->total_units,
                'total_towers' => $project->total_towers,
                'total_floors' => $project->total_floors,

                'is_featured' => (bool) $project->is_featured,
                'is_emerging_property' => (bool) $project->is_emerging_property,
                'is_new_launch' => (bool) $project->is_new_launch,
                'is_trending' => (bool) $project->is_trending,

                'status' => (bool) $project->status,

                'builder' => $project->builder ? [
                    '_id' => (string) $project->builder->_id,
                    'name' => $project->builder->name,
                ] : null,

                'promoter' => $project->promoter ? [
                    '_id' => (string) $project->promoter->_id,
                    'name' => $project->promoter->name,
                ] : null,

                'amenities' => $amenities,
                'categories' => $categories,
                'towers' => $towers,
            ],

            'unitTypes' => $unitTypes,
            'propertyTypes' => $propertyTypes,
        ]);
    }
    public function create()
    {

        // Builders
        $builders = BuilderUser::select('_id', 'name')
            ->get()
            ->map(function ($builder) {
                return [
                    '_id' => (string) $builder->_id,
                    'name' => $builder->name,
                ];
            });

        // Amenities
        $amenities = Amenity::select('_id', 'name', 'icon_url')
            ->whereIn('status', [true, 1, '1'])
            ->get()
            ->map(function ($amenity) {
                return [
                    '_id' => (string) $amenity->_id,
                    'name' => $amenity->name,
                    'icon_url' => $amenity->icon_url,
                ];
            });

        // Categories
        $categories = Category::select('_id', 'name')
            ->where('status', true)
            ->get()
            ->map(function ($category) {
                return [
                    '_id' => (string) $category->_id,
                    'name' => $category->name,
                ];
            });

        // States
        $states = State::where('status', true)
            ->select('_id', 'name')
            ->get()
            ->map(function ($state) {
                return [
                    '_id' => (string) $state->_id,
                    'name' => $state->name,
                ];
            });

        // Property Types
        $propertyTypes = PropertyType::where('status', true)
            ->select('_id', 'name', 'slug')
            ->get()
            ->map(function ($type) {
                return [
                    '_id' => (string) $type->_id,
                    'name' => $type->name,
                    'slug' => $type->slug,
                ];
            });

        // Unit Types
        $unitTypes = UnitType::where('status', true)
            ->select('_id', 'name', 'bhk')
            ->get()
            ->map(function ($unit) {
                return [
                    '_id' => (string) $unit->_id,
                    'name' => $unit->name,
                    'bhk' => $unit->bhk,
                ];
            });

        return Inertia::render('Project/Create', [
            'builders' => $builders,
            'amenities' => $amenities,
            'categories' => $categories,
            'states' => $states,
            'propertyTypes' => $propertyTypes,
            'unitTypes' => $unitTypes,
        ]);
    }

    public function edit($id)
    {
        $project = Project::findOrFail($id);

        // Builders
        $builders = BuilderUser::select('_id', 'name')
            ->get()
            ->map(fn($b) => [
                '_id' => (string) $b->_id,
                'name' => $b->name,
            ]);

        // Amenities
        $amenities = Amenity::select('_id', 'name', 'icon_url')
            ->whereIn('status', [true, 1, '1'])
            ->get()
            ->map(fn($a) => [
                '_id' => (string) $a->_id,
                'name' => $a->name,
                'icon_url' => $a->icon_url,
            ]);

        // Categories
        $categories = Category::select('_id', 'name')
            ->where('status', true)
            ->get()
            ->map(fn($category) => [
                '_id' => (string) $category->_id,
                'name' => $category->name,
            ]);

        // States
        $states = State::where('status', true)
            ->select('_id', 'name')
            ->get()
            ->map(fn($state) => [
                '_id' => (string) $state->_id,
                'name' => $state->name,
            ]);

        // Property Types
        $propertyTypes = PropertyType::where('status', true)
            ->select('_id', 'name', 'slug')
            ->get()
            ->map(fn($type) => [
                '_id' => (string) $type->_id,
                'name' => $type->name,
                'slug' => $type->slug,
            ]);

        // Unit Types
        $unitTypes = UnitType::where('status', true)
            ->select('_id', 'name', 'bhk')
            ->get()
            ->map(fn($unit) => [
                '_id' => (string) $unit->_id,
                'name' => $unit->name,
                'bhk' => $unit->bhk,
            ]);



        // Towers
        $towers = Tower::where('project_id', (string) $project->_id)
            ->get()
            ->map(function ($tower) {

                return [

                    '_id' => (string) $tower->_id,
                    'id' => (string) $tower->_id, // React ke liye
                    'name' => $tower->name,

                    'type' => $tower->type,
                    'category' => $tower->type ?? 'apartment',

                    'total_floors' => $tower->total_floors ?? 0,
                    'total_units' => $tower->total_units ?? 0,

                    // apartment
                    'floor_designs' => collect($tower->floor_designs ?? [])
                        ->map(function ($floor) {
                            return [
                                'from_floor' => $floor['from_floor'] ?? null,
                                'to_floor' => $floor['to_floor'] ?? null,
                                'units_per_floor' => $floor['units_per_floor'] ?? null,
                                'property_type_id' => $floor['property_type_id'] ?? null,
                                'unit_type_id' => $floor['unit_type_id'] ?? null,
                                'unit_size' => $floor['unit_size'] ?? null,
                                'room_sizes' => $floor['room_sizes'] ?? [],
                            ];
                        })
                        ->values()
                        ->toArray(),

                    // villa
                    'unit_ranges' => collect($tower->unit_ranges ?? [])
                        ->map(function ($range) {
                            return [
                                'from_unit' => $range['from_unit'] ?? null,
                                'to_unit' => $range['to_unit'] ?? null,
                                'unit_prefix' => $range['unit_prefix'] ?? 'Villa',
                                'unit_size' => $range['unit_size'] ?? null,
                                'property_type_id' => $range['property_type_id'] ?? null,
                                'unit_type_id' => $range['unit_type_id'] ?? null,
                                'room_sizes' => $range['room_sizes'] ?? [],
                            ];
                        })
                        ->values()
                        ->toArray(),

                    'units' => $tower->units ?? [],

                    'status' => $tower->status ?? true,
                ];
            });
        // dd($towers);

        return Inertia::render('Project/Create', [

            'projectData' => [
                ...$project->toArray(),
                '_id' => (string) $project->_id,

                'amenity_ids' => collect($project->amenity_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->values()
                    ->toArray(),

                'category_ids' => collect($project->category_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->values()
                    ->toArray(),

                'property_type_ids' => collect($project->property_type_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->values()
                    ->toArray(),

                'unit_type_ids' => collect($project->unit_type_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->values()
                    ->toArray(),

                'towers' => $towers,
            ],

            'builders' => $builders,
            'amenities' => $amenities,
            'categories' => $categories,
            'states' => $states,
            'propertyTypes' => $propertyTypes,
            'unitTypes' => $unitTypes,

            'isEdit' => true
        ]);
    }


    private function validateRequest($request)
    {
        return $request->validate([

            'name' => 'required|string|max:255',
            'builder_id' => 'nullable|string',

            'cover_image_url' => 'nullable|string',
            'gallery_images_url' => 'nullable|array',
            'floorPlans_images_url' => 'nullable|array',
            'slider_image_url' => 'nullable|array',

            'brochure_url' => 'nullable|string',
            'reel_url' => 'nullable|string',

            'amenity_ids' => 'nullable|array',

            'towers' => 'nullable|array',

            'towers.*.name' => 'nullable|string',
            'towers.*.total_floors' => 'nullable|integer',

            'towers.*.floor_designs' => 'nullable|array',

        ]);
    }


    private function saveUnits($request, $project)
    {
        $towerIds = [];
        $propertyTypeIds = [];
        $unitTypeIds = [];

        foreach ($request->towers ?? [] as $tower) {

            $incomingTowerId = $tower['id'] ?? $tower['_id'] ?? null;

            $floorDesigns = [];
            $unitRanges = [];
            $units = [];

            $totalUnits = 0;

            $category = $tower['category'] ?? 'apartment';



            if ($category === 'apartment') {

                foreach ($tower['floor_designs'] ?? [] as $floor) {

                    $from = (int) $floor['from_floor'];
                    $to = (int) $floor['to_floor'];
                    $unitsPerFloor = (int) $floor['units_per_floor'];

                    $floorsCount = ($to - $from) + 1;
                    $totalUnits += $floorsCount * $unitsPerFloor;

                    $propertyTypeId = $floor['property_type_id'] ?? null;
                    $unitTypeId = $floor['unit_type_id'] ?? null;

                    if ($propertyTypeId) {
                        $propertyTypeIds[] = (string) $propertyTypeId;
                    }

                    if ($unitTypeId) {
                        $unitTypeIds[] = (string) $unitTypeId;
                    }

                    $floorDesigns[] = [
                        'from_floor' => $from,
                        'to_floor' => $to,
                        'units_per_floor' => $unitsPerFloor,
                        'property_type_id' => $propertyTypeId,
                        'unit_type_id' => $unitTypeId,
                        'unit_size' => (int) ($floor['unit_size'] ?? 0),
                        'room_sizes' => $floor['room_sizes'] ?? [],
                    ];
                }

                $units = $this->generateApartmentUnits($tower['name'], $floorDesigns);
            }



            if ($category !== 'apartment') {

                foreach ($tower['unit_ranges'] ?? [] as $range) {

                    $from = (int) $range['from_unit'];
                    $to = (int) $range['to_unit'];

                    $totalUnits += ($to - $from) + 1;

                    $propertyTypeId = $range['property_type_id'] ?? null;
                    $unitTypeId = $range['unit_type_id'] ?? null;

                    if ($propertyTypeId) {
                        $propertyTypeIds[] = (string) $propertyTypeId;
                    }

                    if ($unitTypeId) {
                        $unitTypeIds[] = (string) $unitTypeId;
                    }

                    $unitRanges[] = [
                        'from_unit' => $from,
                        'to_unit' => $to,
                        'unit_prefix' => $range['unit_prefix'] ?? 'Villa',
                        'unit_size' => (int) ($range['unit_size'] ?? 0),
                        'property_type_id' => $propertyTypeId,
                        'unit_type_id' => $unitTypeId,
                        'room_sizes' => $range['room_sizes'] ?? [],
                    ];
                }

                $units = $this->generateVillaUnits($unitRanges);
            }



            $towerId = new ObjectId();

            $towerData = [
                '_id' => $towerId,
                'project_id' => (string) $project->_id,
                'name' => $tower['name'] ?? null,
                'type' => $category === 'apartment' ? 'apartment' : 'villa/bungalow',
                'category' => $category,
                'total_floors' => (int) ($tower['total_floors'] ?? 0),
                'total_units' => $totalUnits,
                'floor_designs' => $floorDesigns,
                'unit_ranges' => $unitRanges,
                'units' => $units,
                'status' => ($tower['status'] ?? "1") == "1",
            ];

            if (!$incomingTowerId || str_starts_with($incomingTowerId, 'tw_')) {

                Tower::create($towerData);

                $towerIds[] = (string) $towerId;

            } else {

                $existing = Tower::find($incomingTowerId);

                if ($existing) {

                    $existing->update($towerData);

                    $towerIds[] = (string) $existing->_id;
                }
            }
        }

        return [
            'towerIds' => $towerIds,
            'propertyTypeIds' => array_values(array_unique($propertyTypeIds)),
            'unitTypeIds' => array_values(array_unique($unitTypeIds)),
        ];
    }
    private function generateApartmentUnits($towerName, $floorDesigns)
    {
        $units = [];

        foreach ($floorDesigns as $design) {

            for ($floor = $design['from_floor']; $floor <= $design['to_floor']; $floor++) {

                for ($unit = 1; $unit <= $design['units_per_floor']; $unit++) {

                    $unitNumber = $towerName . "-" . $floor . str_pad($unit, 2, "0", STR_PAD_LEFT);

                    $units[] = [

                        'tower_name' => $towerName,
                        'floor_number' => $floor,
                        'unit_number' => $unitNumber,
                        'property_type_id' => $design['property_type_id'] ?? null,
                        'unit_type_id' => $design['unit_type_id'] ?? null,
                        'unit_size' => $design['unit_size'] ?? 0,
                        'room_sizes' => $design['room_sizes'] ?? [],
                        'status' => 'available'
                    ];
                }
            }
        }

        return $units;
    }

    private function generateVillaUnits($ranges)
    {
        $units = [];

        foreach ($ranges as $range) {

            for ($i = $range['from_unit']; $i <= $range['to_unit']; $i++) {

                $unitNumber = ($range['unit_prefix'] ?? 'Villa') . " " . $i;

                $units[] = [

                    'tower_name' => null,
                    'unit_number' => $unitNumber,
                    'property_type_id' => $range['property_type_id'] ?? null,
                    'unit_type_id' => $range['unit_type_id'] ?? null,
                    'unit_size' => $range['unit_size'] ?? 0,
                    'room_sizes' => $range['room_sizes'] ?? [],
                    'status' => 'available'
                ];
            }
        }

        return $units;
    }
    public function storeAll(Request $request)
    {
        // dd($request->all());
        $this->validateRequest($request);

        try {

            $project = $this->saveProject($request);

            $result = $this->saveUnits($request, $project);

            $project->update([
                'tower_ids' => $result['towerIds'],
                'property_type_ids' => $result['propertyTypeIds'],
                'unit_type_ids' => $result['unitTypeIds'],
            ]);



            $this->updateProjectTotals($project);

            return redirect()
                ->route('projects.index')
                ->with('success', 'Project created successfully');

        } catch (\Exception $e) {

            Log::error('Project storeAll failed', [
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Something went wrong.');
        }
    }
    private function saveProject($request)
    {
        $projectData = $request->except([
            'configurations',
            'towers',
            'project'
        ]);

        $baseSlug = Str::slug($projectData['name']);
        $slug = $baseSlug;
        $count = 1;

        while (Project::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $count++;
        }

        $projectData['slug'] = $slug;

        $projectData['amenity_ids'] = array_map(
            fn($id) => (string) $id,
            array_filter($request->amenity_ids ?? [])
        );

        return Project::create($projectData);
    }

    public function update(Request $request, $id)
    {
        // dd($request->all());    
        $this->validateRequest($request);

        $project = Project::findOrFail($id);

        try {

            $projectData = $request->except([
                'towers',
                '_method',
                '_token'
            ]);

            $projectData['slug'] = Str::slug($projectData['name']);

            $project->update($projectData);

            $towerIds = $this->saveUnits($request, $project);

            $project->update([
                'tower_ids' => $towerIds,
            ]);

            $this->updateProjectTotals($project);

            return redirect()
                ->route('projects.index')
                ->with('success', 'Project updated successfully');

        } catch (\Exception $e) {

            Log::error('Project update failed', [
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Something went wrong.');
        }
    }
    private function updateProjectTotals($project)
    {
        $project->update([
            'total_towers' => Tower::where('project_id', (string) $project->_id)->count(),
            'total_units' => Tower::where('project_id', (string) $project->_id)->sum('total_units'),
        ]);
    }



}