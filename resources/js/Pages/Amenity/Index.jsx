import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, amenities }) {

    const { data, setData, post, delete: destroy, reset, errors } = useForm({
        name: '',
        icon_url: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        meta_data: '',
        status: true,
        _id: null
    });

    const [editMode, setEditMode] = useState(false);
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [jsonError, setJsonError] = useState(null);

    // Close Modal
    const closeModal = () => {
        reset();
        setPreview(null);
        setEditMode(false);
        setShowModal(false);
        setJsonError(null);
    };

    // Submit
    const submit = (e) => {
        e.preventDefault();

        let parsedMetaData = {};

        if (data.meta_data) {
            try {
                parsedMetaData = JSON.parse(data.meta_data);
                setJsonError(null);
            } catch (err) {
                setJsonError("Invalid JSON format");
                return;
            }
        }

        const payload = {
            ...data,
            meta_data: parsedMetaData,
        };

        if (editMode) {
            post(route('amenities.update', data._id), {
                forceFormData: true,
                data: { ...payload, _method: 'PUT' },
                onSuccess: closeModal
            });
        } else {
            post(route('amenities.store'), {
                forceFormData: true,
                data: payload,
                onSuccess: closeModal
            });
        }
    };

    // Edit
    const editAmenity = (amenity) => {
        setData({
            name: amenity.name,
            icon_url: amenity.icon_url || '',
            description: amenity.description || '',
            meta_title: amenity.meta_title || '',
            meta_description: amenity.meta_description || '',
            meta_keywords: amenity.meta_keywords || '',
            meta_data: amenity.meta_data
                ? JSON.stringify(amenity.meta_data, null, 2)
                : '',
            status: amenity.status,
            _id: amenity._id
        });

        setPreview(amenity.icon_url ?? '');
        setEditMode(true);
        setShowModal(true);
    };

    // Delete
    const deleteAmenity = (id) => {
        if (confirm('Delete this amenity?')) {
            destroy(route('amenities.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Amenities" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Amenities</h2>

                    <button
                        onClick={() => {
                            closeModal();
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Add Amenity
                    </button>
                </div>

                {/* Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={closeModal}
                    >
                        <div
                            className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h2 className="text-xl font-bold mb-4">
                                {editMode ? 'Edit Amenity' : 'Add Amenity'}
                            </h2>

                            <form onSubmit={submit} className="space-y-4">

                                {/* Name */}
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="border p-2 w-full rounded"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                                {/* Icon URL */}
                                <div>
                                    <label>Icon URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/icon.png"
                                        value={preview}
                                        onChange={(e) => {
                                            setData('icon_url', e.target.value);
                                            setPreview(e.target.value);
                                        }}
                                        className="border p-2 w-full rounded"
                                    />
                                    {errors.icon_url && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.icon_url}
                                        </p>
                                    )}
                                </div>

                                {/* Preview */}
                                {preview && (
                                    <div className="mt-3">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            onError={() => setPreview(null)}
                                            className="h-20 w-20 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <textarea
                                    placeholder="Description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="border p-2 w-full rounded"
                                />

                                <hr />

                                <h3 className="font-semibold">SEO Settings</h3>

                                <input
                                    type="text"
                                    placeholder="Meta Title"
                                    value={data.meta_title}
                                    onChange={e => setData('meta_title', e.target.value)}
                                    className="border p-2 w-full rounded"
                                />

                                <textarea
                                    placeholder="Meta Description"
                                    value={data.meta_description}
                                    onChange={e => setData('meta_description', e.target.value)}
                                    className="border p-2 w-full rounded"
                                />

                                <input
                                    type="text"
                                    placeholder="Meta Keywords"
                                    value={data.meta_keywords}
                                    onChange={e => setData('meta_keywords', e.target.value)}
                                    className="border p-2 w-full rounded"
                                />

                                <textarea
                                    placeholder="Meta Data (JSON)"
                                    value={data.meta_data}
                                    onChange={e => setData('meta_data', e.target.value)}
                                    className="border p-2 w-full rounded font-mono"
                                />
                                {jsonError && <p className="text-red-500 text-sm">{jsonError}</p>}

                                {/* Status */}
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value === 'true')}
                                    className="border p-2 w-full rounded"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>

                                {/* Buttons */}
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-400 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                                    >
                                        {editMode ? 'Update' : 'Create'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white shadow rounded-lg p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Icon</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {amenities.length > 0 ? (
                                amenities.map((item) => (
                                    <tr key={item._id} className="border-t">
                                        <td className="p-3">{item.name}</td>

                                        <td className="p-3">
                                            {item.icon_url && (
                                                <img
                                                    src={item.icon_url}
                                                    alt="icon"
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {item.status ? (
                                                <span className="text-green-600 font-semibold">Active</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Inactive</span>
                                            )}
                                        </td>

                                        <td className="p-3 space-x-2">
                                            <button
                                                onClick={() => editAmenity(item)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => deleteAmenity(item._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4 text-gray-500">
                                        No amenities found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}