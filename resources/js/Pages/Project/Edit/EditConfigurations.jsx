import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function EditConfigurations({ auth, project, categories }) {
   const { data, setData, put, processing, errors } = useForm({
    configurations: (project.configurations || []).map(c => ({
        ...c,
        category_ids: (c.category_ids || [])
            .filter(id => id)
            .map(id => id.toString())
    }))
});
console.log("Initial form data:", data);    
    const [activeIndex, setActiveIndex] = useState(null);

    // Helper functions
    const addConfiguration = () => {
        const newConfig = {
            id: "cfg_" + Date.now(),
            category_ids: [],
            name: "",
            type: "",
            type_size: "",
            total_configuration_size: "",
            room_sizes: {},
            description: "",
            status: true
        };

        setData("configurations", [...data.configurations, newConfig]);
        setActiveIndex(data.configurations.length);
    };

    const removeConfiguration = (index) => {
        if (confirm("Are you sure you want to remove this configuration?")) {
            const updated = data.configurations.filter((_, i) => i !== index);
            setData("configurations", updated);
            if (activeIndex === index) setActiveIndex(null);
        }
    };

    const updateConfig = (index, field, value) => {
        const updated = [...data.configurations];
        updated[index][field] = value;

        if (field === "type") {
            updated[index].room_sizes = generateRoomsByType(value);
        }

        setData("configurations", updated);
    };
const toggleCategory = (index, categoryId) => {
    if (!categoryId) return;

    const updated = [...data.configurations];

    const idString = categoryId.toString();

    let current = (updated[index].category_ids || [])
        .filter(id => id)
        .map(id => id.toString());

    if (current.includes(idString)) {
        updated[index].category_ids = current.filter(id => id !== idString);
    } else {
        updated[index].category_ids = [...current, idString];
    }

    setData("configurations", updated);
};

    const updateRoomSize = (index, key, value) => {
        const updated = [...data.configurations];
        updated[index].room_sizes = {
            ...(updated[index].room_sizes || {}),
            [key]: value
        };
        setData("configurations", updated);
    };

    const addCustomRoom = (index) => {
        const updated = [...data.configurations];
        const currentRooms = updated[index].room_sizes || {};
        updated[index].room_sizes = {
            ...currentRooms,
            "New Room": ""
        };
        setData("configurations", updated);
    };

    const removeRoomSize = (index, key) => {
        const updated = [...data.configurations];
        const newRooms = { ...(updated[index].room_sizes || {}) };
        delete newRooms[key];
        updated[index].room_sizes = newRooms;
        setData("configurations", updated);
    };

    const renameRoomKey = (index, oldKey, newKey) => {
        if (!newKey.trim() || oldKey === newKey) return;

        const updated = [...data.configurations];
        const rooms = { ...(updated[index].room_sizes || {}) };
        const value = rooms[oldKey];
        delete rooms[oldKey];
        rooms[newKey] = value;
        updated[index].room_sizes = rooms;
        setData("configurations", updated);
    };

    const generateRoomsByType = (type) => {
        const rooms = {};
        if (!type) return rooms;

        const bhkMatch = type.match(/(\d+)\s*bhk/i);
        if (bhkMatch) {
            const bedroomCount = parseInt(bhkMatch[1]);
            for (let i = 1; i <= bedroomCount; i++) {
                rooms[`Bedroom ${i}`] = "";
            }
            rooms["Hall"] = "";
            rooms["Kitchen"] = "";
            rooms["Washroom"] = "";
            return rooms;
        }

        if (type.toLowerCase().includes("office")) {
            return {
                "Cabin": "",
                "Meeting Room": "",
                "Reception": "",
                "Washroom": ""
            };
        }

        return {};
    };
    
// console.log("Selected categories:", config.category_ids);

    const validateForm = () => {
        const configs = data.configurations;
        if (configs.length === 0) {
            alert("At least one configuration is required");
            return false;
        }

        for (let i = 0; i < configs.length; i++) {
            const config = configs[i];
            if (!config.name?.trim()) {
                alert(`Configuration ${i + 1}: Name is required`);
                setActiveIndex(i);
                return false;
            }
            if (!config.type?.trim()) {
                alert(`Configuration ${i + 1}: Type is required`);
                setActiveIndex(i);
                return false;
            }
            if (!config.total_configuration_size?.trim()) {
                alert(`Configuration ${i + 1}: Total size is required`);
                setActiveIndex(i);
                return false;
            }
            if (!config.type_size?.trim()) {
                alert(`Configuration ${i + 1}: Type size is required`);
                setActiveIndex(i);
                return false;
            }
          if (!Array.isArray(config.category_ids) || config.category_ids.length === 0) {
                alert(`Configuration ${i + 1}: At least one category must be selected`);
                setActiveIndex(i);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            put(route("projects.update.configurations", project._id));
        }
    };

    const hasError = (index, field) => {
        return errors[`configurations.${index}.${field}`];
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Configurations - {project.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                            Project ID: {project._id}
                        </span>
                    </div>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">


                    {/* Error Summary */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                        {Object.entries(errors).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Configuration Button */}
                    <div className="mb-6 flex justify-end">
                        <button
                            type="button"
                            onClick={addConfiguration}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Configuration
                        </button>
                    </div>

                    {/* Configurations List */}
                    {data.configurations.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No configurations yet</h3>
                            <p className="mt-2 text-gray-500">Click the button above to add your first configuration.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {data.configurations.map((config, index) => (
                                <div key={config.id || index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                    {/* Header */}
                                    <div
                                        className={`px-6 py-4 border-b flex justify-between items-center cursor-pointer transition-colors
                                            ${hasError(index, 'name') || hasError(index, 'type')
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-gray-50 border-gray-200'}`}
                                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <span className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
                                                ${hasError(index, 'name') || hasError(index, 'type')
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-indigo-100 text-indigo-600'}`}>
                                                {index + 1}
                                            </span>
                                            <h3 className="font-semibold text-gray-800">
                                                {config.name || `Configuration ${index + 1}`}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {config.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeConfiguration(index);
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>

                                    {/* Content */}
                                    {activeIndex === index && (
                                        <div className="p-6 space-y-6">
                                            {/* Basic Info Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Configuration Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={config.name || ""}
                                                        onChange={e => updateConfig(index, "name", e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500
                                                            ${hasError(index, 'name') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="e.g., Standard, Premium, Luxury"
                                                    />
                                                    {hasError(index, 'name') && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`configurations.${index}.name`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={config.type || ""}
                                                        onChange={e => updateConfig(index, "type", e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500
                                                            ${hasError(index, 'type') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="e.g., 2 BHK, 3 BHK, Office"
                                                    />
                                                    {hasError(index, 'type') && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`configurations.${index}.type`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Total Size <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={config.total_configuration_size || ""}
                                                        onChange={e => updateConfig(index, "total_configuration_size", e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500
                                                            ${hasError(index, 'total_configuration_size') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="e.g., 2300 sq.ft"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Type Size <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={config.type_size || ""}
                                                        onChange={e => updateConfig(index, "type_size", e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500
                                                            ${hasError(index, 'type_size') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder="e.g., 1200 sq.ft"
                                                    />
                                                </div>
                                            </div>

                                            {/* Categories */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Categories <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {categories?.map(cat => (
                                                        <label key={cat._id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                          checked={(config.category_ids || []).includes(cat._id?.toString())}
                                                                onChange={() => toggleCategory(index, cat._id)}
                                                                className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {hasError(index, 'category_ids') && (
                                                    <p className="text-red-500 text-xs mt-2">{errors[`configurations.${index}.category_ids`]}</p>
                                                )}
                                            </div>

                                            {/* Room Sizes */}
                                            <div className="bg-gray-50 rounded-lg p-5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-semibold text-gray-800">Room Sizes</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {Object.keys(config.room_sizes || {}).length} rooms
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {Object.entries(config.room_sizes || {}).map(([key, value], roomIndex) => (
                                                        <div key={roomIndex} className="flex gap-3 items-center group">
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <input
                                                                    type="text"
                                                                    value={key}
                                                                    onChange={(e) => renameRoomKey(index, key, e.target.value)}
                                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Room name"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={(e) => updateRoomSize(index, key, e.target.value)}
                                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Size (e.g., 12x10)"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRoomSize(index, key)}
                                                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg opacity-70 group-hover:opacity-100"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={() => addCustomRoom(index)}
                                                        className="mt-4 inline-flex items-center px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg border border-indigo-200"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Add Room
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={config.description || ""}
                                                    onChange={e => updateConfig(index, "description", e.target.value)}
                                                    rows="3"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Detailed description of this configuration..."
                                                />
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Status
                                                </label>
                                                <div className="flex space-x-6 p-4 bg-white border rounded-lg">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={config.status === true}
                                                            onChange={() => updateConfig(index, "status", true)}
                                                            className="w-4 h-4 text-indigo-600"
                                                        />
                                                        <span className="text-sm font-medium">Active</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={config.status === false}
                                                            onChange={() => updateConfig(index, "status", false)}
                                                            className="w-4 h-4 text-indigo-600"
                                                        />
                                                        <span className="text-sm font-medium">Inactive</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update Configurations
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}