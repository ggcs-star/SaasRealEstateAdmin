import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Show({ auth, lead, followups = [] }) {

    const leadId = lead.id || lead._id;

    const [remarks, setRemarks] = useState(lead.remarks || "");
    const [followupDate, setFollowupDate] = useState("");
    const [followupRemark, setFollowupRemark] = useState("");

    const updateStatus = (status) => {
        router.post(
            route("project-leads.status"),
            {
                id: leadId,
                lead_status: status,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const saveRemark = () => {
        router.post(
            route("project-leads.remark"),
            {
                id: leadId,
                remarks,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const addFollowup = () => {

        if (!followupDate) {
            alert("Please select followup date");
            return;
        }

        router.post(
            route("lead-followup.store"),
            {
                lead_id: leadId,
                followup_date: followupDate,
                remark: followupRemark,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFollowupDate("");
                    setFollowupRemark("");
                }
            }
        );
    };

    const getStatusColor = (status) => {

        switch (status) {

            case "interested":
                return "bg-green-100 text-green-700";

            case "contacted":
                return "bg-blue-100 text-blue-700";

            case "site_visit":
                return "bg-yellow-100 text-yellow-700";

            case "booked":
                return "bg-purple-100 text-purple-700";

            case "lost":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Lead Details" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        CRM Lead Details
                    </h1>

                    <Link
                        href={route("project-leads.index")}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Back
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Lead Info */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            Lead Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium">{lead.name}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Email</p>
                                <p>{lead.email || "-"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Mobile</p>
                                <p>
                                    {lead.country_code} {lead.mobile}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Project</p>
                                <p>{lead.project?.name || "-"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Looking For</p>
                                <p>{lead.looking_for || "-"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Bedrooms</p>
                                <p>
                                    {Array.isArray(
                                        lead.preferred_bedrooms
                                    )
                                        ? lead.preferred_bedrooms.join(", ")
                                        : "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Consent</p>
                                <p>
                                    {lead.consent ? "Yes" : "No"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Source</p>
                                <p>{lead.source || "-"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    IP Address
                                </p>
                                <p>{lead.ip_address || "-"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Created At
                                </p>
                                <p>{lead.created_at}</p>
                            </div>

                        </div>

                        <hr className="my-6" />

                        <h3 className="font-semibold mb-3">
                            Remarks
                        </h3>

                        <textarea
                            rows="5"
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <button
                            onClick={saveRemark}
                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Save Remark
                        </button>

                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow p-6">

                        <h2 className="font-semibold mb-4">
                            Lead Actions
                        </h2>

                        <div className="mb-4">

                            <p className="text-gray-500 mb-2">
                                Current Status
                            </p>

                            <span
                                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                    lead.lead_status
                                )}`}
                            >
                                {lead.lead_status || "new"}
                            </span>

                        </div>

                        <select
                            className="w-full border rounded p-2 mb-4"
                            value={lead.lead_status || "new"}
                            onChange={(e) =>
                                updateStatus(e.target.value)
                            }
                        >
                            <option value="new">New</option>
                            <option value="contacted">
                                Contacted
                            </option>
                            <option value="interested">
                                Interested
                            </option>
                            <option value="site_visit">
                                Site Visit
                            </option>
                            <option value="booked">
                                Booked
                            </option>
                            <option value="lost">
                                Lost
                            </option>
                        </select>

                        <div className="space-y-3">

                            <a
                                href={`tel:${lead.mobile}`}
                                className="block text-center bg-green-600 text-white py-2 rounded"
                            >
                                Call Customer
                            </a>

                            <a
                                href={`https://wa.me/${lead.mobile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-center bg-green-700 text-white py-2 rounded"
                            >
                                WhatsApp
                            </a>

                        </div>

                    </div>

                </div>

                {/* Followup Section */}

                <div className="bg-white rounded-lg shadow p-6 mt-6">

                    <h2 className="font-semibold text-lg mb-4">
                        Add Followup
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <input
                            type="date"
                            value={followupDate}
                            onChange={(e) =>
                                setFollowupDate(e.target.value)
                            }
                            className="border rounded p-2"
                        />

                        <input
                            type="text"
                            placeholder="Remark"
                            value={followupRemark}
                            onChange={(e) =>
                                setFollowupRemark(e.target.value)
                            }
                            className="border rounded p-2"
                        />

                        <button
                            onClick={addFollowup}
                            className="bg-indigo-600 text-white rounded"
                        >
                            Add Followup
                        </button>

                    </div>

                    <div className="mt-8">

                        <h3 className="font-semibold text-lg mb-4">
                            Followup History
                        </h3>

                        {followups?.length > 0 ? (

                            followups.map((item) => (

                                <div
                                    key={item.id || item._id}
                                    className="border rounded-lg p-4 mb-3"
                                >
                                    <div>
                                        <strong>Date:</strong>{" "}
                                        {item.followup_date}
                                    </div>

                                    <div className="mt-2">
                                        <strong>Remark:</strong>{" "}
                                        {item.remark}
                                    </div>

                                    <div className="mt-2">
                                        <strong>Status:</strong>{" "}
                                        {item.status}
                                    </div>
                                </div>

                            ))

                        ) : (

                            <div className="text-gray-500">
                                No Followups Found
                            </div>

                        )}

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}