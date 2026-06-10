<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProjectLead;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Models\LeadFollowup;
class ProjectLeadController extends Controller
{


    public function index()
    {
        $leads = ProjectLead::with('project')
            ->latest()
            ->paginate(20);

        return Inertia::render('ProjectLeads/Index', [
            'leads' => $leads
        ]);
    }

    public function show($id)
{
    $lead = ProjectLead::with('project')->findOrFail($id);

    $followups = LeadFollowup::where('lead_id', $id)
        ->latest()
        ->get();
// dd($followups);
    return Inertia::render('ProjectLeads/Show', [
        'lead' => $lead,
        'followups' => $followups,
    ]);
}

    public function updateStatus(Request $request)
    {
        $lead = ProjectLead::findOrFail($request->id);

        $lead->update([
            'lead_status' => $request->lead_status
        ]);

        return back();
    }
    public function updateRemark(Request $request)
    {
        ProjectLead::findOrFail(
            $request->id
        )->update([
                    'remarks' => $request->remarks
                ]);

        return back();
    }

    public function addFollowup(Request $request)
    {
        LeadFollowup::create([

            'lead_id' => $request->lead_id,

            'followup_date' =>
                $request->followup_date,

            'remark' =>
                $request->remark,

            'status' => 'pending',
        ]);

        return back();
    }
}