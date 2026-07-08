import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Format currency helper
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0,
    }).format(amount || 0);
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    let colors = 'bg-gray-100 text-gray-700';
    if (status === 'Paid' || status === 'Approved' || status === 'Completed') colors = 'bg-green-100 text-green-700';
    else if (status === 'Pending') colors = 'bg-yellow-100 text-yellow-700';
    else if (status === 'Partially Paid') colors = 'bg-blue-100 text-blue-700';
    else if (status === 'Rejected' || status === 'Cancelled') colors = 'bg-red-100 text-red-700';

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${colors}`}>
            {status || 'Unknown'}
        </span>
    );
};

export default function Index({ auth, commissions, filters }) {
    
    // Search Handler
    const handleSearch = (e) => {
        router.get(
            route('commissions.index'), 
            { search: e.target.value }, 
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Commissions Management" />

            <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Commissions</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage channel partner payouts and dues</p>
                    </div>

                    <div className="w-full sm:w-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            defaultValue={filters.search}
                            placeholder="Search by Partner or Booking No..."
                            className="pl-10 border-gray-300 rounded-xl p-2.5 w-full sm:w-80 shadow-sm focus:border-[#14B99F] focus:ring-[#14B99F] text-sm transition-all"
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-50/80 text-gray-500 uppercase text-[11px] tracking-wider font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="p-4 pl-6">Channel Partner</th>
                                    <th className="p-4">Project & Booking</th>
                                    <th className="p-4 text-right">Commission Amt</th>
                                    <th className="p-4 text-right">Due Amt</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {commissions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-base font-medium">No commissions found.</p>
                                                <p className="text-sm mt-1">Try adjusting your search filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    commissions.data.map((commission) => (
                                        <tr key={commission.id} className="hover:bg-gray-50/50 transition-colors">
                                            
                                            {/* Channel Partner Col */}
                                            <td className="p-4 pl-6">
                                                <div className="font-bold text-gray-900 truncate max-w-[200px]" title={commission.channel_partner?.partner_name}>
                                                    {commission.channel_partner?.partner_name || 'N/A'}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-0.5">
                                                    {commission.channel_partner?.partner_code || '-'}
                                                </div>
                                            </td>

                                            {/* Project & Booking Col */}
                                            <td className="p-4">
                                                {/* Fallback to checking booking relation if direct project is null */}
                                                <div className="font-medium text-gray-800 truncate max-w-[200px]" title={commission.project?.name || commission.booking?.project?.name}>
                                                    {commission.project?.name || commission.booking?.project?.name || '-'}
                                                </div>
                                                <div className="text-[#14B99F] font-bold text-xs mt-0.5">
                                                    #{commission.booking?.booking_number || 'N/A'}
                                                </div>
                                            </td>

                                            {/* Commission Amount Col */}
                                            <td className="p-4 text-right">
                                                <div className="font-bold text-gray-900">
                                                    {formatCurrency(commission.commission_amount)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {commission.commission_type === 'Percentage' 
                                                        ? `${commission.commission_value}%` 
                                                        : 'Fixed'}
                                                </div>
                                            </td>

                                            {/* Due Amount Col */}
                                            <td className="p-4 text-right">
                                                <div className={`font-bold ${
                                                    (commission.due_amount || commission.commission_amount) > 0 
                                                        ? 'text-red-600' 
                                                        : 'text-green-600'
                                                }`}>
                                                    {/* Agar due amount 0 se bada hai, ya fir explicitly update nahi hua to total commission ko hi due maante hain fallback ke roop me */}
                                                    {formatCurrency(commission.due_amount !== undefined ? commission.due_amount : commission.commission_amount)}
                                                </div>
                                            </td>

                                            {/* Status Col */}
                                            <td className="p-4 text-center">
                                                <StatusBadge status={commission.payment_status} />
                                            </td>

                                            {/* Action Col */}
                                            <td className="p-4 text-center pr-6">
                                                <Link 
                                                    href={route('commissions.show', commission.id)} 
                                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-[#14B99F] hover:text-[#14B99F] hover:bg-[#14B99F]/5 transition-all font-medium text-xs shadow-sm"
                                                >
                                                    <EyeIcon className="w-4 h-4" /> 
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Basic Pagination Wrapper (Replace with your actual Pagination component if you have one) */}
                    {commissions.data.length > 0 && commissions.links && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Showing <span className="font-medium text-gray-900">{commissions.from}</span> to <span className="font-medium text-gray-900">{commissions.to}</span> of <span className="font-medium text-gray-900">{commissions.total}</span> results
                            </span>
                            {/* Insert your pagination links mapping here */}
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}