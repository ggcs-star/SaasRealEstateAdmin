<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\BuilderUser;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Configuration;
use App\Models\Unit;
use Illuminate\Support\Facades\Log;
use App\Models\Promoter;

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
        $project = Project::with('builder')->findOrFail($id);

        $configurations = Configuration::where(
            'project_id',
            (string) $project->_id
        )->get();

        $units = Unit::where(
            'project_id',
            (string) $project->_id
        )->get();

        $towers = [];
        $bungalows = [];

        foreach ($units as $unit) {

            if ($unit->type === 'apartment') {
                $towers[] = [
                    '_id' => (string) $unit->_id,
                    'name' => $unit->tower,
                    'floors' => $unit->floors ?? [],
                ];
            }

            if ($unit->type === 'bungalow') {
                $bungalows = $unit->bungalows ?? [];
            }
        }

        return Inertia::render('Project/View', [
            'project' => [
                ...$project->toArray(),
                '_id' => (string) $project->_id,
                'builder' => $project->builder?->name,
            ],
            'configurations' => $configurations,
            'towers' => $towers,
            'bungalows' => $bungalows,
        ]);
    }
    // ✅ Create Page
    public function create()
    {
        $builders = BuilderUser::select('_id', 'name')->get()
            ->map(function ($builder) {
                return [
                    '_id' => (string) $builder->_id,
                    'name' => $builder->name,
                ];
            });

        $amenities = Amenity::select('_id', 'name', 'icon')
            ->whereIn('status', [true, 1, '1'])
            ->get()
            ->map(function ($amenity) {
                return [
                    '_id' => (string) $amenity->_id,
                    'name' => $amenity->name,
                    'icon' => asset('storage/' . $amenity->icon),
                ];
            });
        // dd($amenities);

        return Inertia::render('Project/Create', [
            'builders' => $builders,
            'amenities' => $amenities,
        ]);
    }

    // ✅ Store Project
    public function edit($id)
    {
        $project = Project::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | BUILDERS
        |--------------------------------------------------------------------------
        */

        $builders = BuilderUser::select('_id', 'name')->get()
            ->map(fn($b) => [
                '_id' => (string) $b->_id,
                'name' => $b->name,
            ]);

        /*
        |--------------------------------------------------------------------------
        | AMENITIES
        |--------------------------------------------------------------------------
        */

        $amenities = Amenity::select('_id', 'name', 'icon')
            ->whereIn('status', [true, 1, '1'])
            ->get()
            ->map(fn($a) => [
                '_id' => (string) $a->_id,
                'name' => $a->name,
                'icon' => asset('storage/' . $a->icon),
            ]);

        /*
        |--------------------------------------------------------------------------
        | CONFIGURATIONS
        |--------------------------------------------------------------------------
        */

        $configurations = Configuration::where(
            'project_id',
            (string) $project->_id
        )->get()->map(function ($config) {
            return [
                ...$config->toArray(),
                '_id' => (string) $config->_id,
                'project_id' => (string) $config->project_id,
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | UNITS → SPLIT INTO TOWERS & BUNGALOWS
        |--------------------------------------------------------------------------
        */

        $units = Unit::where(
            'project_id',
            (string) $project->_id
        )->get();

        $towers = [];
        $bungalows = [];

        foreach ($units as $unit) {

            if ($unit->type === 'apartment') {

                $towers[] = [
                    '_id' => (string) $unit->_id,
                    'name' => $unit->tower,
                    'floors' => $unit->floors ?? [],
                ];

            } elseif ($unit->type === 'bungalow') {

                $bungalows = $unit->bungalows ?? [];
            }
        }

        /*
        |--------------------------------------------------------------------------
        | RETURN
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Project/Create', [
            'projectData' => [
                'project' => [
                    ...$project->toArray(),
                    '_id' => (string) $project->_id,
                    'amenity_ids' => $project->amenity_ids ?? [],
                ],
                'configurations' => $configurations,
                'towers' => $towers,
                'bungalows' => $bungalows,
            ],
            'builders' => $builders,
            'amenities' => $amenities,
            'isEdit' => true
        ]);
    }

    private function validateRequest($request)
    {
        return $request->validate([

            'project.name' => 'required|string|max:255',
            'project.builder_id' => 'nullable|string',

            // Remove strict file validation for update
            'project.reel' => 'nullable',
            'project.brochure' => 'nullable',
            'project.logo_image' => 'nullable',

            'configurations' => 'nullable|array',

            // Allow both strings (old URLs) and files
            'configurations.*.imageslider.*' => 'nullable',
            'configurations.*.floorPlans.*' => 'nullable',
            'configurations.*.galleryImages.*' => 'nullable',

            'towers' => 'nullable|array',
            'bungalows' => 'nullable|array',
        ]);
    }
    private function saveConfigurations($request, $project)
    {
        if (empty($request->configurations))
            return;

        foreach ($request->configurations as $index => $config) {

            $configData = $config;
            $configData['project_id'] = (string) $project->_id;
            $configData['rooms'] = $config['rooms'] ?? [];

            $configData = $this->handleConfigurationUploads(
                $request,
                $index,
                $configData
            );

            Configuration::create($configData);
        }
    }
    private function handleConfigurationUploads($request, $index, $configData)
    {
        foreach (['imageslider', 'floorPlans', 'galleryImages'] as $field) {

            // If new files uploaded
            if ($request->hasFile("configurations.$index.$field")) {

                $configData[$field] = [];

                foreach ($request->file("configurations.$index.$field") as $image) {

                    $path = $image->store(
                        "projects/configurations/$field",
                        'public'
                    );

                    $configData[$field][] = asset('storage/' . $path);
                }

            } else {

                // If no new file → keep old images
                $configData[$field] = $configData[$field] ?? [];
            }
        }

        return $configData;
    }
    private function saveUnits($request, $project)
    {
        // Towers
        if (!empty($request->towers)) {

            foreach ($request->towers as $tower) {

                Unit::create([
                    'project_id' => (string) $project->_id,
                    'type' => 'apartment',
                    'tower' => $tower['name'] ?? null,
                    'floors' => $tower['floors'] ?? []
                ]);
            }
        }

        // Bungalows
        if (!empty($request->bungalows)) {

            Unit::create([
                'project_id' => (string) $project->_id,
                'type' => 'bungalow',
                'bungalows' => $request->bungalows
            ]);
        }
    }
    public function storeAll(Request $request)
    {
        // dd($request->all());
        $validated = $this->validateRequest($request);
        // dd($validated);
        try {

            $project = $this->saveProject($request);

            $this->saveConfigurations($request, $project);
            $this->saveUnits($request, $project);

            return redirect()
                ->route('projects.index')
                ->with('success', 'Project created successfully');

        } catch (\Exception $e) {

            $this->rollbackProject($project ?? null);

            Log::error('Project storeAll failed', [
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Something went wrong.');
        }
    }
    private function saveProject($request)
    {
        $projectData = $request->project;

        $projectData['slug'] = Str::slug($projectData['name']);

        $projectData['amenity_ids'] = array_map(
            fn($id) => (string) $id,
            array_filter($projectData['amenity_ids'] ?? [])
        );

        $projectData = $this->handleProjectUploads($request, $projectData);

        return Project::create($projectData);
    }
    private function handleProjectUploads($request, $projectData)
    {
        if ($request->hasFile('project.reel')) {

            $path = $request->file('project.reel')
                ->store('projects/reels', 'public');

            $projectData['reel'] = asset('storage/' . $path);
        }

        if ($request->hasFile('project.brochure')) {

            $path = $request->file('project.brochure')
                ->store('projects/brochures', 'public');

            $projectData['brochure'] = asset('storage/' . $path);
        }

        if ($request->hasFile('project.logo_image')) {

            $path = $request->file('project.logo_image')
                ->store('projects/logos', 'public');

            $projectData['logo_image'] = asset('storage/' . $path);
        }

        return $projectData;
    }
    public function update(Request $request, $id)
    {
        // dd($request->all());
        $validated = $this->validateRequest($request);
        // dd($validated);
        $project = Project::findOrFail($id);

        try {

            $this->updateProject($request, $project);

            $this->deleteProjectRelations($project);

            $this->saveConfigurations($request, $project);
            $this->saveUnits($request, $project);

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
    private function updateProject(Request $request, $project)
    {
        // dd($request);
        $projectData = $request->project;

        $projectData['slug'] = Str::slug($projectData['name']);

        $projectData['amenity_ids'] = array_map(
            fn($id) => (string) $id,
            array_filter($projectData['amenity_ids'] ?? [])
        );



        // Reel
        if ($request->hasFile('project.reel')) {

            $path = $request->file('project.reel')
                ->store('projects/reels', 'public');

            $projectData['reel'] = asset('storage/' . $path);

        } else {
            unset($projectData['reel']); // Prevent overwrite
        }

        // Brochure
        if ($request->hasFile('project.brochure')) {

            $path = $request->file('project.brochure')
                ->store('projects/brochures', 'public');

            $projectData['brochure'] = asset('storage/' . $path);

        } else {
            unset($projectData['brochure']);
        }

        // Logo
        if ($request->hasFile('project.logo_image')) {

            $path = $request->file('project.logo_image')
                ->store('projects/logos', 'public');

            $projectData['logo_image'] = asset('storage/' . $path);

        } else {
            unset($projectData['logo_image']);
        }

        $project->update($projectData);
    }
    private function deleteProjectRelations($project)
    {
        Configuration::where(
            'project_id',
            (string) $project->_id
        )->delete();

        Unit::where(
            'project_id',
            (string) $project->_id
        )->delete();
    }


    private function rollbackProject($project)
    {
        if (!$project)
            return;

        Configuration::where(
            'project_id',
            (string) $project->_id
        )->delete();

        Unit::where(
            'project_id',
            (string) $project->_id
        )->delete();

        $project->delete();
    }



}