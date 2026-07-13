import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const InputGroup = ({
    label,
    name,
    type = "text",
    data,
    setData,
    errors,
    readOnly = false
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
            {label}
        </label>
        <input
            type={type}
            readOnly={readOnly}
            value={data[name]}
            onChange={(e) =>
                !readOnly &&
                setData(name, e.target.value)
            }
            className={`
                w-full
                rounded-md
                border
                px-3
                py-2
                ${readOnly
                    ? "bg-gray-100"
                    : "bg-white"
                }
            `}
        />
        {errors[name] && (
            <p className="text-red-500 text-xs mt-1">
                {errors[name]}
            </p>
        )}
    </div>
);

const SelectGroup = ({ label, name, options, data, setData, errors, placeholder = "Select..." }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={data[name]}
            onChange={(e) => setData(name, e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border focus:ring-[#14B99F] focus:border-[#14B99F]"
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
);

const FileGroup = ({ label, name, setData, errors }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="file"
            onChange={(e) => setData(name, e.target.files[0])}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] px-3 py-2 border file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14B99F]/10 file:text-[#14B99F] hover:file:bg-[#14B99F]/20"
        />
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
);

const DetailCard = ({ label, value }) => (
    <div className="bg-gradient-to-br from-gray-50 to-white border rounded-xl p-4 hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-500 uppercase mb-2">{label}</p>
        <p className="font-semibold text-gray-900">{value || '-'}</p>
    </div>
);

export default function Form({ booking = null, customers, projects, channelPartners, users, currentRole, submitUrl, isUpdate = false }) {

    const [projectUnits, setProjectUnits] = useState([]);
    const [isLoadingUnits, setIsLoadingUnits] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: booking?.customer_id || "",
        project_id: booking?.project_id || "",
        unit_id: booking?.unit_id || "",
        channel_partner_id: booking?.channel_partner_id || "",
        assigned_user_id: booking?.assigned_user_id || "",

        booking_date: booking?.booking_date ? booking.booking_date.split('T')[0] : "",
        agreement_date: booking?.agreement_date ? booking.agreement_date.split('T')[0] : "",
        followup_date: booking?.followup_date ? booking.followup_date.split('T')[0] : "",
        possession_date: booking?.possession_date ? booking.possession_date.split('T')[0] : "",

        tower_name: booking?.tower_name || "",
        floor_name: booking?.floor_name || "",
        unit_name: booking?.unit_name || "",
        unit_type: booking?.unit_type || "",
        property_type: booking?.property_type || "",
        unit_size: booking?.unit_size || "",
        unit_size_unit: booking?.unit_size_unit || "",

        booking_amount: booking?.booking_amount || "",
        other_amount: booking?.other_amount || "",
        discount_amount: booking?.discount_amount || "",
        tax_amount: booking?.tax_amount || "",
        total_amount: booking?.total_amount || "",

        commission_type: booking?.commission_type || "Percentage",
        commission_value: booking?.commission_value || "",
        commission_amount: booking?.commission_amount || 0,

        payment_plan: booking?.payment_plan || "",
        payment_status: booking?.payment_status || "Pending",

        booking_form: null,
        agreement_document: null,
        payment_receipt: null,

        remarks: booking?.remarks || "",
        cancellation_reason: booking?.cancellation_reason || "",
        
        status: booking?.status || "Booked",
        base_price: booking?.base_price || "",

        tax_percentage: booking?.tax_percentage || 0,

        paid_amount: booking?.paid_amount || 0,

        due_amount: booking?.due_amount || 0,

        refund_amount: booking?.refund_amount || 0,

        registration_date: booking?.registration_date ? booking.registration_date.split("T")[0] : "",

        cancellation_date: booking?.cancellation_date ? booking.cancellation_date.split("T")[0] : "",

        commission_status: booking?.commission_status || "Pending",
        ...(isUpdate && { _method: 'put' })
    });

    useEffect(() => {
        const base = parseFloat(data.base_price) || 0;
        const discount = parseFloat(data.discount_amount) || 0;
        const other = parseFloat(data.other_amount) || 0;
        const taxPercent = parseFloat(data.tax_percentage) || 0;
        const booking = parseFloat(data.booking_amount) || 0;

        const subtotal = base - discount + other;
        const tax = (subtotal * taxPercent) / 100;
        const total = subtotal + tax;
        const due = total - booking;

        let commission = 0;

        if (data.channel_partner_id) {
            if (data.commission_type === "Percentage") {
                commission = (total * (parseFloat(data.commission_value) || 0)) / 100;
            } else {
                commission = parseFloat(data.commission_value) || 0;
            }
        }

        setData(prev => ({
            ...prev,
            tax_amount: tax.toFixed(2),
            total_amount: total.toFixed(2),
            paid_amount: booking.toFixed(2),
            due_amount: due.toFixed(2),
            commission_amount: commission.toFixed(2)
        }));

    }, [
        data.base_price,
        data.discount_amount,
        data.other_amount,
        data.tax_percentage,
        data.booking_amount,
        data.commission_type,
        data.commission_value,
        data.channel_partner_id
    ]);

    useEffect(() => {
        if (data.project_id) {
            setIsLoadingUnits(true);
            axios.get(`/api/projects/${data.project_id}/units`)
                .then(response => {
                    setProjectUnits(response.data);
                    if (!isUpdate) {
                        setSelectedUnit(null);
                        clearUnitData();
                    }
                })
                .catch(error => {
                    console.error("Error fetching units", error);
                    setProjectUnits([]);
                })
                .finally(() => {
                    setIsLoadingUnits(false);
                });
        } else {
            setProjectUnits([]);
            setSelectedUnit(null);
            clearUnitData();
        }
    }, [data.project_id]);

    const clearUnitData = () => {
        setData(prev => ({
            ...prev,
            unit_id: "",
            tower_name: "",
            floor_name: "",
            unit_name: "",
            unit_type: "",
            configuration: "",
            unit_size: "",
            unit_size_unit: "",
            property_type: "",
        }));
    }

    const handleUnitSelect = (_, unit) => {
        setSelectedUnit(unit);
        setData((prev) => ({
            ...prev,
            unit_id: unit.unit_id,
            tower_name: unit.tower_name || "",
            floor_name: unit.floor_name || "",
            unit_name: unit.unit_name || "",
            unit_type: unit.unit_type || "",
            property_type: unit.property_type || "",
            unit_size: unit.unit_size || "",
            unit_size_unit: unit.unit_size_unit || "Sq.Ft",
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.unit_id) {
            alert("Please select a Unit before saving the booking.");
            return;
        }
        post(submitUrl, { forceFormData: true });
    };

    return (
        <form onSubmit={submit} className="space-y-8 bg-gray-50 p-6 rounded-xl border border-gray-200" encType="multipart/form-data">

            {/* Section 1: Parties Involved */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-5">Parties Involved</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SelectGroup label="Customer *" name="customer_id" data={data} setData={setData} errors={errors} options={customers.map(c => ({ value: c.id, label: `${c.first_name} ${c.last_name}` }))} />
                    <SelectGroup label="Project *" name="project_id" data={data} setData={setData} errors={errors} options={projects.map(p => ({ value: p.id, label: p.name }))} />
                    <SelectGroup label="Channel Partner" name="channel_partner_id" data={data} setData={setData} errors={errors} options={channelPartners.map(cp => ({ value: cp.id, label: cp.partner_name }))} />
                    {currentRole !== 'employee' && (
                        <SelectGroup
                            label="Assigned User"
                            name="assigned_user_id"
                            data={data}
                            setData={setData}
                            errors={errors}
                            options={users.map(u => ({
                                value: u.id,
                                label: `${u.name} (${u.role})`
                            }))}
                        />
                    )}
                </div>
            </div>

            {/* Section 2: Unit Selection */}
            {data.project_id && (
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Select Unit</h3>
                            <p className="text-sm text-gray-500 mt-1">Choose an available unit for booking</p>
                        </div>
                        {isLoadingUnits && (
                            <div className="text-sm animate-pulse text-[#14B99F]">Loading Units...</div>
                        )}
                    </div>

                    {!isLoadingUnits && projectUnits.length === 0 && (
                        <div className="bg-gray-50 border rounded-xl p-12 text-center text-gray-500">
                            No Units Available
                        </div>
                    )}

                    {!isLoadingUnits && projectUnits.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {projectUnits.map((tower) => (
                                <div key={tower.tower_name} className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                                    <div className="bg-gradient-to-r from-[#14B99F] to-[#0EA88D] p-5">
                                        <h3 className="text-white font-bold text-lg">{tower.tower_name}</h3>
                                        <p className="text-[#E8F5F2] text-sm">{tower.floors?.length || 0} Floors</p>
                                    </div>
                                    <div className="p-5 max-h-[700px] overflow-y-auto space-y-8">
                                        {tower.floors?.map((floor) => (
                                            <div key={floor.floor_name} className="border rounded-xl p-4 bg-gray-50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-gray-700">Floor {floor.floor_name}</h4>
                                                    <span className="bg-[#14B99F]/10 text-[#14B99F] text-xs px-3 py-1 rounded-full">
                                                        {floor.units.length} Units
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {floor.units.map((unit) => {
                                                        const isSelected = data.unit_id === unit.unit_id;
                                                        const isBooked = ["booked", "sold"].includes(unit.status?.toLowerCase());
                                                        const isHold = unit.status?.toLowerCase() === "hold";
                                                        const isDisabled = ["booked", "sold", "hold"].includes(unit.status?.toLowerCase());

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={unit.unit_id}
                                                                disabled={isDisabled}
                                                                onClick={() => {
                                                                    if (!isDisabled) {
                                                                        handleUnitSelect(null, unit);
                                                                    }
                                                                }}
                                                                className={`
                                                                    relative
                                                                    rounded-xl
                                                                    border
                                                                    p-4
                                                                    transition-all
                                                                    duration-200
                                                                    text-center

                                                                    ${
                                                                        isSelected
                                                                        ? "border-[#14B99F] bg-[#14B99F]/10 shadow-lg scale-105"
                                                                        : ""
                                                                    }

                                                                    ${
                                                                        isBooked
                                                                        ? "bg-red-100 border-red-500 text-red-700 cursor-not-allowed opacity-80"
                                                                        : ""
                                                                    }

                                                                    ${
                                                                        isHold
                                                                        ? "bg-yellow-100 border-yellow-500 text-yellow-700 cursor-not-allowed opacity-80"
                                                                        : ""
                                                                    }

                                                                    ${
                                                                        !isSelected &&
                                                                        !isBooked &&
                                                                        !isHold
                                                                        ? "border-gray-200 bg-white hover:border-[#14B99F] hover:shadow-md"
                                                                        : ""
                                                                    }
                                                                `}
                                                            >
                                                                {isSelected && (
                                                                    <CheckCircleIcon
                                                                        className="
                                                                            w-6 h-6
                                                                            text-[#14B99F]
                                                                            absolute
                                                                            -top-2
                                                                            -right-2
                                                                            bg-white
                                                                            rounded-full
                                                                        "
                                                                    />
                                                                )}

                                                                <div className="font-bold text-lg">
                                                                    {unit.unit_name}
                                                                </div>

                                                                {unit.configuration && (
                                                                    <div className="text-xs mt-2">
                                                                        {unit.configuration}
                                                                    </div>
                                                                )}

                                                                {unit.unit_size && (
                                                                    <div className="mt-2 text-sm font-medium">
                                                                        {unit.unit_size}
                                                                        {" "}
                                                                        {unit.unit_size_unit}
                                                                    </div>
                                                                )}

                                                                <div className="mt-2 text-xs font-semibold">
                                                                    {
                                                                        isBooked
                                                                        ? "BOOKED"
                                                                        : isHold
                                                                        ? "HOLD"
                                                                        : "AVAILABLE"
                                                                    }
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.unit_id && <p className="text-red-500 mt-4 text-sm">{errors.unit_id}</p>}
                </div>
            )}

            {/* Section 3: Selected Unit Details */}
            {data.unit_id && selectedUnit && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-[#14B99F] px-6 py-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white">Selected Unit Details</h3>
                        </div>
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <DetailCard label="Unit Number" value={data.unit_name} />
                            <DetailCard label="Tower/Block" value={data.tower_name} />
                            <DetailCard label="Floor" value={data.floor_name || "Ground"} />
                            <DetailCard label="Size" value={`${data.unit_size} ${data.unit_size_unit}`} />
                            <DetailCard label="Property Types" value={data.property_type || "-"} />
                            <DetailCard label="Unit Type" value={data.unit_type || "-"} />
                        </div>
                    </div>
                </div>
            )}

            {/* Section 4: Key Dates */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-5">Key Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputGroup label="Booking Date *" name="booking_date" type="date" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Agreement Date" name="agreement_date" type="date" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Follow-up Date" name="followup_date" type="date" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Possession Date" name="possession_date" type="date" data={data} setData={setData} errors={errors} />
                    <InputGroup
                        label="Registration Date"
                        name="registration_date"
                        type="date"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                    
                    {/* Updated Logic: Show if Cancelled OR Refunded */}
                    {["Cancelled", "Refunded"].includes(data.status) && (
                        <InputGroup
                            label="Cancellation Date"
                            name="cancellation_date"
                            type="date"
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    )}
                </div>
            </div>

            {/* Section 5: Financials */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-bold mb-6">
                    Financial Details
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <InputGroup label="Base Price" name="base_price" type="number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Booking Amount" name="booking_amount" type="number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Discount" name="discount_amount" type="number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Other Charges" name="other_amount" type="number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Tax %" name="tax_percentage" type="number" data={data} setData={setData} errors={errors} />
                    <InputGroup label="Tax Amount" name="tax_amount" type="number" data={data} setData={() => { }} errors={errors} readOnly />
                    <InputGroup label="Total Amount" name="total_amount" type="number" data={data} setData={() => { }} errors={errors} readOnly />
                    <InputGroup label="Paid Amount" name="paid_amount" type="number" data={data} setData={() => { }} errors={errors} readOnly />
                    <InputGroup label="Due Amount" name="due_amount" type="number" data={data} setData={() => { }} errors={errors} readOnly />
                    <InputGroup label="Refund Amount" name="refund_amount" type="number" data={data} setData={setData} errors={errors} />
                    <SelectGroup
                        label="Payment Plan"
                        name="payment_plan"
                        data={data}
                        setData={setData}
                        errors={errors}
                        options={[
                            { value: "Construction Linked", label: "Construction Linked" },
                            { value: "Down Payment", label: "Down Payment" },
                            { value: "Flexi", label: "Flexi" },
                            { value: "Lumpsum", label: "Lumpsum" },
                            { value: "Custom", label: "Custom" }
                        ]}
                    />
                </div>
            </div>

            {/* Section: Live Commission Setup */}
            {data.channel_partner_id && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#14B99F]"></div>
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-5">Channel Partner Commission Setup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <SelectGroup
                            label="Commission Type"
                            name="commission_type"
                            data={data}
                            setData={setData}
                            errors={errors}
                            options={[
                                { value: "Percentage", label: "Percentage (%)" },
                                { value: "Fixed", label: "Fixed Amount (₹)" }
                            ]}
                        />
                        <InputGroup
                            label={`Commission Value ${data.commission_type === 'Percentage' ? '(%)' : '(₹)'}`}
                            name="commission_value"
                            type="number"
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                        <SelectGroup
                            label="Commission Status"
                            name="commission_status"
                            data={data}
                            setData={setData}
                            errors={errors}
                            options={[
                                { value: "Pending", label: "Pending" },
                                { value: "Approved", label: "Approved" },
                                { value: "Paid", label: "Paid" },
                                { value: "Cancelled", label: "Cancelled" }
                            ]}
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calculated Commission Amount</label>
                            <div className="w-full bg-[#14B99F]/10 border border-[#14B99F]/30 rounded-md px-3 py-2 text-[#14B99F] font-bold">
                                ₹ {data.commission_amount}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 6: Documents & Remarks */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-5">Documents & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <FileGroup label="Booking Form (PDF/Img)" name="booking_form" setData={setData} errors={errors} />
                    <FileGroup label="Agreement Document" name="agreement_document" setData={setData} errors={errors} />
                    <FileGroup label="Payment Receipt" name="payment_receipt" setData={setData} errors={errors} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Updated Status Options */}
                    <SelectGroup 
                        label="Booking Status *" 
                        name="status" 
                        data={data} 
                        setData={setData} 
                        errors={errors} 
                        options={[
                            // { value: "Enquiry", label: "Enquiry" },
                            // { value: "Hold", label: "Hold" },
                            { value: "Booked", label: "Booked" },
                            { value: "Agreement Done", label: "Agreement Done" },
                            { value: "Registered", label: "Registered" },
                            { value: "Completed", label: "Completed" },
                            { value: "Cancelled", label: "Cancelled" },
                            { value: "Refunded", label: "Refunded" }
                        ]} 
                    />
                    
                    {/* Updated Logic: Show if Cancelled OR Refunded */}
                    {["Cancelled", "Refunded"].includes(data.status) && (
                        <InputGroup 
                            label="Cancellation Reason" 
                            name="cancellation_reason" 
                            data={data} 
                            setData={setData} 
                            errors={errors} 
                        />
                    )}
                    
                    <div className="md:col-span-2">
                        <InputGroup label="Remarks / Notes" name="remarks" data={data} setData={setData} errors={errors} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <a href={route('bookings.index')} className="px-8 py-3 mr-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-semibold">Cancel</a>
                <button type="submit" disabled={processing} className="px-8 py-3 bg-[#14B99F] text-white font-bold rounded-lg hover:bg-[#0EA88D] disabled:opacity-50 transition shadow-md">
                    {processing ? 'Saving Booking...' : 'Save Booking'}
                </button>
            </div>
        </form>
    );
}