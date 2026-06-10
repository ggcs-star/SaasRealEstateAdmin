import { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BuilderUserForm from "./Components/BuilderUserForm";
import { router } from "@inertiajs/react";
import { 
    Plus, Search, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
    Users, Building, Phone, Mail, MapPin, Star, TrendingUp, Award,
    CheckCircle, XCircle, MoreVertical, Download, Upload, RefreshCw,
    Grid, List, AlertCircle, UserPlus, Briefcase, Calendar, Clock,
    X, Loader2, FilterX, SortAsc, SortDesc, ExternalLink
} from 'lucide-react';

export default function Index({ auth, users, stats: initialStats }) {
    // State Management
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState("table");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [isLoading, setIsLoading] = useState(false);

    // Calculate stats from actual data
    const statsData = useMemo(() => {
        const total = users?.length || 0;
        const active = users?.filter(u => u.status === 1 || u.status === "1" || u.status === true).length || 0;
        const inactive = users?.filter(u => u.status === 0 || u.status === "0" || u.status === false).length || 0;
        const companies = [...new Set(users?.map(u => u.company_name).filter(Boolean))].length || 0;
        const totalProjects = users?.reduce((sum, u) => sum + (parseInt(u.projects_count) || 0), 0) || 0;
        const avgProjects = total > 0 ? (totalProjects / total).toFixed(1) : 0;
        
        return { total, active, inactive, companies, avgProjects, totalProjects };
    }, [users]);

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users?.filter(user => {
            const matchesSearch = searchTerm === "" || 
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === "all" || 
                (statusFilter === "active" && (user.status === 1 || user.status === "1" || user.status === true)) ||
                (statusFilter === "inactive" && (user.status === 0 || user.status === "0" || user.status === false));
            
            return matchesSearch && matchesStatus;
        }) || [];

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (sortField === "created_at") {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            } else if (typeof aVal === "string") {
                aVal = aVal?.toLowerCase() || "";
                bVal = bVal?.toLowerCase() || "";
            } else if (sortField === "projects_count") {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
            }
            
            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [users, searchTerm, statusFilter, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredAndSortedUsers.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

    // Handlers
    const handleCreate = () => {
        setSelectedUser(null);
        setShowForm(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setSelectedUser(null);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            setIsLoading(true);
            router.delete(route("builder.destroy", userToDelete._id), {
                onFinish: () => {
                    setIsLoading(false);
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                    setSelectedRows(prev => prev.filter(id => id !== userToDelete._id));
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedRows.length > 0 && confirm(`Delete ${selectedRows.length} selected builders?`)) {
            setIsLoading(true);
            // Implement bulk delete endpoint
            router.post(route("builder.bulk-destroy"), { ids: selectedRows }, {
                onFinish: () => {
                    setIsLoading(false);
                    setSelectedRows([]);
                }
            });
        }
    };

    const handleExport = () => {
        // Implement export functionality
        const exportData = filteredAndSortedUsers.map(user => ({
            Name: user.name,
            Email: user.email,
            Phone: user.phone,
            Company: user.company_name,
            Status: user.status === 1 ? "Active" : "Inactive",
            Projects: user.projects_count || 0,
            Joined: new Date(user.created_at).toLocaleDateString()
        }));
        
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `builders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const convertToCSV = (data) => {
        const headers = Object.keys(data[0] || {});
        const csvRows = [headers.join(',')];
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header]?.toString() || '';
                return `"${val.replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    const toggleSelectRow = (id) => {
        setSelectedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === currentUsers.length && currentUsers.length > 0) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentUsers.map(user => user._id));
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

    // Status badge component
    const StatusBadge = ({ status }) => {
        const isActive = status === 1 || status === "1" || status === true;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                isActive 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
                {isActive ? <CheckCircle size={10} className="mr-1" /> : <XCircle size={10} className="mr-1" />}
                {isActive ? "Active" : "Inactive"}
            </span>
        );
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <Filter size={12} className="opacity-50" />;
        return sortDirection === "asc" ? <SortAsc size={12} /> : <SortDesc size={12} />;
    };

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
                                    <Building size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Builder Management
                                </h1>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 ml-12">
                                Manage your builder partners and their company details
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
                                onClick={handleExport}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Export to CSV"
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
                                onClick={handleCreate}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus size={18} />
                                Add New Builder
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Builders</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.total}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <Users size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span>{statsData.totalProjects} total projects</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Builders</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{statsData.active}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                <div 
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${statsData.total > 0 ? (statsData.active / statsData.total) * 100 : 0}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{statsData.inactive} inactive</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Companies</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.companies}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Building size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Briefcase size={12} />
                            <span>Unique companies</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Avg. Projects</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.avgProjects}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Star size={24} className="text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Award size={12} />
                            <span>Per builder average</span>
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
                                        placeholder="Search builders by name, email, company, or phone..."
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
                                    <option value={100}>100 / page</option>
                                </select>
                                
                                {(searchTerm || statusFilter !== "all") && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                        <FilterX size={16} />
                                        Clear
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
                                    {filteredAndSortedUsers.length} results found
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold text-slate-800 dark:text-white">{filteredAndSortedUsers.length > 0 ? indexOfFirstItem + 1 : 0}</span> 
                        {' '}-{' '}
                        <span className="font-semibold text-slate-800 dark:text-white">{Math.min(indexOfLastItem, filteredAndSortedUsers.length)}</span> 
                        {' '}of{' '}
                        <span className="font-semibold text-slate-800 dark:text-white">{filteredAndSortedUsers.length}</span> builders
                    </p>
                </div>

                {/* Table/Grid View */}
                {filteredAndSortedUsers.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-full mb-4">
                                <Building size={48} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No builders found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria" 
                                    : "Get started by adding your first builder"}
                            </p>
                            {(searchTerm || statusFilter !== "all") ? (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    <FilterX size={16} />
                                    Clear Filters
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreate}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add New Builder
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
                                                checked={selectedRows.length === currentUsers.length && currentUsers.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Builder
                                                <SortIcon field="name" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact Info</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company</th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort("projects_count")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Projects
                                                <SortIcon field="projects_count" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort("created_at")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Joined
                                                <SortIcon field="created_at" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                    {currentUsers.map((user) => (
                                        <tr 
                                            key={user._id} 
                                            className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(user._id)}
                                                    onChange={() => toggleSelectRow(user._id)}
                                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {user._id?.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                        <Mail size={14} className="text-slate-400 flex-shrink-0" />
                                                        <span className="truncate max-w-[200px]">{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                        <Phone size={14} className="text-slate-400 flex-shrink-0" />
                                                        <span>{user.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} className="text-slate-400 flex-shrink-0" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{user.company_name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.projects_count || 0}</span>
                                                    <span className="text-xs text-slate-500">projects</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={user.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button 
                                                        className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        title="More"
                                                    >
                                                        <MoreVertical size={16} />
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
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} results
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
                        {currentUsers.map((user) => (
                            <div key={user._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{user.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {user._id?.slice(-6)}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={user.status} />
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Mail size={14} className="text-slate-400 flex-shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Phone size={14} className="text-slate-400 flex-shrink-0" />
                                            <span>{user.phone || 'N/A'}</span>
                                        </div>
                                        {user.company_name && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Building size={14} className="text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{user.company_name}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{user.projects_count || 0}</span>
                                            <span className="text-slate-500">Projects</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
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

                {/* Modal Form */}
                {showForm && (
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
                                                {selectedUser ? <Edit size={20} className="text-white" /> : <UserPlus size={20} className="text-white" />}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {selectedUser ? "Edit Builder" : "Create New Builder"}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <BuilderUserForm
                                        selectedUser={selectedUser}
                                        onSuccess={handleClose}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && userToDelete && (
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
                                        Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">{userToDelete.name}</span>? This action cannot be undone.
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
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
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