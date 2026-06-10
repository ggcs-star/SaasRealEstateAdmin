import React from "react";
import { useForm } from "@inertiajs/react";

export default function PropertyTypeForm({
    propertyType,
    categories,
    closeModal
}) {
    const { data, setData, post, put, processing } = useForm({
        name: propertyType?.name || "",
        category_ids: propertyType?.category_ids ? [...propertyType.category_ids] : [],
        description: propertyType?.description || "",
        meta_title: propertyType?.meta_title || "",
        meta_description: propertyType?.meta_description || "",
        meta_keywords: propertyType?.meta_keywords || "",
        status: propertyType?.status ?? true
    });

    const submit = (e) => {
        e.preventDefault();

        if (propertyType) {
            put(`/property-types/${propertyType.id}`, {
                onSuccess: closeModal
            });
        } else {
            post("/property-types", {
                onSuccess: closeModal
            });
        }
    };

    const toggleCategory = (id) => {
        let updated = [...data.category_ids];

        if (updated.includes(id)) {
            updated = updated.filter(c => c !== id);
        } else {
            updated.push(id);
        }

        setData("category_ids", updated);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            {/* Modal Container with Animation */}
            <div className="bg-white w-[650px] rounded-2xl shadow-2xl animate-slideUp overflow-hidden">
                {/* Modal Header with Gradient */}
                <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 px-6 py-5">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>

                    <div className="flex items-center justify-between relative">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                {propertyType ? (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {propertyType ? "Edit Property Type" : "Create New Property Type"}
                                </h2>
                                <p className="text-sm text-emerald-100 mt-0.5">
                                    {propertyType ? "Update the details below" : "Fill in the information below"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors group"
                        >
                            <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={submit} className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-5">
                        {/* Name Field with Icon */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                    placeholder="e.g., Apartment, Villa, Office"
                                />
                            </div>
                        </div>

                        {/* Category Select with Custom Styling */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(cat => (
                                    <label
                                        key={cat.id}
                                        className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-emerald-50 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.category_ids.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm">
                                            {cat.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Description
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                                    </svg>
                                </div>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    rows="4"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                                    placeholder="Describe this property type..."
                                />
                            </div>
                        </div>

                        {/* Meta Section with Accent */}
                        <div className="relative">
                            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                            <div className="pl-3">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                                    </svg>
                                    SEO Settings
                                </h3>

                                {/* Meta Fields Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                                        <input
                                            value={data.meta_title}
                                            onChange={(e) => setData("meta_title", e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-sm"
                                            placeholder="Enter meta title"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                                        <textarea
                                            value={data.meta_description}
                                            onChange={(e) => setData("meta_description", e.target.value)}
                                            rows="2"
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-sm resize-none"
                                            placeholder="Enter meta description"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
                                        <input
                                            value={data.meta_keywords}
                                            onChange={(e) => setData("meta_keywords", e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-sm"
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Toggle with Modern Switch */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg transition-colors ${data.status ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {data.status ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        )}
                                    </svg>
                                </div>
                                <div>
                                    <label className="font-medium text-gray-700">Status</label>
                                    <p className="text-xs text-gray-500">Set property type as active or inactive</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setData("status", !data.status)}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-100 ${data.status ? 'bg-emerald-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${data.status ? 'translate-x-8' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Form Actions with Modern Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 mt-6 border-t-2 border-gray-100">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="relative px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </span>
                            {!processing && (
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* Add these animations to your global CSS or in a style tag */
<style jsx>{`
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideUp {
        animation: slideUp 0.4s ease-out;
    }
`}</style>