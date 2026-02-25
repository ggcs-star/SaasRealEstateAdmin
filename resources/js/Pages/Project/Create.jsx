import React, { useState } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import Step1Project from './Steps/Step1Project';
import Step2Amenities from './Steps/Step4Amenities';
import Step3Configuration from './Steps/Step2Configuration';
import Step4Units from './Steps/Step3Units';

export default function Create({ auth, builders, amenities, projectData, isEdit }) {
    console.log('Builders:', builders);
    console.log('Amenities:', amenities);
    const [step, setStep] = useState(1);

    const { data, setData, post, put } = useForm(
        projectData ?? {
            project: {
                builder_id: '',
                name: '',
                slug: '',
                reel: null,
                brochure: null,
                logo_image: null,
                price: '',
                type: '',
                status: 'active',
                rera: { number: '', authority: '' },
                location: {
                    address: '',
                    city: '',
                    area: '',
                    latitude: '',
                    longitude: '',
                    map_description: '',
                },
                amenity_ids: [],
                featured: false,
                emerging_property: false,
                emerging_area: false,
            },
            configurations: [],
            towers: [],
            bungalows: []
        }
    );
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const submitAll = () => {

    if (isEdit) {

        router.post(route('projects.update', data.project._id), {
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

            <div className="p-6 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Step {step} of 4
                </h2>

                {step === 1 && (
                    <Step1Project
                        data={data}
                        setData={setData}
                        nextStep={nextStep}
                        builders={builders}
                    />
                )}



                {step === 2 && (
                    <Step3Configuration
                        data={data}
                        setData={setData}
                        nextStep={nextStep}
                        prevStep={prevStep}
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
                        submitAll={submitAll}
                    />

                )}


            </div>
        </AuthenticatedLayout>
    );
}