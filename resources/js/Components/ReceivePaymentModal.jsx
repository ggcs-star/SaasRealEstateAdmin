import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";

// Helper: Format Currency locally for display
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0,
    }).format(amount || 0);
};

export default function ReceivePaymentModal({ isOpen, onClose, selectedCollection }) {
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        payment_date: new Date().toISOString().split('T')[0],
        paid_amount: "",
        payment_mode: "NEFT/RTGS",
        transaction_number: "",
        cheque_number: "",
        bank_name: "",
        branch_name: "",
        payment_receipt: null,
        remarks: ""
    });

    // Populate data when a collection is selected
    useEffect(() => {
        if (selectedCollection) {
            setData({
                payment_date: new Date().toISOString().split('T')[0],
                paid_amount: selectedCollection.scheduled_amount || "",
                payment_mode: "NEFT/RTGS",
                transaction_number: "",
                cheque_number: "",
                bank_name: "",
                branch_name: "",
                payment_receipt: null,
                remarks: ""
            });
        }
    }, [selectedCollection]);

    const submitPayment = (e) => {
        e.preventDefault();
        if(!selectedCollection) return;

        post(route('collections.receive-payment', selectedCollection.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    if (!isOpen || !selectedCollection) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                
                {/* Modal Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Receive Payment</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            For {selectedCollection.installment_name} • Due: <span className="font-bold text-[#14B99F]">{formatCurrency(selectedCollection.scheduled_amount)}</span>
                        </p>
                    </div>
                    <button onClick={handleClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body Form */}
                <form onSubmit={submitPayment} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Amount Received (₹) *</label>
                            <input 
                                type="number" 
                                value={data.paid_amount}
                                onChange={e => setData('paid_amount', e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                required
                            />
                            {errors.paid_amount && <p className="text-red-500 text-xs mt-1">{errors.paid_amount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Date *</label>
                            <input 
                                type="date" 
                                value={data.payment_date}
                                onChange={e => setData('payment_date', e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                required
                            />
                            {errors.payment_date && <p className="text-red-500 text-xs mt-1">{errors.payment_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Mode *</label>
                            <select 
                                value={data.payment_mode}
                                onChange={e => setData('payment_mode', e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                required
                            >
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                                <option value="NEFT/RTGS">NEFT / RTGS</option>
                                <option value="UPI">UPI</option>
                            </select>
                            {errors.payment_mode && <p className="text-red-500 text-xs mt-1">{errors.payment_mode}</p>}
                        </div>

                        {data.payment_mode === 'Cheque' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Number *</label>
                                    <input 
                                        type="text" 
                                        value={data.cheque_number}
                                        onChange={e => setData('cheque_number', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                                    <input 
                                        type="text" 
                                        value={data.bank_name}
                                        onChange={e => setData('bank_name', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                    <input 
                                        type="text" 
                                        value={data.branch_name}
                                        onChange={e => setData('branch_name', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                    />
                                </div>
                            </>
                        )}

                        {(data.payment_mode === 'UPI' || data.payment_mode === 'NEFT/RTGS') && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / Reference No. *</label>
                                <input 
                                    type="text" 
                                    value={data.transaction_number}
                                    onChange={e => setData('transaction_number', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt / Screenshot (Optional)</label>
                            <input 
                                type="file" 
                                onChange={e => setData('payment_receipt', e.target.files[0])}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#14B99F]/10 file:text-[#14B99F] hover:file:bg-[#14B99F]/20"
                            />
                            {errors.payment_receipt && <p className="text-red-500 text-xs mt-1">{errors.payment_receipt}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Note</label>
                            <textarea 
                                value={data.remarks}
                                onChange={e => setData('remarks', e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] min-h-[80px]"
                                placeholder="Add any internal note here..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button type="button" onClick={handleClose} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-[#14B99F] text-white hover:bg-[#0EA88D] rounded-lg font-bold shadow-md transition disabled:opacity-50">
                            {processing ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}