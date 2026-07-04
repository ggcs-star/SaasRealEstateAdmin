import { useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    XMarkIcon,
    PlusIcon,
    TrashIcon,
    CalculatorIcon,
    CalendarDaysIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0,
    }).format(amount || 0);
};

export default function AddScheduleModal({ isOpen, onClose, selectedBooking }) {

    if (!selectedBooking) return null;
    const totalBookingAmount = selectedBooking.total_amount || 0;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({

        booking_id: selectedBooking.id,

        customer_id: selectedBooking.customer_id,

        project_id: selectedBooking.project_id,
        deleted_ids: [],
        schedules:
            selectedBooking.collections?.length

                ?

                selectedBooking.collections.map(item => ({

                    id: item.id,

                    installment_name: item.installment_name,

                    scheduled_date:
                        item.scheduled_date
                            ? item.scheduled_date.substring(0, 10)
                            : "",

                    scheduled_amount: item.scheduled_amount,

                    remarks: item.remarks ?? ""

                }))

                :

                [

                    {

                        installment_name: "Down Payment",

                        scheduled_date: "",

                        scheduled_amount: "",

                        remarks: ""

                    }

                ]

    });
    useEffect(() => {

        if (!selectedBooking) return;

        setData({

            booking_id: selectedBooking.id,

            customer_id: selectedBooking.customer_id,

            project_id: selectedBooking.project_id,

            deleted_ids: [],

            schedules:
                selectedBooking.collections?.length

                    ? selectedBooking.collections.map(item => ({

                        id: item.id,

                        installment_name: item.installment_name,

                        scheduled_date: item.scheduled_date
                            ? item.scheduled_date.substring(0, 10)
                            : "",

                        scheduled_amount: item.scheduled_amount,

                        remarks: item.remarks ?? ""

                    }))

                    : [

                        {

                            installment_name: "Down Payment",

                            scheduled_date: "",

                            scheduled_amount: "",

                            remarks: ""

                        }

                    ]

        });

    }, [selectedBooking]);
    const [totalScheduled, setTotalScheduled] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(totalBookingAmount);

    useEffect(() => {
        const sum = data.schedules.reduce((acc, curr) => {
            const amt = parseFloat(curr.scheduled_amount) || 0;
            return acc + amt;
        }, 0);

        setTotalScheduled(sum);
        setRemainingAmount(totalBookingAmount - sum);
    }, [data.schedules, totalBookingAmount]);

    const addScheduleRow = () => {
        setData('schedules', [
            ...data.schedules,
            { installment_name: "", scheduled_date: "", scheduled_amount: "", remarks: "" }
        ]);
    };

    const removeScheduleRow = (index) => {

        const row = data.schedules[index];

        let ids = [...data.deleted_ids];

        if (row.id) {

            ids.push(row.id);

        }

        setData({

            ...data,

            deleted_ids: ids,

            schedules: data.schedules.filter((_, i) => i !== index),

        });

    }

    const updateScheduleField = (index, field, value) => {
        const updatedSchedules = [...data.schedules];
        updatedSchedules[index][field] = value;
        setData('schedules', updatedSchedules);
    };
    const submit = (e) => {
        e.preventDefault();

        if (remainingAmount < 0) {
            alert("Warning: Scheduled amount exceeds the total booking amount!");
            return;
        }

        post(route("collections.storeBulk"), {

            preserveScroll: true,

            onSuccess: () => {

                reset();

                clearErrors();

                onClose();

            }

        });
    };
    const handleClose = () => {

        reset();

        clearErrors();

        onClose();

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all overflow-hidden">

                {/* Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-[#14B99F]" /> Setup Payment Plan
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Booking #{selectedBooking.booking_number}</p>
                    </div>
                    <button onClick={handleClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Body (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-grow bg-gray-50">

                    {/* Summary Bar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CalculatorIcon className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Total Booking Amount</p>
                                <p className="text-lg font-black text-gray-800">{formatCurrency(totalBookingAmount)}</p>
                            </div>
                        </div>

                        <div className="hidden md:block h-10 w-px bg-gray-200"></div>

                        <div className="text-center md:text-left">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Total Scheduled</p>
                            <p className="text-lg font-bold text-[#14B99F]">{formatCurrency(totalScheduled)}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Remaining to Schedule</p>
                            <p className={`text-lg font-bold ${remainingAmount < 0 ? 'text-red-600' : 'text-orange-500'}`}>
                                {formatCurrency(remainingAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Form Rows */}
                    <form id="bulk-schedule-form" onSubmit={submit} className="space-y-4">

                        {/* Table Header (Visible only on large screens) */}
                        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-gray-100 rounded-t-lg border border-gray-200 border-b-0 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <div className="col-span-3">Installment Name *</div>
                            <div className="col-span-3">Due Date *</div>
                            <div className="col-span-3">Amount (₹) *</div>
                            <div className="col-span-2">Remarks</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>

                        {/* Rows */}
                        <div className="bg-white border border-gray-200 rounded-b-lg rounded-t-none md:rounded-t-none rounded-lg divide-y divide-gray-100">
                            {data.schedules.map((schedule, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 items-start relative group">

                                    <div className="md:col-span-3">
                                        <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Installment Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1st Slab"
                                            value={schedule.installment_name}
                                            onChange={e => updateScheduleField(index, 'installment_name', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] text-sm"
                                            required
                                        />
                                        {errors[`schedules.${index}.installment_name`] && <p className="text-red-500 text-[10px] mt-1">{errors[`schedules.${index}.installment_name`]}</p>}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={schedule.scheduled_date}
                                            onChange={e => updateScheduleField(index, 'scheduled_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] text-sm"
                                            required
                                        />
                                        {errors[`schedules.${index}.scheduled_date`] && <p className="text-red-500 text-[10px] mt-1">{errors[`schedules.${index}.scheduled_date`]}</p>}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm font-medium">₹</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={schedule.scheduled_amount}
                                                onChange={e => updateScheduleField(index, 'scheduled_amount', e.target.value)}
                                                className="w-full pl-7 border-gray-300 rounded-md shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] text-sm"
                                                required
                                            />
                                        </div>
                                        {errors[`schedules.${index}.scheduled_amount`] && <p className="text-red-500 text-[10px] mt-1">{errors[`schedules.${index}.scheduled_amount`]}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Remarks</label>
                                        <input
                                            type="text"
                                            placeholder="Notes..."
                                            value={schedule.remarks}
                                            onChange={e => updateScheduleField(index, 'remarks', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] text-sm text-gray-600 bg-gray-50"
                                        />
                                    </div>

                                    <div className="md:col-span-1 flex justify-center items-center h-full pt-6 md:pt-0">
                                        <button
                                            type="button"
                                            onClick={() => removeScheduleRow(index)}
                                            disabled={data.schedules.length === 1}
                                            className={`p-2 rounded-md transition ${data.schedules.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:bg-red-50 hover:text-red-600'}`}
                                            title="Remove Installment"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Add Row Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={addScheduleRow}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition border border-blue-100 border-dashed"
                            >
                                <PlusIcon className="w-4 h-4" /> Add Another Installment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                    <p className={`text-xs font-semibold ${remainingAmount < 0 ? 'text-red-500' : (remainingAmount === 0 ? 'text-green-600' : 'text-gray-500')}`}>
                        {remainingAmount < 0
                            ? 'Warning: Over-scheduled!'
                            : (remainingAmount === 0 ? 'Perfectly Scheduled!' : 'Still need to schedule amount.')}
                    </p>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="bulk-schedule-form"
                            disabled={processing || data.schedules.length === 0}
                            className="px-6 py-2 bg-[#14B99F] text-white hover:bg-[#0EA88D] rounded-lg font-bold shadow-md transition disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save All Schedules'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}