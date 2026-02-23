<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;

class UserRoleController extends Controller
{
    // Show users + roles
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::all(),
            'roles' => Role::all()
        ]);
    }

    // Assign role
    public function assignRole(Request $request)
    {

    //   dd($request->all());
        $request->validate([
            'user_id' => 'required',
            'role' => 'required'
        ]);

        $user = User::find($request->user_id);

        $user->role = $request->role;
        $user->save();

        return back()->with('success', 'Role assigned successfully ✅');
    }
}

