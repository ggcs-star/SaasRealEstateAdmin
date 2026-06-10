import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Show({ auth, lead, followups }) {

const [remarks, setRemarks] = useState(lead.remarks || "");

const [followupDate, setFollowupDate] = useState("");

const [followupRemark, setFollowupRemark] = useState("");

const updateStatus = (status) => {
    router.post(route("project-leads.status"), {
        id: lead._id,
        lead_status: status,
    });
};

const saveRemark = () => {
    router.post(route("project-leads.remark"), {
        id: lead._id,
        remarks,
    });
};

const addFollowup = () => {
    router.post(route("lead-followup.store"), {
        lead_id: lead._id,
        followup_date: followupDate,
        remark: followupRemark,
    });

    setFollowupDate("");
    setFollowupRemark("");
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

                <div className="lg:col-span-2 bg-white rounded shadow p-6">

                    <h2 className="text-lg font-semibold mb-4">
                        Lead Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <strong>Name</strong>
                            <p>{lead.name}</p>
                        </div>

                        <div>
                            <strong>Email</strong>
                            <p>{lead.email || "-"}</p>
                        </div>

                        <div>
                            <strong>Mobile</strong>
                            <p>
                                {lead.country_code} {lead.mobile}
                            </p>
                        </div>

                        <div>
                            <strong>Project</strong>
                            <p>{lead.project?.name || "-"}</p>
                        </div>

                        <div>
                            <strong>Looking For</strong>
                            <p>{lead.looking_for}</p>
                        </div>

                        <div>
                            <strong>Status</strong>
                            <p>{lead.lead_status || "new"}</p>
                        </div>

                    </div>

                    <hr className="my-6" />

                    <h2 className="font-semibold mb-3">
                        Remarks
                    </h2>

                    <textarea
                        value={remarks}
                        onChange={(e) =>
                            setRemarks(e.target.value)
                        }
                        className="w-full border rounded p-3"
                        rows={4}
                    />

                    <button
                        onClick={saveRemark}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save Remark
                    </button>

                </div>

                <div className="bg-white rounded shadow p-6">

                    <h2 className="font-semibold mb-4">
                        Actions
                    </h2>

                    <select
                        className="w-full border rounded p-2 mb-4"
                        value={lead.lead_status || "new"}
                        onChange={(e) =>
                            updateStatus(e.target.value)
                        }
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="site_visit">Site Visit</option>
                        <option value="booked">Booked</option>
                        <option value="lost">Lost</option>
                    </select>

                    <a
                        href={`tel:${lead.mobile}`}
                        className="block text-center bg-green-600 text-white py-2 rounded mb-3"
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

            <div className="bg-white rounded shadow p-6 mt-6">

                <h2 className="font-semibold mb-4">
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
                        value={followupRemark}
                        onChange={(e) =>
                            setFollowupRemark(e.target.value)
                        }
                        placeholder="Remark"
                        className="border rounded p-2"
                    />

                    <button
                        onClick={addFollowup}
                        className="bg-indigo-600 text-white rounded"
                    >
                        Add Followup
                    </button>

                </div>

                <div className="mt-6">

                    <h3 className="font-semibold mb-3">
                        Followup History
                    </h3>

                    {followups.map((item) => (
                        <div
                            key={item._id}
                            className="border rounded p-3 mb-2"
                        >
                            <div>
                                <strong>Date:</strong>{" "}
                                {item.followup_date}
                            </div>

                            <div>
                                <strong>Remark:</strong>{" "}
                                {item.remark}
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    </AuthenticatedLayout>
);
}



Show.guards = ["auth"];