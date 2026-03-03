import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Shield,
    Key,
    Save,
    XCircle,
    CheckCircle,
    Search,
    Filter,
    Lock,
    Unlock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Info,
    Users,
    Globe,
    Settings,
    Database,
    FileText,
    Image,
    Mail,
    Bell,
    ChevronRight 
} from 'lucide-react';

export default function Create() {
    const { permissionsList, auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectAllHover, setSelectAllHover] = useState(false);

    const { data, setData, post, errors, processing } = useForm({
        name: '',
        description: '',
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

    // Get category icon
    const getCategoryIcon = (category) => {
        const icons = {
            user: Users,
            role: Shield,
            permission: Key,
            setting: Settings,
            content: FileText,
            media: Image,
            email: Mail,
            notification: Bell,
            database: Database,
            general: Globe
        };
        const IconComponent = icons[category] || Settings;
        return <IconComponent className="w-4 h-4" />;
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            user: 'bg-blue-100 text-blue-600',
            role: 'bg-purple-100 text-purple-600',
            permission: 'bg-indigo-100 text-indigo-600',
            setting: 'bg-gray-100 text-gray-600',
            content: 'bg-green-100 text-green-600',
            media: 'bg-pink-100 text-pink-600',
            email: 'bg-yellow-100 text-yellow-600',
            notification: 'bg-orange-100 text-orange-600',
            database: 'bg-red-100 text-red-600',
            general: 'bg-teal-100 text-teal-600'
        };
        return colors[category] || 'bg-gray-100 text-gray-600';
    };

    // Toggle category expansion
    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Toggle permission
    function togglePermission(permission) {
        if (data.permissions.includes(permission)) {
            setData('permissions', data.permissions.filter(p => p !== permission));
        } else {
            setData('permissions', [...data.permissions, permission]);
        }
    }

    // Toggle all permissions in a category
    function toggleCategoryPermissions(category, permissions) {
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

    // Select/deselect all permissions
    function toggleAllPermissions() {
        if (data.permissions.length === permissionsList.length) {
            setData('permissions', []);
        } else {
            setData('permissions', permissionsList);
        }
    }

    // Filter permissions based on search
    const filteredCategories = Object.entries(categorizedPermissions).reduce((acc, [category, perms]) => {
        const filteredPerms = perms.filter(p => 
            p.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredPerms.length > 0) {
            acc[category] = filteredPerms;
        }
        return acc;
    }, {});

    // Calculate stats
    const totalPermissions = permissionsList.length;
    const selectedCount = data.permissions.length;
    const selectedPercentage = Math.round((selectedCount / totalPermissions) * 100) || 0;

    function submit(e) {
        e.preventDefault();
        post('/roles');
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header with breadcrumb */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <a href="/roles" className="hover:text-indigo-600">Roles</a>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-700">Create New Role</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Shield className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Create New Role
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Define a new role and set its permissions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <form onSubmit={submit}>
                            {/* Basic Information Section */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Basic Information
                                </h2>
                                
                                <div className="space-y-4 max-w-2xl">
                                    {/* Role Name */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Role Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="e.g., Admin, Editor, Viewer"
                                                className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                                                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="flex items-center text-sm text-red-600 mt-1">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Brief description of this role's purpose..."
                                            rows={3}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Permissions
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Select the permissions for this role
                                        </p>
                                    </div>
                                    
                                    {/* Search and Stats */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search permissions..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
                                            />
                                        </div>
                                        
                                        <div className="text-sm text-gray-500">
                                            {selectedCount} / {totalPermissions} selected
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-600">Selection Progress</span>
                                        <span className="font-medium text-indigo-600">{selectedPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${selectedPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Bulk Actions */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        type="button"
                                        onClick={toggleAllPermissions}
                                        onMouseEnter={() => setSelectAllHover(true)}
                                        onMouseLeave={() => setSelectAllHover(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        {selectedCount === totalPermissions ? (
                                            <>
                                                <XCircle className="w-4 h-4 text-gray-500" />
                                                Deselect All
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-indigo-600" />
                                                {selectAllHover && selectedCount > 0 ? 'Deselect All' : 'Select All'}
                                            </>
                                        )}
                                    </button>
                                    
                                    {selectedCount > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {selectedCount} permission{selectedCount !== 1 ? 's' : ''} selected
                                        </span>
                                    )}
                                </div>

                                {/* Permissions Grid */}
                                {Object.keys(filteredCategories).length > 0 ? (
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                        {Object.entries(filteredCategories).map(([category, perms]) => {
                                            const isExpanded = expandedCategories[category] !== false;
                                            const categorySelected = perms.every(p => data.permissions.includes(p));
                                            const categoryPartial = perms.some(p => data.permissions.includes(p)) && !categorySelected;
                                            
                                            return (
                                                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                                    {/* Category Header */}
                                                    <div 
                                                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 ${
                                                            categorySelected 
                                                                ? 'bg-indigo-50 hover:bg-indigo-100' 
                                                                : 'bg-gray-50 hover:bg-gray-100'
                                                        }`}
                                                        onClick={() => toggleCategory(category)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                                                                {getCategoryIcon(category)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900">
                                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                                </h3>
                                                                <p className="text-xs text-gray-500">
                                                                    {perms.length} permission{perms.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-3">
                                                            {/* Category Selection Indicator */}
                                                            <div className="flex items-center gap-1">
                                                                {categorySelected ? (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                ) : categoryPartial ? (
                                                                    <div className="relative">
                                                                        <CheckCircle className="w-4 h-4 text-gray-300" />
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <XCircle className="w-4 h-4 text-gray-300" />
                                                                )}
                                                            </div>
                                                            
                                                            {/* Category Actions */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleCategoryPermissions(category, perms);
                                                                }}
                                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1"
                                                            >
                                                                {categorySelected ? 'Deselect' : 'Select All'}
                                                            </button>
                                                            
                                                            {/* Expand/Collapse Icon */}
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Category Permissions */}
                                                    {isExpanded && (
                                                        <div className="p-4 bg-white border-t border-gray-200">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {perms.map(p => {
                                                                    const isSelected = data.permissions.includes(p);
                                                                    const permissionName = p.split('.').slice(1).join('.') || p;
                                                                    
                                                                    return (
                                                                        <label
                                                                            key={p}
                                                                            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                                isSelected
                                                                                    ? 'border-indigo-500 bg-indigo-50'
                                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => togglePermission(p)}
                                                                                className="mt-1 accent-indigo-600"
                                                                            />
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-1 mb-1">
                                                                                    {isSelected ? (
                                                                                        <Lock className="w-3 h-3 text-indigo-600" />
                                                                                    ) : (
                                                                                        <Unlock className="w-3 h-3 text-gray-400" />
                                                                                    )}
                                                                                    <span className={`text-xs font-medium ${
                                                                                        isSelected ? 'text-indigo-600' : 'text-gray-500'
                                                                                    }`}>
                                                                                        {category}
                                                                                    </span>
                                                                                </div>
                                                                                <p className={`text-sm font-medium truncate ${
                                                                                    isSelected ? 'text-indigo-900' : 'text-gray-700'
                                                                                }`}>
                                                                                    {permissionName}
                                                                                </p>
                                                                            </div>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            No permissions found
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Try adjusting your search term
                                        </p>
                                    </div>
                                )}

                            
                            </div>

                            {/* Form Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                                <a
                                    href="/roles"
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Create Role
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}