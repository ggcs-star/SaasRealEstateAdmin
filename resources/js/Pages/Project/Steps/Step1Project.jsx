import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import axios from "axios";
import ProjectLocationMap from "@/Components/ProjectLocationMap";

const Step1Project = forwardRef(function Step1Project(
    {
        data,
        setData,
        builders = [],
        states = []
    }, ref) {

    const updateField = useCallback((field, value) => {
        setData(field, value);
    }, [setData]);

    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState({
        cities: false,
        areas: false
    });

    useEffect(() => {
        if (data.state_id) {
            loadCities(data.state_id);
        }
    }, [data.state_id]);

    useEffect(() => {
        if (data.city_id) {
            loadAreas(data.city_id);
        }
    }, [data.city_id]);

    const handleStateChange = async (stateId) => {
        setData("state_id", stateId);

        setData("city_id", "");
        setData("area_id", "");

        setCities([]);
        setAreas([]);

        if (!stateId) return;

        await loadCities(stateId);
    };

    const handleCityChange = async (cityId) => {

        setData("city_id", cityId);

        setData("area_id", "");

        setAreas([]);

        if (!cityId) return;

        await loadAreas(cityId);
    };

    const loadCities = async (stateId) => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
            const res = await axios.get(`/get-cities/${stateId}`);
            setCities(res.data);
        } catch (err) {
            console.error("City load error:", err);
        } finally {
            setLoading(prev => ({ ...prev, cities: false }));
        }
    };

    const loadAreas = async (cityId) => {
        setLoading(prev => ({ ...prev, areas: true }));
        try {
            const res = await axios.get(`/get-areas/${cityId}`);
            setAreas(res.data);
        } catch (err) {
            console.error("Area load error:", err);
        } finally {
            setLoading(prev => ({ ...prev, areas: false }));
        }
    };

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const fieldRefs = {
        builder_id: useRef(null),
        name: useRef(null),
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

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    };

    const validateField = (field) => {
        let fieldError = null;

        switch (field) {
            case 'builder_id':
                if (!data.builder_id) fieldError = "Builder is required";
                break;
            case 'name':
                if (!data.name) fieldError = "Project Name is required";
                break;
            case 'project_type':
                if (!data.project_type) fieldError = "Project Type is required";
                break;
            case 'price':
                if (!data.price) fieldError = "Starting Price is required";
                break;
            case 'carpet_area':
                if (!data.carpet_area) fieldError = "Carpet Area is required";
                break;
            case 'state_id':
                if (!data.state_id) fieldError = "State is required";
                break;
            case 'city_id':
                if (!data.city_id) fieldError = "City is required";
                break;
            case 'area_id':
                if (!data.area_id) fieldError = "Area is required";
                break;
            case 'address':
                if (!data.address) fieldError = "Address is required";
                break;
            case 'rera_number':
                if (!data.rera_number) fieldError = "RERA Number is required";
                break;
            case 'project_status':
                if (!data.project_status) fieldError = "Project Status is required";
                break;
            case 'pincode':
                if (!data.pincode) fieldError = "Pincode is required";
                break;
            case 'latitude':
                if (!data.latitude) fieldError = "Latitude is required";
                break;
            case 'longitude':
                if (!data.longitude) fieldError = "Longitude is required";
                break;
        }

        setErrors(prev => ({ ...prev, [field]: fieldError }));
        return !fieldError;
    };

    const validateStep = () => {
        let newErrors = {};
        let isValid = true;

        // Validate all required fields
        Object.keys(fieldRefs).forEach(field => {
            const fieldValid = validateField(field);
            if (!fieldValid) {
                isValid = false;
                newErrors[field] = errors[field];
            }
        });

        if (!isValid) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const field = fieldRefs[firstErrorKey]?.current;

            if (field) {
                field.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                field.focus();
            }

            return false;
        }

        return true;
    };

    useImperativeHandle(ref, () => ({
        validate: validateStep
    }));

    // Memoize InputField component to prevent unnecessary re-renders
    const InputField = useCallback(({ label, required = false, error, children, htmlFor }) => (
        <div className="space-y-1.5">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    ), []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Builder Selection - Full Width */}
                <div className="lg:col-span-2">
                    <InputField label="Builder" required error={touched.builder_id && errors.builder_id} htmlFor="builder_id">
                        <select
                            id="builder_id"
                            ref={fieldRefs.builder_id}
                            value={data.builder_id || ''}
                            onChange={e => updateField('builder_id', e.target.value)}
                            onBlur={() => handleBlur('builder_id')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 appearance-none bg-white
                                ${touched.builder_id && errors.builder_id
                                    ? "border-red-300 bg-red-50"
                                    : data.builder_id
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        >
                            <option value="">Select Builder</option>
                            {builders.map(b => (
                                <option key={b._id} value={b._id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </InputField>
                </div>

                {/* Section Divider */}
                <div className="lg:col-span-2">
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="bg-white pr-4 text-sm font-medium text-gray-500">Basic Information</span>
                        </div>
                    </div>
                </div>

                {/* Project Name */}
                <div>
                    <InputField label="Project Name" required error={touched.name && errors.name} htmlFor="name">
                        <input
                            id="name"
                            ref={fieldRefs.name}
                            type="text"
                            placeholder="e.g., Sunrise Heights"
                            value={data.name || ''}
                            onChange={e => updateField('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                ${touched.name && errors.name
                                    ? "border-red-300 bg-red-50"
                                    : data.name
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        />
                    </InputField>
                </div>

                {/* Project Type */}
                <div>
                    <InputField label="Project Type" required error={touched.project_type && errors.project_type} htmlFor="project_type">
                        <select
                            id="project_type"
                            ref={fieldRefs.project_type}
                            value={data.project_type || ''}
                            onChange={e => updateField('project_type', e.target.value)}
                            onBlur={() => handleBlur('project_type')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white
                                ${touched.project_type && errors.project_type
                                    ? "border-red-300 bg-red-50"
                                    : data.project_type
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        >
                            <option value="">Select Type</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Premium">Premium</option>
                            <option value="Ultra Luxury">Ultra Luxury</option>
                            <option value="Affordable">Affordable</option>
                            <option value="Budget">Budget</option>
                            <option value="Mid Segment">Mid Segment</option>
                        </select>
                    </InputField>
                </div>

                {/* Price */}
                <div>
                    <InputField label="Starting Price" required error={touched.price && errors.price} htmlFor="price">
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-400">₹</span>
                            <input
                                id="price"
                                ref={fieldRefs.price}
                                type="text"
                                placeholder="50 Lac"
                                value={data.price || ''}
                                onChange={e => updateField('price', e.target.value)}
                                onBlur={() => handleBlur('price')}
                                className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                    ${touched.price && errors.price
                                        ? "border-red-300 bg-red-50"
                                        : data.price
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 hover:border-indigo-200"
                                    }`}
                            />
                        </div>
                    </InputField>
                </div>

                {/* Carpet Area */}
                <div>
                    <InputField label="Carpet Area" required error={touched.carpet_area && errors.carpet_area} htmlFor="carpet_area">
                        <div className="relative">
                            <input
                                id="carpet_area"
                                type="number"
                                placeholder="1200"
                                ref={fieldRefs.carpet_area}
                                value={data.carpet_area ? data.carpet_area.replace(" sq.ft", "") : ""}
                                onChange={(e) => {
                                    const onlyNumber = e.target.value;
                                    updateField("carpet_area", onlyNumber ? `${onlyNumber} sq.ft` : "");
                                }}
                                onBlur={() => handleBlur('carpet_area')}
                                className={`w-full px-4 py-3 pr-16 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                    ${touched.carpet_area && errors.carpet_area
                                        ? "border-red-300 bg-red-50"
                                        : data.carpet_area
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 hover:border-indigo-200"
                                    }`}
                            />
                            <span className="absolute right-4 top-3 text-gray-400 text-sm">
                                sq.ft
                            </span>
                        </div>
                    </InputField>
                </div>

                {/* Descriptions */}
                <div className="lg:col-span-2">
                    <InputField label="Short Description" htmlFor="short_description">
                        <textarea
                            id="short_description"
                            placeholder="Brief overview of the project (max 200 characters)"
                            value={data.short_description || ''}
                            onChange={e => updateField('short_description', e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none hover:border-indigo-200"
                            maxLength="200"
                        />
                        <div className="flex justify-end mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${(data.short_description?.length || 0) > 180
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {data.short_description?.length || 0}/200
                            </span>
                        </div>
                    </InputField>
                </div>

                <div className="lg:col-span-2">
                    <InputField label="Full Description" htmlFor="description">
                        <textarea
                            id="description"
                            placeholder="Detailed description of the project..."
                            value={data.description || ''}
                            onChange={e => updateField('description', e.target.value)}
                            rows="5"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-y hover:border-indigo-200"
                        />
                    </InputField>
                </div>

                {/* Location Section Divider */}
                <div className="lg:col-span-2">
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="bg-white pr-4 text-sm font-medium text-gray-500">Location Details</span>
                        </div>
                    </div>
                </div>

                {/* Map Component */}
                <div className="lg:col-span-2">
                    {/* <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <ProjectLocationMap setData={setData} />
                    </div> */}
                </div>

                <div className="lg:col-span-2">
                    <InputField label="Address" required error={touched.address && errors.address} htmlFor="address">
                        <input
                            id="address"
                            type="text"
                            placeholder="Full address of the project"
                            ref={fieldRefs.address}
                            value={data.address || ''}
                            onChange={e => updateField('address', e.target.value)}
                            onBlur={() => handleBlur('address')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                ${touched.address && errors.address
                                    ? "border-red-300 bg-red-50"
                                    : data.address
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        />
                    </InputField>
                </div>
                {/* Location Selects */}
                <div>
                    <InputField label="State" required error={touched.state_id && errors.state_id} htmlFor="state_id">
                        <select
                            id="state_id"
                            ref={fieldRefs.state_id}
                            value={data.state_id || ''}
                            onChange={(e) => handleStateChange(e.target.value)}
                            onBlur={() => handleBlur('state_id')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white
                                ${touched.state_id && errors.state_id
                                    ? "border-red-300 bg-red-50"
                                    : data.state_id
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        >
                            <option value="">Select State</option>
                            {states.map(state => (
                                <option key={state._id} value={state._id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </InputField>
                </div>

                <div>
                    <InputField label="City" required error={touched.city_id && errors.city_id} htmlFor="city_id">
                        <div className="relative">
                            <select
                                id="city_id"
                                ref={fieldRefs.city_id}
                                value={data.city_id || ''}
                                onChange={(e) => handleCityChange(e.target.value)}
                                onBlur={() => handleBlur('city_id')}
                                disabled={!data.state_id || loading.cities}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white
                                    ${touched.city_id && errors.city_id
                                        ? "border-red-300 bg-red-50"
                                        : data.city_id
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 hover:border-indigo-200"
                                    }
                                    ${(!data.state_id || loading.cities) ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <option value="">
                                    {loading.cities ? 'Loading cities...' : 'Select City'}
                                </option>
                                {cities.map(city => (
                                    <option key={city._id} value={city._id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {loading.cities && (
                                <div className="absolute right-3 top-3">
                                    <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </InputField>
                </div>

                <div>
                    <InputField label="Area" required error={touched.area_id && errors.area_id} htmlFor="area_id">
                        <div className="relative">
                            <select
                                id="area_id"
                                ref={fieldRefs.area_id}
                                value={data.area_id || ''}
                                onChange={(e) => {
                                    const areaId = e.target.value;
                                    setData("area_id", areaId);
                                }}
                                onBlur={() => handleBlur('area_id')}
                                disabled={!data.city_id || loading.areas}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white
                                    ${touched.area_id && errors.area_id
                                        ? "border-red-300 bg-red-50"
                                        : data.area_id
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 hover:border-indigo-200"
                                    }
                                        ${(!data.city_id || loading.areas) ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                            >
                                <option value="">
                                    {loading.areas ? 'Loading areas...' : 'Select Area'}
                                </option>
                                {areas.map(area => (
                                    <option key={area._id} value={area._id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                            {loading.areas && (
                                <div className="absolute right-3 top-3">
                                    <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </InputField>
                </div>

                <div>
                    <InputField label="Pincode" required error={touched.pincode && errors.pincode} htmlFor="pincode">
                        <input
                            id="pincode"
                            ref={fieldRefs.pincode}
                            type="number"
                            placeholder="e.g., 400001"
                            value={data.pincode || ''}
                            onChange={e => updateField('pincode', e.target.value)}
                            onBlur={() => handleBlur('pincode')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                ${touched.pincode && errors.pincode
                                    ? "border-red-300 bg-red-50"
                                    : data.pincode
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        />Address
                    </InputField>
                </div>



                {/* Coordinates */}
                <div>
                    <InputField label="Latitude" required error={touched.latitude && errors.latitude} htmlFor="latitude">
                        <input
                            id="latitude"
                            ref={fieldRefs.latitude}
                            type="number"
                            placeholder="e.g., 19.0760"
                            step="any"
                            value={data.latitude || ''}
                            onChange={e => updateField('latitude', e.target.value)}
                            onBlur={() => handleBlur('latitude')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                ${touched.latitude && errors.latitude
                                    ? "border-red-300 bg-red-50"
                                    : data.latitude
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        />
                    </InputField>
                </div>

                <div>
                    <InputField label="Longitude" required error={touched.longitude && errors.longitude} htmlFor="longitude">
                        <input
                            id="longitude"
                            ref={fieldRefs.longitude}
                            type="number"
                            placeholder="e.g., 72.8777"
                            step="any"
                            value={data.longitude || ''}
                            onChange={e => updateField('longitude', e.target.value)}
                            onBlur={() => handleBlur('longitude')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                ${touched.longitude && errors.longitude
                                    ? "border-red-300 bg-red-50"
                                    : data.longitude
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        />
                    </InputField>
                </div>

                {/* Project Details Section Divider */}
                <div className="lg:col-span-2">
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="bg-white pr-4 text-sm font-medium text-gray-500">Project Details</span>
                        </div>
                    </div>
                </div>

                {/* RERA */}
                <div>
                    <InputField label="RERA Number" required error={touched.rera_number && errors.rera_number} htmlFor="rera_number">
                        <input
                            id="rera_number"
                            ref={fieldRefs.rera_number}
                            type="text"
                            placeholder="e.g., RERA/2024/001"
                            value={data.rera_number || ''}
                            onChange={e => updateField('rera_number', e.target.value)}
                            onBlur={() => handleBlur('rera_number')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                                ${touched.rera_number && errors.rera_number
                                    ? "border-red-300 bg-red-50"
                                    : data.rera_number
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        />
                    </InputField>
                </div>

                {/* Dates */}
                <div>
                    <InputField label="Possession Date" htmlFor="possession_date">
                        <input
                            id="possession_date"
                            type="date"
                            value={data.possession_date ? data.possession_date.slice(0, 10) : ''}
                            onChange={e => updateField('possession_date', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-200"
                        />
                    </InputField>
                </div>

                <div>
                    <InputField label="Launch Date" htmlFor="launch_date">
                        <input
                            id="launch_date"
                            type="date"
                            value={data.launch_date ? data.launch_date.slice(0, 10) : ''}
                            onChange={e => updateField('launch_date', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-200"
                        />
                    </InputField>
                </div>

                {/* Display Order */}
                <div>
                    <InputField label="Display Order" htmlFor="display_order">
                        <input
                            id="display_order"
                            type="number"
                            placeholder="Priority (lower = higher)"
                            value={data.display_order || ''}
                            onChange={e => updateField('display_order', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-200"
                        />
                    </InputField>
                </div>

                {/* Project Status */}
                <div>
                    <InputField label="Project Status" required error={touched.project_status && errors.project_status} htmlFor="project_status">
                        <select
                            id="project_status"
                            ref={fieldRefs.project_status}
                            value={data.project_status || ''}
                            onChange={e => updateField('project_status', e.target.value)}
                            onBlur={() => handleBlur('project_status')}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white
                                ${touched.project_status && errors.project_status
                                    ? "border-red-300 bg-red-50"
                                    : data.project_status
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-200 hover:border-indigo-200"
                                }`}
                        >
                            <option value="">Select Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="ready_to_move">Ready to Move</option>
                        </select>
                    </InputField>
                </div>

                {/* Flags */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Project Tags
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            { key: 'is_featured', label: 'Featured', color: 'purple' },
                            { key: 'is_emerging_property', label: 'Emerging Property', color: 'blue' },
                            { key: 'is_emerging_area', label: 'Emerging Area', color: 'green' },
                            { key: 'is_new_launch', label: 'New Launch', color: 'orange' },
                            { key: 'is_trending', label: 'Trending', color: 'pink' }
                        ].map(tag => (
                            <label
                                key={tag.key}
                                className={`relative flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200
                                    ${data[tag.key]
                                        ? `border-${tag.color}-200 bg-${tag.color}-50`
                                        : 'border-gray-200 hover:border-indigo-200 bg-white'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={data[tag.key] || false}
                                    onChange={e => updateField(tag.key, e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <span className={`text-sm font-medium ${data[tag.key] ? `text-${tag.color}-700` : 'text-gray-700'
                                    }`}>
                                    {tag.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Active Status */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex space-x-4">
                        <label className={`flex items-center space-x-3 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 flex-1
                            ${data.status === true
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 hover:border-indigo-200 bg-white'
                            }`}>
                            <input
                                type="radio"
                                value="true"
                                checked={data.status === true}
                                onChange={e => updateField('status', true)}
                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-700">Active</span>
                                <span className="text-xs text-gray-500">Project is visible to users</span>
                            </div>
                        </label>
                        <label className={`flex items-center space-x-3 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 flex-1
                            ${data.status === false
                                ? 'border-red-200 bg-red-50'
                                : 'border-gray-200 hover:border-indigo-200 bg-white'
                            }`}>
                            <input
                                type="radio"
                                value="false"
                                checked={data.status === false}
                                onChange={e => updateField('status', false)}
                                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-700">Inactive</span>
                                <span className="text-xs text-gray-500">Project is hidden from users</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* SEO Information Section Divider */}
                <div className="lg:col-span-2">
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="bg-white pr-4 text-sm font-medium text-gray-500">SEO Information</span>
                        </div>
                    </div>
                </div>

                {/* SEO Fields */}
                <div className="lg:col-span-2">
                    <InputField label="Meta Title" htmlFor="meta_title">
                        <input
                            id="meta_title"
                            type="text"
                            value={data.meta_title || ''}
                            onChange={e => setData('meta_title', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-200"
                            placeholder="SEO title (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Recommended: 50-60 characters
                        </p>
                    </InputField>
                </div>

                <div className="lg:col-span-2">
                    <InputField label="Meta Description" htmlFor="meta_description">
                        <textarea
                            id="meta_description"
                            value={data.meta_description || ''}
                            onChange={e => setData('meta_description', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-200"
                            rows="3"
                            placeholder="SEO description (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Recommended: 150-160 characters
                        </p>
                    </InputField>
                </div>

                <div className="lg:col-span-2">
                    <InputField label="Meta Keywords" htmlFor="meta_keywords">
                        <input
                            id="meta_keywords"
                            type="text"
                            value={data.meta_keywords || ''}
                            onChange={e => setData('meta_keywords', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-200"
                            placeholder="amenity, hotel, pool, ..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate keywords with commas
                        </p>
                    </InputField>
                </div>

                {/* <div className="lg:col-span-2">
                    <InputField label="Meta Data (JSON)" htmlFor="meta_data">
                        <textarea
                            id="meta_data"
                            value={data.meta_data || ''}
                            onChange={e => setData('meta_data', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-mono text-sm hover:border-indigo-200"
                            rows="4"
                            placeholder='{\n  "key": "value"\n}'
                        />
                    </InputField>
                </div> */}
            </div>
        </div>
    );
});

export default Step1Project;