import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PropertyTypeForm from "@/Components/PropertyTypeForm";

export default function Index({ auth, propertyTypes, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
console.log(categories);
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
            router.delete(`/property-types/${id}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header Section with Decorative Elements */}
                <div className="relative bg-white border-b border-gray-200 shadow-sm">
                    {/* Decorative gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Title with Icon */}
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Property Types</h1>
                                    <p className="text-sm text-gray-500 mt-1">Manage and organize your property categories</p>
                                </div>
                            </div>

                            {/* Stats Badge */}
                            <div className="flex items-center space-x-3">
                                <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                    <span className="text-sm font-medium text-blue-600">
                                        Total: {propertyTypes.length} types
                                    </span>
                                </div>
                                
                                {/* Add Button with Enhanced Design */}
                                <button
                                    onClick={openCreate}
                                    className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Add Property Type
                                </button>
                            </div>
                        </div>

                      
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8">
                    {/* Table Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Table Header with Search (Visual only) */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <div className="relative">
                                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <input 
                                        type="text" 
                                        placeholder="Search property types..." 
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                        </svg>
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled>
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
                                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                                        <th className="px-6 py-4 text-left">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                                </svg>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {propertyTypes.map((item, index) => (
                                        <tr 
                                            key={item._id} 
                                            className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-200 group-hover:border-blue-300 transition-colors">
                                                        <span className="text-blue-600 font-semibold text-lg">
                                                            {item.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {/* ID: {item._id.slice(-6)} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                                                        {item.category?.name || 'Uncategorized'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                                            Active
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                        <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-sm font-medium border border-red-200">
                                                            Inactive
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 group/edit"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 group/delete"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold">{propertyTypes.length}</span> entries
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        1
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <PropertyTypeForm
                    propertyType={editData}
                    categories={categories}
                    closeModal={() => setShowModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}