import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Form from './Form';

export default function Create({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Channel Partner" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Channel Partner</h2>
                    <Form
                        submitUrl={route('channel-partners.store')}
                        isUpdate={false}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}