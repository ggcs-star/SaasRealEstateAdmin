<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ChannelPartner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChannelPartnerController extends Controller
{
    public function index(Request $request)
    {
        $partners = ChannelPartner::when($request->search, function ($q) use ($request) {
            $q->where('partner_name', 'like', "%{$request->search}%")
                ->orWhere('partner_code', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('contact_number', 'like', "%{$request->search}%")
                ->orWhere('company_name', 'like', "%{$request->search}%");
        })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ChannelPartners/Index', [
            'partners' => $partners,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('ChannelPartners/Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validatePartner($request);
        $validated['password'] = Hash::make($validated['password']);

        $fileFields = ['aadhaar_front', 'aadhaar_back', 'pan_image', 'cancelled_cheque'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store('channel_partners/docs', 'public');
            }
        }

        ChannelPartner::create($validated);

        return redirect()->route('channel-partners.index')
            ->with('success', 'Channel Partner created successfully.');
    }

    public function edit($id)
    {
        $partner = ChannelPartner::findOrFail($id);

        return Inertia::render('ChannelPartners/Edit', [
            'partner' => $partner,
        ]);
    }

    public function update(Request $request, $id)
    {
        $channelPartner = ChannelPartner::findOrFail($id);

        $validated = $this->validatePartner(
            $request,
            $id
        );


        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $fileFields = ['aadhaar_front', 'aadhaar_back', 'pan_image', 'cancelled_cheque'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                if ($channelPartner->$field) {
                    Storage::disk('public')->delete($channelPartner->$field);
                }
                $validated[$field] = $request->file($field)->store('channel_partners/docs', 'public');
            } else {
                unset($validated[$field]);
            }
        }

        $channelPartner->update($validated);

        return redirect()->route('channel-partners.index')
            ->with('success', 'Channel Partner updated successfully.');
    }

    public function destroy(ChannelPartner $channelPartner)
    {
        $fileFields = ['aadhaar_front', 'aadhaar_back', 'pan_image', 'cancelled_cheque'];
        foreach ($fileFields as $field) {
            if ($channelPartner->$field) {
                Storage::disk('public')->delete($channelPartner->$field);
            }
        }

        $channelPartner->delete();
        return back()->with('success', 'Channel Partner deleted successfully.');
    }

    private function validatePartner(Request $request, $id = null)
    {
        return $request->validate([
            'partner_code' => 'required|string|unique:channel_partners,partner_code' . ($id ? ',' . $id . ',_id' : ''),
            'partner_name' => 'required|string|max:255',
            'contact_number' => 'required|string|unique:channel_partners,contact_number' . ($id ? ',' . $id . ',_id' : ''),
            'alternate_number' => 'nullable|string',
            'email' => 'required|email|unique:channel_partners,email' . ($id ? ',' . $id . ',_id' : ''),
            'password' => $id ? 'nullable|min:6' : 'required|min:6',

            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:Male,Female,Other',

            'aadhaar_number' => 'nullable|string',
            'aadhaar_front' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'aadhaar_back' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'pan_number' => 'nullable|string',
            'pan_image' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',

            'gst_number' => 'nullable|string',
            'rera_number' => 'nullable|string',
            'company_name' => 'nullable|string',
            'company_type' => 'nullable|string',

            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'pincode' => 'nullable|string',

            'bank_name' => 'nullable|string',
            'account_holder_name' => 'nullable|string',
            'account_number' => 'nullable|string',
            'ifsc_code' => 'nullable|string',
            'cancelled_cheque' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',

            'commission_type' => 'nullable|string|in:Percentage,Fixed',
            'commission_value' => 'nullable|numeric',

            'status' => 'required|in:Pending,Approved,Rejected,Blocked',
        ]);
    }
}