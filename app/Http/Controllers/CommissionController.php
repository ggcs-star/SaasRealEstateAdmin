<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ChannelPartner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Commission;
class CommissionController extends Controller
{

    public function index(Request $request)
    {
        $commissions = Commission::with(['channelPartner', 'project', 'booking'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('booking_number', 'like', "%{$request->search}%")
                    ->orWhereHas('channelPartner', function ($cq) use ($request) {
                        $cq->where('partner_name', 'like', "%{$request->search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
        // dd($commissions->toArray());
        return Inertia::render('Commissions/Index', [
            'commissions' => $commissions,
            'filters' => $request->only('search'),
        ]);
    }

    public function show($id)
    {
        $commission = Commission::with([
            'booking',
            'customer',
            'project',
            'channelPartner',
            'approvedBy',
            'paidBy',
            'createdBy'
        ])->findOrFail($id);
// dd($commission->toArray());
        return Inertia::render('Commissions/Show', [
            'commission' => $commission
        ]);
    }
}