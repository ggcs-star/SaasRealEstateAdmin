import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import CategoryFormModal from '@/Components/Category/CategoryFormModal';
import { toast } from 'react-hot-toast'; // Install: npm install react-hot-toast

export default function Index({ categories, auth, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

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
            router.delete(route('categories.destroy', id), {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                    setSelectedCategories([]);
                },
                onError: (errors) => {
                    toast.error('Failed to delete category');
                    console.error(errors);
                }
            });
        }
    };

    const bulkDelete = () => {
        if (selectedCategories.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedCategories.length} selected categories?`)) {
            router.post(route('categories.bulk-delete'), {
                ids: selectedCategories
            }, {
                onSuccess: () => {
                    toast.success(`${selectedCategories.length} categories deleted successfully`);
                    setSelectedCategories([]);
                },
                onError: (errors) => {
                    toast.error('Failed to delete categories');
                    console.error(errors);
                }
            });
        }
    };

    const bulkStatusUpdate = (status) => {
        if (selectedCategories.length === 0) return;
        
        router.post(route('categories.bulk-status'), {
            ids: selectedCategories,
            status: status
        }, {
            onSuccess: () => {
                toast.success(`${selectedCategories.length} categories updated successfully`);
                setSelectedCategories([]);
            },
            onError: (errors) => {
                toast.error('Failed to update categories');
                console.error(errors);
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

    const filteredCategories = useMemo(() => {
        let filtered = categories.data;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(cat => 
                cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
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
            
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return filtered;
    }, [categories.data, searchTerm, statusFilter, sortField, sortDirection]);

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <span className="ml-1 text-gray-400">↕️</span>;
        return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your product categories • {categories.total} total
                        </p>
                    </div>

                    {/* Filters and Actions */}
                    <div className="mb-6 space-y-4">
                        {/* Bulk Actions */}
                        {selectedCategories.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                                <span className="text-sm text-blue-700">
                                    <strong>{selectedCategories.length}</strong> categories selected
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => bulkStatusUpdate(true)}
                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                    >
                                        Set Active
                                    </button>
                                    <button
                                        onClick={() => bulkStatusUpdate(false)}
                                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
                                    >
                                        Set Inactive
                                    </button>
                                    <button
                                        onClick={bulkDelete}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                                    >
                                        Delete Selected
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Search and Add */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="flex-1 flex gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search categories..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            
                            <button
                                onClick={openCreate}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Category
                            </button>
                        </div>
                    </div>

                    {/* Categories Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            <SortIcon field="name" />
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('slug')}
                                    >
                                        <div className="flex items-center">
                                            Slug
                                            <SortIcon field="slug" />
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            <SortIcon field="status" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Products
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Updated
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCategories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat._id)}
                                                onChange={() => toggleSelect(cat._id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {cat.name || 'Unnamed Category'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{cat.slug || 'No Slug'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                cat.status 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {cat.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cat.products_count || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cat.updated_at ? new Date(cat.updated_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => openEdit(cat)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(cat._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty State */}
                        {filteredCategories.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm || statusFilter !== 'all' 
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Get started by creating a new category'}
                                </p>
                                {!searchTerm && statusFilter === 'all' && (
                                    <div className="mt-6">
                                        <button
                                            onClick={openCreate}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Add Category
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {categories.links && categories.links.length > 3 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {categories.from} to {categories.to} of {categories.total} results
                            </div>
                            <div className="flex gap-2">
                                {categories.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <CategoryFormModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    editData={editData}
                />
            </div>
        </AuthenticatedLayout>
    );
}