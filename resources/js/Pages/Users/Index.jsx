import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Users, 
    UserPlus, 
    Shield, 
    Search,
    ChevronDown,
    CheckCircle,
    XCircle,
    Filter,
    RefreshCw,
    User,
    Award,
    Mail,
    Calendar
} from 'lucide-react';

export default function Index() {
    const { users, roles, auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        role: ''
    });

    function submit(e) {
        e.preventDefault();
        post('/users/assign-role', {
            preserveScroll: true,
            onSuccess: () => {
                setData('user_id', '');
                setData('role', '');
            }
        });
    }

    // Filter users based on search and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = 
            roleFilter === 'all' || 
            (roleFilter === 'assigned' && user.role) ||
            (roleFilter === 'unassigned' && !user.role);
        
        return matchesSearch && matchesRole;
    });

    // Statistics
    const totalUsers = users.length;
    const usersWithRoles = users.filter(u => u.role).length;
    const usersWithoutRoles = totalUsers - usersWithRoles;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    User Role Management
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage user roles and permissions across the system
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">With Roles</p>
                                    <p className="text-2xl font-bold text-emerald-600 mt-1">{usersWithRoles}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Without Roles</p>
                                    <p className="text-2xl font-bold text-gray-400 mt-1">{usersWithoutRoles}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <UserPlus className="w-6 h-6 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Form Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-emerald-600" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Assign New Role
                                </h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* User Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Select User <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <select
                                                value={data.user_id}
                                                onChange={e => setData('user_id', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white ${
                                                    errors.user_id ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="">Choose a user...</option>
                                                {users.map(user => (
                                                    <option key={user.id || user._id} value={user.id || user._id}>
                                                        {user.name} {user.role ? `(Current: ${user.role})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                        {errors.user_id && (
                                            <p className="text-sm text-red-600 mt-1">{errors.user_id}</p>
                                        )}
                                    </div>

                                    {/* Role Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Select Role <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <select
                                                value={data.role}
                                                onChange={e => setData('role', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white ${
                                                    errors.role ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="">Choose a role...</option>
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.name}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                        {errors.role && (
                                            <p className="text-sm text-red-600 mt-1">{errors.role}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                        >
                                            {processing ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                    Assigning...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-4 h-4" />
                                                    Assign Role
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Users List Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* List Header with Filters */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Users List
                                    </h2>
                                    <span className="ml-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {filteredUsers.length} users
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        />
                                    </div>

                                    {/* Role Filter */}
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-sm"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="assigned">With Role</option>
                                            <option value="unassigned">Without Role</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                                                <span className="text-emerald-600 font-medium text-sm">
                                                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {(user._id || user.id).slice(-6)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.role ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            {user.role}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            No Role Assigned
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.role ? (
                                                        <span className="inline-flex items-center text-emerald-600">
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            <span className="text-sm">Active</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center text-gray-400">
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            <span className="text-sm">Pending</span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Users className="w-12 h-12 text-gray-300 mb-3" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                        No users found
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {searchTerm || roleFilter !== 'all' 
                                                            ? 'Try adjusting your search or filter criteria'
                                                            : 'No users are available in the system'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer with summary */}
                        {filteredUsers.length > 0 && (
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Showing {filteredUsers.length} of {totalUsers} total users
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}