import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    UserGroupIcon, BanknotesIcon, BuildingOfficeIcon, 
    CreditCardIcon, ClipboardDocumentCheckIcon, ArrowLeftIcon
} from "@heroicons/react/24/outline";

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

const DetailRow = ({ label, value, isBold = false, highlightColor = '' }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className={`text-sm text-right ${isBold ? 'font-bold' : 'font-medium'} ${highlightColor ? highlightColor : 'text-gray-800'}`}>
            {value || '-'}
        </span>
    </div>
);

const StatusBadge = ({ status }) => {
    let colors = 'bg-gray-100 text-gray-700';
    if (status === 'Paid' || status === 'Approved' || status === 'Completed') colors = 'bg-green-100 text-green-700';
    else if (status === 'Pending') colors = 'bg-yellow-100 text-yellow-700';
    else if (status === 'Partially Paid') colors = 'bg-blue-100 text-blue-700';
    else if (status === 'Rejected' || status === 'Cancelled') colors = 'bg-red-100 text-red-700';

    return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors}`}>{status || 'Unknown'}</span>;
};

export default function Show({ auth, commission }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Commission Details - ${commission.booking_number}`} />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Link href={route('commissions.index')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition">
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                Commission #{commission.booking_number}
                                <StatusBadge status={commission.status || 'Pending'} />
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Generated on {formatDate(commission.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column - 2 Spans */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Partner & Booking Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Channel Partner Details */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                    <div className="p-2 bg-pink-50 rounded-lg"><UserGroupIcon className="w-5 h-5 text-pink-600" /></div>
                                    <h3 className="text-lg font-bold text-gray-800">Channel Partner</h3>
                                </div>
                                {commission.channel_partner ? (
                                    <>
                                        <div className="font-bold text-lg text-gray-800 mb-1">{commission.channel_partner.partner_name}</div>
                                        <p className="text-sm text-gray-600 mb-4">Code: {commission.channel_partner.partner_code}</p>
                                        <DetailRow label="Contact" value={commission.channel_partner.contact_number} />
                                        <DetailRow label="Email" value={commission.channel_partner.email} />
                                        <DetailRow label="Company" value={commission.channel_partner.company_name} />
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm">Partner Details Unavailable</p>
                                )}
                            </div>

                            {/* Booking & Project Details */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                    <div className="p-2 bg-purple-50 rounded-lg"><BuildingOfficeIcon className="w-5 h-5 text-purple-600" /></div>
                                    <h3 className="text-lg font-bold text-gray-800">Project & Booking</h3>
                                </div>
                                <div className="font-bold text-lg text-gray-800 mb-1">{commission.project?.name || '-'}</div>
                                <p className="text-sm text-gray-600 mb-4">Booking Ref: <span className="font-mono text-purple-600 font-bold">{commission.booking_number}</span></p>
                                
                                <DetailRow label="Customer" value={commission.customer ? `${commission.customer.first_name} ${commission.customer.last_name || ''}` : '-'} />
                                <DetailRow label="Total Sale Amount" value={formatCurrency(commission.total_sale_amount)} isBold />
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg"><CreditCardIcon className="w-5 h-5 text-blue-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Payout Details</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <DetailRow label="Payment Status" value={<StatusBadge status={commission.payment_status} />} />
                                <DetailRow label="Payment Date" value={formatDate(commission.payment_date)} />
                                <DetailRow label="Payment Mode" value={commission.payment_mode} />
                                <DetailRow label="Transaction Number" value={commission.transaction_number} />
                                <DetailRow label="Bank Name" value={commission.bank_name} />
                            </div>
                        </div>

                        {/* Approvals & Remarks */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 border-b pb-3 mb-4">
                                <div className="p-2 bg-orange-50 rounded-lg"><ClipboardDocumentCheckIcon className="w-5 h-5 text-orange-600" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Approvals & Notes</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                                <DetailRow label="Approved By" value={commission.approved_by_user?.name || 'Pending Approval'} />
                                <DetailRow label="Paid By" value={commission.paid_by_user?.name || '-'} />
                                <DetailRow label="Created By" value={commission.created_by_user?.name || '-'} />
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Remarks</h4>
                                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {commission.remarks || 'No remarks added.'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Financial Summary Widget */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#14B99F]/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#14B99F]"></div>
                            <div className="flex items-center gap-3 border-b pb-3 mb-4 mt-2">
                                <div className="p-2 bg-[#14B99F]/10 rounded-lg"><BanknotesIcon className="w-5 h-5 text-[#14B99F]" /></div>
                                <h3 className="text-lg font-bold text-gray-800">Commission Summary</h3>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-gray-700">Total Commission</span>
                                    <span className="text-xl font-black text-[#14B99F]">{formatCurrency(commission.commission_amount)}</span>
                                </div>
                                <div className="text-xs text-gray-500 text-right mt-1">
                                    {commission.commission_type === 'Percentage' 
                                        ? `Calculated at ${commission.commission_value}%` 
                                        : 'Fixed Amount'}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <DetailRow 
                                    label="Amount Paid" 
                                    value={formatCurrency(commission.paid_amount)} 
                                    isBold 
                                    highlightColor="text-green-600" 
                                />
                                <div className="border-t border-gray-200 pt-3">
                                    <DetailRow 
                                        label="Amount Due" 
                                        value={formatCurrency(commission.due_amount)} 
                                        isBold 
                                        highlightColor={commission.due_amount > 0 ? "text-red-600" : "text-gray-400"} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}