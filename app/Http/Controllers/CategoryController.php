<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * List Page
     */
    public function index()
    {
        $categories = Category::latest()->paginate(10);

        $categories->getCollection()->transform(function ($category) {
            return [
                '_id' => (string) $category->_id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'meta_title' => $category->meta_title,
                'meta_description' => $category->meta_description,
                'meta_keywords' => $category->meta_keywords,
                'status' => $category->status,
                'created_at' => $category->created_at?->format('d M Y'),
            ];
        });

        return Inertia::render('Category/Index', [
            'categories' => $categories
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'status' => 'required|boolean',
        ]);

        // Generate Unique Slug
        $slug = Str::slug($request->name);
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        Category::create([
            'created_by_id' => auth()->id(),
            'created_by_type' => auth()->user()::class,
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'meta_keywords' => $validated['meta_keywords'] ?? null,
            'meta_data' => $validated['meta_data'] ?? [],
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category Created Successfully');
    }


    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'status' => 'required|boolean',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $count = 1;

        while (
            Category::where('slug', $slug)
                ->where('_id', '!=', $category->_id)
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $count++;
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'meta_keywords' => $validated['meta_keywords'] ?? null,
            'meta_data' => $validated['meta_data'] ?? [],
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category Updated Successfully');
    }
    /**
     * Delete
     */
    public function destroy($id)
    {
        Category::findOrFail($id)->delete();

        return redirect()->back()
            ->with('success', 'Category Deleted Successfully');
    }
}