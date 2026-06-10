import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Shield,
    Key,
    Search,
    CheckCircle,
    XCircle,
    ChevronRight,
    UserPlus,
    Save,
    Filter,
    Lock,
    Unlock,
    CheckSquare,
    Square,
    AlertCircle,
    Settings,
    Users,
    Globe
} from 'lucide-react';

export default function Index() {
    const { roles, permissionsList, auth } = usePage().props;
    const [selectedRole, setSelectedRole] = useState(null);
    const [search, setSearch] = useState('');
    const [selectAllHover, setSelectAllHover] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('all');

    const { data, setData, post, processing } = useForm({
        role: '',
        permissions: []
    });

    // Categorize permissions
    const categorizedPermissions = permissionsList.reduce((acc, permission) => {
        const category = permission.split('.')[0] || 'general';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {});

    // Get unique categories
    const categories = ['all', ...Object.keys(categorizedPermissions).sort()];

    // Filter permissions by search and category
    const filteredPermissions = permissionsList.filter(p => {
        const matchesSearch = p.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.startsWith(categoryFilter);
        return matchesSearch && matchesCategory;
    });

    // Group filtered permissions by category for display
    const groupedFilteredPermissions = filteredPermissions.reduce((acc, permission) => {
        const category = permission.split('.')[0] || 'general';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {});

    // Select role
    function selectRole(role) {
        setSelectedRole(role);
        setData({
            role: role.name,
            permissions: role.permissions || []
        });
        setSearch('');
        setCategoryFilter('all');
    }

    // Toggle permission
    function togglePermission(permission) {
        if (data.permissions.includes(permission)) {
            setData('permissions', data.permissions.filter(p => p !== permission));
        } else {
            setData('permissions', [...data.permissions, permission]);
        }
    }

    // Toggle category permissions
    function toggleCategory(category, permissions) {
        const categoryPerms = permissions.filter(p => p.startsWith(category));
        const allSelected = categoryPerms.every(p => data.permissions.includes(p));
        
        if (allSelected) {
            setData('permissions', data.permissions.filter(p => !p.startsWith(category)));
        } else {
            const newPerms = [...data.permissions];
            categoryPerms.forEach(p => {
                if (!newPerms.includes(p)) {
                    newPerms.push(p);
                }
            });
            setData('permissions', newPerms);
        }
    }

    // Check if all permissions are selected
    const allSelected = data.permissions.length === permissionsList.length;
    const someSelected = data.permissions.length > 0 && !allSelected;

    function submit(e) {
        e.preventDefault();
        post('/roles/update-permissions', {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show success message
            }
        });
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Role Permissions
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage permissions for different roles in your system
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* LEFT - ROLES PANEL */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                                {/* Panel Header */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-emerald-600" />
                                            <h2 className="font-semibold text-gray-900">Roles</h2>
                                        </div>
                                        <Link
                                            href="/roles/create"
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            New Role
                                        </Link>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Select a role to manage its permissions
                                    </p>
                                </div>

                                {/* Roles List */}
                                <div className="p-4 max-h-[600px] overflow-y-auto">
                                    <div className="space-y-2">
                                        {roles.map(role => (
                                            <button
                                                key={role._id}
                                                onClick={() => selectRole(role)}
                                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                                                    selectedRole?._id === role._id
                                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-200'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`p-1.5 rounded-lg ${
                                                            selectedRole?._id === role._id
                                                                ? 'bg-white/20'
                                                                : 'bg-gray-100 group-hover:bg-gray-200'
                                                        }`}>
                                                            <Shield className={`w-4 h-4 ${
                                                                selectedRole?._id === role._id
                                                                    ? 'text-white'
                                                                    : 'text-gray-600'
                                                            }`} />
                                                        </div>
                                                        <span className={`font-medium truncate ${
                                                            selectedRole?._id === role._id
                                                                ? 'text-white'
                                                                : 'text-gray-700'
                                                        }`}>
                                                            {role.name}
                                                        </span>
                                                    </div>
                                                    
                                                    {selectedRole?._id === role._id && (
                                                        <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
                                                    )}
                                                    
                                                    {role.permissions?.length > 0 && selectedRole?._id !== role._id && (
                                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                                            {role.permissions.length}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {role.description && (
                                                    <p className={`text-xs mt-1 truncate ${
                                                        selectedRole?._id === role._id
                                                            ? 'text-emerald-100'
                                                            : 'text-gray-500'
                                                    }`}>
                                                        {role.description}
                                                    </p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Roles Stats */}
                                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Total Roles</span>
                                        <span className="font-semibold text-gray-900">{roles.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT - PERMISSIONS PANEL */}
                        <div className="lg:w-3/4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {selectedRole ? (
                                    <>
                                        {/* Panel Header */}
                                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Key className="w-5 h-5 text-emerald-600" />
                                                        <h2 className="text-lg font-semibold text-gray-900">
                                                            Permissions for {selectedRole.name}
                                                        </h2>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        Configure access rights for this role
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={submit}
                                                    disabled={processing}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Selected Role Info */}
                                        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-sm text-gray-600">Selected Role:</span>
                                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-full">
                                                    {selectedRole.name}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-auto">
                                                    {data.permissions.length} of {permissionsList.length} permissions selected
                                                </span>
                                            </div>
                                        </div>

                                        {/* Search and Filters */}
                                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex-1 relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search permissions..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                
                                                <div className="relative sm:w-48">
                                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                    <select
                                                        value={categoryFilter}
                                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat} value={cat}>
                                                                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Bulk Actions */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <button
                                                    onClick={() => setData('permissions', permissionsList)}
                                                    onMouseEnter={() => setSelectAllHover(true)}
                                                    onMouseLeave={() => setSelectAllHover(false)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    {allSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                                    ) : someSelected ? (
                                                        <div className="relative">
                                                            <Square className="w-4 h-4 text-gray-400" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-emerald-600 rounded-sm"></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Square className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    {selectAllHover && allSelected ? 'Deselect All' : 'Select All'}
                                                </button>
                                                
                                                <button
                                                    onClick={() => setData('permissions', [])}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <XCircle className="w-4 h-4 text-gray-400" />
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>

                                        {/* Permissions Grid */}
                                        <div className="p-6 max-h-[500px] overflow-y-auto">
                                            {Object.entries(groupedFilteredPermissions).length > 0 ? (
                                                <div className="space-y-6">
                                                    {Object.entries(groupedFilteredPermissions).map(([category, perms]) => (
                                                        <div key={category} className="space-y-3">
                                                            {/* Category Header */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                                        {category}
                                                                    </h3>
                                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                                        {perms.length}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => toggleCategory(category, perms)}
                                                                    className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                                                                >
                                                                    {perms.every(p => data.permissions.includes(p)) 
                                                                        ? 'Deselect All' 
                                                                        : 'Select All'}
                                                                </button>
                                                            </div>

                                                            {/* Permissions */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {perms.map(p => {
                                                                    const isSelected = data.permissions.includes(p);
                                                                    return (
                                                                        <label
                                                                            key={p}
                                                                            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                                isSelected
                                                                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => togglePermission(p)}
                                                                                className="mt-0.5 accent-emerald-600"
                                                                            />
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-1 mb-1">
                                                                                    {isSelected ? (
                                                                                        <Lock className="w-3 h-3 text-emerald-600" />
                                                                                    ) : (
                                                                                        <Unlock className="w-3 h-3 text-gray-400" />
                                                                                    )}
                                                                                    <span className={`text-xs font-medium truncate ${
                                                                                        isSelected ? 'text-emerald-700' : 'text-gray-500'
                                                                                    }`}>
                                                                                        {category}
                                                                                    </span>
                                                                                </div>
                                                                                <p className={`text-sm font-medium truncate ${
                                                                                    isSelected ? 'text-emerald-900' : 'text-gray-700'
                                                                                }`}>
                                                                                    {p.split('.').slice(1).join('.') || p}
                                                                                </p>
                                                                            </div>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                        No permissions found
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Try adjusting your search or filter criteria
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer with Summary */}
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {data.permissions.length} permissions selected
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    <span className="text-xs text-gray-500">
                                                        {Math.round((data.permissions.length / permissionsList.length) * 100)}% configured
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Empty State
                                    <div className="text-center py-20 px-6">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-4">
                                            <Shield className="w-10 h-10 text-emerald-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No Role Selected
                                        </h3>
                                        <p className="text-sm text-gray-500 max-sm mx-auto mb-6">
                                            Please select a role from the left panel to view and manage its permissions
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                                            <ChevronRight className="w-4 h-4" />
                                            <span>Select a role to get started</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}