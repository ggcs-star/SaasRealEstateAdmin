import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PromoterFormModal({ show, onClose, editData = null }) {

    const isEdit = !!editData;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        status: true,
    });

    useEffect(() => {
        if (editData) {
            setData({
                name: editData.name || '',
                email: editData.email || '',
                phone: editData.phone || '',
                status: editData.status ?? true,
            });
        } else {
            reset();
        }
    }, [editData]);

    const submit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('promoters.update', editData._id), {
                onSuccess: onClose,
            });
        } else {
            post(route('promoters.store'), {
                onSuccess: onClose,
            });
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? 'Edit Promoter' : 'Add Promoter'}
                </h2>

                <form onSubmit={submit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <input
                        type="text"
                        placeholder="Phone"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                    <select
                        value={data.status}
                        onChange={e => setData('status', e.target.value === 'true')}
                        className="border p-2 w-full rounded"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            {isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}