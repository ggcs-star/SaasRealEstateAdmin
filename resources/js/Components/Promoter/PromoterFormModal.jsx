import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { X, User, Mail, Phone, CheckCircle, XCircle, Save, AlertCircle } from 'lucide-react';

export default function PromoterFormModal({ show, onClose, editData = null }) {
    const [isVisible, setIsVisible] = useState(false);
    const isEdit = !!editData;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        status: true,
    });

    useEffect(() => {
        if (editData) {
            setData({
                name: editData.name || '',
                email: editData.email || '',
                phone: editData.phone || '',
                status: editData.status ?? true,
            });
        } else {
            reset();
        }
    }, [editData]);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const submit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('promoters.update', editData._id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('promoters.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                show ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Backdrop with blur effect */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    show ? 'bg-opacity-60 backdrop-blur-sm' : 'bg-opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all duration-300 ${
                    show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEdit ? 'Edit Promoter' : 'Add New Promoter'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit 
                                ? 'Update the promoter information below' 
                                : 'Fill in the details to create a new promoter'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="p-6 space-y-5">
                    {/* Name Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter promoter's full name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="flex items-center text-sm text-red-600 mt-1">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                placeholder="promoter@example.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="flex items-center text-sm text-red-600 mt-1">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className={`pl-10 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                        </div>
                        {errors.phone && (
                            <p className="flex items-center text-sm text-red-600 mt-1">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Status Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Account Status
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('status', true)}
                                className={`flex items-center justify-center px-4 py-2.5 border rounded-lg transition-all duration-200 ${
                                    data.status === true
                                        ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                }`}
                            >
                                <CheckCircle className={`w-4 h-4 mr-2 ${
                                    data.status === true ? 'text-green-500' : 'text-gray-400'
                                }`} />
                                Active
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('status', false)}
                                className={`flex items-center justify-center px-4 py-2.5 border rounded-lg transition-all duration-200 ${
                                    data.status === false
                                        ? 'border-gray-500 bg-gray-50 text-gray-700 ring-2 ring-gray-200'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                }`}
                            >
                                <XCircle className={`w-4 h-4 mr-2 ${
                                    data.status === false ? 'text-gray-500' : 'text-gray-400'
                                }`} />
                                Inactive
                            </button>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-5 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Saving...' : (isEdit ? 'Update Promoter' : 'Create Promoter')}
                        </button>
                    </div>
                </form>

                {/* Additional Info (optional) */}
               
            </div>
        </div>
    );
}