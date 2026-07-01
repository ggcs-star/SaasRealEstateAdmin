import { useForm } from "@inertiajs/react";

const InputGroup = ({ label, name, type = "text", placeholder, data, setData, errors }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {type === "file" ? (
            <input
                type="file"
                onChange={(e) => setData(name, e.target.files[0])}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
        ) : (
            <input
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                placeholder={placeholder}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            />
        )}
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
);

export default function Form({ partner = null, submitUrl, isUpdate = false }) {
    const { data, setData, post, processing, errors } = useForm({
        partner_code: partner?.partner_code || "",
        partner_name: partner?.partner_name || "",
        contact_number: partner?.contact_number || "",
        alternate_number: partner?.alternate_number || "",
        email: partner?.email || "",
        password: "",

        date_of_birth: partner?.date_of_birth ? partner.date_of_birth.split('T')[0] : "",
        gender: partner?.gender || "",

        aadhaar_number: partner?.aadhaar_number || "",
        aadhaar_front: null,
        aadhaar_back: null,
        pan_number: partner?.pan_number || "",
        pan_image: null,

        gst_number: partner?.gst_number || "",
        rera_number: partner?.rera_number || "",
        company_name: partner?.company_name || "",
        company_type: partner?.company_type || "",

        address: partner?.address || "",
        city: partner?.city || "",
        state: partner?.state || "",
        country: partner?.country || "",
        pincode: partner?.pincode || "",

        bank_name: partner?.bank_name || "",
        account_holder_name: partner?.account_holder_name || "",
        account_number: partner?.account_number || "",
        ifsc_code: partner?.ifsc_code || "",
        cancelled_cheque: null,

        commission_type: partner?.commission_type || "Percentage",
        commission_value: partner?.commission_value || "",

        status: partner?.status || "Pending",

        ...(isUpdate && { _method: 'put' })
    });

    const submit = (e) => {
        e.preventDefault();
        post(submitUrl, { forceFormData: true }); 
    };

    return (
        <form onSubmit={submit} className="space-y-8 bg-white p-6 rounded-lg shadow-md" encType="multipart/form-data">

            {/* --- Basic Information --- */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Partner Code *" name="partner_code" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Partner Name *" name="partner_name" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Email *" name="email" type="email" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Contact Number *" name="contact_number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Alternate Number" name="alternate_number" data={data} setData={setData} errors={errors} />
                    <InputGroup label={isUpdate ? "Password (leave blank to keep)" : "Password *"} name="password" type="password" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Date of Birth" name="date_of_birth" type="date" data={data} setData={setData} errors={errors} />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select value={data.gender} onChange={(e) => setData("gender", e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- Business Information --- */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Company Name" name="company_name" data={data} setData={setData} errors={errors} />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                        <select value={data.company_type} onChange={(e) => setData("company_type", e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
                            <option value="">Select Type</option>
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Private Limited">Private Limited</option>
                            <option value="LLP">LLP</option>
                        </select>
                    </div>
                    <InputGroup label="GST Number" name="gst_number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="RERA Number" name="rera_number" data={data} setData={setData} errors={errors} />
                </div>
            </div>

            {/* --- KYC & Documents --- */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">KYC & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InputGroup label="Aadhaar Number" name="aadhaar_number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Aadhaar Front (Image/PDF)" name="aadhaar_front" type="file" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Aadhaar Back (Image/PDF)" name="aadhaar_back" type="file" data={data} setData={setData} errors={errors} />
                    <InputGroup label="PAN Number" name="pan_number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="PAN Card (Image/PDF)" name="pan_image" type="file" data={data} setData={setData} errors={errors} />
                </div>
            </div>

            {/* --- Bank Details --- */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Bank Name" name="bank_name" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Account Holder Name" name="account_holder_name" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Account Number" name="account_number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="IFSC Code" name="ifsc_code" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Cancelled Cheque (Image/PDF)" name="cancelled_cheque" type="file" data={data} setData={setData} errors={errors} />
                </div>
            </div>

            {/* --- Address --- */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                        <InputGroup label="Full Address" name="address" data={data} setData={setData} errors={errors} />
                    </div>
                    <InputGroup label="City" name="city" data={data} setData={setData} errors={errors} />
                    <InputGroup label="State" name="state" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Country" name="country" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Pincode" name="pincode" data={data} setData={setData} errors={errors} />
                </div>
            </div>

            {/* --- Settings & Status --- */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Commission & Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type</label>
                        <select value={data.commission_type} onChange={(e) => setData("commission_type", e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
                            <option value="Percentage">Percentage (%)</option>
                            <option value="Fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <InputGroup label="Commission Value" name="commission_value" type="number" data={data} setData={setData} errors={errors} />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={data.status} onChange={(e) => setData("status", e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border">
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <a href={route('channel-partners.index')} className="px-6 py-2 mr-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    Cancel
                </a>
                <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                    {processing ? 'Saving...' : 'Save Channel Partner'}
                </button>
            </div>
        </form>
    );
}