import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
    Plus,
    Eye,
    Edit,
    UserPlus,
    Users,
    Building2,
    FolderKanban,
    Star,
    Search,
    Filter,
    X,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Download,
    Grid,
    List,
    TrendingUp,
    Award,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    FilterX,
    Home,
    MapPin,
    DollarSign,
    Percent
} from "lucide-react";

export default function Index({ auth, projects, builders }) {

    const [assignModal, setAssignModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedPromoters, setSelectedPromoters] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [viewMode, setViewMode] = useState("table")
    const [isLoading, setIsLoading] = useState(false)

    // Safe access to projects data
    const projectsData = projects?.data || []
    const projectsTotal = projects?.total || projectsData.length
    const projectsFrom = projects?.from || 1
    const projectsTo = projects?.to || projectsData.length
    const projectsLinks = projects?.links || []

    // Filter projects
    const filteredProjects = projectsData.filter(project => {
        const matchesSearch = searchTerm === "" ||
            project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.builder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location?.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && project.status == 1) ||
            (statusFilter === "inactive" && project.status == 0)
        
        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter])

    const togglePromoter = (id) => {
        if (selectedPromoters.includes(id)) {
            setSelectedPromoters(
                selectedPromoters.filter(p => p !== id)
            )
        } else {
            setSelectedPromoters([
                ...selectedPromoters,
                id
            ])
        }
    }

    const handleAssignPromoters = () => {
        if (selectedPromoters.length === 0) {
            alert("Select at least one promoter")
            return
        }

        setIsLoading(true)
        router.post(
            route('projects.assignPromoter', selectedProject._id),
            {
                promoter_ids: selectedPromoters
            },
            {
                onSuccess: () => {
                    setIsLoading(false)
                    setAssignModal(false)
                    setSelectedPromoters([])
                },
                onError: () => {
                    setIsLoading(false)
                }
            }
        )
    }

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
    }

    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pageNumbers.push(i)
                pageNumbers.push('...')
                pageNumbers.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1)
                pageNumbers.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i)
            } else {
                pageNumbers.push(1)
                pageNumbers.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i)
                pageNumbers.push('...')
                pageNumbers.push(totalPages)
            }
        }
        return pageNumbers
    }

    const StatusBadge = ({ status }) => {
        const isActive = status == 1
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}>
                {isActive ? <CheckCircle size={10} className="mr-1" /> : <XCircle size={10} className="mr-1" />}
                {isActive ? "Active" : "Inactive"}
            </span>
        )
    }

    // Stats calculations
    const statsData = {
        total: projectsTotal,
        active: projectsData.filter(p => p.status == 1).length || 0,
        inactive: projectsData.filter(p => p.status == 0).length || 0,
        featured: projectsData.filter(p => p.featured).length || 0
    }

    const buildersData = builders || []

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects" />

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
                                    <FolderKanban size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Projects
                                </h1>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 ml-12">
                                Manage and track all your construction projects
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
                            <Link
                                href={route('projects.create')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus size={18} />
                                Create Project
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Projects</p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">{statsData.total}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <FolderKanban size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span>{statsData.featured} featured projects</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Projects</p>
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
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Builders</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{buildersData.length || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Award size={12} />
                            <span>Associated builders</span>
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
                                        placeholder="Search projects by name, builder, or location..."
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
                            </div>
                        </div>

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
                                    {filteredProjects.length} results found
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-semibold">{filteredProjects.length > 0 ? indexOfFirstItem + 1 : 0}</span>
                        {' '}-{' '}
                        <span className="font-semibold">{Math.min(indexOfLastItem, filteredProjects.length)}</span>
                        {' '}of{' '}
                        <span className="font-semibold">{filteredProjects.length}</span> projects
                    </p>
                </div>

                {/* Table/Grid View */}
                {filteredProjects.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-slate-100 dark:bg-gray-800 rounded-full mb-4">
                                <FolderKanban size={48} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No projects found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Get started by creating your first project"}
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
                                <Link
                                    href={route('projects.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Create Project
                                </Link>
                            )}
                        </div>
                    </div>
                ) : viewMode === "table" ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-800">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Builder</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                    {currentProjects.map((project) => (
                                        <tr key={project._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {project.logo_image ? (
                                                        <img
                                                            src={project.logo_image}
                                                            alt={project.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-gray-700"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                                                            <Building2 size={18} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                                {project.name}
                                                            </div>
                                                            {project.featured && (
                                                                <span className="inline-flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">
                                                                    <Star size={10} />
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                            ID: {project._id?.slice(-6)}
                                                        </div>
                                                        {project.location && (
                                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                                <MapPin size={10} />
                                                                {project.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} className="text-slate-400" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {project.builder || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={project.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProject(project)
                                                            setSelectedPromoters(project.promoter_ids || [])
                                                            setAssignModal(true)
                                                        }}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                        title="Assign Builders"
                                                    >
                                                        <UserPlus size={16} />
                                                    </button>
                                                    <Link
                                                        href={route('projects.view', project._id)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={route('projects.edit', project._id)}
                                                        className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
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
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProjects.length)} of {filteredProjects.length} results
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
                                                className={`px-3 py-1.5 rounded-lg transition-colors min-w-[36px] ${currentPage === page
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
                        {currentProjects.map((project) => (
                            <div key={project._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                <div className="relative">
                                    {project.featured && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <span className="inline-flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                                <Star size={10} />
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                    {project.logo_image ? (
                                        <img
                                            src={project.logo_image}
                                            alt={project.name}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                            <Building2 size={48} className="text-white opacity-50" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{project.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Building2 size={12} className="text-slate-400" />
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{project.builder || 'No builder'}</span>
                                            </div>
                                            {project.location && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <MapPin size={10} className="text-slate-400" />
                                                    <span className="text-xs text-slate-400">{project.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <StatusBadge status={project.status} />
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-800">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar size={12} />
                                            <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(project)
                                                    setSelectedPromoters(project.promoter_ids || [])
                                                    setAssignModal(true)
                                                }}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                                                title="Assign Builders"
                                            >
                                                <UserPlus size={16} />
                                            </button>
                                            <Link
                                                href={route('projects.view', project._id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={route('projects.edit', project._id)}
                                                className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ASSIGN BUILDER MODAL */}
                {assignModal && selectedProject && (
                    <div className="fixed inset-0 overflow-y-auto z-50">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/90 backdrop-blur-sm"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full animate-slideUp">
                                <div className="bg-white dark:bg-gray-900 px-6 pt-6 pb-4">
                                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-800 pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                                                <UserPlus size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Assign Builders
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    to {selectedProject.name}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setAssignModal(false)}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {buildersData.length > 0 ? (
                                            buildersData.map(builder => (
                                                <label
                                                    key={builder._id}
                                                    className="flex items-center gap-3 p-3 border border-slate-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPromoters.includes(builder._id)}
                                                        onChange={() => togglePromoter(builder._id)}
                                                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {builder.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {builder.email}
                                                        </div>
                                                    </div>
                                                    {builder.company_name && (
                                                        <div className="text-xs text-slate-400">
                                                            {builder.company_name}
                                                        </div>
                                                    )}
                                                </label>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-slate-500">No builders available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-gray-800/50 px-6 py-4 flex gap-3 border-t border-slate-200 dark:border-gray-800">
                                    <button
                                        onClick={() => setAssignModal(false)}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignPromoters}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                                        Assign Builders
                                    </button>
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
                
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </AuthenticatedLayout>
    )
}