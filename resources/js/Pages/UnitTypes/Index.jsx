import React, { useState, useMemo, useEffect } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UnitTypeForm from "@/Components/UnitTypeForm";
import { 
    Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight,
    Grid, List, RefreshCw, Download, Upload, AlertCircle, Loader2,
    CheckCircle, XCircle, Eye, Home, Layers, BedDouble, Bath,
    TrendingUp, Award, Star, Hash, Calendar, Clock, FilterX, X,
    Building2, Ruler, Square, Maximize
} from 'lucide-react';

export default function Index({ auth, unitTypes }) {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [bhkFilter, setBhkFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState("table");
    const [selectedRows, setSelectedRows] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [isLoading, setIsLoading] = useState(false);

    // Filter and sort unit types
    const filteredItems = useMemo(() => {
        let filtered = unitTypes || [];

        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.bhk?.toString().includes(searchTerm) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(item => 
                statusFilter === "active" ? item.status : !item.status
            );
        }

        if (bhkFilter !== "all") {
            filtered = filtered.filter(item => 
                parseInt(item.bhk) === parseInt(bhkFilter)
            );
        }

        filtered = [...filtered].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (sortField === 'name') {
                aVal = aVal?.toLowerCase() || '';
                bVal = bVal?.toLowerCase() || '';
                return sortDirection === 'asc' 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            
            if (sortField === 'bhk') {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
            }
            
            if (sortField === 'status') {
                aVal = aVal ? 1 : 0;
                bVal = bVal ? 1 : 0;
            }
            
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return filtered;
    }, [unitTypes, searchTerm, statusFilter, bhkFilter, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, bhkFilter, itemsPerPage]);

    const openCreate = () => {
        setEditData(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setShowModal(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            setIsLoading(true);
            router.delete(route('unit-types.destroy', itemToDelete._id), {
                onSuccess: () => {
                    setIsLoading(false);
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                    setSelectedRows(prev => prev.filter(id => id !== itemToDelete._id));
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedRows.length > 0 && confirm(`Delete ${selectedRows.length} selected unit types?`)) {
            setIsLoading(true);
            router.post(route('unit-types.bulk-destroy'), { ids: selectedRows }, {
                onSuccess: () => {
                    setIsLoading(false);
                    setSelectedRows([]);
                },
                onError: () => {
                    setIsLoading(false);
                }
            });
        }
    };

    const handleBulkStatusUpdate = (status) => {
        if (selectedRows.length === 0) return;
        
        setIsLoading(true);
        router.post(route('unit-types.bulk-status'), {
            ids: selectedRows,
            status: status
        }, {
            onSuccess: () => {
                setIsLoading(false);
                setSelectedRows([]);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    const toggleSelectRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === currentItems.length && currentItems.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentItems.map(item => item._id));
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setBhkFilter("all");
        setSortField("name");
        setSortDirection("asc");
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

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <Filter size={12} className="opacity-50" />;
        return sortDirection === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
    };

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

    const getBhkColor = (bhk) => {
        const bhkNum = parseInt(bhk);
        if (bhkNum <= 2) return 'emerald';
        if (bhkNum <= 3) return 'blue';
        if (bhkNum <= 4) return 'purple';
        return 'amber';
    };

    const getBhkIcon = (bhk) => {
        const bhkNum = parseInt(bhk);
        if (bhkNum <= 2) return <BedDouble size={16} />;
        if (bhkNum <= 3) return <Home size={16} />;
        if (bhkNum <= 4) return <Building2 size={16} />;
        return <Layers size={16} />;
    };

    // Stats calculations
    const statsData = {
        total: unitTypes?.length || 0,
        active: unitTypes?.filter(u => u.status).length || 0,
        inactive: unitTypes?.filter(u => !u.status).length || 0,
        totalBHK: unitTypes?.reduce((sum, u) => sum + (parseInt(u.bhk) || 0), 0) || 0,
        avgBHK: unitTypes?.length > 0 ? (unitTypes.reduce((sum, u) => sum + (parseInt(u.bhk) || 0), 0) / unitTypes.length).toFixed(1) : 0,
        uniqueBHK: new Set(unitTypes?.map(u => u.bhk).filter(Boolean)).size || 0
    };

    // Get unique BHK values for filter
    const uniqueBHK = useMemo(() => {
        const bhkValues = new Set();
        unitTypes?.forEach(item => {
            if (item.bhk) {
                bhkValues.add(parseInt(item.bhk));
            }
        });
        return Array.from(bhkValues).sort((a, b) => a - b);
    }, [unitTypes]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-4 md:p-6 lg:p-8">
                {/* Loading Overlay */}
                {isLoading && (
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
                                    <Layers size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Unit Types
                                </h1>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 ml-12">
                                Manage your property unit configurations and BHK types
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
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus size={18} />
                                Add Unit Type
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Unit Types</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.total}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Layers size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span>{statsData.uniqueBHK} different BHK types</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Types</p>
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
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Average BHK</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statsData.avgBHK}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <BedDouble size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Award size={12} />
                            <span>Across all unit types</span>
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

                {/* Bulk Actions Bar */}
                {selectedRows.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slideDown">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <CheckCircle size={14} className="text-emerald-600" />
                            </div>
                            <span className="text-sm text-emerald-700 dark:text-emerald-400">
                                <strong>{selectedRows.length}</strong> unit type{selectedRows.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleBulkStatusUpdate(true)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                <CheckCircle size={14} />
                                Set Active
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate(false)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                <XCircle size={14} />
                                Set Inactive
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                <Trash2 size={14} />
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setSelectedRows([])}
                                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-all duration-200"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 mb-6 overflow-hidden">
                    <div className="p-5">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search unit types by name, BHK, or description..."
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
                            <div className="flex gap-3 flex-wrap">
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
                                    value={bhkFilter}
                                    onChange={(e) => setBhkFilter(e.target.value)}
                                    className="px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-600 dark:text-slate-300 min-w-[120px]"
                                >
                                    <option value="all">All BHK</option>
                                    {uniqueBHK.map(bhk => (
                                        <option key={bhk} value={bhk}>{bhk} BHK</option>
                                    ))}
                                </select>
                                
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-600 dark:text-slate-300"
                                >
                                    <option value={10}>10 / page</option>
                                    <option value={25}>25 / page</option>
                                    <option value={50}>50 / page</option>
                                    <option value={100}>100 / page</option>
                                </select>
                                
                                {(searchTerm || statusFilter !== "all" || bhkFilter !== "all") && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                        <FilterX size={16} />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {(searchTerm || statusFilter !== "all" || bhkFilter !== "all") && (
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
                                {bhkFilter !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                                        BHK: {bhkFilter} BHK
                                        <button onClick={() => setBhkFilter("all")} className="hover:text-emerald-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                    {filteredItems.length} results found
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{filteredItems.length > 0 ? indexOfFirstItem + 1 : 0}</span> 
                        {' '}-{' '}
                        <span className="font-semibold">{Math.min(indexOfLastItem, filteredItems.length)}</span> 
                        {' '}of{' '}
                        <span className="font-semibold">{filteredItems.length}</span> unit types
                    </p>
                </div>

                {/* Table/Grid View */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-full mb-4">
                                <Layers size={48} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No unit types found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {searchTerm || statusFilter !== "all" || bhkFilter !== "all"
                                    ? "Try adjusting your search or filter criteria" 
                                    : "Get started by creating your first unit type"}
                            </p>
                            {(searchTerm || statusFilter !== "all" || bhkFilter !== "all") ? (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    <FilterX size={16} />
                                    Clear Filters
                                </button>
                            ) : (
                                <button
                                    onClick={openCreate}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Unit Type
                                </button>
                            )}
                        </div>
                    </div>
                ) : viewMode === "table" ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-800">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Unit Name
                                                <SortIcon field="name" />
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort('bhk')}
                                        >
                                            <div className="flex items-center gap-1">
                                                BHK
                                                <SortIcon field="bhk" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Status
                                                <SortIcon field="status" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                    {currentItems.map((item) => (
                                        <tr 
                                            key={item._id} 
                                            className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(item._id)}
                                                    onChange={() => toggleSelectRow(item._id)}
                                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                                                        {item.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {item._id?.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold bg-${getBhkColor(item.bhk)}-100 text-${getBhkColor(item.bhk)}-700 dark:bg-${getBhkColor(item.bhk)}-900/30 dark:text-${getBhkColor(item.bhk)}-400`}>
                                                    {getBhkIcon(item.bhk)}
                                                    {item.bhk} BHK
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600 dark:text-slate-400 max-w-md truncate">
                                                    {item.description || 'No description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
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
                        
                        {totalPages > 1 && (
                            <div className="bg-slate-50 dark:bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-gray-800">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} results
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map((item) => (
                            <div key={item._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                                                {item.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-${getBhkColor(item.bhk)}-100 text-${getBhkColor(item.bhk)}-700 dark:bg-${getBhkColor(item.bhk)}-900/30 dark:text-${getBhkColor(item.bhk)}-400 mt-1`}>
                                                    {getBhkIcon(item.bhk)}
                                                    {item.bhk} BHK
                                                </span>
                                            </div>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    
                                    {item.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar size={12} />
                                            <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item)}
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

                {/* Modal */}
                {showModal && (
                    <UnitTypeForm
                        unitType={editData}
                        closeModal={() => setShowModal(false)}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && itemToDelete && (
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
                                        Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">{itemToDelete.name}</span>? This action cannot be undone.
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
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
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
                
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}