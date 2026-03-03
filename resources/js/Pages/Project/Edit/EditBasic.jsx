import { Head, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function EditBasic({ auth, project, builders = [], states = [] }) {
    console.log('Project Data:', project)

    const { data, setData, put, processing, errors: serverErrors } = useForm({
        builder_id: project.builder_id || '',
        name: project.name || '',
        slug: project.slug || '',
        project_type: project.project_type || '',
        price: project.price || '',
        carpet_area: project.carpet_area || '',

        state_id: project.state_id || '',
        city_id: project.city_id || '',
        area_id: project.area_id || '',
        State_name: project.State_name || '',
        city_name: project.city_name || '',
        area_name: project.area_name || '',

        address: project.address || '',
        pincode: project.pincode || '',
        latitude: project.latitude || '',
        longitude: project.longitude || '',

        rera_number: project.rera_number || '',
        launch_date: project.launch_date || '',
        possession_date: project.possession_date || '',
        project_status: project.project_status || '',

        short_description: project.short_description || '',
        description: project.description || '',

        is_featured: project.is_featured || false,
        is_emerging_property: project.is_emerging_property || false,
        is_emerging_area: project.is_emerging_area || false,
        is_new_launch: project.is_new_launch || false,
        is_trending: project.is_trending || false,

        display_order: project.display_order || '',
        status: project.status ?? true,

        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        meta_keywords: project.meta_keywords || '',
        meta_data: project.meta_data || '',
    })

    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [errors, setErrors] = useState({});

    const fieldRefs = {
        builder_id: useRef(null),
        name: useRef(null),
        slug: useRef(null),
        project_type: useRef(null),
        price: useRef(null),
        carpet_area: useRef(null),
        state_id: useRef(null),
        city_id: useRef(null),
        area_id: useRef(null),
        address: useRef(null),
        rera_number: useRef(null),
        project_status: useRef(null),
        pincode: useRef(null),
        latitude: useRef(null),
        longitude: useRef(null),
    };

    // Load cities if state is already selected
    useEffect(() => {
        if (data.state_id) {
            loadCities(data.state_id);
        }
    }, []);

    // Load areas if city is already selected
    useEffect(() => {
        if (data.city_id) {
            loadAreas(data.city_id);
        }
    }, []);

    const handleStateChange = async (stateId) => {
        const selectedState = states.find(s => s._id === stateId);

        setData('state_id', stateId);
        setData('State_name', selectedState?.name || '');
        setData('city_id', '');
        setData('city_name', '');
        setData('area_id', '');
        setData('area_name', '');

        setCities([]);
        setAreas([]);

        if (!stateId) return;

        await loadCities(stateId);
    };

    const handleCityChange = async (cityId) => {
        const selectedCity = cities.find(c => c._id === cityId);

        setData('city_id', cityId);
        setData('city_name', selectedCity?.name || '');
        setData('area_id', '');
        setData('area_name', '');

        setAreas([]);

        if (!cityId) return;

        await loadAreas(cityId);
    };

    const loadCities = async (stateId) => {
        try {
            const res = await axios.get(`/get-cities/${stateId}`);
            setCities(res.data);
        } catch (err) {
            console.error('City load error:', err);
        }
    };

    const loadAreas = async (cityId) => {
        try {
            const res = await axios.get(`/get-areas/${cityId}`);
            setAreas(res.data);
        } catch (err) {
            console.error('Area load error:', err);
        }
    };

    const updateField = (field, value) => {
        setData(field, value);
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateStep = () => {
        let newErrors = {};

        if (!data.builder_id) newErrors.builder_id = 'Builder is required';
        if (!data.name) newErrors.name = 'Project Name is required';
        if (!data.slug) newErrors.slug = 'Slug is required';
        if (!data.project_type) newErrors.project_type = 'Project Type is required';
        if (!data.price) newErrors.price = 'Price Range is required';
        if (!data.carpet_area) newErrors.carpet_area = 'Carpet Area is required';

        if (!data.state_id) newErrors.state_id = 'State is required';
        if (!data.city_id) newErrors.city_id = 'City is required';
        if (!data.area_id) newErrors.area_id = 'Area is required';
        if (!data.address) newErrors.address = 'Address is required';

        if (!data.rera_number) newErrors.rera_number = 'RERA Number is required';
        if (!data.project_status) newErrors.project_status = 'Project Status is required';
        if (!data.pincode) newErrors.pincode = 'Pincode is required';
        if (!data.latitude) newErrors.latitude = 'Latitude is required';
        if (!data.longitude) newErrors.longitude = 'Longitude is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const field = fieldRefs[firstErrorKey]?.current;

            if (field) {
                field.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                field.focus();
            }
            return false;
        }
        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        if (validateStep()) {
            put(route('projects.update.basic', project._id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Basic Details" />

            <div className="p-6 max-w-5xl mx-auto">
                <div className="bg-white shadow rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Edit Project Basic Details</h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Basic Information
                        </span>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Builder Selection */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Builder <span className="text-red-500">*</span>
                                </label>
                                <select
                                    ref={fieldRefs.builder_id}
                                    value={data.builder_id}
                                    onChange={e => updateField('builder_id', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.builder_id ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Builder</option>
                                    {builders.map(b => (
                                        <option key={b._id} value={b._id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.builder_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.builder_id}</p>
                                )}
                                {serverErrors.builder_id && (
                                    <p className="text-red-500 text-xs mt-1">{serverErrors.builder_id}</p>
                                )}
                            </div>

                            {/* Basic Information Header */}
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h3>
                            </div>

                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                                <input
                                    ref={fieldRefs.name}
                                    type="text"
                                    placeholder="e.g., Sunrise Heights"
                                    value={data.name}
                                    onChange={e => updateField('name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400 text-sm">/</span>
                                    <input
                                        ref={fieldRefs.slug}
                                        type="text"
                                        placeholder="sunrise-heights"
                                        value={data.slug}
                                        onChange={e => updateField('slug', e.target.value)}
                                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                            ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
                                )}
                            </div>

                            {/* Project Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                                <input
                                    ref={fieldRefs.project_type}
                                    type="text"
                                    placeholder="Premium Condominiums, Luxury Homes"
                                    value={data.project_type}
                                    onChange={e => updateField('project_type', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.project_type ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.project_type && (
                                    <p className="text-red-500 text-xs mt-1">{errors.project_type}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range *</label>
                                <input
                                    ref={fieldRefs.price}
                                    type="text"
                                    placeholder="50 Lac - 1 Cr"
                                    value={data.price}
                                    onChange={e => updateField('price', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                )}
                            </div>

                            {/* Carpet Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area *</label>
                                <input
                                    ref={fieldRefs.carpet_area}
                                    type="text"
                                    placeholder="e.g., 1200 sq.ft"
                                    value={data.carpet_area}
                                    onChange={e => updateField('carpet_area', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.carpet_area ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.carpet_area && (
                                    <p className="text-red-500 text-xs mt-1">{errors.carpet_area}</p>
                                )}
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

                            {/* Location Details Header */}
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Location Details</h3>
                            </div>

                            {/* State Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                <select
                                    ref={fieldRefs.state_id}
                                    value={data.state_id}
                                    onChange={(e) => handleStateChange(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.state_id ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state._id} value={state._id}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.state_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.state_id}</p>
                                )}
                            </div>

                            {/* City Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                <select
                                    ref={fieldRefs.city_id}
                                    value={data.city_id}
                                    onChange={(e) => handleCityChange(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.city_id ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city._id} value={city._id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>
                                )}
                            </div>

                            {/* Area Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Area *</label>
                                <select
                                    ref={fieldRefs.area_id}
                                    value={data.area_id}
                                    onChange={(e) => {
                                        const areaId = e.target.value;
                                        const selectedArea = (areas || []).find(
                                            a => a._id === areaId
                                        );
                                        setData('area_id', areaId);
                                        setData('area_name', selectedArea?.name || '');
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.area_id ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Area</option>
                                    {areas.map(area => (
                                        <option key={area._id} value={area._id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.area_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.area_id}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                <input
                                    ref={fieldRefs.pincode}
                                    type="number"
                                    placeholder="e.g., 400001"
                                    value={data.pincode}
                                    onChange={e => updateField('pincode', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.pincode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                <input
                                    ref={fieldRefs.address}
                                    type="text"
                                    placeholder="Full address of the project"
                                    value={data.address}
                                    onChange={e => updateField('address', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>

                            {/* Coordinates */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                                <input
                                    ref={fieldRefs.latitude}
                                    type="number"
                                    placeholder="e.g., 19.0760"
                                    step="any"
                                    value={data.latitude}
                                    onChange={e => updateField('latitude', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.latitude && (
                                    <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                                <input
                                    ref={fieldRefs.longitude}
                                    type="number"
                                    placeholder="e.g., 72.8777"
                                    step="any"
                                    value={data.longitude}
                                    onChange={e => updateField('longitude', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.longitude && (
                                    <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
                                )}
                            </div>

                            {/* Project Details Header */}
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Project Details</h3>
                            </div>

                            {/* RERA Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">RERA Number *</label>
                                <input
                                    ref={fieldRefs.rera_number}
                                    type="text"
                                    placeholder="e.g., RERA/2024/001"
                                    value={data.rera_number}
                                    onChange={e => updateField('rera_number', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors
                                        ${errors.rera_number ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.rera_number && (
                                    <p className="text-red-500 text-xs mt-1">{errors.rera_number}</p>
                                )}
                            </div>

                            {/* Dates */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Possession Date</label>
                                <input
                                    type="date"
                                    value={data.possession_date ? data.possession_date.slice(0, 10) : ''}
                                    onChange={e => updateField('possession_date', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Launch Date</label>
                                <input
                                    type="date"
                                    value={data.launch_date ? data.launch_date.slice(0, 10) : ''}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Status *</label>
                                <select
                                    ref={fieldRefs.project_status}
                                    value={data.project_status}
                                    onChange={e => updateField('project_status', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors bg-white
                                        ${errors.project_status ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Status</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="ready_to_move">Ready to Move</option>
                                </select>
                                {errors.project_status && (
                                    <p className="text-red-500 text-xs mt-1">{errors.project_status}</p>
                                )}
                            </div>

                            {/* Flags/Tags */}
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

                            {/* SEO Information Header */}
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">SEO Information</h3>
                            </div>

                            {/* Meta Title */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={e => updateField('meta_title', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="SEO title (optional)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                            </div>

                            {/* Meta Description */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                <textarea
                                    value={data.meta_description}
                                    onChange={e => updateField('meta_description', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    rows="3"
                                    placeholder="SEO description (optional)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                            </div>

                            {/* Meta Keywords */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={data.meta_keywords}
                                    onChange={e => updateField('meta_keywords', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="amenity, hotel, pool, ..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                            </div>

                            {/* Meta Data JSON */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Data (JSON)</label>
                                <textarea
                                    value={data.meta_data}
                                    onChange={e => updateField('meta_data', e.target.value)}
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
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{processing ? 'Updating...' : 'Update Project'}</span>
                                {!processing && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}