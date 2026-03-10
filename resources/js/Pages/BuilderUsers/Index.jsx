import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BuilderUserForm from "./Components/BuilderUserForm";
import { router } from "@inertiajs/react";

export default function Index({ auth, users }) {

    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
        router.delete(route("builder.destroy", id));
    }
};

    return (
    <AuthenticatedLayout user={auth.user}>
        <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Builder Users</h2>
                    <p className="text-gray-600 mt-1">Manage your builder users and their details</p>
                </div>
                
                <button
                    onClick={handleCreate}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New User
                </button>
            </div>

       

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users?.length > 0 ? (
                                users.map((user, index) => (
                                    <tr 
                                        key={user._id} 
                                        className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{user.phone || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{user.company_name || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status == 1 
                                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                                {user.status == 1 ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                                            <p className="mt-1 text-gray-500">Get started by creating a new user.</p>
                                            <button
                                                onClick={handleCreate}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add New User
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {users?.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of <span className="font-medium">{users.length}</span> results
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700">
                                1
                            </button>
                            <button className="px-3 py-1 border rounded-md bg-white text-gray-600 hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {selectedUser ? "Edit Builder User" : "Create New Builder User"}
                                    </h3>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
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
        </div>
    </AuthenticatedLayout>
);
}