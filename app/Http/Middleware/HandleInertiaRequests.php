<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Role;
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */



public function share(Request $request)
{
    $user = $request->user();

    $permissions = [];

    if ($user) {

        if ($user->role === 'super_admin') {

            $permissions = collect(config('permissions.modules'))
                ->flatten()
                ->values()
                ->toArray();

        } else {

            $role = Role::where('name', $user->role)->first();
            $permissions = $role->permissions ?? [];
        }
    }

    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $user,
            'permissions' => $permissions,
        ],
    ]);
}
}
