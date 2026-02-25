import { Building2, Home } from "lucide-react";

export default function ProjectTypeSelector({ projectType, setProjectType }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Project Type</label>
            <div className="flex gap-4">
                <button
                    onClick={() => setProjectType("apartment")}
                    className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        projectType === "apartment"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                >
                    <Building2 size={24} />
                    <span className="font-medium">Apartment / Tower</span>
                </button>
                <button
                    onClick={() => setProjectType("bungalow")}
                    className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        projectType === "bungalow"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                >
                    <Home size={24} />
                    <span className="font-medium">Bungalow / Villa</span>
                </button>
            </div>
        </div>
    );
}