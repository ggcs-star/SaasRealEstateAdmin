import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { XMarkIcon, BanknotesIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

// Helper: Format Currency locally for display
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0,
    }).format(amount || 0);
};

export default function ReceivePaymentModal({ isOpen, onClose, selectedCollection }) {
    
    // Model ke 'ACTUAL PAYMENT DETAILS' ke hisaab se fields map kiye gaye hain
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        payment_date: new Date().toISOString().split('T')[0],
        paid_amount: "",
        payment_mode: "NEFT/RTGS", // Default selection
        transaction_number: "",
        cheque_number: "",
        bank_name: "",
        branch_name: "",
        payment_receipt: null,
        remarks: ""
    });

    // Jab modal open ho aur collection select ho, to default data populate karo
    useEffect(() => {
        if (selectedCollection && isOpen) {
            setData({
                payment_date: new Date().toISOString().split('T')[0],
                paid_amount: selectedCollection.scheduled_amount || "", // Default paid amount scheduled amount ke barabar
                payment_mode: "NEFT/RTGS",
                transaction_number: "",
                cheque_number: "",
                bank_name: "",
                branch_name: "",
                payment_receipt: null,
                remarks: selectedCollection.remarks || "" // Agar pehle se koi remark tha to le aao
            });
        }
    }, [selectedCollection, isOpen]);

    // Handle form submission
    const submitPayment = (e) => {
        e.preventDefault();
        if (!selectedCollection) return;

        // CollectionController ke 'receivePayment' route par data bhejenge
        post(route('collections.receive-payment', selectedCollection.id || selectedCollection._id), {
            forceFormData: true, // File upload ke liye zaroori hai
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                onClose();
            },
        });
    };

    // Handle Modal Close
    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    // Reset irrelevant fields when payment mode changes
    const handlePaymentModeChange = (e) => {
        const mode = e.target.value;
        setData((prev) => ({
            ...prev,
            payment_mode: mode,
            transaction_number: "",
            cheque_number: "",
            bank_name: "",
            branch_name: ""
        }));
    };

    // Agar modal close hai ya data nahi hai to kuch render mat karo
    if (!isOpen || !selectedCollection) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-gray-900/60 backdrop-blur-sm">
            
            {/* CHANGED: max-w-2xl se max-w-4xl kar diya hai taaki modal side se lamba (wide) ho jaye */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col transform transition-all overflow-hidden">
                {/* Modal Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#14B99F]/10 rounded-lg">
                            <BanknotesIcon className="w-6 h-6 text-[#14B99F]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Receive Payment</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Ref: <span className="font-semibold text-gray-700">{selectedCollection.installment_name}</span> 
                                <span className="mx-2">•</span> 
                                Scheduled Due: <span className="font-bold text-[#14B99F]">{formatCurrency(selectedCollection.scheduled_amount)}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body Form (Scrollable) */}
                <div className="overflow-y-auto p-6 bg-gray-50">
                    <form id="receive-payment-form" onSubmit={submitPayment} className="space-y-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Paid Amount */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Amount Received (₹) *</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium">₹</span>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        min="1"
                                        value={data.paid_amount}
                                        onChange={e => setData('paid_amount', e.target.value)}
                                        className="w-full pl-8 border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                {errors.paid_amount && <p className="text-red-500 text-xs mt-1">{errors.paid_amount}</p>}
                            </div>

                            {/* Payment Date */}
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

                            {/* Payment Mode */}
                            <div className={data.payment_mode === 'Cash' ? 'md:col-span-2' : ''}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Mode *</label>
                                <select 
                                    value={data.payment_mode}
                                    onChange={handlePaymentModeChange}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] bg-gray-50 font-medium"
                                    required
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="NEFT/RTGS">NEFT / RTGS</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                                {errors.payment_mode && <p className="text-red-500 text-xs mt-1">{errors.payment_mode}</p>}
                            </div>

                            {/* Dynamic Fields: Cheque */}
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
                                        {errors.cheque_number && <p className="text-red-500 text-xs mt-1">{errors.cheque_number}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. HDFC Bank"
                                            value={data.bank_name}
                                            onChange={e => setData('bank_name', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                            required
                                        />
                                        {errors.bank_name && <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. SG Highway"
                                            value={data.branch_name}
                                            onChange={e => setData('branch_name', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Dynamic Fields: Online Transfers (UPI, NEFT, Bank Transfer) */}
                            {['UPI', 'NEFT/RTGS', 'Bank Transfer'].includes(data.payment_mode) && (
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR No. *</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter reference number"
                                        value={data.transaction_number}
                                        onChange={e => setData('transaction_number', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F]"
                                        required
                                    />
                                    {errors.transaction_number && <p className="text-red-500 text-xs mt-1">{errors.transaction_number}</p>}
                                </div>
                            )}
                        </div>

                        <hr className="border-gray-100" />

                        {/* File Upload & Remarks */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <DocumentArrowUpIcon className="w-5 h-5 text-gray-400" /> Upload Receipt / Screenshot (Optional)
                                </label>
                                <input 
                                    type="file" 
                                    onChange={e => setData('payment_receipt', e.target.files[0])}
                                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-[#14B99F]/10 file:text-[#14B99F] hover:file:bg-[#14B99F]/20 cursor-pointer bg-gray-50"
                                />
                                {errors.payment_receipt && <p className="text-red-500 text-xs mt-1">{errors.payment_receipt}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Note</label>
                                <textarea 
                                    value={data.remarks}
                                    onChange={e => setData('remarks', e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#14B99F] focus:border-[#14B99F] min-h-[80px]"
                                    placeholder="Add any internal note here (e.g. Paid by brother, Late payment fee adjusted...)"
                                ></textarea>
                                {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>}
                            </div>
                        </div>

                    </form>
                </div>

                {/* Modal Footer Actions */}
                <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" onClick={handleClose} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="receive-payment-form" // Triggers the form inside the scrollable area
                        disabled={processing} 
                        className="px-6 py-2.5 bg-[#14B99F] text-white hover:bg-[#0EA88D] rounded-lg font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {processing ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </div>

            </div>
        </div>
    );
}