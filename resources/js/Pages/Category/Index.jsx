import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import CategoryFormModal from '@/Components/Category/CategoryFormModal';
import { toast } from 'react-hot-toast';
import { 
    Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight,
    Grid, List, RefreshCw, Download, Upload, AlertCircle, Loader2,
    CheckCircle, XCircle, Eye, FolderTree, Package, Calendar,
    TrendingUp, Award, Star, Hash, Globe, Clock, Users
} from 'lucide-react';

export default function Index({ categories, auth, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState("table");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const openCreate = () => {
        setEditData(null);
        setShowModal(true);
    };

    const openEdit = (category) => {
        setEditData(category);
        setShowModal(true);
    };

    const deleteCategory = (id) => {
        if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            setIsLoading(true);
            router.delete(route('categories.destroy', id), {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                    setSelectedCategories([]);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    toast.error('Failed to delete category');
                    console.error(errors);
                    setIsLoading(false);
                }
            });
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (categoryToDelete) {
            setIsLoading(true);
            router.delete(route('categories.destroy', categoryToDelete._id), {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                    setSelectedCategories([]);
                    setShowDeleteConfirm(false);
                    setCategoryToDelete(null);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    toast.error('Failed to delete category');
                    console.error(errors);
                    setIsLoading(false);
                }
            });
        }
    };

    const bulkDelete = () => {
        if (selectedCategories.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedCategories.length} selected categories?`)) {
            setIsLoading(true);
            router.post(route('categories.bulk-delete'), {
                ids: selectedCategories
            }, {
                onSuccess: () => {
                    toast.success(`${selectedCategories.length} categories deleted successfully`);
                    setSelectedCategories([]);
                    setIsLoading(false);
                },
                onError: (errors) => {
                    toast.error('Failed to delete categories');
                    console.error(errors);
                    setIsLoading(false);
                }
            });
        }
    };

    const bulkStatusUpdate = (status) => {
        if (selectedCategories.length === 0) return;
        
        setIsLoading(true);
        router.post(route('categories.bulk-status'), {
            ids: selectedCategories,
            status: status
        }, {
            onSuccess: () => {
                toast.success(`${selectedCategories.length} categories updated successfully`);
                setSelectedCategories([]);
                setIsLoading(false);
            },
            onError: (errors) => {
                toast.error('Failed to update categories');
                console.error(errors);
                setIsLoading(false);
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedCategories.length === filteredCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(filteredCategories.map(c => c._id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setSortField('name');
        setSortDirection('asc');
    };

    const filteredCategories = useMemo(() => {
        let filtered = categories.data || [];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(cat => 
                cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(cat => 
                statusFilter === 'active' ? cat.status : !cat.status
            );
        }

        // Sorting
        filtered = [...filtered].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (sortField === 'name' || sortField === 'slug') {
                aVal = aVal || '';
                bVal = bVal || '';
                return sortDirection === 'asc' 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            
            if (sortField === 'status') {
                aVal = aVal ? 1 : 0;
                bVal = bVal ? 1 : 0;
            }
            
            if (sortField === 'products_count') {
                aVal = aVal || 0;
                bVal = bVal || 0;
            }
            
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return filtered;
    }, [categories.data, searchTerm, statusFilter, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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

    // Stats calculations
    const statsData = {
        total: categories.total || categories.data?.length || 0,
        active: categories.data?.filter(c => c.status).length || 0,
        inactive: categories.data?.filter(c => !c.status).length || 0,
        totalProducts: categories.data?.reduce((sum, c) => sum + (c.products_count || 0), 0) || 0
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
                                    <FolderTree size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Category Management
                                </h1>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 ml-12">
                                Manage your product categories and organize your inventory
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
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Categories</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.total}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <FolderTree size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Categories</p>
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
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Products</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statsData.totalProducts}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Package size={24} className="text-blue-600 dark:text-blue-400" />
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

                {/* Bulk Actions Bar */}
                {selectedCategories.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slideDown">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <CheckCircle size={14} className="text-blue-600" />
                            </div>
                            <span className="text-sm text-blue-700 dark:text-blue-400">
                                <strong>{selectedCategories.length}</strong> categories selected
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => bulkStatusUpdate(true)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                <CheckCircle size={14} />
                                Set Active
                            </button>
                            <button
                                onClick={() => bulkStatusUpdate(false)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                <XCircle size={14} />
                                Set Inactive
                            </button>
                            <button
                                onClick={bulkDelete}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                <Trash2 size={14} />
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setSelectedCategories([])}
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search categories by name, slug, or description..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <XCircle size={16} />
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
                                        Clear Filters
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
                                            <XCircle size={12} />
                                        </button>
                                    </span>
                                )}
                                {statusFilter !== "all" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                                        Status: {statusFilter === "active" ? "Active" : "Inactive"}
                                        <button onClick={() => setStatusFilter("all")} className="hover:text-emerald-900">
                                            <XCircle size={12} />
                                        </button>
                                    </span>
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                    {filteredCategories.length} results found
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{filteredCategories.length > 0 ? indexOfFirstItem + 1 : 0}</span> 
                        {' '}-{' '}
                        <span className="font-semibold">{Math.min(indexOfLastItem, filteredCategories.length)}</span> 
                        {' '}of{' '}
                        <span className="font-semibold">{filteredCategories.length}</span> categories
                    </p>
                </div>

                {/* Table/Grid View */}
                {filteredCategories.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-full mb-4">
                                <FolderTree size={48} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No categories found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria" 
                                    : "Get started by creating your first category"}
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
                                    onClick={openCreate}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Category
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
                                                checked={selectedCategories.length === currentCategories.length && currentCategories.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Category Name
                                                <SortIcon field="name" />
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort('slug')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Slug
                                                <SortIcon field="slug" />
                                            </div>
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
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => handleSort('products_count')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Products
                                                <SortIcon field="products_count" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                    {currentCategories.map((cat) => (
                                        <tr 
                                            key={cat._id} 
                                            className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat._id)}
                                                    onChange={() => toggleSelect(cat._id)}
                                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                        {cat.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{cat.name || 'Unnamed Category'}</div>
                                                        {cat.description && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">
                                                                {cat.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <code className="text-xs bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {cat.slug || 'No slug'}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={cat.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Package size={14} className="text-slate-400" />
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cat.products_count || 0}</span>
                                                    <span className="text-xs text-slate-500">products</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>{cat.updated_at ? new Date(cat.updated_at).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(cat)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(cat)}
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
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCategories.length)} of {filteredCategories.length} results
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
                        {currentCategories.map((cat) => (
                            <div key={cat._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {cat.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                                                <code className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {cat.slug}
                                                </code>
                                            </div>
                                        </div>
                                        <StatusBadge status={cat.status} />
                                    </div>
                                    
                                    {cat.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                            {cat.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} className="text-slate-400" />
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cat.products_count || 0}</span>
                                            <span className="text-xs text-slate-500">products</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(cat)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(cat)}
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
                <CategoryFormModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    editData={editData}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && categoryToDelete && (
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
                                        Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">{categoryToDelete.name}</span>? This action cannot be undone.
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

            {/* Custom Animations */}
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