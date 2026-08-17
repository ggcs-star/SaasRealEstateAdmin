<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;
class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::visibleTo(auth()->user())
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('first_name', 'like', "%{$request->search}%")
                        ->orWhere('last_name', 'like', "%{$request->search}%")
                        ->orWhere('email', 'like', "%{$request->search}%")
                        ->orWhere('mobile', 'like', "%{$request->search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        ;

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validateCustomer($request);
        $validated['password'] = Hash::make($validated['password']);
        $validated['created_by_id'] = (string) auth()->id();
        $validated['created_by_type'] = User::class;
        Customer::create($validated);

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function edit($id)
    {
        $customer = Customer::visibleTo(auth()->user())
            ->findOrFail($id);
        // dd($customer);
        return Inertia::render('Customers/Edit', [
            'customer' => $customer
        ]);
    }


    public function update(Request $request, $id)
    {
        $customer = Customer::visibleTo(auth()->user())
            ->findOrFail($id);

        $validated = $this->validateCustomer($request, $id);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $customer->update($validated);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy($id)
    {
        $customer = Customer::visibleTo(auth()->user())
            ->findOrFail($id);

        $customer->delete();

        return back()->with(
            'success',
            'Customer deleted successfully.'
        );
    }

    // Helper method for clean validation
    private function validateCustomer(Request $request, $id = null)
    {
        return $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',

            'email' => 'required|email|unique:customers,email,' . $id . ',_id',

            'mobile' => 'required|string|unique:customers,mobile,' . $id . ',_id',

            'alternate_mobile' => 'nullable|string',

            'password' => $id
                ? 'nullable|min:6'
                : 'required|min:6',

            'gender' => 'nullable|string',
            'dob' => 'nullable|date',
            'marital_status' => 'nullable|string',

            'country' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
            'pincode' => 'nullable|string',

            'occupation' => 'nullable|string',
            'company_name' => 'nullable|string',
            'annual_income' => 'nullable|numeric',

            'pan_number' => 'nullable|string',
            'aadhaar_number' => 'nullable|string',

            'preferred_property_type' => 'nullable|string',
            'preferred_city' => 'nullable|string',
            'budget_min' => 'nullable|numeric',
            'budget_max' => 'nullable|numeric',

            'status' => 'required|in:active,inactive,blocked',
            'source' => 'nullable|string',
        ]);
    }
    public function show($id)
    {
        $customer = Customer::visibleTo(auth()->user())
            ->findOrFail($id);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }
}