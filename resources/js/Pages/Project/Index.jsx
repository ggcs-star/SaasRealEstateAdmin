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
    CheckCircle,
    Star,
    Search,
    Filter,
    X
} from "lucide-react";

export default function Index({ auth, projects, promoters }) {
    const [assignModal, setAssignModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedPromoters, setSelectedPromoters] = useState([])
    const [openDropdown, setOpenDropdown] = useState(null);
    const togglePromoter = (id) => {
        if (selectedPromoters.includes(id)) {
            setSelectedPromoters(selectedPromoters.filter(p => p !== id))
        } else {
            setSelectedPromoters([...selectedPromoters, id])
        }
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-wrapper")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header with Gradient */}
                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 -m-6 p-6 mb-0">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FolderKanban className="w-6 h-6" />
                            Projects
                        </h1>
                        <p className="text-indigo-100 text-sm mt-1">
                            Manage and track all your construction projects
                        </p>
                    </div>

                    <Link
                        href={route('projects.create')}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all border border-white/30 shadow-lg"
                    >
                        <Plus size={16} /> Create Project
                    </Link>
                </div>




                {/* Search & Filter Bar */}
                <div className="flex gap-3 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <select className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                    <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</th>
                                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Builder</th>
                                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                                    <th className="p-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {projects.data.length > 0 ? (
                                    projects.data.map(project => (
                                        <tr key={project._id} className="hover:bg-slate-50 transition-colors group">
                                            {/* Project Info with Logo */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {project.logo_image ? (
                                                            <img
                                                                src={project.logo_image}
                                                                className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-100"
                                                                alt={project.name}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ring-2 ring-slate-100">
                                                                <Building2 className="w-5 h-5 text-indigo-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                                                            {project.name}
                                                            {project.featured && (
                                                                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                                    <Star className="w-3 h-3" /> Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5">
                                                            ID: #{project._id.slice(-6)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Builder */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-slate-600">
                                                            {project.builder?.charAt(0) || 'B'}
                                                        </span>
                                                    </div>
                                                    <span className="text-slate-600">
                                                        {project.builder || '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="p-4">
                                                <span className={`
                                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                                ${project.status == '1'
                                                        ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                                                        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                                                    }
                                            `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${project.status == '1' ? 'bg-green-600' : 'bg-red-600'}`} />
                                                    {project.status == 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Created */}
                                            <td className="p-4">
                                                <div className="text-slate-600">
                                                    {new Date(project.created_at).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {new Date(project.created_at).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Promoter Count Badge */}
                                                    {project.promoter_ids?.length > 0 && (
                                                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full flex items-center gap-1 mr-2">
                                                            <Users className="w-3 h-3" />
                                                            {project.promoter_ids.length}
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            setSelectedProject(project)
                                                            setSelectedPromoters(project.promoter_ids || [])
                                                            setAssignModal(true)
                                                        }}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        title="Assign Promoters"
                                                    >
                                                        <UserPlus size={18} />
                                                    </button>

                                                    <Link
                                                        href={route('projects.view', project._id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>

                                                    <div className="relative inline-block dropdown-wrapper">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdown(openDropdown === project._id ? null : project._id);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>

                                                        {openDropdown === project._id && (
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                                                            >
                                                                {/* Full Edit */}
                                                                <Link
                                                                    href={route('projects.edit', project._id)}
                                                                    className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                                                                >
                                                                    Edit  Project
                                                                </Link>

                                                                {/* <Link
                                                                    href={route('projects.edit.basic', project._id)}
                                                                    className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                                                                >
                                                                    Edit Project Basic Details
                                                                </Link> */}

                                                                {/* Configurations Only */}
                                                                {/* <Link
                                                                    href={route('projects.edit.configurations', project._id)}
                                                                    className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                                                                >
                                                                    Edit Configurations
                                                                </Link> */}

                                                                {/* Towers Only */}
                                                                {/* <Link
                                                                    href={route('projects.edit.towers', project._id)}
                                                                    className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                                                                >
                                                                    Edit Towers
                                                                </Link> */}
{/*                                                                 
                                                                <Link
                                                                    href={route('projects.edit.amenities', project._id)}
                                                                    className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                                                                >
                                                                    Edit Amenities
                                                                </Link> */}
                                                                {/* Gallery Only */}
                                                                {/* <Link
                                                                    href={route('projects.edit.gallery', project._id)}
                                                                    className="block px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
                                                                >
                                                                    Edit Gallery Images
                                                                </Link> */}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Delete commented out as per original */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <Building2 className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No projects found</p>
                                                <Link
                                                    href={route('projects.create')}
                                                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                                                >
                                                    <Plus size={16} /> Create your first project
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer with Pagination */}
                    {projects.data.length > 0 && (
                        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Showing <span className="font-medium">{projects.from || 0}</span> to{' '}
                                <span className="font-medium">{projects.to || 0}</span> of{' '}
                                <span className="font-medium">{projects.total || 0}</span> results
                            </div>

                            {projects.links && (
                                <div className="flex gap-1">
                                    {projects.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`
                                            px-3 py-1.5 text-sm rounded-lg transition-colors
                                            ${link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                        ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                }
                                        `}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Assign Modal - Improved Design */}
                {assignModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Assign Promoters
                                    </h2>
                                    <button
                                        onClick={() => setAssignModal(false)}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-indigo-100 text-sm mt-1">
                                    {selectedProject?.name}
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Selected Promoters */}
                                {selectedPromoters.length > 0 && (
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                                            Selected Promoters ({selectedPromoters.length})
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPromoters.map(id => {
                                                const promoter = promoters.find(p => p._id === id)
                                                return (
                                                    <div
                                                        key={id}
                                                        className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm border border-indigo-200"
                                                    >
                                                        <span className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-medium">
                                                            {promoter?.name?.charAt(0)}
                                                        </span>
                                                        {promoter?.name}
                                                        <button
                                                            onClick={() => togglePromoter(id)}
                                                            className="ml-1 text-indigo-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Promoters List */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                                        Available Promoters
                                    </label>
                                    <div className="border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
                                        {promoters?.length > 0 ? (
                                            promoters.map(p => (
                                                <label
                                                    key={p._id}
                                                    className={`
                                                    flex items-center gap-3 p-3 cursor-pointer border-b last:border-0
                                                    hover:bg-slate-50 transition-colors
                                                    ${selectedPromoters.includes(p._id) ? 'bg-indigo-50/50' : ''}
                                                `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPromoters.includes(p._id)}
                                                        onChange={() => togglePromoter(p._id)}
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-indigo-600">
                                                                {p.name?.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800">{p.name}</p>
                                                            <p className="text-xs text-slate-500">{p.email || 'No email'}</p>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-slate-500">
                                                <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                                <p>No promoters available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setAssignModal(false)}
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedPromoters.length === 0) {
                                                alert('Please select at least one promoter')
                                                return
                                            }

                                            router.post(route('projects.assignPromoter', selectedProject._id), {
                                                promoter_ids: selectedPromoters
                                            }, {
                                                onSuccess: () => {
                                                    setAssignModal(false)
                                                    setSelectedPromoters([])
                                                }
                                            })
                                        }}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg shadow-lg shadow-indigo-200 transition-all"
                                    >
                                        Assign Promoters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}