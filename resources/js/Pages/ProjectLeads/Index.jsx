import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react';
import { 
    Users, 
    Phone, 
    Mail, 
    Home, 
    Calendar,
    Target,
    Activity,
    CheckCircle,
    Search,
    Eye,
    Edit,
    Trash2,
    Filter,
    Download
} from "lucide-react";

export default function Index({ auth, leads }) {
    const [searchTerm, setSearchTerm] = useState("");

    const updateLeadStatus = (id, status) => {
        router.post(
            route("project-leads.status"),
            {
                id,
                lead_status: status
            },
            { preserveScroll: true }
        );
    };

    // Stats calculations
    const statsData = {
        total: leads?.data?.length || 0,
        new: leads?.data?.filter(l => !l.lead_status || l.lead_status === 'new').length || 0,
        interested: leads?.data?.filter(l => l.lead_status === 'interested' || l.lead_status === 'site_visit').length || 0,
        booked: leads?.data?.filter(l => l.lead_status === 'booked').length || 0
    };

    // Helper to get new gradient pill styles for select dropdown
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects Leads" />
            
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                
                {/* Page Header */}
                <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                                <Target size={20} className="text-white" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                Project Leads
                            </h1>
                        </div>
                        <p className="text-gray-500 ml-12">
                            Manage and track all your incoming property inquiries
                        </p>
                    </div>
                </div>

                {/* Stats Cards (Updated to light theme) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Leads", value: statsData.total, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
                        { title: "New Leads", value: statsData.new, icon: Activity, color: "text-amber-600", bg: "bg-amber-100" },
                        { title: "Interested / Visit", value: statsData.interested, icon: Home, color: "text-purple-600", bg: "bg-purple-100" },
                        { title: "Booked", value: statsData.booked, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon size={24} className={stat.color} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Table Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    
                    {/* Toolbar / Search Area */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:w-auto">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search leads..." 
                                    className="w-full sm:w-72 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                                <button className="p-2.5 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors border border-transparent hover:border-gray-300" title="Filter">
                                    <Filter className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors border border-transparent hover:border-gray-300" title="Export">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                                    <th className="px-6 py-4 text-left"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Lead Info</span></th>
                                    <th className="px-6 py-4 text-left"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</span></th>
                                    <th className="px-6 py-4 text-left"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Requirements</span></th>
                                    <th className="px-6 py-4 text-left"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span></th>
                                    <th className="px-6 py-4 text-left"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Followup</span></th>
                                    <th className="px-6 py-4 text-right"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {leads?.data?.length > 0 ? (
                                    leads.data.map((lead) => (
                                        <tr 
                                            key={lead._id || lead.id} 
                                            className="group hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200"
                                        >
                                            {/* Lead Info: Avatar + Name + Email */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center border-2 border-emerald-200 group-hover:border-emerald-300 transition-colors shadow-sm">
                                                        <span className="text-emerald-600 font-bold text-lg">
                                                            {lead.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{lead.name || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                            <Mail size={12} className="text-gray-400" />
                                                            {lead.email || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact: Phone */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <div className="p-1.5 bg-gray-100 rounded-lg">
                                                        <Phone size={14} className="text-gray-500" />
                                                    </div>
                                                    {lead.country_code} {lead.mobile}
                                                </div>
                                            </td>

                                            {/* Requirements: Looking for + Bedrooms */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="w-fit px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
                                                        {lead.looking_for || 'Uncategorized'}
                                                    </span>
                                                    {Array.isArray(lead.preferred_bedrooms) && lead.preferred_bedrooms.length > 0 && (
                                                        <div className="flex gap-1">
                                                            {lead.preferred_bedrooms.map((bed, idx) => (
                                                                <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
                                                                    {bed}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status Update Dropdown (With Pulse Dot Integration) */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative inline-flex items-center">
                                                    {/* Optional pulse dot if status is active/new */}
                                                    {(!lead.lead_status || lead.lead_status === 'new') && (
                                                        <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse z-10"></div>
                                                    )}
                                                    <select
                                                        value={lead.lead_status || "new"}
                                                        onChange={(e) => updateLeadStatus(lead.id || lead._id, e.target.value)}
                                                        className={`pl-4 pr-8 py-1.5 text-sm font-semibold rounded-full border cursor-pointer appearance-none transition-all outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${getStatusStyle(lead.lead_status || 'new')}`}
                                                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="interested">Interested</option>
                                                        <option value="site_visit">Site Visit</option>
                                                        <option value="booked">Booked</option>
                                                        <option value="lost">Lost</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Followup */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span>No date set</span>
                                                </div>
                                            </td>

                                            {/* Action Buttons (Hover Animations) */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route("project-leads.show", lead.id || lead._id)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-200 hover:scale-110 group/view"
                                                        title="View"
                                                    >
                                                        <Eye className="w-5 h-5 group-hover/view:scale-110 transition-transform" />
                                                    </Link>
                                                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 group/edit" title="Edit">
                                                        <Edit className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 group/delete" title="Delete">
                                                        <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    /* Empty State */
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center bg-gray-50/50">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
                                                    <Search className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">No Leads Found</h3>
                                                <p className="text-gray-500">
                                                    We couldn't find any leads matching your criteria.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination matching HTML */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-bold text-gray-900">{leads?.data?.length || 0}</span> entries
                            </p>
                            <div className="flex items-center space-x-2">
                                <button className="px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    Previous
                                </button>
                                <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-sm transition-colors">
                                    1
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}