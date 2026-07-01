import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, customers, filters }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Customers" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Customers Management
                    </h1>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            defaultValue={filters.search}
                            placeholder="Search name, email, or phone..."
                            className="border-gray-300 rounded-lg p-2 w-full md:w-80 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) =>
                                router.get(
                                    route('customers.index'),
                                    { search: e.target.value },
                                    { preserveState: true, replace: true }
                                )
                            }
                        />
                        <Link
                            href={route('customers.create')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow whitespace-nowrap"
                        >
                            + Add Customer
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Contact Details</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No customers found.</td>
                                </tr>
                            ) : (
                                customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium text-gray-900">
                                            {customer.first_name} {customer.last_name}
                                        </td>
                                        <td className="p-4">
                                            <div>{customer.email}</div>
                                            <div className="text-gray-500 text-xs">{customer.mobile}</div>
                                        </td>
                                        <td className="p-4">
                                            {customer.city ? `${customer.city}${customer.state ? `, ${customer.state}` : ''}` : '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${
                                                customer.status === 'active' ? 'bg-green-100 text-green-700' : 
                                                customer.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center space-x-3">
                                            <Link
    href={route('customers.show', customer.id)}
    className="text-green-600 mr-3"
>
    View
</Link>
                                            <Link href={route('customers.edit', customer.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this customer?')) {
                                                        router.delete(route('customers.destroy', customer.id));
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