import React from 'react';
import { Plus, Trash2 } from "lucide-react";

export default function Step5Media({ data, setData, prevStep, submitAll }) {

    /* ===============================
       Helper for Multiple URL Fields
    =============================== */
    const updateMultipleUrls = (field, index, value) => {
        const updated = [...(data[field] || [])];
        updated[index] = value;
        setData(field, updated);
    };

    const addUrlField = (field) => {
        setData(field, [...(data[field] || []), ""]);
    };

    const removeUrlField = (field, index) => {
        const updated = [...(data[field] || [])];
        updated.splice(index, 1);
        setData(field, updated);
    };

    return (
    <div className="space-y-8">
       

        {/* Cover Image Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </span>
                    Cover Image
                </h3>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="https://example.com/cover-image.jpg"
                        value={data.cover_image_url || ""}
                        onChange={(e) => setData('cover_image_url', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    {data.cover_image_url && (
                        <div className="flex items-center px-3 bg-gray-50 border border-gray-300 rounded-lg">
                            <span className="text-xs text-gray-500">✓ URL added</span>
                        </div>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Main image that represents your project (appears in listings)
                </p>
            </div>
        </div>

        {/* Gallery Images Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </span>
                        Gallery Images
                    </h3>
                    <button
                        type="button"
                        onClick={() => addUrlField('gallery_images_url')}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium text-sm rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Image URL
                    </button>
                </div>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gallery Image URLs
                </label>
                
                {(data.gallery_images_url || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">No gallery images added yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(data.gallery_images_url || []).map((url, index) => (
                            <div key={index} className="flex gap-2 items-center group">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/gallery-image.jpg"
                                        value={url}
                                        onChange={(e) => updateMultipleUrls('gallery_images_url', index, e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                                        #{index + 1}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeUrlField('gallery_images_url', index)}
                                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                                    title="Remove image"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="mt-3 text-xs text-gray-500">
                    Add multiple images to showcase your project's gallery
                </p>
            </div>
        </div>

        {/* Floor Plans Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </span>
                        Floor Plans
                    </h3>
                    <button
                        type="button"
                        onClick={() => addUrlField('floorPlans_images_url')}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium text-sm rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Floor Plan
                    </button>
                </div>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Floor Plan Image URLs
                </label>
                
                {(data.floorPlans_images_url || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">No floor plans added yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(data.floorPlans_images_url || []).map((url, index) => (
                            <div key={index} className="flex gap-2 items-center group">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/floor-plan.jpg"
                                        value={url}
                                        onChange={(e) => updateMultipleUrls('floorPlans_images_url', index, e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeUrlField('floorPlans_images_url', index)}
                                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Slider Images Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </span>
                        Slider Images
                    </h3>
                    <button
                        type="button"
                        onClick={() => addUrlField('slider_image_url')}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium text-sm rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Slider Image
                    </button>
                </div>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Slider Image URLs
                </label>
                
                {(data.slider_image_url || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">No slider images added yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(data.slider_image_url || []).map((url, index) => (
                            <div key={index} className="flex gap-2 items-center group">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/slider-image.jpg"
                                        value={url}
                                        onChange={(e) => updateMultipleUrls('slider_image_url', index, e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeUrlField('slider_image_url', index)}
                                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Documents Section - Brochure & Reel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brochure */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </span>
                        Brochure
                    </h3>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brochure PDF URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="https://example.com/brochure.pdf"
                            value={data.brochure_url || ""}
                            onChange={(e) => setData('brochure_url', e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        {data.brochure_url && (
                            <a 
                                href={data.brochure_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Reel/Video */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </span>
                        Project Reel
                    </h3>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reel / Video URL
                    </label>
                    <input
                        type="text"
                        placeholder="https://youtube.com/shorts/xxxx or video link"
                        value={data.reel_url || ""}
                        onChange={(e) => setData('reel_url', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Supports YouTube, Vimeo, or direct video links
                    </p>
                </div>
            </div>
        </div>

        {/* Media Summary */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Media Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                    <span className="text-indigo-600 font-medium">Cover Image:</span>
                    <p className="text-gray-800">{data.cover_image_url ? '✓ Added' : '✗ Missing'}</p>
                </div>
                <div>
                    <span className="text-indigo-600 font-medium">Gallery:</span>
                    <p className="text-gray-800">{(data.gallery_images_url || []).length} images</p>
                </div>
                <div>
                    <span className="text-indigo-600 font-medium">Floor Plans:</span>
                    <p className="text-gray-800">{(data.floorPlans_images_url || []).length} plans</p>
                </div>
                <div>
                    <span className="text-indigo-600 font-medium">Slider:</span>
                    <p className="text-gray-800">{(data.slider_image_url || []).length} images</p>
                </div>
                <div>
                    <span className="text-indigo-600 font-medium">Brochure:</span>
                    <p className="text-gray-800">{data.brochure_url ? '✓ Added' : '✗ Missing'}</p>
                </div>
            </div>
        </div>

        {/* Navigation Buttons */}
        {/* <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <button
                type="button"
                onClick={submitAll}
                className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Project
            </button>
        </div> */}
    </div>
);
}