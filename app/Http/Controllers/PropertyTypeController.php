<?php

namespace App\Http\Controllers;

use App\Models\PropertyType;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyTypeController extends Controller
{

public function index()
{
    $propertyTypes = PropertyType::get();

    $categories = Category::select('_id','name')->get();

    return Inertia::render('PropertyTypes/Index', [
        'propertyTypes' => $propertyTypes,
        'categories' => $categories
    ]);
}

   

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'category_ids' => 'required|array'
    ]);

    PropertyType::create([
        'created_by_id' => auth()->id(),
        'created_by_type' => 'admin_users',
        'category_ids' => $request->category_ids,
        'name' => $request->name,
        'description' => $request->description,
        'meta_title' => $request->meta_title,
        'meta_description' => $request->meta_description,
        'meta_keywords' => $request->meta_keywords,
        'status' => $request->status ?? true,
    ]);

    return redirect()->route('property-types.index')
        ->with('success','Property Type Created');
}

   public function update(Request $request, $id)
{
    $propertyType = PropertyType::findOrFail($id);

    $request->validate([
        'name' => 'required',
        'category_ids' => 'required|array'
    ]);

    $propertyType->update([
        'category_ids' => $request->category_ids,
        'name' => $request->name,
        'description' => $request->description,
        'meta_title' => $request->meta_title,
        'meta_description' => $request->meta_description,
        'meta_keywords' => $request->meta_keywords,
        'status' => $request->status
    ]);

    return redirect()->route('property-types.index')
        ->with('success','Updated Successfully');
}

    public function destroy($id)
    {
        // dd($id);
        PropertyType::find($id)?->delete();

        return redirect()->back();
    }
}