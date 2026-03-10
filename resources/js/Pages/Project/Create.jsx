import React, { useState, useRef } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Step1Project from "./Steps/Step1Project";
import Step2Amenities from "./Steps/Step4Amenities";
import Step4Units from "./Steps/Step3Units";
import Step5Media from "./Steps/Step5Media";

export default function Create({
    auth,
    builders,
    amenities,
    projectData,
    isEdit,
    categories,
    states,
    propertyTypes,
    unitTypes,
}) {
    const [openSection, setOpenSection] = useState('project');
    const [sectionErrors, setSectionErrors] = useState({
        project: false,
        tower: false,
        amenities: false,
        media: false
    });
    const [validationLoading, setValidationLoading] = useState(false);

    const projectRef = useRef();
    const towerRef = useRef();

    const { data, setData } = useForm(
        projectData ?? {
            builder_id: "",
            category_ids: [],
            amenity_ids: [],
            tower_ids: [],
            towers: [],
            name: "",
            slug: "",
            project_type: "",
            description: "",
            short_description: "",
            address: "",
            state_id: "",
            city_id: "",
            area_id: "",
            pincode: "",
            latitude: "",
            longitude: "",
            rera_number: "",
            possession_date: "",
            launch_date: "",
            project_status: "",
            cover_image_url: null,
            gallery_images_url: [],
            floorPlans_images_url: [],
            slider_image_url: [],
            brochure_url: null,
            reel_url: null,
            price: "",
            carpet_area: "",
            total_units: "",
            total_towers: "",
            meta_title: "",
            meta_description: "",
            meta_keywords: "",
            meta_data: {},
            is_featured: true,
            is_emerging_property: true,
            is_emerging_area: true,
            is_new_launch: true,
            is_trending: true,
            display_order: "",
            status: true,
        }
    );

    const submitAll = async () => {

        setValidationLoading(true);

        try {

            setOpenSection("project");

            setTimeout(() => {

                if (!projectRef.current?.validate()) {

                    setSectionErrors(prev => ({ ...prev, project: true }));
                    setValidationLoading(false);
                    return;

                }

                setSectionErrors(prev => ({ ...prev, project: false }));

                setOpenSection("tower");

                setTimeout(() => {

                    if (!towerRef.current?.validate()) {

                        setSectionErrors(prev => ({ ...prev, tower: true }));
                        setValidationLoading(false);
                        return;

                    }

                    setSectionErrors(prev => ({ ...prev, tower: false }));

                    if (isEdit) {

                        router.put(route("projects.update", projectData.id), data, {
                            onFinish: () => setValidationLoading(false)
                        });

                    } else {

                        router.post(route("projects.storeAll"), data, {
                            onFinish: () => setValidationLoading(false)
                        });

                    }

                }, 100);

            }, 100);

        } catch (error) {

            console.error(error);
            setValidationLoading(false);

        }
    };

    const toggleSection = (sectionName) => {
        if (openSection === sectionName) {
            setOpenSection(null);
        } else {
            setOpenSection(sectionName);
        }
    };

    const SectionHeader = ({ title, section, isCompleted, icon }) => {
        const sectionIcons = {
            project: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            tower: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            amenities: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            media: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        };

        return (
            <div
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between cursor-pointer group hover:bg-opacity-80 transition-all duration-200"
            >
                <h3 className="text-lg font-semibold flex items-center">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-200 ${openSection === section
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200'
                        : sectionErrors[section]
                            ? 'bg-red-100 text-red-600 group-hover:bg-red-200'
                            : isCompleted
                                ? 'bg-green-100 text-green-600 group-hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                        {sectionIcons[section] || (
                            <span className="text-sm font-bold">
                                {section === 'project' && '1'}
                                {section === 'tower' && '2'}
                                {section === 'amenities' && '3'}
                                {section === 'media' && '4'}
                            </span>
                        )}
                    </span>
                    <span className="text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {title}
                    </span>
                    {isCompleted && !sectionErrors[section] && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completed
                        </span>
                    )}
                    {sectionErrors[section] && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Required
                        </span>
                    )}
                </h3>
                <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                        {openSection === section ? 'Click to collapse' : 'Click to expand'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${openSection === section
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                        <svg
                            className={`w-5 h-5 transition-transform duration-200 ${openSection === section ? 'transform rotate-180' : ''
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    // Progress calculation
    const calculateProgress = () => {
        let completed = 0;
        let total = 4;

        if (data.name && data.builder_id) completed++;
        if (data.towers?.length > 0) completed++;
        if (data.amenity_ids?.length > 0) completed++;
        if (data.cover_image_url || data.gallery_images_url?.length > 0) completed++;

        return (completed / total) * 100;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={isEdit ? "Edit Project" : "Create Project"} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header with Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEdit ? 'Edit Project' : 'Create New Project'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Fill in the details below to {isEdit ? 'update' : 'create'} your project
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-medium text-gray-500">Progress</span>
                                <div className="text-2xl font-bold text-indigo-600">
                                    {Math.round(calculateProgress())}%
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
                                style={{ width: `${calculateProgress()}%` }}
                            />
                        </div>
                    </div>




                    <div className="px-8 py-6 space-y-4">

                        {/* PROJECT DETAILS - SECTION 1 */}
                        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${sectionErrors.project
                            ? "border-red-300 bg-red-50 shadow-md shadow-red-100"
                            : openSection === 'project'
                                ? "border-indigo-200 shadow-md shadow-indigo-100"
                                : "border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                            }`}>
                            <div className={`px-6 py-4 border-b ${sectionErrors.project
                                ? "bg-red-50 border-red-200"
                                : openSection === 'project'
                                    ? "bg-indigo-50 border-indigo-200"
                                    : "bg-gray-50 border-gray-200"
                                }`}>
                                <SectionHeader
                                    title="Project Details"
                                    section="project"
                                    isCompleted={data.name && data.builder_id}
                                />
                            </div>

                            {openSection === 'project' && (
                                <div className="p-6 bg-white">
                                    <Step1Project
                                        ref={projectRef}
                                        data={data}
                                        setData={setData}
                                        builders={builders}
                                        states={states}
                                    />
                                </div>
                            )}
                        </div>

                        {/* TOWER SECTION - SECTION 2 */}
                        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${sectionErrors.tower
                            ? "border-red-300 bg-red-50 shadow-md shadow-red-100"
                            : openSection === 'tower'
                                ? "border-indigo-200 shadow-md shadow-indigo-100"
                                : "border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                            }`}>
                            <div className={`px-6 py-4 border-b ${sectionErrors.tower
                                ? "bg-red-50 border-red-200"
                                : openSection === 'tower'
                                    ? "bg-indigo-50 border-indigo-200"
                                    : "bg-gray-50 border-gray-200"
                                }`}>
                                <SectionHeader
                                    title="Towers & Units"
                                    section="tower"
                                    isCompleted={data.towers?.length > 0}
                                />
                            </div>

                            {openSection === 'tower' && (
                                <div className="p-6 bg-white">
                                    <Step4Units
                                        ref={towerRef}
                                        data={data}
                                        setData={setData}
                                        propertyTypes={propertyTypes}
                                        unitTypes={unitTypes}
                                    />
                                </div>
                            )}
                        </div>

                        {/* AMENITIES SECTION - SECTION 3 */}
                        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${openSection === 'amenities'
                            ? "border-indigo-200 shadow-md shadow-indigo-100"
                            : "border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                            }`}>
                            <div className={`px-6 py-4 border-b ${openSection === 'amenities'
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-gray-50 border-gray-200"
                                }`}>
                                <SectionHeader
                                    title="Amenities"
                                    section="amenities"
                                    isCompleted={data.amenity_ids?.length > 0}
                                />
                            </div>

                            {openSection === 'amenities' && (
                                <div className="p-6 bg-white">
                                    <Step2Amenities
                                        data={data}
                                        setData={setData}
                                        amenities={amenities}
                                    />
                                </div>
                            )}
                        </div>

                        {/* MEDIA SECTION - SECTION 4 */}
                        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${openSection === 'media'
                            ? "border-indigo-200 shadow-md shadow-indigo-100"
                            : "border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                            }`}>
                            <div className={`px-6 py-4 border-b ${openSection === 'media'
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-gray-50 border-gray-200"
                                }`}>
                                <SectionHeader
                                    title="Media Upload"
                                    section="media"
                                    isCompleted={data.cover_image_url || data.gallery_images_url?.length > 0}
                                />
                            </div>

                            {openSection === 'media' && (
                                <div className="p-6 bg-white">
                                    <Step5Media
                                        data={data}
                                        setData={setData}
                                        submitAll={submitAll}
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    {/* FOOTER with enhanced styling */}
                    <div className="border-t px-8 py-5 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="text-red-500 text-lg mr-1">*</span>
                                <span>Required fields</span>
                            </div>
                            {validationLoading && (
                                <div className="flex items-center text-indigo-600">
                                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Validating...
                                </div>
                            )}
                        </div>

                        <button
                            onClick={submitAll}
                            disabled={validationLoading}
                            className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl 
                                    hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 
                                    font-medium shadow-lg shadow-indigo-200 hover:shadow-xl 
                                    hover:shadow-indigo-300 transform hover:-translate-y-0.5
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                                    flex items-center space-x-2`}
                        >
                            {validationLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{isEdit ? 'Update Project' : 'Create Project'}</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}