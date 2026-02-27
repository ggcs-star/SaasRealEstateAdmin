import React, { useState } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import Step1Project from './Steps/Step1Project';
import Step2Amenities from './Steps/Step4Amenities';
import Step3Configuration from './Steps/Step2Configuration';
import Step4Units from './Steps/Step3Units';
import Step5Media from './Steps/Step5Media';

export default function Create({ auth, builders, amenities, projectData, isEdit, categories, states }) {
    const [step, setStep] = useState(1);

    const { data, setData, post, put } = useForm(
        projectData ?? {
            builder_id: '',
            promoter_id: '',
            category_ids: [],
            configuration_ids: [],
            amenity_ids: [],
            tower_ids: [],
            name: '',
            slug: '',
            project_type: '',
            description: '',
            short_description: '',
            address: '',
            state_id: '',
            city_id: '',
            area_id: '',
            State_name: '',
            city_name: '',
            area_name: '',
            pincode: '',
            latitude: '',
            longitude: '',
            rera_number: '',
            possession_date: '',
            launch_date: '',
            project_status: '',
            cover_image_url: null,
            gallery_images_url: [],
            floorPlans_images_url: [],
            slider_image_url: [],
            brochure_url: null,
            reel_url: null,
            price: '',
            carpet_area: '',
            total_units: '',
            total_towers: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            meta_data: {},
            is_featured: true,
            is_emerging_property: true,
            is_emerging_area: true,
            is_new_launch: true,
            is_trending: true,
            display_order: '',
            status: true,
        }
    );
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const submitAll = () => {
        if (isEdit) {
            router.post(route('projects.update', data._id), {
                ...data,
                _method: 'put'
            }, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            router.post(route('projects.storeAll'), data, {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };
    

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Project Wizard" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section with Gradient */}


                    {/* Step Indicators */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between max-w-3xl mx-auto">
                            {[1, 2, 3, 4, 5].map((stepNumber) => (
                                <div key={stepNumber} className="flex items-center">
                                    <div className="relative">
                                        <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                                        transition-all duration-300
                                        ${step > stepNumber
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                : step === stepNumber
                                                    ? 'bg-white border-2 border-indigo-600 text-indigo-600 shadow-lg'
                                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                            }
                                    `}>
                                            {step > stepNumber ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                stepNumber
                                            )}
                                        </div>
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                            <span className={`
                                            text-xs font-medium
                                            ${step === stepNumber ? 'text-indigo-600' : 'text-gray-500'}
                                        `}>
                                                {stepNumber === 1 && 'Details'}
                                                {stepNumber === 2 && 'Config'}
                                                {stepNumber === 3 && 'Towers'}
                                                {stepNumber === 4 && 'Amenities'}
                                                {stepNumber === 5 && 'Media'}
                                            </span>
                                        </div>
                                    </div>
                                    {stepNumber < 5 && (
                                        <div className={`
                                        w-12 sm:w-16 h-0.5 mx-2
                                        ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-300'}
                                    `} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Step Title */}
                        <div className="border-b border-gray-200 bg-gray-50/50 px-8 py-5">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                                    {step === 1 && <span>📋</span>}
                                    {step === 2 && <span>⚙️</span>}
                                    {step === 3 && <span>🏢</span>}
                                    {step === 4 && <span>✨</span>}
                                    {step === 5 && <span>🖼️</span>}
                                </span>
                                {step === 1 && 'Basic Information'}
                                {step === 2 && 'Configurations'}
                                {step === 3 && 'Tower & Floor Plans'}
                                {step === 4 && 'Amenities'}
                                {step === 5 && 'Media & Documents'}
                            </h2>
                        </div>

                        {/* Step Content */}
                        <div className="px-8 py-6">
                            {step === 1 && (
                                <Step1Project
                                    data={data}
                                    setData={setData}
                                    nextStep={nextStep}
                                    builders={builders}
                                    states={states}
                                />
                            )}

                            {step === 2 && (
                                <Step3Configuration
                                    data={data}
                                    setData={setData}
                                    nextStep={nextStep}
                                    prevStep={prevStep}
                                    categories={categories}
                                />
                            )}

                            {step === 3 && (
                                <Step4Units
                                    data={data}
                                    setData={setData}
                                    prevStep={prevStep}
                                    nextStep={nextStep}
                                />
                            )}

                            {step === 4 && (
                                <Step2Amenities
                                    data={data}
                                    setData={setData}
                                    prevStep={prevStep}
                                    amenities={amenities}
                                    nextStep={nextStep}
                                />
                            )}

                            {step === 5 && (
                                <Step5Media
                                    data={data}
                                    setData={setData}
                                    prevStep={prevStep}
                                    submitAll={submitAll}
                                />
                            )}
                        </div>

                        {/* Footer with Navigation Info */}
                        <div className="border-t border-gray-200 bg-gray-50/50 px-8 py-4">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Auto-save enabled
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Secure form
                                    </span>
                                </div>
                                <span className="text-xs">
                                    Fields marked with <span className="text-red-500">*</span> are required
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 bg-indigo-50 rounded-xl border border-indigo-100 p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-indigo-800">Need help?</h3>
                                <p className="text-sm text-indigo-600 mt-1">
                                    You can save your progress at any time and continue later.
                                    All your data is automatically saved as you move between steps.
                                </p>
                            </div>
                            <button className="ml-auto px-3 py-1.5 bg-white text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200">
                                View Guide
                            </button>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts (Optional Visual Enhancement) */}
                    <div className="mt-4 text-center text-xs text-gray-400">
                        <span className="mx-2">⌘ + → Next step</span>
                        <span className="mx-2">⌘ + ← Previous step</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}