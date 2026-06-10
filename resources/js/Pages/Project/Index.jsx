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
    X
} from "lucide-react";

export default function Index({ auth, projects, builders }) {

    const [assignModal, setAssignModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedPromoters, setSelectedPromoters] = useState([])
    const [openDropdown, setOpenDropdown] = useState(null)
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
   

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 -m-6 p-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FolderKanban className="w-6 h-6" />
                            Projects
                        </h1>
                        <p className="text-indigo-100 text-sm">
                            Manage and track all your construction projects
                        </p>
                    </div>

                    <Link
                        href={route('projects.create')}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30"
                    >
                        <Plus size={16} /> Create Project
                    </Link>
                </div>


                {/* SEARCH */}
                <div className="flex gap-3 items-center bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full pl-9 pr-4 py-2 border rounded-lg"
                        />
                    </div>

                    <select className="px-3 py-2 border rounded-lg">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>

                    <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>


                {/* TABLE */}
                <div className="bg-white rounded-xl shadow border overflow-hidden">

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">

                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="p-4 text-left">Project</th>
                                    <th className="p-4 text-left">Builder</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Created</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {projects.data.map(project => (

                                    <tr key={project._id} className="hover:bg-slate-50">

                                        {/* PROJECT */}
                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                {project.logo_image ? (
                                                    <img
                                                        src={project.logo_image}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                        <Building2 size={18} />
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="font-semibold flex gap-2 items-center">
                                                        {project.name}

                                                        {project.featured && (
                                                            <span className="text-xs bg-yellow-100 px-2 rounded">
                                                                <Star size={12} /> Featured
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-slate-400">
                                                        ID #{project._id.slice(-6)}
                                                    </div>
                                                </div>

                                            </div>

                                        </td>


                                        {/* BUILDER */}
                                        <td className="p-4">
                                            {project.builder || "-"}
                                        </td>


                                        {/* STATUS */}
                                        <td className="p-4">

                                            {project.status == 1 ? (
                                                <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded">
                                                    Inactive
                                                </span>
                                            )}

                                        </td>


                                        {/* DATE */}
                                        <td className="p-4 text-slate-600">
                                            {project.created_at}
                                        </td>


                                        {/* ACTIONS */}
                                        <td className="p-4 text-right">

                                            <div className="flex justify-end gap-2">

                                                {/* Assign Builder */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(project)
                                                        setSelectedPromoters(project.promoter_ids || [])
                                                        setAssignModal(true)
                                                    }}
                                                >
                                                    <UserPlus size={18} />
                                                </button>


                                                {/* View */}
                                                <Link
                                                    href={route('projects.view', project._id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Eye size={18} />
                                                </Link>


                                                {/* Edit */}
                                                <Link
                                                    href={route('projects.edit', project._id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit size={18} />
                                                </Link>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>


                    {/* PAGINATION */}
                    <div className="p-4 border-t flex justify-between">

                        <div className="text-sm text-gray-600">
                            Showing {projects.from} to {projects.to} of {projects.total}
                        </div>

                        <div className="flex gap-1">
                            {projects.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 border rounded
                                    ${link.active ? 'bg-indigo-600 text-white' : ''}`}
                                />
                            ))}
                        </div>

                    </div>

                </div>


                {/* ASSIGN BUILDER MODAL */}
                {assignModal && (

                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                        <div className="bg-white rounded-xl w-full max-w-md">

                            <div className="flex justify-between items-center p-4 border-b">

                                <h2 className="font-semibold">
                                    Assign Promoters 
                                </h2>

                                <button onClick={() => setAssignModal(false)}>
                                    <X size={18} />
                                </button>

                            </div>


                            <div className="p-4 space-y-2">

                                <div className="p-4 space-y-2">

                                    {builders.map(builder => (

                                        <label
                                            key={builder._id}
                                            className="flex items-center gap-3 p-2 border rounded cursor-pointer"
                                        >

                                            <input
                                                type="checkbox"
                                                checked={selectedPromoters.includes(builder._id)}
                                                onChange={() => togglePromoter(builder._id)}
                                            />

                                            <div>
                                                <div className="font-medium">
                                                    {builder.name}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {builder.email}
                                                </div>
                                            </div>

                                        </label>

                                    ))}

                                </div>

                            </div>


                            <div className="p-4 border-t flex gap-2">

                                <button
                                    onClick={() => setAssignModal(false)}
                                    className="flex-1 border rounded py-2"
                                >
                                    Cancel
                                </button>

                                <button
    onClick={() => {

        if (selectedPromoters.length === 0) {
            alert("Select at least one promoter")
            return
        }

        router.post(
            route('projects.assignPromoter', selectedProject._id),
            {
                promoter_ids: selectedPromoters
            },
            {
                onSuccess: () => {
                    setAssignModal(false)
                }
            }
        )

    }}
    className="flex-1 bg-indigo-600 text-white rounded py-2"
>
Assign Promoters
</button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </AuthenticatedLayout>
    )
}