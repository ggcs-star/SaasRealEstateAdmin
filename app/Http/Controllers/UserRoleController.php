<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use App\Enums\UserRole;
class UserRoleController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        return Inertia::render('Users/Index', [
            'users' => User::visibleTo($currentUser)->get(),
            'roles' => Role::all(),

            'managers' => $currentUser->isSuperAdmin()
                ? User::where('role', UserRole::MANAGER)
                    ->select('_id', 'name')
                    ->get()
                : [],

            'userRoles' => [
                'SUPER_ADMIN' => UserRole::SUPER_ADMIN,
                'MANAGER' => UserRole::MANAGER,
                'EMPLOYEE' => UserRole::EMPLOYEE,
            ],
        ]);
    }

    public function assignRole(Request $request)
    {

        //   dd($request->all());
        $request->validate([
            'user_id' => 'required',
            'role' => 'required',
            'manager_id' => 'required_if:role,' . UserRole::EMPLOYEE,
        ]);

        $user = User::find($request->user_id);

        $user->role = $request->role;

        $user->manager_id =
            $request->role === UserRole::EMPLOYEE
            ? $request->manager_id
            : null;

        $user->save();
        $user->save();

        return back()->with('success', 'Role assigned successfully ✅');
    }
}

