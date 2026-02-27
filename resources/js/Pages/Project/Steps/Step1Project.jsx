import { useEffect, useState } from "react";
import axios from "axios";
export default function Step1Project({
    data,
    setData,
    nextStep,
    builders = [],
    states = []
}) {
    // console.log("Step1 data:", data);
    
    const updateField = (field, value) => {
        setData(field, value);
    };
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    useEffect(() => {
    if (data.state_id) {
        loadCities(data.state_id);
    }
}, []);

useEffect(() => {
    if (data.city_id) {
        loadAreas(data.city_id);
    }
}, []);
  const handleStateChange = async (stateId) => {
    const selectedState = states.find(s => s._id === stateId);

    setData("state_id", stateId);
    setData("State_name", selectedState?.name || "");

    setData("city_id", "");
    setData("city_name", "");
    setData("area_id", "");
    setData("area_name", "");

    setCities([]);
    setAreas([]);

    if (!stateId) return;

    await loadCities(stateId);
};

const handleCityChange = async (cityId) => {
    const selectedCity = cities.find(c => c._id === cityId);

    setData("city_id", cityId);
    setData("city_name", selectedCity?.name || "");

    setData("area_id", "");
    setData("area_name", "");

    setAreas([]);

    if (!cityId) return;

    await loadAreas(cityId);
};
    const loadCities = async (stateId) => {
    try {
        const res = await axios.get(`/get-cities/${stateId}`);
        setCities(res.data);
    } catch (err) {
        console.error("City load error:", err);
    }
};

const loadAreas = async (cityId) => {
    try {
        const res = await axios.get(`/get-areas/${cityId}`);
        setAreas(res.data);
    } catch (err) {
        console.error("Area load error:", err);
    }
};
    return (
        <div className="space-y-8">
            {/* Header with progress indicator */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Step 1 of 4
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Builder Selection - Full width on mobile, half on desktop */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Builder <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.builder_id}
                        onChange={e => updateField('builder_id', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                        <option value="">Select Builder</option>
                        {builders.map(b => (
                            <option key={b._id} value={b._id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Basic Information Group */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h3>
                </div>

                {/* Project Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Sunrise Heights"
                        value={data.name}
                        onChange={e => updateField('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 text-sm">/</span>
                        <input
                            type="text"
                            placeholder="sunrise-heights"
                            value={data.slug}
                            onChange={e => updateField('slug', e.target.value)}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Project Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <input
                        type="text"
                        placeholder="Premium Condominiums, Luxury Homes"
                        value={data.project_type}
                        onChange={e => updateField('project_type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <input
                        type="text"
                        placeholder="50 Lac - 1 Cr"
                        value={data.price}
                        onChange={e => updateField('price', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Carpet Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area</label>
                    <input
                        type="text"
                        placeholder="e.g., 1200 sq.ft"
                        value={data.carpet_area}
                        onChange={e => updateField('carpet_area', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Descriptions */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <textarea
                        placeholder="Brief overview of the project (max 200 characters)"
                        value={data.short_description}
                        onChange={e => updateField('short_description', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {data.short_description?.length || 0}/200 characters
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                    <textarea
                        placeholder="Detailed description of the project..."
                        value={data.description}
                        onChange={e => updateField('description', e.target.value)}
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                    />
                </div>

                {/* Location Information */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Location Details</h3>
                </div>

                {/* Location Selects */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                        value={data.state_id}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                        <option value="">Select State</option>
                        {states.map(state => (
                            <option key={state._id} value={state._id}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                        value={data.city_id}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city._id} value={city._id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <select
                        value={data.area_id}
                        onChange={(e) => {
                            const areaId = e.target.value;
                            const selectedArea = (areas || []).find(
                                a => a._id === areaId
                            );
                            setData("area_id", areaId);
                            setData("area_name", selectedArea?.name || "");
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                        <option value="">Select Area</option>
                        {areas.map(area => (
                            <option key={area._id} value={area._id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                        type="number"
                        placeholder="e.g., 400001"
                        value={data.pincode}
                        onChange={e => updateField('pincode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                        type="text"
                        placeholder="Full address of the project"
                        value={data.address}
                        onChange={e => updateField('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Coordinates */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                        type="number"
                        placeholder="e.g., 19.0760"
                        step="any"
                        value={data.latitude}
                        onChange={e => updateField('latitude', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                        type="number"
                        placeholder="e.g., 72.8777"
                        step="any"
                        value={data.longitude}
                        onChange={e => updateField('longitude', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Project Details */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Project Details</h3>
                </div>

                {/* RERA */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RERA Number</label>
                    <input
                        type="text"
                        placeholder="e.g., RERA/2024/001"
                        value={data.rera_number}
                        onChange={e => updateField('rera_number', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Dates */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Possession Date</label>
                    <input
                        type="date"
                        value={data.possession_date}
                        onChange={e => updateField('possession_date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Launch Date</label>
                    <input
                        type="date"
                        value={data.launch_date}
                        onChange={e => updateField('launch_date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Display Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                    <input
                        type="number"
                        placeholder="Priority (lower = higher)"
                        value={data.display_order}
                        onChange={e => updateField('display_order', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Project Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Status</label>
                    <select
                        value={data.project_status}
                        onChange={e => updateField('project_status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                        <option value="">Select Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="ready_to_move">Ready to Move</option>
                    </select>
                </div>

                {/* Flags */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Project Tags</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={e => updateField('is_featured', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Featured</span>
                        </label>

                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={data.is_emerging_property}
                                onChange={e => updateField('is_emerging_property', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Emerging Property</span>
                        </label>

                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={data.is_emerging_area}
                                onChange={e => updateField('is_emerging_area', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Emerging Area</span>
                        </label>

                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={data.is_new_launch}
                                onChange={e => updateField('is_new_launch', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">New Launch</span>
                        </label>

                        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={data.is_trending}
                                onChange={e => updateField('is_trending', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Trending</span>
                        </label>
                    </div>
                </div>

                {/* Active Status */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex space-x-6 p-4 bg-gray-50 rounded-lg">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="true"
                                checked={data.status === true}
                                onChange={e => updateField('status', true)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="false"
                                checked={data.status === false}
                                onChange={e => updateField('status', false)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Inactive</span>
                        </label>
                    </div>
                </div>

                {/* SEO Information */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">SEO Information</h3>
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                    </label>
                    <input
                        type="text"
                        value={data.meta_title}
                        onChange={e => setData('meta_title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="SEO title (optional)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Recommended: 50-60 characters
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                    </label>
                    <textarea
                        value={data.meta_description}
                        onChange={e => setData('meta_description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        rows="3"
                        placeholder="SEO description (optional)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Recommended: 150-160 characters
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords
                    </label>
                    <input
                        type="text"
                        value={data.meta_keywords}
                        onChange={e => setData('meta_keywords', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="amenity, hotel, pool, ..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Separate keywords with commas
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Data (JSON)
                    </label>
                    <textarea
                        value={data.meta_data}
                        onChange={e => setData('meta_data', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
                        rows="4"
                        placeholder='{
  "key": "value"
}'
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">

                <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center space-x-2"
                >
                    <span>Next Step</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}