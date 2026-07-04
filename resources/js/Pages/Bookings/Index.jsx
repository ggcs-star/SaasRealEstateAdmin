import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, bookings, filters }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700'; // Pending
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Bookings" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            defaultValue={filters.search}
                            placeholder="Search Booking No, Customer..."
                            className="border-gray-300 rounded-lg p-2 w-full md:w-80 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) =>
                                router.get(route('bookings.index'), { search: e.target.value }, { preserveState: true, replace: true })
                            }
                        />
                        <Link
                            href={route('bookings.create')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow whitespace-nowrap"
                        >
                            + New Booking
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4">Booking Info</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Unit Details</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.data.length === 0 ? (
                                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No bookings found.</td></tr>
                            ) : (
                                bookings.data.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{booking.booking_number}</div>
                                            <div className="text-gray-500 text-xs">Date: {booking.booking_date}</div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">
                                            {booking.customer ? `${booking.customer.first_name} ${booking.customer.last_name || ''}` : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <div>{booking.project ? booking.project.name : '-'}</div>
                                            <div className="text-gray-500 text-xs">{booking.unit_name ? `Unit: ${booking.unit_name}` : ''} {booking.tower_name ? `(${booking.tower_name})` : ''}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">₹{booking.total_amount}</div>
                                            <div className="text-xs text-gray-500">{booking.payment_status}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold tracking-wide ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center space-x-3">
                                            <Link href={route('bookings.show', booking.id)} className="text-blue-600 hover:text-blue-800 font-medium">View</Link>
                                            <Link href={route('bookings.edit', booking.id)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this booking?')) {
                                                        router.delete(route('bookings.destroy', booking.id));
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