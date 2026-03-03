import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { 
    X, 
    Save, 
    AlertCircle, 
    CheckCircle, 
    XCircle,
    FileText,
    Hash,
    Tag,
    Globe,
    Code,
    Layers,
    Eye,
    EyeOff
} from 'lucide-react';

export default function CategoryFormModal({
    show,
    onClose,
    editData = null,
}) {
    const isEdit = !!editData;
    const [jsonError, setJsonError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        meta_data: '',
        status: true,
    });

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    // Fill data on edit
    useEffect(() => {
        if (editData) {
            setData({
                name: editData.name || '',
                slug: editData.slug || '',
                description: editData.description || '',
                meta_title: editData.meta_title || '',
                meta_description: editData.meta_description || '',
                meta_keywords: editData.meta_keywords || '',
                meta_data: editData.meta_data
                    ? JSON.stringify(editData.meta_data, null, 2)
                    : '',
                status: editData.status ?? true,
            });
        } else {
            resetForm();
        }
    }, [editData]);

    // Reset function
    const resetForm = () => {
        reset();
        setJsonError(null);
        clearErrors();
        setShowAdvanced(false);
    };

    // Close handler
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (field, value) => {
        setData(field, value);
        clearErrors(field);
        
        // Auto-generate slug from name if slug is empty or not edited
        if (field === 'name' && !data.slug && !editData) {
            const generatedSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setData('slug', generatedSlug);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        let parsedMetaData = {};

        if (data.meta_data) {
            try {
                parsedMetaData = JSON.parse(data.meta_data);
                setJsonError(null);
            } catch (err) {
                setJsonError("Invalid JSON format in Meta Data");
                return;
            }
        }

        const payload = {
            ...data,
            meta_data: parsedMetaData,
        };

        const options = {
            data: payload,
            onSuccess: () => {
                handleClose();
            },
        };

        if (isEdit) {
            put(route('categories.update', editData._id), options);
        } else {
            post(route('categories.store'), options);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                show ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Backdrop with blur */}
            <div
                className={`absolute inset-0 bg-black transition-all duration-300 ${
                    show ? 'bg-opacity-60 backdrop-blur-sm' : 'bg-opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white w-full max-w-3xl rounded-xl shadow-2xl transform transition-all duration-300 overflow-hidden ${
                    show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                    <div>
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isEdit ? 'Edit Category' : 'Create New Category'}
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit 
                                ? 'Update the category information below' 
                                : 'Organize your content by creating a new category'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Basic Information
                            </h3>
                            
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g., Electronics, Fashion, Books"
                                        value={data.name}
                                        onChange={e => handleChange('name', e.target.value)}
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

                            {/* Slug */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="url-friendly-name"
                                        value={data.slug}
                                        onChange={e => handleChange('slug', e.target.value)}
                                        className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 ${
                                            errors.slug ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="flex items-center text-sm text-red-600 mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.slug}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be used in the URL: /category/{data.slug || 'slug'}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <textarea
                                        placeholder="Brief description of the category..."
                                        value={data.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        rows={3}
                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                    />
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Category Status
                                </label>
                                <div className="grid grid-cols-2 gap-3 max-w-xs">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('status', true)}
                                        className={`flex items-center justify-center px-4 py-2.5 border rounded-lg transition-all duration-200 ${
                                            data.status === true
                                                ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                        }`}
                                    >
                                        <CheckCircle className={`w-4 h-4 mr-2 ${
                                            data.status === true ? 'text-green-500' : 'text-gray-400'
                                        }`} />
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange('status', false)}
                                        className={`flex items-center justify-center px-4 py-2.5 border rounded-lg transition-all duration-200 ${
                                            data.status === false
                                                ? 'border-gray-500 bg-gray-50 text-gray-700 ring-2 ring-gray-200'
                                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                        }`}
                                    >
                                        <XCircle className={`w-4 h-4 mr-2 ${
                                            data.status === false ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                        Inactive
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Advanced SEO Section Toggle */}
                        <div className="border-t border-gray-200 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-indigo-600" />
                                    <span className="font-medium text-gray-900">SEO Settings</span>
                                </div>
                                {showAdvanced ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>

                        {/* Advanced SEO Fields */}
                        {showAdvanced && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Meta Title */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SEO title (defaults to category name)"
                                        value={data.meta_title}
                                        onChange={e => handleChange('meta_title', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Recommended length: 50-60 characters
                                    </p>
                                </div>

                                {/* Meta Description */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Meta Description
                                    </label>
                                    <textarea
                                        placeholder="Brief description for search engines"
                                        value={data.meta_description}
                                        onChange={e => handleChange('meta_description', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Recommended length: 150-160 characters
                                    </p>
                                </div>

                                {/* Meta Keywords */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Meta Keywords
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="keyword1, keyword2, keyword3"
                                        value={data.meta_keywords}
                                        onChange={e => handleChange('meta_keywords', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Separate keywords with commas
                                    </p>
                                </div>

                                {/* Meta Data JSON */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Additional Meta Data (JSON)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <Code className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <textarea
                                            value={data.meta_data}
                                            onChange={e => handleChange('meta_data', e.target.value)}
                                            className={`pl-10 w-full px-4 py-2.5 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                                                jsonError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            rows={4}
                                            placeholder="{
    &quot;custom_field&quot;: &quot;value&quot;,
    &quot;another_field&quot;: true
}"
                                        />
                                    </div>
                                    {jsonError && (
                                        <p className="flex items-center text-sm text-red-600 mt-1">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {jsonError}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Enter valid JSON for additional metadata
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                            </button>
                        </div>
                    </div>
                </form>

           
            </div>
        </div>
    );
}