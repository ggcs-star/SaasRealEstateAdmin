<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Role;

class RoleController extends Controller
{

    public function index()
    {
        return Inertia::render('Roles/Index', [
            'roles' => Role::all(),
            'permissionsList' => collect(config('permissions.modules'))
                ->flatten()
                ->values()
                ->toArray()
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create', [
            'permissionsList' => collect(config('permissions.modules'))
                ->flatten()
                ->values()
                ->toArray()
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:roles,name',
            'permissions' => 'nullable|array'
        ]);

        $roleName = strtolower(trim($request->name));

        if (Role::where('name', $roleName)->exists()) {
            return back()->withErrors([
                'name' => 'Role already exists ❌'
            ]);
        }

        Role::create([
            'name' => $roleName,
            'permissions' => $request->permissions ?? []
        ]);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role created successfully ✅');
    }

    public function updatePermissions(Request $request)
    {
        $role = Role::where('name', $request->role)->first();

        if (!$role) {
            return back()->withErrors(['role' => 'Role not found']);
        }

        $role->permissions = $request->permissions;
        $role->save();

        return back()->with('success', 'Permissions updated ✅');
    }
}

