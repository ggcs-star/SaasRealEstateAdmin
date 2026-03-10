<?php

namespace App\Http\Controllers;

use App\Models\BuilderUser;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
class BuilderUserController extends Controller
{
    public function index()
    {
        $users = BuilderUser::get()->map(function ($user) {
            return [
                '_id' => (string) $user->_id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'company_name' => $user->company_name,
                'address' => $user->address,
                'logo' => $user->logo,
                'status' => $user->status,
            ];
        });

        return Inertia::render('BuilderUsers/Index', [
            'users' => $users
        ]);
    }



    public function store(Request $request)
    {
        $data = $request->all();

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('builder_logos', 'public');
            $data['logo'] = $path;
        }

        BuilderUser::create($data);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        // dd($request->all());    
        $user = BuilderUser::findOrFail($id);
        $data = $request->all();

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('builder_logos', 'public');
            $data['logo'] = $path;
        }

        $user->update($data);

        return redirect()->back();
    }

    public function destroy($id)
    {
        BuilderUser::findOrFail($id)->delete();

        return redirect()->route('builder.index')
            ->with('success', 'Deleted Successfully');
    }
}