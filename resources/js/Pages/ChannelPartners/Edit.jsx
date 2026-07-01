import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Form from './Form';

export default function Edit({ auth, partner }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Channel Partner" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Edit Partner: {partner.partner_name} ({partner.partner_code})
                    </h2>
                    <Form
                        partner={partner}
                        submitUrl={route('channel-partners.update', partner.id)}
                        isUpdate={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}