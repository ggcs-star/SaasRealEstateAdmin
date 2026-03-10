<?php

namespace App\Http\Controllers;

use App\Models\UnitType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitTypeController extends Controller
{
    public function index()
    {
        $unitTypes = UnitType::latest()->get();

        return Inertia::render('UnitTypes/Index', [
            'unitTypes' => $unitTypes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'bhk' => 'required|integer'
        ]);

        UnitType::create([
            'created_by_id' => auth()->id(),
            'created_by_type' => 'admin_users',

            'name' => $request->name,
            'bhk' => $request->bhk,
            'description' => $request->description,
            'room_sizes' => $request->room_sizes,

            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'meta_keywords' => $request->meta_keywords,

            'status' => $request->status ?? true,
        ]);

        return redirect()->back()->with('success','Created');
    }

    public function update(Request $request,$id)
    {
        $unitType = UnitType::findOrFail($id);

        $unitType->update($request->only([
            'name',
            'bhk',
            'description',
            'room_sizes',
            'meta_title',
            'meta_description',
            'meta_keywords',
            'status'
        ]));

        return redirect()->back()->with('success','Updated');
    }

    public function destroy($id)
    {
        UnitType::find($id)?->delete();

        return redirect()->back();
    }
}