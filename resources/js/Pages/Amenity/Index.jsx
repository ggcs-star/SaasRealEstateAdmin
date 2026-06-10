import React, { useState, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Plus, Edit, Trash2, X, CheckCircle, XCircle, Image as ImageIcon,
    Star, Home, Wifi, Dumbbell, Coffee, Car, Trees, Waves,
    Search, Filter, ChevronLeft, ChevronRight, Grid, List,
    RefreshCw, Download, Upload, AlertCircle, Loader2,
    Eye, Settings, Globe, Hash, FileText, Code
} from 'lucide-react';

export default function Index({ auth, amenities }) {
    const { data, setData, post, delete: destroy, reset, errors, processing } = useForm({
        name: '',
        icon_url: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        meta_data: '',
        status: true,
        _id: null
    });

    const [editMode, setEditMode] = useState(false);
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [jsonError, setJsonError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState("table");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showImagePreview, setShowImagePreview] = useState(null);

    // Filter amenities
    const filteredAmenities = amenities?.filter(amenity => {
        const matchesSearch = searchTerm === "" || 
            amenity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            amenity.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" && amenity.status) ||
            (statusFilter === "inactive" && !amenity.status);
        return matchesSearch && matchesStatus;
    }) || [];

    // Pagination
    const totalPages = Math.ceil(filteredAmenities.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAmenities = filteredAmenities.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

    // Close Modal
    const closeModal = () => {
        reset();
        setPreview(null);
        setEditMode(false);
        setShowModal(false);
        setJsonError(null);
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();

        let parsedMetaData = {};

        if (data.meta_data) {
            try {
                parsedMetaData = JSON.parse(data.meta_data);
                setJsonError(null);
            } catch (err) {
                setJsonError("Invalid JSON format");
                return;
            }
        }

        const payload = {
            ...data,
            meta_data: parsedMetaData,
        };

        if (editMode) {
            post(route('amenities.update', data._id), {
                forceFormData: true,
                data: { ...payload, _method: 'PUT' },
                onSuccess: closeModal
            });
        } else {
            post(route('amenities.store'), {
                forceFormData: true,
                data: payload,
                onSuccess: closeModal
            });
        }
    };

    // Edit
    const editAmenity = (amenity) => {
        setData({
            name: amenity.name,
            icon_url: amenity.icon_url || '',
            description: amenity.description || '',
            meta_title: amenity.meta_title || '',
            meta_description: amenity.meta_description || '',
            meta_keywords: amenity.meta_keywords || '',
            meta_data: amenity.meta_data
                ? JSON.stringify(amenity.meta_data, null, 2)
                : '',
            status: amenity.status,
            _id: amenity._id
        });
        setPreview(amenity.icon_url ?? '');
        setEditMode(true);
        setShowModal(true);
    };

    // Delete
    const deleteAmenity = (id) => {
        if (confirm('Delete this amenity?')) {
            destroy(route('amenities.destroy', id));
        }
    };

    const handleDeleteClick = (amenity) => {
        setAmenityToDelete(amenity);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (amenityToDelete) {
            destroy(route('amenities.destroy', amenityToDelete._id), {
                onFinish: () => {
                    setShowDeleteConfirm(false);
                    setAmenityToDelete(null);
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedRows.length > 0 && confirm(`Delete ${selectedRows.length} selected amenities?`)) {
            // Implement bulk delete
            selectedRows.forEach(id => {
                destroy(route('amenities.destroy', id));
            });
            setSelectedRows([]);
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === currentAmenities.length && currentAmenities.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentAmenities.map(amenity => amenity._id));
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pageNumbers.push(i);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                status 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
                {status ? <CheckCircle size={10} className="mr-1" /> : <XCircle size={10} className="mr-1" />}
                {status ? "Active" : "Inactive"}
            </span>
        );
    };

    // Stats cards
    const statsData = {
        total: amenities?.length || 0,
        active: amenities?.filter(a => a.status).length || 0,
        inactive: amenities?.filter(a => !a.status).length || 0,
        withIcon: amenities?.filter(a => a.icon_url).length || 0
    };

    // Icon placeholder based on amenity name
    const getIconComponent = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('wifi')) return <Wifi size={20} />;
        if (lowerName.includes('gym') || lowerName.includes('fitness')) return <Dumbbell size={20} />;
        if (lowerName.includes('pool') || lowerName.includes('swim')) return <Waves size={20} />;
        if (lowerName.includes('park') || lowerName.includes('garden')) return <Trees size={20} />;
        if (lowerName.includes('parking')) return <Car size={20} />;
        if (lowerName.includes('coffee') || lowerName.includes('cafe')) return <Coffee size={20} />;
        return <Star size={20} />;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Amenities" />

            <div className="p-4 md:p-6 lg:p-8">
                {/* Loading Overlay */}
                {processing && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 flex items-center gap-3 shadow-xl">
                            <Loader2 size={24} className="animate-spin text-emerald-600" />
                            <span className="text-slate-700 dark:text-slate-300">Processing...</span>
                        </div>
                    </div>
                )}

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                                    <Star size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Amenities Management
                                </h1>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 ml-12">
                                Manage property amenities and facilities
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title={viewMode === "table" ? "Grid View" : "Table View"}
                            >
                                {viewMode === "table" ? <Grid size={20} /> : <List size={20} />}
                            </button>
                            <button 
                                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Export"
                            >
                                <Download size={20} />
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    closeModal();
                                    setShowModal(true);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus size={18} />
                                Add Amenity
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Amenities</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.total}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Star size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Amenities</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{statsData.active}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${statsData.total > 0 ? (statsData.active / statsData.total) * 100 : 0}%` }} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">With Icons</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statsData.withIcon}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <ImageIcon size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Inactive</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.inactive}</p>
                            </div>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                <XCircle size={24} className="text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 mb-6 overflow-hidden">
                    <div className="p-5">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search amenities by name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-600 dark:text-slate-300"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-600 dark:text-slate-300"
                                >
                                    <option value={10}>10 / page</option>
                                    <option value={25}>25 / page</option>
                                    <option value={50}>50 / page</option>
                                </select>
                                
                                {(searchTerm || statusFilter !== "all") && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                                
                                {selectedRows.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete ({selectedRows.length})
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Active Filters Display */}
                        {(searchTerm || statusFilter !== "all") && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-gray-800">
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                                        Search: {searchTerm}
                                        <button onClick={() => setSearchTerm("")} className="hover:text-emerald-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {statusFilter !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                                        Status: {statusFilter === "active" ? "Active" : "Inactive"}
                                        <button onClick={() => setStatusFilter("all")} className="hover:text-emerald-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                    {filteredAmenities.length} results found
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{filteredAmenities.length > 0 ? indexOfFirstItem + 1 : 0}</span> 
                        {' '}-{' '}
                        <span className="font-semibold">{Math.min(indexOfLastItem, filteredAmenities.length)}</span> 
                        {' '}of{' '}
                        <span className="font-semibold">{filteredAmenities.length}</span> amenities
                    </p>
                </div>

                {/* Table/Grid View */}
                {filteredAmenities.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-full mb-4">
                                <Star size={48} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No amenities found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria" 
                                    : "Get started by adding your first amenity"}
                            </p>
                            {(searchTerm || statusFilter !== "all") ? (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        closeModal();
                                        setShowModal(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Amenity
                                </button>
                            )}
                        </div>
                    </div>
                ) : viewMode === "table" ? (
                    // Table View
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-800">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.length === currentAmenities.length && currentAmenities.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Icon</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                    {currentAmenities.map((amenity) => (
                                        <tr 
                                            key={amenity._id} 
                                            className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(amenity._id)}
                                                    onChange={() => toggleSelectRow(amenity._id)}
                                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {amenity.icon_url ? (
                                                    <img
                                                        src={amenity.icon_url}
                                                        alt={amenity.name}
                                                        className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-gray-700"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                                                        {getIconComponent(amenity.name)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{amenity.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {amenity._id?.slice(-6)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600 dark:text-slate-400 max-w-md truncate">
                                                    {amenity.description || 'No description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={amenity.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setShowImagePreview(amenity.icon_url);
                                                        }}
                                                        className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                        title="View Icon"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => editAmenity(amenity)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(amenity)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-slate-50 dark:bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-gray-800">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAmenities.length)} of {filteredAmenities.length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={index} className="px-2 text-slate-400">...</span>
                                        ) : (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1.5 rounded-lg transition-colors min-w-[36px] ${
                                                    currentPage === page
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentAmenities.map((amenity) => (
                            <div key={amenity._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {amenity.icon_url ? (
                                                <img
                                                    src={amenity.icon_url}
                                                    alt={amenity.name}
                                                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-gray-700"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                                                    {getIconComponent(amenity.name)}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{amenity.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {amenity._id?.slice(-6)}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={amenity.status} />
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                        {amenity.description || 'No description available'}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => editAmenity(amenity)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(amenity)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Amenity Form Modal */}
                {showModal && (
                    <div className="fixed inset-0 overflow-y-auto z-50">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/90 backdrop-blur-sm"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-slideUp">
                                <div className="bg-white dark:bg-gray-900 px-6 pt-6 pb-4">
                                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-800 pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                                                {editMode ? <Edit size={20} className="text-white" /> : <Star size={20} className="text-white" />}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {editMode ? "Edit Amenity" : "Create New Amenity"}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={submit} className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Swimming Pool, Gym, Club House"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>

                                        {/* Icon URL */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Icon URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="https://example.com/icon.png"
                                                value={data.icon_url}
                                                onChange={(e) => {
                                                    setData('icon_url', e.target.value);
                                                    setPreview(e.target.value);
                                                }}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all"
                                            />
                                            {errors.icon_url && <p className="text-red-500 text-sm mt-1">{errors.icon_url}</p>}
                                        </div>

                                        {/* Icon Preview */}
                                        {preview && (
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preview</label>
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    onError={() => setPreview(null)}
                                                    className="h-16 w-16 object-cover rounded-xl border border-slate-200 dark:border-gray-700"
                                                />
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                placeholder="Describe this amenity..."
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                rows="3"
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 transition-all resize-none"
                                            />
                                        </div>

                                        {/* SEO Section */}
                                        <div className="border-t border-slate-200 dark:border-gray-800 pt-4 mt-2">
                                            <h4 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                                <Globe size={16} />
                                                SEO Settings
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Meta Title"
                                                    value={data.meta_title}
                                                    onChange={e => setData('meta_title', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                                />

                                                <textarea
                                                    placeholder="Meta Description"
                                                    value={data.meta_description}
                                                    onChange={e => setData('meta_description', e.target.value)}
                                                    rows="2"
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Meta Keywords (comma separated)"
                                                    value={data.meta_keywords}
                                                    onChange={e => setData('meta_keywords', e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                                />

                                                <div>
                                                    <textarea
                                                        placeholder="Meta Data (JSON format)"
                                                        value={data.meta_data}
                                                        onChange={e => setData('meta_data', e.target.value)}
                                                        rows="4"
                                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                                                    />
                                                    {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
                                                    <p className="text-xs text-slate-400 mt-1">Enter valid JSON for additional meta data</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Status
                                            </label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        checked={data.status === true}
                                                        onChange={() => setData('status', true)}
                                                        className="text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Active</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        checked={data.status === false}
                                                        onChange={() => setData('status', false)}
                                                        className="text-red-600 focus:ring-red-500"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Inactive</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-800">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-5 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {processing && <Loader2 size={18} className="animate-spin" />}
                                                {editMode ? 'Update Amenity' : 'Create Amenity'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && amenityToDelete && (
                    <div className="fixed inset-0 overflow-y-auto z-50">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/90 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}></div>
                            
                            <div className="relative bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-xl animate-scaleIn">
                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                                        <AlertCircle size={24} className="text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Confirm Delete</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                        Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">{amenityToDelete.name}</span>? This action cannot be undone.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteConfirm}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Preview Modal */}
                {showImagePreview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowImagePreview(null)}>
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 max-w-md mx-auto">
                            <img src={showImagePreview} alt="Icon Preview" className="w-full h-auto rounded-xl" />
                            <button
                                onClick={() => setShowImagePreview(null)}
                                className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}