<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
class AmenityController extends Controller
{
    // ✅ List Page
    public function index()
    {
        $amenities = Amenity::latest()->get()->map(function ($item) {
            return [
                '_id' => (string) $item->_id, 
                'name' => $item->name,
                'icon' => $item->icon,
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
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'status' => 'required|boolean'
        ]);

        $data = $request->only(['name', 'status']);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('amenities', 'public');
        }

        Amenity::create($data);

        return back()->with('success', 'Amenity created successfully');
    }

    // ✅ Update
    public function update(Request $request, $id)
    {

        // dd($request->all(), $id);
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'status' => 'required|boolean'
        ]);

        $amenity = Amenity::findOrFail($id);

        $data = $request->only(['name', 'status']);

        if ($request->hasFile('icon')) {

            if ($amenity->icon) {
                Storage::disk('public')->delete($amenity->icon);
            }

            $data['icon'] = $request->file('icon')->store('amenities', 'public');
        }

        $amenity->update($data);

        return back()->with('success', 'Amenity updated successfully');
    }

    // ✅ Delete
    public function destroy($id)
    {
        $amenity = Amenity::findOrFail($id);

        if ($amenity->icon && Storage::disk('public')->exists($amenity->icon)) {
            Storage::disk('public')->delete($amenity->icon);
        }

        $amenity->delete();

        return redirect()->back()->with('success', 'Amenity deleted successfully');
    }
}