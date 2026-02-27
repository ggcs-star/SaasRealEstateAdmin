import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CategoryFormModal({
    show,
    onClose,
    editData = null,
}) {

    const isEdit = !!editData;
    const [jsonError, setJsonError] = useState(null);

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
    };

    // Close handler
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (field, value) => {
        setData(field, value);
        clearErrors(field);
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

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={handleClose}   // 👈 outside click close
        >
            <div
                className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}   // 👈 prevent inside click close
            >
                
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? 'Edit Category' : 'Create Category'}
                </h2>

                <form onSubmit={submit} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label>Slug</label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={e => handleChange('slug', e.target.value)}
                            className="w-full border p-2 rounded bg-gray-100"
                        />
                        {errors.slug && <div className="text-red-500 text-sm">{errors.slug}</div>}
                    </div>

                    {/* Description */}
                    <div>
                        <label>Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <hr />

                    <h3 className="font-semibold text-lg">SEO Settings</h3>

                    <div>
                        <label>Meta Title</label>
                        <input
                            type="text"
                            value={data.meta_title}
                            onChange={e => handleChange('meta_title', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Meta Description</label>
                        <textarea
                            value={data.meta_description}
                            onChange={e => handleChange('meta_description', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Meta Keywords</label>
                        <input
                            type="text"
                            value={data.meta_keywords}
                            onChange={e => handleChange('meta_keywords', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label>Meta Data (JSON)</label>
                        <textarea
                            value={data.meta_data}
                            onChange={e => handleChange('meta_data', e.target.value)}
                            className="w-full border p-2 rounded font-mono text-sm"
                            rows={4}
                        />
                        {jsonError && <div className="text-red-500 text-sm">{jsonError}</div>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={e => handleChange('status', e.target.checked)}
                            />
                            Active
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}