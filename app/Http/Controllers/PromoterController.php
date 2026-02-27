<?php

namespace App\Http\Controllers;

use App\Models\Promoter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoterController extends Controller
{
    // Index
    public function index()
    {
        $promoters = Promoter::latest()->get()->map(function ($item) {
            return [
                '_id' => (string) $item->_id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'status' => $item->status,
            ];
        });

        return Inertia::render('Promoter/Index', [
            'promoters' => $promoters
        ]);
    }

    // Store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|boolean',
        ]);

        $validated['created_by_id'] = auth()->id();
        $validated['created_by_type'] = auth()->user()::class;

        Promoter::create($validated);

        return back()->with('success', 'Promoter created successfully');
    }

    // Update
    public function update(Request $request, $id)
    {
        $promoter = Promoter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|boolean',
        ]);

        $promoter->update($validated);

        return back()->with('success', 'Promoter updated successfully');
    }

    // Delete
    public function destroy($id)
    {
        Promoter::findOrFail($id)->delete();

        return back()->with('success', 'Promoter deleted successfully');
    }
}