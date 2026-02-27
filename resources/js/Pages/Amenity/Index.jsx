import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, amenities }) {

    const { data, setData, post, delete: destroy, reset, errors } = useForm({
        name: '',
        icon: null,
        status: true,
        _id: null
    });

    const [editMode, setEditMode] = useState(false);
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ✅ Submit
    const submit = (e) => {
        e.preventDefault();

        if (editMode) {
            post(route('amenities.update', data._id), {
                forceFormData: true,
                data: {
                    ...data,
                    _method: 'PUT',
                },
                onSuccess: () => {
                    closeModal();
                }
            });
        } else {
            post(route('amenities.store'), {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                }
            });
        }
    };

    // ✅ Close Modal
    const closeModal = () => {
        reset();
        setPreview(null);
        setEditMode(false);
        setShowModal(false);
    };

    // ✅ Edit
    const editAmenity = (amenity) => {
        setData({
            name: amenity.name,
            icon: null,
            status: amenity.status,
            _id: amenity._id
        });

        setPreview(amenity.icon ? `/storage/${amenity.icon}` : null);
        setEditMode(true);
        setShowModal(true);
    };

    // ✅ Delete
    const deleteAmenity = (id) => {
        if (confirm('Delete this amenity?')) {
            destroy(route('amenities.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Amenities" />

            <div className="p-6">

                {/* Header */}
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">

                            <h2 className="text-xl font-bold mb-4">
                                {editMode ? 'Edit Amenity' : 'Add Amenity'}
                            </h2>

                            <form onSubmit={submit} className="space-y-4">

                                {/* Name */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="border p-2 w-full rounded"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Icon */}
                                <div>
                                    <input
                                        type="file"
                                        onChange={e => {
                                            setData('icon', e.target.files[0]);
                                            setPreview(URL.createObjectURL(e.target.files[0]));
                                        }}
                                        className="border p-2 w-full rounded"
                                    />
                                    {errors.icon && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.icon}
                                        </p>
                                    )}
                                </div>

                                {/* Preview */}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-20 w-20 object-cover rounded"
                                    />
                                )}

                                {/* Status */}
                                <div>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value === 'true')}
                                        className="border p-2 w-full rounded"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

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
                                            {item.icon && (
                                                <img
                                                    src={`/storage/${item.icon}`}
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