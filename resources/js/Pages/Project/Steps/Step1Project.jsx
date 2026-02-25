import { useEffect, useState } from "react";

export default function Step1Project({
    data,
    setData,
    nextStep,
    builders = [],
}) {

    const [logoPreview, setLogoPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const updateProject = (field, value) => {
        setData('project', {
            ...data.project,
            [field]: value
        });
    };
    useEffect(() => {
        if (typeof data.project.logo_image === "string") {
            setLogoPreview(data.project.logo_image);
        }
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        updateProject("logo_image", file);

        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };
    useEffect(() => {
        if (typeof data.project.reel === "string") {
            setVideoPreview(data.project.reel);
        }
    }, []);

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        updateProject("reel", file);

        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
    };

    const updateNested = (parent, field, value) => {
        setData('project', {
            ...data.project,
            [parent]: {
                ...data.project[parent],
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-6">

            {/* Builder */}
            <div>
                <label className="font-semibold">Builder</label>
                <select
                    value={data.project.builder_id}
                    onChange={e => updateProject('builder_id', e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="">Select Builder</option>
                    {builders.map(b => (
                        <option key={b._id} value={b._id}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Project Name */}
            <input
                type="text"
                placeholder="Project Name"
                value={data.project.name}
                onChange={e => updateProject('name', e.target.value)}
                className="border p-2 w-full rounded"
            />

            {/* Slug */}
            <input
                type="text"
                placeholder="Slug"
                value={data.project.slug}
                onChange={e => updateProject('slug', e.target.value)}
                className="border p-2 w-full rounded"
            />

            {/* 🎥 Reel Upload */}
            <div>
                <label className="font-semibold">Reel (Video Upload)</label>

                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="border p-2 w-full rounded"
                />

                {videoPreview && (
                    <video
                        src={videoPreview}
                        controls
                        className="mt-3 w-64 rounded"
                    />
                )}
            </div>

            {/* 📄 Brochure Upload */}
            <div>
                <label className="font-semibold">Brochure (PDF Upload)</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                            updateProject('brochure', file);
                        }
                    }}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* 🖼 Logo Upload */}
            <div>
                <label className="font-semibold">Logo Image</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="border p-2 w-full rounded"
                />

                {logoPreview && (
                    <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="mt-3 h-24 rounded shadow"
                    />
                )}
            </div>

            {/* Type */}
            <input
                type="text"
                placeholder="Type"
                value={data.project.type}
                onChange={e => updateProject('type', e.target.value)}
                className="border p-2 w-full rounded"
            />

            {/* Status */}
            <select
                value={data.project.status}
                onChange={e => updateProject('status', e.target.value)}
                className="border p-2 w-full rounded"
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            {/* Location */}
            <div className="border p-4 rounded space-y-3">
                <h4 className="font-semibold">Location</h4>

                <input
                    type="text"
                    placeholder="Address"
                    value={data.project.location.address}
                    onChange={e => updateNested('location', 'address', e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="text"
                    placeholder="City"
                    value={data.project.location.city}
                    onChange={e => updateNested('location', 'city', e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="text"
                    placeholder="Area"
                    value={data.project.location.area}
                    onChange={e => updateNested('location', 'area', e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    placeholder="Latitude"
                    value={data.project.location.latitude}
                    onChange={e => updateNested('location', 'latitude', e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    placeholder="Longitude"
                    value={data.project.location.longitude}
                    onChange={e => updateNested('location', 'longitude', e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <textarea
                    placeholder="Map Description"
                    value={data.project.location.map_description}
                    onChange={e => updateNested('location', 'map_description', e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Flags */}
            <div className="flex gap-6">
                <label>
                    <input
                        type="checkbox"
                        checked={data.project.featured}
                        onChange={e => updateProject('featured', e.target.checked)}
                    /> Featured
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={data.project.emerging_property}
                        onChange={e => updateProject('emerging_property', e.target.checked)}
                    /> Emerging Property
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={data.project.emerging_area}
                        onChange={e => updateProject('emerging_area', e.target.checked)}
                    /> Emerging Area
                </label>
            </div>

            <button
                onClick={nextStep}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
                Next
            </button>

        </div>
    );
}