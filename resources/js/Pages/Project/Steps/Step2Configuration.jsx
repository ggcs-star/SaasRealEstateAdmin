import React from "react";

export default function Step2Configuration({
    data,
    setData,
    nextStep,
    prevStep,
    categories = []
}) {

    const configurations = data.configurations || [];


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

        setData("configurations", [...configurations, newConfig]);

        // 👇 Open only newly added one
        setActiveIndex(configurations.length);
    };
    

    const removeConfiguration = (index) => {
        const updated = configurations.filter((_, i) => i !== index);
        setData("configurations", updated);
    };

    const updateConfig = (index, field, value) => {
        const updated = [...configurations];

        updated[index][field] = value;

        // 🔥 Auto generate rooms when type changes
        if (field === "type") {
            updated[index].room_sizes = generateRoomsByType(value);
        }

        setData("configurations", updated);
    };


    const toggleCategory = (index, categoryId) => {
        const updated = [...configurations];
        const current = updated[index].category_ids || [];

        updated[index].category_ids = current.includes(categoryId)
            ? current.filter(id => id !== categoryId)
            : [...current, categoryId];

        setData("configurations", updated);
    };


    const updateRoomSize = (index, key, value) => {
        const updated = [...configurations];

        updated[index].room_sizes = {
            ...(updated[index].room_sizes || {}),
            [key]: value
        };

        setData("configurations", updated);
    };
    const addCustomRoom = (index) => {
        const updated = [...configurations];

        const currentRooms = updated[index].room_sizes || {};

        updated[index].room_sizes = {
            ...currentRooms,
            "": ""  // blank key + blank value
        };

        setData("configurations", updated);
    };

    const removeRoomSize = (index, key) => {
        const updated = [...configurations];
        const newRooms = { ...(updated[index].room_sizes || {}) };

        delete newRooms[key];

        updated[index].room_sizes = newRooms;
        setData("configurations", updated);
    };

    const generateRoomsByType = (type) => {

        const rooms = {};

        if (!type) return rooms;

        const bhkMatch = type.match(/(\d+)\s*bhk/i);

        if (bhkMatch) {
            const bedroomCount = parseInt(bhkMatch[1]);

            for (let i = 1; i <= bedroomCount; i++) {
                rooms[`Bedroom_${i}`] = "";
            }

            rooms["Hall"] = "";
            rooms["Kitchen"] = "";
            return rooms;
        }

        // Office Type
        if (type.toLowerCase().includes("office")) {
            return {
                "Cabin": "",
                "Meeting Room": "",
                "Reception": "",
                "Washroom": ""
            };
        }

        // Default fallback
        return {};
    };
    const [errors, setErrors] = React.useState({});
    const [activeIndex, setActiveIndex] = React.useState(null);
    const validateStep = () => {
        let newErrors = {};

        if (configurations.length === 0) {
            alert("At least one configuration is required");
            return false;
        }

        configurations.forEach((config, index) => {
            if (!config.name?.trim())
                newErrors[`name_${index}`] = "Configuration Name is required";

            if (!config.type?.trim())
                newErrors[`type_${index}`] = "Type is required";

            if (!config.total_configuration_size?.trim())
                newErrors[`total_configuration_size_${index}`] = "Total Size is required";

            if (!config.type_size?.trim())
                newErrors[`type_size_${index}`] = "Type Size is required";

            if (!config.category_ids || config.category_ids.length === 0)
                newErrors[`category_ids_${index}`] = "At least one category must be selected";
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const errorIndex = parseInt(firstErrorKey.split("_")[1]);

            setActiveIndex(errorIndex);

            setTimeout(() => {
                const element = document.getElementById(firstErrorKey);

                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                    element.focus?.();
                }
            }, 300);

            return false;
        }

        // 🔥 THIS WAS MISSING
        return true;
    };
    const hasConfigError = (index) => {
        return Object.keys(errors).some(key =>
            key.endsWith(`_${index}`)
        );
    };
    return (
        <div className="space-y-8">
            {/* Header with progress */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Project Configurations</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Step 2 of 4
                </span>
            </div>

            {/* Add Configuration Button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={addConfiguration}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Configuration
                </button>
            </div>

            {/* Configurations List */}
            {configurations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No configurations</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new configuration.</p>
                </div>
            ) : (
                configurations.map((config, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                        {/* Configuration Header */}
                        <div
                            className={`
    px-6 py-4 border-b flex justify-between items-center cursor-pointer transition-colors
    ${hasConfigError(index)
                                    ? "bg-red-50 border-red-300"
                                    : "bg-gray-50 border-gray-200"
                                }
`}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        >                        <div className="flex items-center space-x-3">
                                <span
                                    className={`
        flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
        ${hasConfigError(index)
                                            ? "bg-red-100 text-red-600"
                                            : "bg-indigo-100 text-indigo-600"
                                        }
    `}
                                >                                {index + 1}
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
                                onClick={() => removeConfiguration(index)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium text-sm rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                            </button>
                        </div>

                        {/* Configuration Content */}
                        {activeIndex === index && (
                            <div className="p-6 space-y-6">
                                {/* Name and Type Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Configuration Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Standard, Premium, Luxury"
                                            value={config.name || ""}
                                            onChange={e => updateConfig(index, "name", e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg 
        ${errors[`name_${index}`] ? "border-red-500" : "border-gray-300"}
        focus:ring-2 focus:ring-indigo-500`}
                                        />
                                        {errors[`name_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[`name_${index}`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 2 BHK, 3 BHK, Office"
                                            value={config.type || ""}
                                            onChange={e => updateConfig(index, "type", e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
${errors[`type_${index}`] ? "border-red-500" : "border-gray-300"}
`}
                                        />
                                        {errors[`type_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`type_${index}`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Configuration Size <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 2300 sq.ft"
                                            value={config.total_configuration_size || ""}
                                            onChange={e => updateConfig(index, "total_configuration_size", e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
${errors[`total_configuration_size_${index}`] ? "border-red-500" : "border-gray-300"}
`}
                                        />
                                        {errors[`total_configuration_size_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`total_configuration_size_${index}`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type Size <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 1200 sq.ft"
                                            value={config.type_size || ""}
                                            onChange={e => updateConfig(index, "type_size", e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
${errors[`type_size_${index}`] ? "border-red-500" : "border-gray-300"}
`}
                                        />
                                        {errors[`type_size_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`type_size_${index}`]}</p>
                                        )}
                                    </div>



                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Categories
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {(categories || []).map(cat => (
                                            <label key={cat._id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={(config.category_ids || []).includes(cat._id)}
                                                    onChange={() => toggleCategory(index, cat._id)}
                                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                />
                                                {errors[`category_ids_${index}`] && (
                                                    <p className="text-red-500 text-xs mt-1">{errors[`category_ids_${index}`]}</p>
                                                )}
                                                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Room Sizes */}
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                            Room Sizes
                                        </h4>
                                        <span className="text-xs text-gray-500">
                                            {Object.keys(config.room_sizes || {}).length} rooms configured
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {Object.entries(config.room_sizes || {}).map(([key, value], roomIndex) => (
                                            <div key={roomIndex} className="flex gap-3 items-center group">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={key}
                                                        placeholder="Room Name"
                                                        onChange={(e) => {
                                                            const updated = [...configurations];
                                                            const rooms = { ...(updated[index].room_sizes || {}) };
                                                            const newKey = e.target.value;
                                                            const roomValue = rooms[key];
                                                            delete rooms[key];
                                                            rooms[newKey] = roomValue;
                                                            updated[index].room_sizes = rooms;
                                                            setData("configurations", updated);
                                                        }}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        placeholder="Size (e.g., 12x10)"
                                                        onChange={e => updateRoomSize(index, key, e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRoomSize(index, key)}
                                                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                                                    title="Remove room"
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
                                            className="mt-4 inline-flex items-center px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 font-medium rounded-lg transition-colors duration-200 border border-indigo-200 hover:border-indigo-300"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Custom Room
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Detailed description of this configuration..."
                                        value={config.description || ""}
                                        onChange={e => updateConfig(index, "description", e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <div className="flex space-x-6 p-4 bg-white border border-gray-200 rounded-lg">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={config.status === true}
                                                onChange={() => updateConfig(index, "status", true)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={config.status === false}
                                                onChange={() => updateConfig(index, "status", false)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Inactive</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                ))
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
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

                <div className="flex space-x-4">

                    <button
                        type="button"
                        onClick={() => {
                            // if (validateStep()) {
                                nextStep();
                            // }
                        }}
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Next Step
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}