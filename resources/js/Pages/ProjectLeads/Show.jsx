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
    ClipboardList
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
            alert("Please select followup date");
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

    // Consistent gradient status styling mapped from previous design
    const getStatusStyle = (status) => {
        switch(status) {
            case 'new': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200';
            case 'contacted': return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200';
            case 'interested': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200';
            case 'site_visit': return 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200';
            case 'booked': return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200';
            case 'lost': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200';
            default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200';
        }
    };

    // Helper component for Lead Info Cards
    const InfoCard = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-100 hover:shadow-sm transition-all">
            <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-gray-900 font-medium text-sm">{value || <span className="text-gray-400 italic">Not Provided</span>}</p>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Lead - ${lead.name}`} />

            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("project-leads.index")}
                            className="p-2.5 bg-white text-gray-600 hover:text-emerald-600 rounded-xl shadow-sm border border-gray-200 hover:border-emerald-200 transition-all"
                            title="Back to Leads"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                    <User size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {lead.name}
                                </h1>
                            </div>
                            <p className="text-gray-500 ml-14 mt-1 text-sm">
                                CRM Lead Details & Followups
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Lead Info & Remarks */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Lead Information Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                                <ClipboardList className="text-emerald-600" size={20} />
                                <h2 className="text-lg font-bold text-gray-900">Lead Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoCard icon={User} label="Full Name" value={lead.name} />
                                    <InfoCard icon={Mail} label="Email Address" value={lead.email} />
                                    <InfoCard icon={Phone} label="Mobile Number" value={`${lead.country_code || ''} ${lead.mobile || ''}`.trim()} />
                                    <InfoCard icon={Building} label="Target Project" value={lead.project?.name} />
                                    <InfoCard icon={Search} label="Looking For" value={lead.looking_for} />
                                    <InfoCard icon={BedDouble} label="Bedrooms Preference" value={Array.isArray(lead.preferred_bedrooms) ? lead.preferred_bedrooms.join(", ") : lead.preferred_bedrooms} />
                                    <InfoCard icon={CheckSquare} label="Consent Given" value={lead.consent ? "Yes" : "No"} />
                                    <InfoCard icon={Globe} label="Lead Source" value={lead.source} />
                                    <InfoCard icon={Monitor} label="IP Address" value={lead.ip_address} />
                                    <InfoCard icon={Calendar} label="Created At" value={lead.created_at} />
                                </div>
                            </div>
                        </div>

                        {/* General Remarks Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                                <FileText className="text-emerald-600" size={20} />
                                <h3 className="text-lg font-bold text-gray-900">General Remarks</h3>
                            </div>
                            <div className="p-6">
                                <textarea
                                    rows="4"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add important notes or remarks about this lead here..."
                                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-y"
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={saveRemark}
                                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all transform hover:scale-105"
                                    >
                                        <Save size={18} />
                                        Save Remarks
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Actions & Followups */}
                    <div className="flex flex-col gap-6">

                        {/* Quick Actions & Status */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-6">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                                <Activity className="text-blue-600" size={20} />
                                <h2 className="text-lg font-bold text-gray-900">Lead Actions</h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Update Lead Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full pl-4 pr-10 py-3 text-sm font-bold rounded-xl border appearance-none outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 cursor-pointer transition-all ${getStatusStyle(lead.lead_status || 'new')}`}
                                            value={lead.lead_status || "new"}
                                            onChange={(e) => updateStatus(e.target.value)}
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="interested">Interested</option>
                                            <option value="site_visit">Site Visit</option>
                                            <option value="booked">Booked</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={`tel:${lead.country_code || ''}${lead.mobile}`}
                                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium shadow-sm transition-all transform hover:scale-[1.02]"
                                    >
                                        <PhoneCall size={18} />
                                        Call Customer
                                    </a>

                                    <a
                                        href={`https://wa.me/${(lead.country_code || '').replace('+', '')}${lead.mobile}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-xl font-medium shadow-sm transition-all transform hover:scale-[1.02]"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp Chat
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Followups Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-amber-600" size={20} />
                                    <h2 className="text-lg font-bold text-gray-900">Followups</h2>
                                </div>
                                <span className="bg-amber-100 text-amber-700 py-0.5 px-2.5 rounded-full text-xs font-bold border border-amber-200">
                                    {followups?.length || 0}
                                </span>
                            </div>

                            <div className="p-6 border-b border-gray-100 bg-amber-50/30">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Add New Followup</h3>
                                <div className="space-y-3">
                                    <input
                                        type="date"
                                        value={followupDate}
                                        onChange={(e) => setFollowupDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Followup remark..."
                                        value={followupRemark}
                                        onChange={(e) => setFollowupRemark(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                                    />
                                    <button
                                        onClick={addFollowup}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-medium transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add Record
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 max-h-[400px] overflow-y-auto">
                                {followups?.length > 0 ? (
                                    <div className="space-y-4">
                                        {followups.map((item, index) => (
                                            <div 
                                                key={item.id || item._id} 
                                                className="relative pl-4 border-l-2 border-amber-200 pb-2"
                                            >
                                                {/* Timeline dot */}
                                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white"></div>
                                                
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-amber-100 transition-colors">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                                            <Calendar size={12} />
                                                            {item.followup_date}
                                                        </span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusStyle(item.status)}`}>
                                                            {item.status || lead.lead_status || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-800 bg-white p-2.5 rounded-lg border border-gray-100">
                                                        {item.remark || <span className="text-gray-400 italic">No remarks left.</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                            <Clock size={24} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">No followups recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}