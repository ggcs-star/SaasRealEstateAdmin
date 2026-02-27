import React from 'react';

export default function AmenityFormModal({ 
    show, 
    onClose, 
    onSubmit, 
    data, 
    setData, 
    errors, 
    previewImage, 
    onFileChange, 
    isProcessing,
    isEdit 
}) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {isEdit ? 'Edit Amenity' : 'Add New Amenity'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Basic Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., Swimming Pool, Gym, WiFi"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows="3"
                                placeholder="Brief description of the amenity..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    onChange={onFileChange}
                                    accept="image/*"
                                    className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
                                />
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="h-12 w-12 object-cover rounded"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended size: 64x64 pixels. Max file size: 2MB
                            </p>
                            {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-semibold text-gray-700">SEO Settings</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={data.meta_title}
                                onChange={e => setData('meta_title', e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
                                placeholder="SEO title (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Description
                            </label>
                            <textarea
                                value={data.meta_description}
                                onChange={e => setData('meta_description', e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                                placeholder="SEO description (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Keywords
                            </label>
                            <input
                                type="text"
                                value={data.meta_keywords}
                                onChange={e => setData('meta_keywords', e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
                                placeholder="amenity, hotel, pool, ..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Data (JSON)
                            </label>
                            <textarea
                                value={data.meta_data}
                                onChange={e => setData('meta_data', e.target.value)}
                                className="border border-gray-300 p-2 w-full rounded font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                                rows="4"
                                placeholder='{"key": "value"}'
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value === 'true')}
                            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
                            disabled={isProcessing}
                        >
                            {isProcessing && (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}