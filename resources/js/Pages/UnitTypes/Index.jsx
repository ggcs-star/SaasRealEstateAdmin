import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UnitTypeForm from "@/Components/UnitTypeForm";

export default function Index({ auth, unitTypes }) {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const openCreate = () => {
        setEditData(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setShowModal(true);
    };

    const deleteItem = (id) => {
        if (confirm("Delete this item?")) {
            router.delete(`/unit-types/${id}`);
        }
    };

    // Calculate stats
    const totalUnits = unitTypes.length;
    const activeUnits = unitTypes.filter(item => item.status).length;
    const totalBHK = unitTypes.reduce((sum, item) => sum + (parseInt(item.bhk) || 0), 0);
    const avgBHK = totalUnits > 0 ? (totalBHK / totalUnits).toFixed(1) : 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
                {/* Header Section with Modern Design */}
                <div className="relative bg-white border-b border-gray-200/80 shadow-lg shadow-gray-100/50">
                    {/* Animated gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Title with Icon and Gradient */}
                            <div className="flex items-center space-x-4">
                                <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-200/50 transform hover:scale-105 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        Unit Types
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                                        Manage your property unit configurations
                                    </p>
                                </div>
                            </div>

                            {/* Add Button with Modern Design */}
                            <button
                                onClick={openCreate}
                                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                                <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Unit Type
                            </button>
                        </div>

                       
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8">
                    {/* Table Card with Modern Design */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden backdrop-blur-sm">
                        {/* Table Header with Search and Filters (Visual only) */}
                        <div className="px-6 py-4 border-b border-gray-200/80 bg-gradient-to-r from-gray-50/80 to-white/50">
                            <div className="flex items-center justify-between">
                                <div className="relative">
                                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <input 
                                        type="text" 
                                        placeholder="Search unit types..." 
                                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64 bg-white/50 backdrop-blur-sm"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" disabled>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                        </svg>
                                    </button>
                                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" disabled>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-100/80 to-gray-50/80 border-b-2 border-gray-200">
                                        <th className="px-6 py-4 text-left">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Name</span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                                </svg>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">BHK</span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80">
                                    {unitTypes.map((item, index) => (
                                        <tr 
                                            key={item._id} 
                                            className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors shadow-sm">
                                                        <span className="text-indigo-600 font-semibold text-lg">
                                                            {item.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-gray-400 flex items-center">
                                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl text-sm font-medium border border-purple-200 shadow-sm">
                                                        <span className="font-bold">{item.bhk}</span> BHK
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="relative">
                                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute"></div>
                                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative"></div>
                                                        </div>
                                                        <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl text-sm font-medium border border-green-200 shadow-sm">
                                                            Active
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                                        <span className="px-3 py-1.5 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-xl text-sm font-medium border border-red-200 shadow-sm">
                                                            Inactive
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all duration-200 hover:scale-110 group/edit relative overflow-hidden"
                                                        title="Edit"
                                                    >
                                                        <div className="absolute inset-0 bg-indigo-100/0 group-hover:bg-indigo-100/50 transition-colors rounded-xl"></div>
                                                        <svg className="w-5 h-5 relative z-10 group-hover/edit:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 group/delete relative overflow-hidden"
                                                        title="Delete"
                                                    >
                                                        <div className="absolute inset-0 bg-red-100/0 group-hover:bg-red-100/50 transition-colors rounded-xl"></div>
                                                        <svg className="w-5 h-5 relative z-10 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 border-t border-gray-200/80 bg-gradient-to-r from-gray-50/80 to-white/50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-indigo-600">{unitTypes.length}</span> entries
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3.5 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm font-medium" disabled>
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-colors text-sm font-medium shadow-md shadow-indigo-200">
                                        1
                                    </button>
                                    <button className="px-3.5 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Empty State (if no data) */}
                    {unitTypes.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300 mt-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Unit Types Found</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first unit type</p>
                            <button
                                onClick={openCreate}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Create Unit Type
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <UnitTypeForm
                    unitType={editData}
                    closeModal={() => setShowModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}