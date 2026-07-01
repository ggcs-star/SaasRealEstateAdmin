import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Form from './Form';

export default function Edit({ auth, customer }) {
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Customer" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Customer: {customer.first_name}</h2>
                    <Form
                        customer={customer}
                        submitUrl={route('customers.update', customer.id)}
                        method="put"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}