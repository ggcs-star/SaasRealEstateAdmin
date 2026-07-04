import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    MagnifyingGlassIcon, BanknotesIcon, CalendarDaysIcon,
    CheckBadgeIcon, ClockIcon, PlusIcon
} from "@heroicons/react/24/outline";

// Import Modals
import ReceivePaymentModal from '@/Components/ReceivePaymentModal';
import AddScheduleModal from '@/Components/AddScheduleModal';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0,
    }).format(amount || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};

const StatusBadge = ({ status, scheduledDate }) => {
    let colors = 'bg-gray-100 text-gray-700';
    let icon = null;
    let displayStatus = status;

    const isOverdue = status === 'Pending' && new Date(scheduledDate) < new Date();

    if (status === 'Paid') {
        colors = 'bg-green-100 text-green-700 border border-green-200';
        icon = <CheckBadgeIcon className="w-3.5 h-3.5 mr-1" />;
    } else if (isOverdue) {
        colors = 'bg-red-100 text-red-700 border border-red-200';
        icon = <ClockIcon className="w-3.5 h-3.5 mr-1" />;
        displayStatus = 'Overdue';
    } else if (status === 'Pending') {
        colors = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        icon = <ClockIcon className="w-3.5 h-3.5 mr-1" />;
    } else if (status === 'Partially Paid') {
        colors = 'bg-blue-100 text-blue-700 border border-blue-200';
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${colors}`}>
            {icon} {displayStatus || 'Unknown'}
        </span>
    );
};

export default function Index({ auth, collections, filters }) {

    // Modal States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const handleSearch = (e) => {
        router.get(
            route('collections.index'),
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const openPaymentModal = (collection) => {
        setSelectedCollection(collection);
        setIsPaymentModalOpen(true);
    };
    const [selectedBooking, setSelectedBooking] = useState(null);

    const openScheduleModal = (booking) => {
        setSelectedBooking(booking);
        setIsScheduleModalOpen(true);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Collections & Payments" />

            <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#14B99F]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <BanknotesIcon className="w-6 h-6 text-[#14B99F]" />
                            Collections Pipeline
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Track scheduled installments and received payments</p>
                    </div>

                    <div className="w-full sm:w-auto relative flex gap-3">
                        <div className="relative flex-grow sm:flex-grow-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                defaultValue={filters?.search}
                                placeholder="Search Receipt, Installment..."
                                className="pl-10 border-gray-300 rounded-xl p-2.5 w-full sm:w-64 shadow-sm focus:border-[#14B99F] focus:ring-[#14B99F] text-sm transition-all bg-gray-50 focus:bg-white"
                                onChange={handleSearch}
                            />
                        </div>

                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="p-4 pl-6">Receipt / Installment</th>
                                    <th className="p-4">Customer Details</th>
                                    <th className="p-4">Schedule Info</th>
                                    <th className="p-4">Payment Info</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {collections.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <BanknotesIcon className="w-12 h-12 text-gray-300 mb-3" />
                                                <p className="text-base font-medium">No collections found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    collections.data.map((collection) => (
                                        <tr key={collection.id} className={`hover:bg-gray-50/50 transition-colors ${collection.status === 'Paid' ? 'bg-green-50/20' : ''}`}>
                                            <td className="p-4 pl-6">
                                                {collection.type === 'Actual_Payment' ? (
                                                    <div>
                                                        <div className="font-bold text-[#14B99F] text-sm">
                                                            {collection.receipt_number || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">Receipt Generated</div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="font-semibold text-gray-800 text-sm truncate max-w-[150px]" title={collection.installment_name}>
                                                            {collection.installment_name || 'Scheduled Payment'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5 italic">Scheduled Plan</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900 capitalize truncate max-w-[180px]">
                                                    {collection.customer?.first_name} {collection.customer?.last_name}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-1 truncate max-w-[180px]">
                                                    <span className="font-medium text-gray-700">{collection.project?.name}</span> • #{collection.booking?.booking_number}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-700">
                                                    {formatCurrency(collection.scheduled_amount)}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                                    <CalendarDaysIcon className="w-3.5 h-3.5 mr-1" />
                                                    {formatDate(collection.scheduled_date)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {collection.status === 'Paid' ? (
                                                    <>
                                                        <div className="font-bold text-green-600">
                                                            {formatCurrency(collection.paid_amount)}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                                            {collection.payment_mode || 'Paid'} • {formatDate(collection.payment_date)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">- Awaiting Payment -</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={collection.status} scheduledDate={collection.scheduled_date} />
                                            </td>
                                            <td className="p-4 text-center pr-6">
                                                <div className="flex gap-2 justify-center">

                                                    <button
                                                        onClick={() => openScheduleModal(collection.booking)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                                    >
                                                        Schedule
                                                    </button>

                                                    {collection.status === "Pending" && (

                                                        <button
                                                            onClick={() => openPaymentModal(collection)}
                                                            className="px-3 py-1 bg-[#14B99F] text-white rounded"
                                                        >
                                                            Receive
                                                        </button>

                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Mount Modals */}
            <ReceivePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                selectedCollection={selectedCollection}
            />

            <AddScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                selectedBooking={selectedBooking}
            />

        </AuthenticatedLayout>
    );
}