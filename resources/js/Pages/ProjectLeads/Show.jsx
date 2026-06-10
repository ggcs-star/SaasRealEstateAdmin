import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    Building, 
    Search, 
    BedDouble, 
    CheckSquare, 
    Globe, 
    Monitor, 
    Calendar,
    MessageCircle,
    PhoneCall,
    Save,
    Plus,
    Clock,
    FileText,
    Activity,
    ClipboardList,
    MoreVertical
} from "lucide-react";

export default function Show({ auth, lead, followups = [] }) {
    const leadId = lead.id || lead._id;

    const [remarks, setRemarks] = useState(lead.remarks || "");
    const [followupDate, setFollowupDate] = useState("");
    const [followupRemark, setFollowupRemark] = useState("");

    const updateStatus = (status) => {
        router.post(
            route("project-leads.status"),
            {
                id: leadId,
                lead_status: status,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const saveRemark = () => {
        router.post(
            route("project-leads.remark"),
            {
                id: leadId,
                remarks,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const addFollowup = () => {
        if (!followupDate) {
            alert("Please select a followup date.");
            return;
        }

        router.post(
            route("lead-followup.store"),
            {
                lead_id: leadId,
                followup_date: followupDate,
                remark: followupRemark,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFollowupDate("");
                    setFollowupRemark("");
                }
            }
        );
    };

    // Consistent gradient status styling
    const getStatusStyle = (status) => {
        switch(status) {
            case 'new': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
            case 'contacted': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200';
            case 'interested': return 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200';
            case 'site_visit': return 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200';
            case 'booked': return 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200';
            case 'lost': return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200';
            default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200';
        }
    };

    // Enhanced Info Card Component
    const InfoCard = ({ icon: Icon, label, value }) => (
        <div className="group flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 hover:bg-white border border-transparent hover:border-emerald-100 hover:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] transition-all duration-300">
            <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-emerald-600 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-300">
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center min-h-[44px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-gray-900 font-semibold text-sm leading-tight">
                    {value || <span className="text-gray-400 font-normal italic">Not Provided</span>}
                </p>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Lead - ${lead.name}`} />

            <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
                
                {/* Header Section */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-5">
                        <Link
                            href={route("project-leads.index")}
                            className="p-3 bg-white text-gray-500 hover:text-emerald-600 rounded-xl shadow-sm border border-gray-200 hover:border-emerald-200 transition-all hover:-translate-x-1"
                            title="Back to Leads"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {lead.name}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(lead.lead_status || 'new')} shadow-sm uppercase tracking-wide`}>
                                    {lead.lead_status || 'New'}
                                </span>
                            </div>
                            <p className="text-slate-500 mt-1.5 text-sm font-medium flex items-center gap-2">
                                <Mail size={14} /> {lead.email || 'No email provided'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (Span 8): Lead Info, Followup Timeline, Remarks */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        
                        {/* Lead Information Panel */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <ClipboardList size={22} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Lead Details</h2>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <InfoCard icon={User} label="Full Name" value={lead.name} />
                                    <InfoCard icon={Phone} label="Mobile Number" value={`${lead.country_code || ''} ${lead.mobile || ''}`.trim()} />
                                    <InfoCard icon={Building} label="Target Project" value={lead.project?.name} />
                                    <InfoCard icon={Search} label="Looking For" value={lead.looking_for} />
                                    <InfoCard icon={BedDouble} label="Bedrooms Pref." value={Array.isArray(lead.preferred_bedrooms) ? lead.preferred_bedrooms.join(", ") : lead.preferred_bedrooms} />
                                    <InfoCard icon={Globe} label="Lead Source" value={lead.source} />
                                    <InfoCard icon={CheckSquare} label="Consent Given" value={lead.consent ? "Yes" : "No"} />
                                    <InfoCard icon={Calendar} label="Created At" value={lead.created_at} />
                                </div>
                            </div>
                        </div>

                        {/* Followups Timeline Panel */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                        <Clock size={22} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900">Followup Journey</h2>
                                </div>
                                <span className="bg-white text-slate-700 py-1 px-3 rounded-full text-xs font-bold border border-slate-200 shadow-sm">
                                    {followups?.length || 0} Records
                                </span>
                            </div>

                            <div className="p-8">
                                {followups?.length > 0 ? (
                                    <div className="relative border-l-2 border-dashed border-slate-200 ml-4 space-y-8 pb-4">
                                        {followups.map((item, index) => (
                                            <div key={item.id || item._id} className="relative pl-8">
                                                {/* Timeline Marker */}
                                                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-amber-400 shadow-sm"></div>
                                                
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                            <Calendar size={14} className="text-amber-500" />
                                                            {item.followup_date}
                                                        </span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getStatusStyle(item.status)}`}>
                                                            {item.status || lead.lead_status || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        {item.remark || <span className="text-slate-400 italic">No remarks provided for this followup.</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4 border border-slate-100">
                                            <Clock size={28} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-700 mb-1">No Followups Yet</h3>
                                        <p className="text-sm text-slate-500">Add a new followup from the right panel to start tracking.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* General Remarks Panel */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <FileText size={22} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">General Notes</h3>
                            </div>
                            <div className="p-8">
                                <textarea
                                    rows="4"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Type important internal notes, client preferences, or observations here..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-y text-sm text-slate-700"
                                />
                                <div className="mt-5 flex justify-end">
                                    <button
                                        onClick={saveRemark}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <Save size={18} />
                                        Save Notes
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Span 4): Sticky Actions & Add Followup */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="sticky top-6 flex flex-col gap-6">
                            
                            {/* Action Center */}
                            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Activity size={18} className="text-blue-600" />
                                        Action Center
                                    </h2>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    {/* Status Updater */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                                            Current Stage
                                        </label>
                                        <div className="relative">
                                            <select
                                                className={`w-full pl-4 pr-10 py-3.5 text-sm font-bold rounded-xl border appearance-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all shadow-sm ${getStatusStyle(lead.lead_status || 'new')}`}
                                                value={lead.lead_status || "new"}
                                                onChange={(e) => updateStatus(e.target.value)}
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                            >
                                                <option value="new">🆕 New</option>
                                                <option value="contacted">📞 Contacted</option>
                                                <option value="interested">⭐ Interested</option>
                                                <option value="site_visit">🏢 Site Visit</option>
                                                <option value="booked">✅ Booked</option>
                                                <option value="lost">❌ Lost</option>
                                            </select>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100" />

                                    {/* Contact Buttons */}
                                    <div className="space-y-3">
                                        <a
                                            href={`tel:${lead.country_code || ''}${lead.mobile}`}
                                            className="flex items-center justify-center gap-2.5 w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold shadow-md transition-all transform hover:-translate-y-0.5"
                                        >
                                            <PhoneCall size={18} />
                                            Call Direct
                                        </a>

                                        <a
                                            href={`https://wa.me/${(lead.country_code || '').replace('+', '')}${lead.mobile}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white py-3.5 rounded-xl font-semibold shadow-md shadow-green-200 transition-all transform hover:-translate-y-0.5"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Add New Followup Widget */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[24px] shadow-sm border border-amber-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-amber-100/50 bg-white/50">
                                    <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                                        <Plus size={18} className="text-amber-600" />
                                        Log New Followup
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-amber-800/70 uppercase tracking-wider mb-1.5">
                                            Followup Date
                                        </label>
                                        <input
                                            type="date"
                                            value={followupDate}
                                            onChange={(e) => setFollowupDate(e.target.value)}
                                            className="w-full border border-amber-200/60 bg-white rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm font-medium text-slate-700 shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-amber-800/70 uppercase tracking-wider mb-1.5">
                                            Remarks
                                        </label>
                                        <textarea
                                            rows="3"
                                            placeholder="What happened? What's next?"
                                            value={followupRemark}
                                            onChange={(e) => setFollowupRemark(e.target.value)}
                                            className="w-full border border-amber-200/60 bg-white rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm text-slate-700 shadow-sm resize-y"
                                        />
                                    </div>
                                    <button
                                        onClick={addFollowup}
                                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold shadow-md shadow-amber-200 transition-all transform hover:-translate-y-0.5 mt-2"
                                    >
                                        <CheckSquare size={18} />
                                        Submit Record
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}