import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, partners, filters }) {
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Rejected': 
            case 'Blocked': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Channel Partners" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Channel Partners
                    </h1>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            defaultValue={filters.search}
                            placeholder="Search code, name, email..."
                            className="border-gray-300 rounded-lg p-2 w-full md:w-80 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) =>
                                router.get(
                                    route('channel-partners.index'),
                                    { search: e.target.value },
                                    { preserveState: true, replace: true }
                                )
                            }
                        />
                        <Link
                            href={route('channel-partners.create')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow whitespace-nowrap"
                        >
                            + Add Partner
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4">Partner Details</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {partners.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No partners found.</td>
                                </tr>
                            ) : (
                                partners.data.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{partner.partner_name}</div>
                                            <div className="text-gray-500 text-xs">Code: {partner.partner_code}</div>
                                        </td>
                                        <td className="p-4">
                                            <div>{partner.email}</div>
                                            <div className="text-gray-500 text-xs">{partner.contact_number}</div>
                                        </td>
                                        <td className="p-4 font-medium">
                                            {partner.company_name || '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold tracking-wide ${getStatusStyle(partner.status)}`}>
                                                {partner.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center space-x-3">
                                            <Link href={route('channel-partners.edit', partner.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this partner?')) {
                                                        router.delete(route('channel-partners.destroy', partner.id));
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}