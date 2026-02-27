import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Edit, Plus, Eye, UserPlus, X } from 'lucide-react'

export default function Index({ auth, projects, promoters }) {
    const [assignModal, setAssignModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedPromoters, setSelectedPromoters] = useState([])
    const togglePromoter = (id) => {
        if (selectedPromoters.includes(id)) {
            setSelectedPromoters(selectedPromoters.filter(p => p !== id))
        } else {
            setSelectedPromoters([...selectedPromoters, id])
        }
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Projects
                    </h1>

                    <Link
                        href={route('projects.create')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                        <Plus size={16} /> Create Project
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-left">
                                <th className="p-4">Logo</th>
                                <th className="p-4">Project Name</th>
                                <th className="p-4">Builder</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {projects.data.length > 0 ? (
                                projects.data.map(project => (
                                    <tr key={project._id} className="border-b hover:bg-slate-50">

                                        {/* Logo */}
                                        <td className="p-4">
                                            {project.logo_image ? (
                                                <img
                                                    src={project.logo_image}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                                            )}
                                        </td>

                                        {/* Name */}
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">
                                                {project.name}
                                            </div>

                                            {project.featured && (
                                                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </td>

                                        {/* Builder */}
                                        <td className="p-4 text-slate-600">
                                            {project.builder || '-'}
                                        </td>

                                        {/* Status */}
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs rounded-full ${project.status === 'active'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>

                                        {/* Created */}
                                        <td className="p-4 text-slate-500">
                                            {project.created_at}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(project)
                                                    setSelectedPromoters(project.promoter_ids || []) // ✅ preload
                                                    setAssignModal(true)
                                                }}
                                                className="inline-flex items-center text-purple-600 hover:text-purple-800"
                                            >
                                                <UserPlus size={16} />
                                            </button>
                                            <Link
                                                href={route('projects.view', project._id)}
                                                className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={route('projects.edit', project._id)}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            {/* 
                                            <Link
                                                as="button"
                                                method="delete"
                                                href={route('projects.destroy', project._id)}
                                                className="inline-flex items-center text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </Link> */}

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        No projects found
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>

                </div>

                {/* Pagination */}
                {projects.links && (
                    <div className="flex gap-2">
                        {projects.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded ${link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                )}

            </div>
            {assignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 max-h-[80vh] overflow-y-auto">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Assign Promoters
                            </h2>
                            <button onClick={() => setAssignModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-500">
                            Project: {selectedProject?.name}
                        </p>

                        {/* ✅ Selected Promoters */}
                        {selectedPromoters.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedPromoters.map(id => {
                                    const promoter = promoters.find(p => p._id === id)
                                    return (
                                        <div
                                            key={id}
                                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2 text-xs"
                                        >
                                            {promoter?.name}
                                            <button
                                                onClick={() => togglePromoter(id)}
                                                className="text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* ✅ Checkbox List */}
                        <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                            {promoters?.map(p => (
                                <label
                                    key={p._id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedPromoters.includes(p._id)}
                                        onChange={() => togglePromoter(p._id)}
                                    />
                                    <span>{p.name}</span>
                                </label>
                            ))}
                        </div>

                        {/* ✅ Assign Button */}
                        <button
                            onClick={() => {
                                if (selectedPromoters.length === 0) {
                                    alert('Select at least one promoter')
                                    return
                                }

                                router.post(route('projects.assignPromoter', selectedProject._id), {
                                    promoter_ids: selectedPromoters
                                })

                                setAssignModal(false)
                                setSelectedPromoters([])
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                        >
                            Assign Promoters
                        </button>

                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    )
}