import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const DetailItem = ({ label, value }) => (
    <div className="py-3 border-b">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">
            {value || '-'}
        </p>
    </div>
);

export default function Show({ auth, customer }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Customer - ${customer.first_name}`} />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white shadow rounded-lg p-6">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                Customer Details
                            </h2>

                            <div className="space-x-2">
                                <Link
                                    href={route(
                                        'customers.edit',
                                        customer.id
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Edit
                                </Link>

                                <Link
                                    href={route('customers.index')}
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                Personal Information
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <DetailItem
                                    label="First Name"
                                    value={customer.first_name}
                                />

                                <DetailItem
                                    label="Last Name"
                                    value={customer.last_name}
                                />

                                <DetailItem
                                    label="Gender"
                                    value={customer.gender}
                                />

                                <DetailItem
                                    label="Date of Birth"
                                    value={customer.dob}
                                />

                                <DetailItem
                                    label="Marital Status"
                                    value={customer.marital_status}
                                />

                                <DetailItem
                                    label="Status"
                                    value={customer.status}
                                />
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                Contact Details
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <DetailItem
                                    label="Email"
                                    value={customer.email}
                                />

                                <DetailItem
                                    label="Mobile"
                                    value={customer.mobile}
                                />

                                <DetailItem
                                    label="Alternate Mobile"
                                    value={customer.alternate_mobile}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                Address Details
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <DetailItem
                                    label="Country"
                                    value={customer.country}
                                />

                                <DetailItem
                                    label="State"
                                    value={customer.state}
                                />

                                <DetailItem
                                    label="City"
                                    value={customer.city}
                                />

                                <DetailItem
                                    label="Pincode"
                                    value={customer.pincode}
                                />

                                <div className="md:col-span-3">
                                    <DetailItem
                                        label="Address"
                                        value={customer.address}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                Professional Information
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <DetailItem
                                    label="Occupation"
                                    value={customer.occupation}
                                />

                                <DetailItem
                                    label="Company Name"
                                    value={customer.company_name}
                                />

                                <DetailItem
                                    label="Annual Income"
                                    value={
                                        customer.annual_income
                                            ? `₹ ${customer.annual_income}`
                                            : "-"
                                    }
                                />
                            </div>
                        </div>

                        {/* KYC */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                KYC Details
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <DetailItem
                                    label="PAN Number"
                                    value={customer.pan_number}
                                />

                                <DetailItem
                                    label="Aadhaar Number"
                                    value={customer.aadhaar_number}
                                />
                            </div>
                        </div>

                        {/* Property Preferences */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                Property Preferences
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <DetailItem
                                    label="Preferred Property Type"
                                    value={
                                        customer.preferred_property_type
                                    }
                                />

                                <DetailItem
                                    label="Preferred City"
                                    value={
                                        customer.preferred_city
                                    }
                                />

                                <DetailItem
                                    label="Budget Min"
                                    value={
                                        customer.budget_min
                                            ? `₹ ${customer.budget_min}`
                                            : "-"
                                    }
                                />

                                <DetailItem
                                    label="Budget Max"
                                    value={
                                        customer.budget_max
                                            ? `₹ ${customer.budget_max}`
                                            : "-"
                                    }
                                />

                                <DetailItem
                                    label="Lead Source"
                                    value={customer.source}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}