import React from "react";

export default function Step2Configuration({
    data,
    setData,
    nextStep,
    prevStep
}) {

    /* ===============================
       Add Configuration
    =============================== */
    const addConfiguration = () => {
        setData("configurations", [
            ...data.configurations,
            {
                category: "",
                title: "",
                price: "",
                size: "",
                possession_date: "",
                rooms: [
                    { type: "Bedroom", size: "" },
                    { type: "Bathroom", size: "" }
                ],
                imageslider: [],
                floorPlans: [],
                galleryImages: [],
                configuration_price: ""
            }
        ]);
    };
    const roomOptions = [
        "Bedroom",
        "Master Bedroom",
        "Children Bedroom",
        "Guest Bedroom",
        "Bathroom",
        "Toilet",
        "Balcony",
        "Parking",
        "Living Room",
        "Dining Room",
        "Kitchen",
        "Modular Kitchen",
        "Store Room",
        "Study Room",
        "Servant Room",
        "Pooja Room",
        "Terrace",
        "Utility Area",
        "Lobby",
        "Garden",
    ];
    const addRoom = (configIndex) => {
        const updated = [...data.configurations];

        if (!updated[configIndex].rooms) {
            updated[configIndex].rooms = [];
        }

        updated[configIndex].rooms = [
            ...updated[configIndex].rooms,
            { type: "Bedroom", size: "" }
        ];

        setData("configurations", updated);
    };
    const removeRoom = (configIndex, roomIndex) => {
        const updated = [...data.configurations];

        updated[configIndex].rooms =
            updated[configIndex].rooms.filter((_, i) => i !== roomIndex);

        setData("configurations", updated);
    };

    /* ===============================
       Remove Configuration
    =============================== */
    const removeConfiguration = (index) => {
        const updated = data.configurations.filter((_, i) => i !== index);
        setData("configurations", updated);
    };

    /* ===============================
       Update Normal Field
    =============================== */
    const updateConfig = (index, field, value) => {
        const updated = [...data.configurations];
        updated[index][field] = value;
        setData("configurations", updated);
    };

    /* ===============================
       Update Room Field
    =============================== */
    const updateRoom = (configIndex, roomIndex, field, value) => {
        const updated = [...data.configurations];

        updated[configIndex].rooms[roomIndex] = {
            ...updated[configIndex].rooms[roomIndex],
            [field]: value
        };

        setData("configurations", updated);
    };

    /* ===============================
       Handle Multi Image Upload
    =============================== */
    const handleImages = (index, field, files) => {

        const updated = [...data.configurations];

        const fileArray = Array.from(files);

        updated[index][field] = [
            ...(updated[index][field] || []),
            ...fileArray
        ];

        setData("configurations", updated);
    };

    /* ===============================
       Remove Image
    =============================== */
    const removeImage = (configIndex, field, imageIndex) => {
        const updated = [...data.configurations];

        updated[configIndex][field] =
            updated[configIndex][field].filter((_, i) => i !== imageIndex);

        setData("configurations", updated);
    };

    return (
        <div className="space-y-8">

            <button
                type="button"
                onClick={addConfiguration}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Add Configuration
            </button>

            {data.configurations.map((config, index) => (
                <div key={index} className="border p-6 rounded-lg bg-gray-50 space-y-6">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">
                            Configuration #{index + 1}
                        </h3>

                        <button
                            type="button"
                            onClick={() => removeConfiguration(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Category */}
                    <input
                        type="text"
                        placeholder="Category (Homes)"
                        value={config.category}
                        onChange={e => updateConfig(index, "category", e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Unit Type (2BHK)"
                        value={config.title}
                        onChange={e => updateConfig(index, "title", e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    {/* Basic Details */}
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Price"
                            value={config.price}
                            onChange={e => updateConfig(index, "price", e.target.value)}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            placeholder="Size (sqft)"
                            value={config.size}
                            onChange={e => updateConfig(index, "size", e.target.value)}
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={config.possession_date}
                            onChange={e => updateConfig(index, "possession_date", e.target.value)}
                            className="border p-2 rounded"
                        />
                    </div>

                    {/* Room Details */}
                    <div className="border p-4 rounded space-y-4">
                        <h4 className="font-semibold">Room Details</h4>

                        {(config.rooms || []).map((room, rIndex) => (
                            <div key={rIndex} className="flex gap-3 items-center">

                                {/* Room Type */}
                                <select
                                    value={room.type}
                                    onChange={(e) =>
                                        updateRoom(index, rIndex, "type", e.target.value)
                                    }
                                    className="flex-1 border p-2 rounded"
                                >
                                    {roomOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                {/* Room Size */}
                                <input
                                    type="text"
                                    placeholder="Size (12 ✕ 11)"
                                    value={room.size || ""}
                                    onChange={(e) =>
                                        updateRoom(index, rIndex, "size", e.target.value)
                                    }
                                    className="w-32 border p-2 rounded"
                                />

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removeRoom(index, rIndex)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    ✕
                                </button>

                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => addRoom(index)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            + Add Room
                        </button>
                    </div>

                    {/* Image Upload Section */}
                    {["imageslider", "floorPlans", "galleryImages"].map(field => (
                        <div key={field} className="space-y-3">
                            <label className="font-semibold capitalize">
                                {field}
                            </label>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={e => handleImages(index, field, e.target.files)}
                                className="border p-2 w-full rounded"
                            />

                            <div className="flex flex-wrap gap-3">
                                {config[field]?.map((img, i) => {

                                    const imageSrc =
                                        img instanceof File
                                            ? URL.createObjectURL(img)
                                            : img; // already stored URL (edit mode)

                                    return (
                                        <div key={i} className="relative">
                                            <img
                                                src={imageSrc}
                                                alt="preview"
                                                className="w-20 h-20 object-cover rounded"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeImage(index, field, i)}
                                                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Configuration Price */}
                    <input
                        type="text"
                        placeholder="Configuration Price"
                        value={config.configuration_price}
                        onChange={e => updateConfig(index, "configuration_price", e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                </div>
            ))}

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>

        </div>
    );
}