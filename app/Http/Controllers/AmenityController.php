<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AmenityController extends Controller
{
    // ✅ Index
    public function index()
    {
        $amenities = Amenity::latest()->get()->map(function ($item) {
            return [
                '_id' => (string) $item->_id,
                'name' => $item->name,
                'icon_url' => $item->icon_url,
                'description' => $item->description,
                'meta_title' => $item->meta_title,
                'meta_description' => $item->meta_description,
                'meta_keywords' => $item->meta_keywords,
                'meta_data' => $item->meta_data,
                'status' => $item->status,
            ];
        });

        return Inertia::render('Amenity/Index', [
            'amenities' => $amenities
        ]);
    }

    // ✅ Store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon_url' => 'nullable|url',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'status' => 'required|boolean'
        ]);

        $validated['created_by_id'] = auth()->id();
        $validated['created_by_type'] = auth()->user()::class;

        Amenity::create($validated);

        return back()->with('success', 'Amenity created successfully');
    }

    // ✅ Update
    public function update(Request $request, $id)
    {
        $amenity = Amenity::findOrFail($id);
// dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon_url' => 'nullable|url',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'status' => 'required|boolean'
        ]);

        $amenity->update($validated);

        return back()->with('success', 'Amenity updated successfully');
    }

    // ✅ Delete
    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);

        $amenity->delete();

        return back()->with('success', 'Amenity deleted successfully');
    }
}