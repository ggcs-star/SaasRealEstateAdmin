import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Form from './Form';

export default function Edit({ auth, booking, customers, projects, channelPartners, users }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Booking" />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Edit Booking: {booking.booking_number}
                    </h2>
                    <Form
                        booking={booking}
                        submitUrl={route('bookings.update', booking.id)}
                        customers={customers}
                        projects={projects}
                        channelPartners={channelPartners}
                        users={users}
                        isUpdate={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}