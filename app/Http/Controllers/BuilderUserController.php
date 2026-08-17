<?php

namespace App\Http\Controllers;

use App\Models\BuilderUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class BuilderUserController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();

        $query = BuilderUser::query();

        if (!$currentUser->isSuperAdmin()) {
            $query->whereIn(
                'created_by',
                $currentUser->accessibleUserIds()
            );
        }

        $users = BuilderUser::visibleTo(auth()->user())
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    '_id' => (string) $user->_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'company_name' => $user->company_name,
                    'address' => $user->address,
                    'logo' => $user->logo,
                    'status' => $user->status,
                    'created_by_id' => $user->created_by_id,
                ];
            });

        return Inertia::render('BuilderUsers/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')
                ->store('builder_logos', 'public');
        }

        $data['created_by_id'] = (string) auth()->id();
        $data['created_by_type'] = User::class;

        BuilderUser::create($data);

        return back()->with(
            'success',
            'Builder created successfully.'
        );
    }

    public function update(Request $request, $id)
    {
        $builder = BuilderUser::findOrFail($id);

        $this->authorizeBuilderAccess($builder);

        $data = $request->all();

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')
                ->store('builder_logos', 'public');
        }

        $builder->update($data);

        return back()->with(
            'success',
            'Builder updated successfully.'
        );
    }

    public function destroy($id)
    {
        $builder = BuilderUser::findOrFail($id);

        $this->authorizeBuilderAccess($builder);

        $builder->delete();

        return redirect()
            ->route('builder.index')
            ->with(
                'success',
                'Builder deleted successfully.'
            );
    }

    private function authorizeBuilderAccess($builder)
    {
        $currentUser = auth()->user();

        if ($currentUser->isSuperAdmin()) {
            return;
        }

        if (
            !in_array(
                $builder->created_by_id,
                $currentUser->accessibleUserIds()
            )
        ) {
            abort(403, 'Unauthorized');
        }
    }
}