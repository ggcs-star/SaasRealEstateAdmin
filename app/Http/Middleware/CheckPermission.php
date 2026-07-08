<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle($request, Closure $next)
    {
        $user = auth()->user();

        if (!$user) {
            abort(403);
        }

        $map = config('permissions.route_map');

        $routeName = $request->route()->getName();

        $permission = $map[$routeName] ?? null;

        if ($user->role === 'super_admin') {
            return $next($request);
        }

        if ($permission && !$user->hasPermission($permission)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}