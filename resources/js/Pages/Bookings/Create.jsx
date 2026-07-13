import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Form from './Form';

export default function Create({ auth, customers, projects, channelPartners, users, currentRole }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="New Booking" />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Booking</h2>
                    <Form
                        submitUrl={route('bookings.store')}
                        customers={customers}
                        projects={projects}
                        channelPartners={channelPartners}
                        users={users}
                        isUpdate={false}
                        currentRole={currentRole}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}