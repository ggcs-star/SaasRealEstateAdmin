import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

import ProjectHeader from "./Components/ProjectHeader";
import ProjectDetails from "./Components/ProjectDetails";
import AmenitiesSection from "./Components/AmenitiesSection";
import ConfigurationsSection from "./Components/ConfigurationsSection";
import TowersSection from "./Components/TowersSection";

export default function View({ project }) {

    const { auth } = usePage().props;

    const steps = [
        { id: 1, label: "Project Details" },
        { id: 2, label: "Amenities" },
        { id: 3, label: "Configurations" },
        { id: 4, label: "Towers" },
    ];

    const [activeStep, setActiveStep] = useState(1);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={project.name} />

            <div className="max-w-7xl mx-auto space-y-8 py-8">

                {/* Header Always Visible */}
                <ProjectHeader project={project} />

                {/* Step Navigation */}
                <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                                activeStep === step.id
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {step.label}
                        </button>
                    ))}
                </div>

                {/* Step Content */}
                <div className="transition-all duration-300">
                    {activeStep === 1 && (
                        <ProjectDetails project={project} />
                    )}

                    {activeStep === 2 && (
                        <AmenitiesSection amenities={project.amenities} />
                    )}

                    {activeStep === 3 && (
                        <ConfigurationsSection configurations={project.configurations} />
                    )}

                    {activeStep === 4 && (
                        <TowersSection towers={project.towers} />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        disabled={activeStep === 1}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        disabled={activeStep === steps.length}
                        onClick={() => setActiveStep((prev) => prev + 1)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}