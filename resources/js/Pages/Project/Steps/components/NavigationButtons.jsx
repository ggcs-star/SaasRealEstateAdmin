export default function NavigationButtons({ prevStep, nextStep }) {
    return (
        <div className="flex justify-between pt-6 border-t">
            <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
                Back
            </button>
            <button
                onClick={nextStep}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
            >
                Next Step
            </button>
        </div>
    );
}