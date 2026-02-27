import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import PromoterFormModal from '@/Components/Promoter/PromoterFormModal';
import { router, Head } from '@inertiajs/react';

export default function Index({ promoters,auth }) {

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const openCreate = () => {
        setEditData(null);
        setShowModal(true);
    };

    const openEdit = (promoter) => {
        setEditData(promoter);
        setShowModal(true);
    };

    const deletePromoter = (id) => {
        if (confirm('Delete this promoter?')) {
            router.delete(route('promoters.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Promoters" />

            <div className="p-6">

                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold">Promoters</h1>
                    <button
                        onClick={openCreate}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Add Promoter
                    </button>
                </div>

                <table className="w-full border">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promoters.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.status ? 'Active' : 'Inactive'}</td>
                                <td>
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="text-blue-600 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deletePromoter(item._id)}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <PromoterFormModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    editData={editData}
                />

            </div>
        </AuthenticatedLayout>
    );
}