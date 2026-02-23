import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Save } from 'lucide-react';

// Steps
import Step1Basic from './Steps/Step1Basic';
import Step2Configuration from './Steps/Step2Configuration';
import Step3Pricing from './Steps/Step3Pricing';
import Step4Rules from './Steps/Step4Rules';
import Step5Review from './Steps/Step5Review';

export default function ProjectSetup() {

  const { auth } = usePage().props;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(null); // ✅ IMPORTANT

  const [config, setConfig] = useState({
    project: {
      name: '',
      slug: '',
      type: 'Residential',

      location: {
        address: '',
        city: '',
        area: '',
        latitude: '',
        longitude: ''
      },

      towers: [],

      pricing: {
        basePrice: 0,
        floorRise: 0,
        taxRate: 5,
        plcRules: []
      },

      rules: {
        holdDurationHours: 24,
        maxDiscountPercentage: 5,
        allowCPBooking: true
      }
    }
  });

  // ✅ STEP 1 SAVE
  const saveStep1 = () => {
    setLoading(true);

    router.post(route('projects.step1'), config, {
      preserveScroll: true,

      onSuccess: (page) => {
        // 👇 backend se id lo
        const id = page?.props?.projectId;
        if (id) setProjectId(id);

        setStep(2);
      },

      onError: (err) => {
        console.log(err);
        alert('Step 1 validation failed');
      },

      onFinish: () => setLoading(false),
    });
  };

  // ✅ FINAL SAVE
  const saveProject = () => {
    setLoading(true);

    router.post(route('projects.store'), {
      projectId,
      ...config
    }, {
      preserveScroll: true,

      onSuccess: () => {
        alert('Project Created Successfully 🚀');
      },

      onFinish: () => setLoading(false),
    });
  };

  // ✅ STEP SWITCH
const handleNext = () => {

  if (step === 1) {
    saveStep1();
  }

  else if (step === 2) {
    saveStep2();   // 👈 ADD THIS
  }

  else {
    setStep(s => s + 1);
  }
};
const saveStep2 = () => {

  setLoading(true);
console.log("Project ID:", projectId);
  router.post(
    route('projects.step2', projectId),
    {
      type: config.project.type,
      configuration: config.configuration?.Homes || {},
      type_price: config.configuration?.Homes?.price || null,
    },
    {
      preserveScroll: true,

      onSuccess: () => {
        setStep(3);
      },

      onError: (err) => {
        console.log(err);
        alert('Step 2 validation failed');
      },

      onFinish: () => setLoading(false),
    }
  );
};
  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  // STEP RENDER
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Basic config={config} setConfig={setConfig} />;
      case 2:
        return <Step2Configuration config={config} setConfig={setConfig} projectId={projectId} />;
      case 3:
        return <Step3Pricing config={config} setConfig={setConfig} projectId={projectId} />;
      case 4:
        return <Step4Rules config={config} setConfig={setConfig} projectId={projectId} />;
      case 5:
        return <Step5Review config={config} />;
      default:
        return null;
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Project Setup" />

      <div className="max-w-5xl mx-auto py-8">

        {/* STEP INDICATOR */}
        <div className="flex justify-center mb-8">
          {[1,2,3,4,5].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
                ${step === s ? 'bg-sky-700 text-white' : 'bg-gray-200'}`}>
                {s}
              </div>
              {s < 5 && (
                <div className={`w-10 h-1 ${
                  step > s ? 'bg-sky-700' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* CARD */}
        <div className="bg-white shadow-xl rounded-2xl border min-h-[500px] flex flex-col">

          {renderStep()}

          {/* FOOTER */}
          <div className="p-6 border-t flex justify-between mt-auto">

            {/* BACK */}
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 bg-gray-200 rounded flex gap-2 disabled:opacity-50"
            >
              <ArrowLeft size={18}/> Back
            </button>

            {/* NEXT / SAVE */}
            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-4 py-2 bg-sky-700 text-white rounded flex gap-2"
              >
                {loading ? 'Saving...' : 'Next'} <ArrowRight size={18}/>
              </button>
            ) : (
              <button
                onClick={saveProject}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded flex gap-2"
              >
                <Save size={18}/> {loading ? 'Saving...' : 'Publish'}
              </button>
            )}

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}