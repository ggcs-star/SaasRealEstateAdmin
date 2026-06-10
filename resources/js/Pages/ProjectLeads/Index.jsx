import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from '@inertiajs/react'
export default function Index({ auth, leads }) {

    const updateLeadStatus = (id, status) => {

        router.post(
            route("project-leads.status"),
            {
                id,
                lead_status: status
            }
        );
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects Leads" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Project Leads
                </h1>

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Mobile</th>
                                <th className="border p-2">Looking For</th>
                                <th className="border p-2">Bedrooms</th>
                                <th>Lead Status</th>
                                <th>Priority</th>
                                <th>Followup</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {leads?.data?.length > 0 ? (
                                leads.data.map((lead) => (
                                    <tr key={lead._id}>
                                        <td className="border p-2">
                                            {lead.name}
                                        </td>

                                        <td className="border p-2">
                                            {lead.email}
                                        </td>

                                        <td className="border p-2">
                                            {lead.country_code} {lead.mobile}
                                        </td>

                                        <td className="border p-2">
                                            {lead.looking_for}
                                        </td>

                                        <td className="border p-2">
                                            {Array.isArray(
                                                lead.preferred_bedrooms
                                            )
                                                ? lead.preferred_bedrooms.join(", ")
                                                : ""}
                                        </td>

                                        <select
                                            value={lead.lead_status || "new"}
                                            onChange={(e) =>
                                                updateLeadStatus(lead.id, e.target.value)
                                            }
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="interested">Interested</option>
                                            <option value="site_visit">Site Visit</option>
                                            <option value="booked">Booked</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                        <td className="border p-2">
                                            <Link
                                                href={route("project-leads.show", lead.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center p-4"
                                    >
                                        No Leads Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}