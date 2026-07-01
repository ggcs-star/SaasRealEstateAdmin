import { Link, useForm } from "@inertiajs/react";

function InputGroup({
    label,
    name,
    type = "text",
    placeholder = "",
    data,
    setData,
    errors,
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            <input
                type={type}
                value={data[name] ?? ""}
                onChange={(e) => setData(name, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />

            {errors[name] && (
                <p className="mt-1 text-sm text-red-500">
                    {errors[name]}
                </p>
            )}
        </div>
    );
}

export default function Form({
    customer = null,
    submitUrl,
    method,
}) {
    const { data, setData, post, put, processing, errors } =
        useForm({
            first_name: customer?.first_name || "",
            last_name: customer?.last_name || "",
            email: customer?.email || "",
            mobile: customer?.mobile || "",
            alternate_mobile:
                customer?.alternate_mobile || "",
            password: "",

            gender: customer?.gender || "",
            dob: customer?.dob
                ? customer.dob.split("T")[0]
                : "",
            marital_status:
                customer?.marital_status || "",

            country: customer?.country || "",
            state: customer?.state || "",
            city: customer?.city || "",
            address: customer?.address || "",
            pincode: customer?.pincode || "",

            occupation:
                customer?.occupation || "",
            company_name:
                customer?.company_name || "",
            annual_income:
                customer?.annual_income || "",

            pan_number:
                customer?.pan_number || "",
            aadhaar_number:
                customer?.aadhaar_number || "",

            preferred_property_type:
                customer?.preferred_property_type || "",
            preferred_city:
                customer?.preferred_city || "",
            budget_min:
                customer?.budget_min || "",
            budget_max:
                customer?.budget_max || "",

            status:
                customer?.status || "active",
            source: customer?.source || "",
        });

    const submit = (e) => {
        e.preventDefault();

        if (method === "post") {
            post(submitUrl);
        } else {
            put(submitUrl);
        }
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-8 bg-white p-6 rounded-lg shadow"
        >
            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="First Name *"
                        name="first_name"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Last Name"
                        name="last_name"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>

                        <select
                            value={data.gender}
                            onChange={(e) =>
                                setData(
                                    "gender",
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                            <option value="">
                                Select Gender
                            </option>
                            <option value="Male">
                                Male
                            </option>
                            <option value="Female">
                                Female
                            </option>
                            <option value="Other">
                                Other
                            </option>
                        </select>
                    </div>

                    <InputGroup
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marital Status
                        </label>

                        <select
                            value={data.marital_status}
                            onChange={(e) =>
                                setData(
                                    "marital_status",
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                            <option value="">
                                Select Status
                            </option>
                            <option value="Single">
                                Single
                            </option>
                            <option value="Married">
                                Married
                            </option>
                            <option value="Divorced">
                                Divorced
                            </option>
                            <option value="Widowed">
                                Widowed
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                    Contact Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="Email"
                        name="email"
                        type="email"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Mobile"
                        name="mobile"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Alternate Mobile"
                        name="alternate_mobile"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label={
                            customer
                                ? "Password (Optional)"
                                : "Password"
                        }
                        name="password"
                        type="password"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                </div>
            </div>

            {/* Address */}
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                    Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="Country"
                        name="country"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="State"
                        name="state"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="City"
                        name="city"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Pincode"
                        name="pincode"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <div className="md:col-span-2">
                        <InputGroup
                            label="Address"
                            name="address"
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                </div>
            </div>

            {/* Professional */}
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                    Professional Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="Occupation"
                        name="occupation"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Company Name"
                        name="company_name"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Annual Income"
                        name="annual_income"
                        type="number"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="PAN Number"
                        name="pan_number"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Aadhaar Number"
                        name="aadhaar_number"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                </div>
            </div>

            {/* Preferences */}
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                    Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="Property Type"
                        name="preferred_property_type"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Preferred City"
                        name="preferred_city"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Min Budget"
                        name="budget_min"
                        type="number"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Max Budget"
                        name="budget_max"
                        type="number"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <InputGroup
                        label="Lead Source"
                        name="source"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>

                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData(
                                    "status",
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                            <option value="active">
                                Active
                            </option>
                            <option value="inactive">
                                Inactive
                            </option>
                            <option value="blocked">
                                Blocked
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-5">
                <Link
                    href={route("customers.index")}
                    className="px-5 py-2 rounded-lg bg-gray-200"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white"
                >
                    {processing
                        ? "Saving..."
                        : "Save Customer"}
                </button>
            </div>
        </form>
    );
}