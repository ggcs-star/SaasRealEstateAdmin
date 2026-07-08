import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    UserIcon, BuildingOfficeIcon, CalendarIcon,
    BanknotesIcon, DocumentTextIcon, UserGroupIcon,
    ArrowLeftIcon, PencilSquareIcon, PlusIcon, XMarkIcon, ClockIcon, CheckBadgeIcon
} from "@heroicons/react/24/outline";
import AddScheduleModal from '@/Components/AddScheduleModal';
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};

const DetailRow = ({ label, value, isBold = false, highlight = false }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className={`text-sm text-right ${isBold ? 'font-bold text-gray-800' : 'text-gray-700'} ${highlight ? 'text-[#14B99F] font-bold' : ''}`}>
            {value || '-'}
        </span>
    </div>
);

const StatusBadge = ({ status }) => {
    let colors = 'bg-gray-100 text-gray-700';
    if (status === 'Confirmed' || status === 'Paid' || status === 'Completed') colors = 'bg-green-100 text-green-700';
    else if (status === 'Pending' || status === 'Partially Paid') colors = 'bg-yellow-100 text-yellow-700';
    else if (status === 'Cancelled' || status === 'Overdue') colors = 'bg-red-100 text-red-700';

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors}`}>
            {status || 'Unknown'}
        </span>
    );
};

export default function Show({ auth, booking }) {

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const { data: scheduleData, setData: setScheduleData, post: postSchedule, processing: processingSchedule, errors: scheduleErrors, reset: resetSchedule, clearErrors: clearScheduleErrors } = useForm({
        booking_id: booking.id || booking._id,
        installment_name: '',
        scheduled_date: '',
        scheduled_amount: '',
        remarks: ''
    });

    const openScheduleModal = () => setIsScheduleModalOpen(true);
    const closeScheduleModal = () => {
        setIsScheduleModalOpen(false);
        setTimeout(() => {
            resetSchedule();
            clearScheduleErrors();
        }, 300);
    };

    const submitSchedule = (e) => {
        e.preventDefault();
        postSchedule(route('collections.store'), {
            preserveScroll: true,
            onSuccess: () => closeScheduleModal(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Booking ${booking.booking_number}`} />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Link href={route('bookings.index')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                {booking.booking_number}
                                <StatusBadge status={booking.status} />
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Booked on {formatDate(booking.booking_date)}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <Link
                            href={route('bookings.edit', booking.id)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#14B99F] text-white font-semibold rounded-lg hover:bg-[#0ea88d] transition shadow-md"
                        >
                            <PencilSquareIcon className="w-5 h-5" />
                            Edit Booking
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Customer & Project Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg"><UserIcon className="w-5 h-5 text-blue-600" /></div>
                                    <h3 className="text-lg font-bold text-gray-800">Customer Details</h3>
                                </div>
                                {booking.customer ? (
                                    <>
                                        <div className="font-bold text-lg text-gray-800 mb-1 capitalize">
                                            {booking.customer.first_name} {booking.customer.last_name}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">{booking.customer.mobile} {booking.customer.alternate_mobile ? ` / ${booking.customer.alternate_mobile}` : ''}</p>
                                        <DetailRow label="Email" value={booking.customer.email} />
                                        <DetailRow label="Gender" value={booking.customer.gender} />
                                        <DetailRow label="DOB" value={formatDate(booking.customer.dob)} />
                                        <DetailRow label="Marital Status" value={booking.customer.marital_status} />
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm">No Customer Linked</p>
                                )}
                            </div>

                            {/* Project & Unit Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                    <div className="p-2 bg-purple-50 rounded-lg"><BuildingOfficeIcon className="w-5 h-5 text-purple-600" /></div>
                                    <h3 className="text-lg font-bold text-gray-800">Project & Unit</h3>
                                </div>
                                <div className="font-bold text-lg text-gray-800 mb-1">
                                    {booking.project?.name || '-'}
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Unit: <span className="font-bold text-[#14B99F]">{booking.unit_name}</span></p>

                                <DetailRow label="Tower / Block" value={booking.tower_name?.toUpperCase()} />
                                <DetailRow label="Floor" value={booking.floor_name} />
                                <DetailRow label="Property Type" value={booking.property_type?.toUpperCase()} />
                                <DetailRow label="Configuration" value={booking.unit_type?.toUpperCase()} />
                                <DetailRow label="Size" value={`${booking.unit_size || ''} ${booking.unit_size_unit || ''}`} />
                            </div>
                        </div>

                        {/* --- NEW SECTION: PAYMENT SCHEDULES (COLLECTIONS) --- */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#14B99F]"></div>
                            <div className="flex items-center justify-between border-b pb-3 mb-4 mt-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#14B99F]/10 rounded-lg"><BanknotesIcon className="w-5 h-5 text-[#14B99F]" /></div>
                                    <h3 className="text-lg font-bold text-gray-800">Payment Schedules</h3>
                                </div>
                                <button
                                    onClick={() => setIsScheduleModalOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#14B99F]/10 text-[#14B99F] hover:bg-[#14B99F] hover:text-white rounded-lg font-semibold text-sm transition"
                                >
                                    <PlusIcon className="w-4 h-4" /> Add Schedule
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                                        <tr>
                                            <th className="p-3">Installment Name</th>
                                            <th className="p-3">Scheduled Date</th>
                                            <th className="p-3 text-right">Amount</th>
                                            <th className="p-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {!booking.collections || booking.collections.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-gray-400 italic">
                                                    No payment schedules created yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            booking.collections.map((col) => (
                                                <tr key={col.id || col._id} className="hover:bg-gray-50">
                                                    <td className="p-3 font-medium text-gray-800">{col.installment_name || 'Scheduled Payment'}</td>
                                                    <td className="p-3 flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                        {formatDate(col.scheduled_date)}
                                                    </td>
                                                    <td className="p-3 text-right font-bold">{formatCurrency(col.scheduled_amount)}</td>
                                                    <td className="p-3 text-center">
                                                        <StatusBadge status={col.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 2. Key Dates */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-orange-50 rounded-lg"><CalendarIcon className="w-5 h-5 text-orange-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Key Dates</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Booking Date</p>
                                    <p className="font-semibold text-gray-800">{formatDate(booking.booking_date)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Agreement Date</p>
                                    <p className="font-semibold text-gray-800">{formatDate(booking.agreement_date)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Registration Date</p>
                                    <p className="font-semibold text-gray-800">{formatDate(booking.registration_date)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Possession Date</p>
                                    <p className="font-semibold text-gray-800">{formatDate(booking.possession_date)}</p>
                                </div>
                                {booking.status === 'Cancelled' && (
                                    <div className="col-span-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                        <p className="text-xs text-red-500 uppercase mb-1">Cancellation Date</p>
                                        <p className="font-bold text-red-700">{formatDate(booking.cancellation_date)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Remarks & Details */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg"><DocumentTextIcon className="w-5 h-5 text-gray-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Additional Notes</h3>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700">Remarks</h4>
                                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg border">
                                    {booking.remarks || 'No remarks added.'}
                                </p>
                            </div>
                            {booking.status === 'Cancelled' && (
                                <div>
                                    <h4 className="text-sm font-semibold text-red-700">Cancellation Reason</h4>
                                    <p className="text-sm text-red-600 mt-1 bg-red-50 p-3 rounded-lg border border-red-100">
                                        {booking.cancellation_reason || 'Reason not provided.'}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column (Sidebar for Financials & Partners) */}
                    <div className="space-y-6">

                        {/* Financial Summary */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#14B99F]/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#14B99F]"></div>
                            <div className="flex items-center gap-3 border-b pb-3 mb-4 mt-2">
                                <div className="p-2 bg-[#14B99F]/10 rounded-lg"><BanknotesIcon className="w-5 h-5 text-[#14B99F]" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Financial Summary</h3>
                            </div>

                            <div className="space-y-1 mb-4">
                                <DetailRow label="Base Price" value={formatCurrency(booking.base_price)} />
                                <DetailRow label={`Tax (${booking.tax_percentage || 0}%)`} value={`+ ${formatCurrency(booking.tax_amount)}`} />
                                <DetailRow label="Other Charges" value={`+ ${formatCurrency(booking.other_amount)}`} />
                                <DetailRow label="Discount" value={`- ${formatCurrency(booking.discount_amount)}`} />
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-gray-700">Total Amount</span>
                                    <span className="text-lg font-black text-[#14B99F]">{formatCurrency(booking.total_amount)}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <DetailRow label="Booking Amount" value={formatCurrency(booking.booking_amount)} />
                                <DetailRow label="Total Paid" value={formatCurrency(booking.paid_amount)} highlight />
                                <DetailRow label="Amount Due" value={formatCurrency(booking.due_amount)} isBold />
                                {booking.refund_amount > 0 && (
                                    <DetailRow label="Refund Amount" value={formatCurrency(booking.refund_amount)} />
                                )}
                            </div>

                            <div className="mt-5 pt-4 border-t flex justify-between items-center">
                                <span className="text-sm text-gray-600">Payment Plan</span>
                                <span className="text-sm font-semibold">{booking.payment_plan || '-'}</span>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-sm text-gray-600">Payment Status</span>
                                <StatusBadge status={booking.payment_status} />
                            </div>
                        </div>

                        {/* Channel Partner & Commission */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-pink-50 rounded-lg"><UserGroupIcon className="w-5 h-5 text-pink-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Channel Partner</h3>
                            </div>

                            {booking.channel_partner ? (
                                <>
                                    <div className="mb-4">
                                        <p className="font-bold text-gray-800">{booking.channel_partner.partner_name}</p>
                                        <p className="text-sm text-gray-500">Code: {booking.channel_partner.partner_code}</p>
                                        <p className="text-xs text-gray-400 mt-1">{booking.channel_partner.email} | {booking.channel_partner.contact_number}</p>
                                    </div>
                                    <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                                        <DetailRow label="Comm. Type" value={booking.commission_type} />
                                        <DetailRow label="Comm. Value" value={booking.commission_type === 'Percentage' ? `${booking.commission_value}%` : formatCurrency(booking.commission_value)} />
                                        <DetailRow label="Comm. Amount" value={formatCurrency(booking.commission_amount)} isBold />
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-pink-200">
                                            <span className="text-sm text-gray-600">Payout Status</span>
                                            <StatusBadge status={booking.commission_status} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-4">Direct Booking (No Channel Partner)</p>
                            )}
                        </div>

                        {/* Assigned User */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg"><UserIcon className="w-5 h-5 text-blue-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Assigned To</h3>
                            </div>
                            {booking.assigned_user ? (
                                <div>
                                    <p className="font-bold text-gray-800 capitalize">{booking.assigned_user.name}</p>
                                    <p className="text-sm text-gray-500">{booking.assigned_user.role}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Not Assigned</p>
                            )}
                        </div>

                        {/* Documents */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-teal-50 rounded-lg"><DocumentTextIcon className="w-5 h-5 text-teal-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Documents</h3>
                            </div>

                            <div className="space-y-3">
                                {booking.booking_form ? (
                                    <a href={`/storage/${booking.booking_form}`} target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:border-[#14B99F] transition group">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-[#14B99F]" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#14B99F]">Booking Form</span>
                                    </a>
                                ) : <p className="text-xs text-gray-400">No Booking Form uploaded</p>}

                                {booking.agreement_document ? (
                                    <a href={`/storage/${booking.agreement_document}`} target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:border-[#14B99F] transition group">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-[#14B99F]" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#14B99F]">Agreement Document</span>
                                    </a>
                                ) : <p className="text-xs text-gray-400">No Agreement uploaded</p>}

                                {booking.payment_receipt ? (
                                    <a href={`/storage/${booking.payment_receipt}`} target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:border-[#14B99F] transition group">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-[#14B99F]" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#14B99F]">Payment Receipt</span>
                                    </a>
                                ) : <p className="text-xs text-gray-400">No Receipt uploaded</p>}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center text-xs text-gray-400 py-4">
                    Created On {formatDate(booking.created_at)} • Last Updated On {formatDate(booking.updated_at)}
                </div>
            </div>

            <AddScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                selectedBooking={booking}
            />

        </AuthenticatedLayout>
    );
}