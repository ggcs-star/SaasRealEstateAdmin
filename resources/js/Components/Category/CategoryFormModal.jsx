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
    EyeOff,
    Sparkles,
    ChevronDown,
    ChevronUp
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
                className={`relative bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl transform transition-all duration-300 overflow-hidden ${
                    show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {isEdit ? 'Edit Category' : 'Create New Category'}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    {isEdit 
                                        ? 'Update the category information below' 
                                        : 'Organize your content by creating a new category'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-xl"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={12} />
                                Basic Information
                            </h3>
                            
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g., Electronics, Fashion, Books"
                                        value={data.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        className={`pl-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200 ${
                                            errors.name ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20' : 'border-slate-200 dark:border-gray-700'
                                        }`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="flex items-center text-sm text-red-600 dark:text-red-400 mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Slug */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="url-friendly-name"
                                        value={data.slug}
                                        onChange={e => handleChange('slug', e.target.value)}
                                        className={`pl-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200 ${
                                            errors.slug ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-gray-700'
                                        }`}
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="flex items-center text-sm text-red-600 dark:text-red-400 mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.slug}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    This will be used in the URL: /category/{data.slug || 'slug'}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Description
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <textarea
                                        placeholder="Brief description of the category..."
                                        value={data.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        rows={3}
                                        className="pl-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Category Status
                                </label>
                                <div className="flex gap-3 max-w-xs">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('status', true)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                            data.status === true
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                                                : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange('status', false)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                            data.status === false
                                                ? 'bg-slate-600 text-white shadow-md'
                                                : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Inactive
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Advanced SEO Section Toggle */}
                        <div className="border-t border-slate-200 dark:border-gray-800 pt-5">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full text-left group"
                            >
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="font-semibold text-slate-800 dark:text-white">SEO Settings</span>
                                    <span className="text-xs text-slate-400">(Optional)</span>
                                </div>
                                <div className="p-1 rounded-lg bg-slate-100 dark:bg-gray-800 group-hover:bg-slate-200 dark:group-hover:bg-gray-700 transition-colors">
                                    {showAdvanced ? (
                                        <ChevronUp className="w-4 h-4 text-slate-500" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Advanced SEO Fields */}
                        {showAdvanced && (
                            <div className="space-y-4 animate-slideDown">
                                {/* Meta Title */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SEO title (defaults to category name)"
                                        value={data.meta_title}
                                        onChange={e => handleChange('meta_title', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Recommended length: 50-60 characters • <span className="text-emerald-600">{data.meta_title?.length || 0}</span>/60
                                    </p>
                                </div>

                                {/* Meta Description */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Meta Description
                                    </label>
                                    <textarea
                                        placeholder="Brief description for search engines"
                                        value={data.meta_description}
                                        onChange={e => handleChange('meta_description', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200 resize-none"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Recommended length: 150-160 characters • <span className="text-emerald-600">{data.meta_description?.length || 0}</span>/160
                                    </p>
                                </div>

                                {/* Meta Keywords */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Meta Keywords
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="keyword1, keyword2, keyword3"
                                        value={data.meta_keywords}
                                        onChange={e => handleChange('meta_keywords', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Separate keywords with commas
                                    </p>
                                </div>

                                {/* Meta Data JSON */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Additional Meta Data (JSON)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <Code className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <textarea
                                            value={data.meta_data}
                                            onChange={e => handleChange('meta_data', e.target.value)}
                                            className={`pl-10 w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-200 ${
                                                jsonError ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20' : 'border-slate-200 dark:border-gray-700'
                                            }`}
                                            rows={4}
                                            placeholder={`{
  "custom_field": "value",
  "another_field": true
}`}
                                        />
                                    </div>
                                    {jsonError && (
                                        <p className="flex items-center text-sm text-red-600 dark:text-red-400 mt-1">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {jsonError}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Enter valid JSON for additional metadata
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 dark:border-gray-800 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}