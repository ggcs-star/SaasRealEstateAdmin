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
                'promoter_ids' => $project->promoter_ids ?? [],
                'created_at' => $project->created_at?->format('d M Y'),
            ];
        });

        $promoters = Promoter::latest()->get()->map(function ($promoter) {
            return [
                '_id' => (string) $promoter->_id,
                'name' => $promoter->name,
                'email' => $promoter->email,
                'phone' => $promoter->phone,
                'designation' => $promoter->designation,
                'commission_percent' => $promoter->commission_percent,
                'status' => $promoter->status,
            ];
        });

        return Inertia::render('Project/Index', [
            'projects' => $projects,
            'promoters' => $promoters, // 👈 send to frontend
        ]);
    }
    public function assignPromoter(Request $request, $id)
    {
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
            'area'
        ])->findOrFail($id);




        $amenityIds = $project->amenity_ids ?? [];
        $categoryIds = $project->category_ids ?? [];
        $configurationIds = $project->configuration_ids ?? [];
        $towerIds = $project->tower_ids ?? [];




        $amenities = Amenity::whereIn('_id', $amenityIds)
            ->get()
            ->map(fn($a) => [
                '_id' => (string) $a->_id,
                'name' => $a->name,
                'status' => (bool) $a->status,
            ])
            ->values();



        $categories = Category::whereIn('_id', $categoryIds)
            ->get()
            ->map(fn($c) => [
                '_id' => (string) $c->_id,
                'name' => $c->name,
            ])
            ->values();



        $allConfigurations = Configuration::whereIn('_id', $configurationIds)
            ->get()
            ->keyBy('_id');


        $configurations = $allConfigurations
            ->map(function ($config) {

                return [
                    '_id' => (string) $config->_id,
                    'name' => $config->name,
                    'type' => $config->type,
                    'room_sizes' => $config->room_sizes ?? [],
                    'description' => $config->description,
                    'status' => (bool) $config->status,
                ];
            })
            ->values();


        $towers = Tower::whereIn('_id', $towerIds)
            ->get()
            ->map(function ($tower) use ($allConfigurations) {


                $towerConfigs = collect($tower->configuration_ids ?? [])
                    ->map(function ($id) use ($allConfigurations) {

                        $conf = $allConfigurations->get($id);

                        return $conf ? [
                            '_id' => (string) $conf->_id,
                            'name' => $conf->name,
                        ] : null;

                    })
                    ->filter()
                    ->values();


                $units = collect($tower->units ?? [])
                    ->map(function ($unit) use ($allConfigurations) {

                        $conf = $allConfigurations->get($unit['configuration_id'] ?? null);

                        return [

                            'floor_number' => $unit['floor_number'] ?? null,

                            'unit_number' => $unit['unit_number'] ?? null,

                            'configuration_id' => $unit['configuration_id'] ?? null,

                            'configuration_name' => $conf?->type ?? null,

                            'status' => $unit['status'] ?? 'available',

                        ];
                    })
                    ->values();


                $floors = $units
                    ->groupBy('floor_number')
                    ->map(function ($floorUnits, $floorNumber) {

                        return [
                            'floor_number' => (int) $floorNumber,
                            'units' => $floorUnits->values()
                        ];

                    })
                    ->values();



                return [

                    '_id' => (string) $tower->_id,

                    'name' => $tower->name,

                    'type' => $tower->type,

                    'total_floors' => (int) $tower->total_floors,

                    'total_units' => (int) $tower->total_units,

                    'floor_designs' => $tower->floor_designs ?? [],

                    'configurations' => $towerConfigs,

                    'units' => $units,

                    'floors' => $floors,

                    'status' => (bool) $tower->status,

                ];

            })
            ->values();



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

                'configurations' => $configurations,

                'towers' => $towers,

            ]

        ]);
    }
    // ✅ Create Page
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

        $categories = Category::select('_id', 'name')
            ->where('status', true)
            ->get()
            ->map(function ($category) {
                return [
                    '_id' => (string) $category->_id,
                    'name' => $category->name,
                ];
            });
        $states = State::where('status', true)
            ->select('_id', 'name')
            ->get()
            ->map(function ($state) {
                return [
                    '_id' => (string) $state->_id,
                    'name' => $state->name,
                ];
            });

        return Inertia::render('Project/Create', [
            'builders' => $builders,
            'amenities' => $amenities,
            'categories' => $categories,
            'states' => $states,
        ]);
    }

    public function edit($id)
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
        // dd($amenities);
        $configurations = Configuration::whereIn(
            '_id',
            $project->configuration_ids ?? []
        )->get()->map(function ($config) {

            return [
                ...$config->toArray(),
                '_id' => (string) $config->_id,
            ];
        });
        $towers = Tower::where(
            'project_id',
            (string) $project->_id
        )->get()->map(function ($tower) {

            return [
                '_id' => (string) $tower->_id,
                'name' => $tower->name,
                'type' => $tower->type,
                'configuration_ids' => $tower->configuration_ids ?? [],
                'total_floors' => $tower->total_floors,
                'total_units' => $tower->total_units,
                'floor_designs' => $tower->floor_designs ?? [],
                'status' => $tower->status,
            ];
        });
        $states = State::where('status', true)
            ->select('_id', 'name')
            ->get()
            ->map(function ($state) {
                return [
                    '_id' => (string) $state->_id,
                    'name' => $state->name,
                ];
            });
        // dd($configurations);
        return Inertia::render('Project/Create', [
            'projectData' => [
                ...$project->toArray(),
                '_id' => (string) $project->_id,
                'amenity_ids' => collect($project->amenity_ids ?? [])
                    ->map(fn($id) => (string) $id)
                    ->values()
                    ->toArray(),
                'configurations' => $configurations,
                'towers' => $towers,
            ],
            'builders' => $builders,
            'amenities' => $amenities,
            'states' => $states,
            'isEdit' => true
        ]);
    }


    private function validateRequest($request)
    {
        // dd($request->all());
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

            'configurations' => 'nullable|array',

            'towers' => 'nullable|array',
            'towers.*.name' => 'nullable|string',
            'towers.*.total_floors' => 'nullable|integer',
            'towers.*.floor_designs' => 'nullable|array',
        ]);
    }
    private function saveConfigurations($request, $project)
    {
        $configMap = [];
        $configIds = [];
        $allCategoryIds = [];

        if (empty($request->configurations)) {
            return [$configMap, $configIds];
        }

        foreach ($request->configurations as $config) {

            $incomingId = $config['id'] ?? null;

            $configData = $config;
            unset($configData['id']);
            unset($configData['_id']);

            $configData['project_id'] = (string) $project->_id;

            // Collect categories
            if (!empty($configData['category_ids'])) {
                foreach ($configData['category_ids'] as $catId) {
                    $allCategoryIds[] = (string) $catId;
                }
            }


            if ($incomingId && str_starts_with($incomingId, 'cfg_')) {

                $created = Configuration::create($configData);

                $realId = (string) $created->_id;

                $configMap[$incomingId] = $realId;
                $configIds[] = $realId;
            } else {

                $existing = Configuration::find($incomingId);

                if ($existing) {
                    $existing->update($configData);
                    $configIds[] = (string) $existing->_id;
                }
            }
        }

        Configuration::where('project_id', (string) $project->_id)
            ->whereNotIn('_id', $configIds)
            ->delete();

        $project->update([
            'category_ids' => array_values(array_unique($allCategoryIds))
        ]);

        return [$configMap, $configIds];
    }

    private function saveUnits($request, $project, $configMap = [])
    {
        Log::info("SAVE UNITS START", [
            'incoming_towers' => $request->towers
        ]);

        $towerIds = [];

        if (empty($request->towers)) {
            Log::info("No towers found in request");
            return $towerIds;
        }

        foreach ($request->towers as $tower) {

            $incomingTowerId = $tower['id'] ?? $tower['_id'] ?? null;

            Log::info("Processing Tower", [
                'incomingTowerId' => $incomingTowerId,
                'tower_name' => $tower['name'] ?? null
            ]);

            $floorDesigns = [];
            $configurationIds = [];
            $totalUnits = 0;

            if (!empty($tower['floor_designs'])) {

                foreach ($tower['floor_designs'] as $floor) {

                    $incomingConfigId = $floor['configuration_id'];

                    $realConfigId = $configMap[$incomingConfigId] ?? $incomingConfigId;

                    if (!$realConfigId) {
                        Log::warning("Config ID not resolved", [
                            'incomingConfigId' => $incomingConfigId
                        ]);
                        continue;
                    }

                    $from = (int) $floor['from_floor'];
                    $to = (int) $floor['to_floor'];
                    $unitsPerFloor = (int) $floor['units_per_floor'];

                    $floorsCount = ($to - $from) + 1;
                    $rangeUnits = $floorsCount * $unitsPerFloor;

                    $totalUnits += $rangeUnits;

                    $configurationIds[] = $realConfigId;

                    $floorDesigns[] = [
                        'from_floor' => $from,
                        'to_floor' => $to,
                        'units_per_floor' => $unitsPerFloor,
                        'configuration_id' => $realConfigId,
                    ];
                }
            }

            $units = $this->generateUnits(
                $tower['name'],
                $floorDesigns
            );

            $towerData = [
                'project_id' => (string) $project->_id,
                'type' => 'apartment',
                'name' => $tower['name'] ?? null,
                'configuration_ids' => array_values(array_unique($configurationIds)),
                'total_floors' => (int) ($tower['total_floors'] ?? 0),
                'total_units' => $totalUnits,
                'floor_designs' => $floorDesigns,
                'units' => $units,
                'status' => ($tower['status'] ?? "1") == "1",
            ];


            if ($incomingTowerId && str_starts_with($incomingTowerId, 'tw_')) {

                Log::info("Creating NEW tower");

                $createdTower = Tower::create($towerData);
                $towerIds[] = (string) $createdTower->_id;
            } elseif ($incomingTowerId) {

                $existingTower = Tower::find($incomingTowerId);

                if ($existingTower) {

                    Log::info("Updating EXISTING tower", [
                        'tower_id' => $incomingTowerId
                    ]);

                    $existingTower->update($towerData);
                    $towerIds[] = (string) $existingTower->_id;

                } else {

                    Log::warning("Tower not found for update", [
                        'tower_id' => $incomingTowerId
                    ]);
                }
            }
        }

        Log::info("Final Tower IDs", [
            'towerIds' => $towerIds
        ]);

        Tower::where('project_id', (string) $project->_id)
            ->whereNotIn('_id', $towerIds)
            ->delete();

        return $towerIds;
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

                        'configuration_id' => $configId,

                        'status' => 'available'

                    ];
                }
            }
        }

        return $units;
    }
    public function storeAll(Request $request)
    {
        // dd($request->all());
        $validated = $this->validateRequest($request);

        try {

            $project = $this->saveProject($request);

            [$configMap, $configIds] =
                $this->saveConfigurations($request, $project);

            $towerIds =
                $this->saveUnits($request, $project, $configMap);

            $project->update([
                'configuration_ids' => $configIds,
                'tower_ids' => $towerIds,
                'total_towers' => count($towerIds),
            ]);

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

        $projectData['slug'] = Str::slug($projectData['name']);

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
                'configurations',
                'towers',
                '_method',
                '_token'
            ]);

            $projectData['slug'] = Str::slug($projectData['name']);

            $project->update($projectData);


            [$configMap, $configIds] =
                $this->saveConfigurations($request, $project);

            $towerIds =
                $this->saveUnits($request, $project, $configMap);
            // dd($towerIds);
            $project->update([
                'configuration_ids' => $configIds,
                'tower_ids' => $towerIds,
                'total_towers' => count($towerIds),
            ]);

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





}