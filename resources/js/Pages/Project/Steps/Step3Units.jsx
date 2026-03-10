import { useState, forwardRef, useImperativeHandle } from "react";
import {
    Plus, Trash2, ChevronDown, ChevronUp, Building2,
    Layers, Home, Ruler, Grid3x3, AlertCircle, Warehouse,
    TreePine, DoorOpen, Bath, BedDouble, Copy, Hash
} from "lucide-react";

const Step3Units = forwardRef(function Step3Units(
    { data, setData, prevStep, nextStep, propertyTypes = [], unitTypes = [] },
    ref
) {
    const towers = data.towers || [];

    // Property Types Constants
    const PROPERTY_CATEGORIES = {
        APARTMENT: 'apartment',
        VILLA: 'villa/bungalow',
        BUNGALOW: 'bungalow',
        DUPLEX: 'duplex',
        PENTHOUSE: 'penthouse'
    };

    const addTower = () => {
        const newTowers = [
            ...towers,
            {
                name: "",
                id: "tw_" + Date.now(),
                 category: PROPERTY_CATEGORIES.APARTMENT,
                type: PROPERTY_CATEGORIES.APARTMENT,
                total_floors: 0,
                floor_designs: [],
                unit_ranges: [],
                units: [],
                status: true
            }
        ];
        setData("towers", newTowers);
        setActiveTower(towers.length);
    };

    const updateTower = (t, field, value) => {
        let updated = [...towers];

        if (field === 'category') {
            updated[t] = {
                ...updated[t],
                [field]: value,
                floor_designs: [],
                unit_ranges: [],
                units: [],
                total_floors: value === PROPERTY_CATEGORIES.VILLA ? 0 : 1
            };
        } else {
            updated[t][field] = value;
        }

        setData("towers", updated);
    };

    // For Apartment: Add floor range
    const addFloorDesign = (t) => {
        let updated = [...towers];
        updated[t].floor_designs.push({
            from_floor: 1,
            to_floor: 1,
            units_per_floor: 1,
            property_type_id: "",
            unit_type_id: "",
            unit_size: "",
            room_sizes: {}
        });
        setData("towers", updated);
    };

    const addUnitRange = (t) => {
        let updated = [...towers];
        updated[t].unit_ranges.push({
            from_unit: 1,
            to_unit: 1,
            unit_prefix: "Villa",
            unit_suffix: "",
            unit_size: "",
            plot_area: "",
            property_type_id: "",
            unit_type_id: "",
            room_sizes: {}
        });
        setData("towers", updated);

        setExpandedUnitRanges(prev => ({
            ...prev,
            [`${t}-${updated[t].unit_ranges.length - 1}`]: true
        }));
    };

    const generateUnitsFromRange = (tower, range) => {
        const units = [];
        const from = parseInt(range.from_unit) || 1;
        const to = parseInt(range.to_unit) || 1;

        for (let i = from; i <= to; i++) {
            const unitNumber = range.unit_prefix +
                (range.unit_suffix ? ` ${range.unit_suffix}` : '') +
                (to - from > 0 ? ` ${i}` : '');

            units.push({
                unit_number: unitNumber,
                unit_name: unitNumber,
                bedrooms: range.bedrooms,
                bathrooms: range.bathrooms,
                halls: range.halls,
                kitchens: range.kitchens,
                unit_size: range.unit_size,
                plot_area: range.plot_area,
                property_type_id: range.property_type_id,
                unit_type_id: range.unit_type_id,
                amenities: { ...range.amenities },
                room_sizes: { ...range.room_sizes }
            });
        }
        return units;
    };

    // Apply all unit ranges to generate units
    const applyUnitRanges = (t) => {
        let updated = [...towers];
        const tower = updated[t];
        let allUnits = [];

        tower.unit_ranges.forEach(range => {
            const generatedUnits = generateUnitsFromRange(tower, range);
            allUnits = [...allUnits, ...generatedUnits];
        });

        updated[t].units = allUnits;
        setData("towers", updated);

        // Auto show generated units
        setShowGeneratedUnits(prev => ({
            ...prev,
            [t]: true
        }));
    };

    const updateFloorDesign = (t, f, field, value) => {
        let updated = [...towers];
        updated[t].floor_designs[f][field] = value;
        setData("towers", updated);
    };

    const updateUnitRange = (t, r, field, value) => {
        let updated = [...towers];

        // Handle nested objects like amenities
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            updated[t].unit_ranges[r][parent] = {
                ...updated[t].unit_ranges[r][parent],
                [child]: value
            };
        } else {
            updated[t].unit_ranges[r][field] = value;
        }

        setData("towers", updated);
    };

    const updateUnit = (t, u, field, value) => {
        let updated = [...towers];

        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            updated[t].units[u][parent] = {
                ...updated[t].units[u][parent],
                [child]: value
            };
        } else {
            updated[t].units[u][field] = value;
        }

        setData("towers", updated);
    };

    const removeFloorDesign = (t, f) => {
        let updated = [...towers];
        updated[t].floor_designs = updated[t].floor_designs.filter((_, i) => i !== f);
        setData("towers", updated);
    };

    const removeUnitRange = (t, r) => {
        let updated = [...towers];
        updated[t].unit_ranges = updated[t].unit_ranges.filter((_, i) => i !== r);
        setData("towers", updated);
    };

    const removeUnit = (t, u) => {
        let updated = [...towers];
        updated[t].units = updated[t].units.filter((_, i) => i !== u);
        setData("towers", updated);
    };

    const removeTower = (t) => {
        if (window.confirm("Are you sure you want to remove this property? This action cannot be undone.")) {
            const updated = towers.filter((_, i) => i !== t);
            setData("towers", updated);
            if (activeTower === t) {
                setActiveTower(null);
            } else if (activeTower > t) {
                setActiveTower(activeTower - 1);
            }
        }
    };

    const [activeTower, setActiveTower] = useState(null);
    const [expandedRanges, setExpandedRanges] = useState({});
    const [expandedUnitRanges, setExpandedUnitRanges] = useState({});
    const [expandedUnits, setExpandedUnits] = useState({});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showGeneratedUnits, setShowGeneratedUnits] = useState({});

    const toggleRange = (towerIdx, rangeIdx) => {
        setExpandedRanges(prev => ({
            ...prev,
            [`${towerIdx}-${rangeIdx}`]: !prev[`${towerIdx}-${rangeIdx}`]
        }));
    };

    const toggleUnitRange = (towerIdx, rangeIdx) => {
        setExpandedUnitRanges(prev => ({
            ...prev,
            [`${towerIdx}-${rangeIdx}`]: !prev[`${towerIdx}-${rangeIdx}`]
        }));
    };

    const toggleUnit = (towerIdx, unitIdx) => {
        setExpandedUnits(prev => ({
            ...prev,
            [`${towerIdx}-${unitIdx}`]: !prev[`${towerIdx}-${unitIdx}`]
        }));
    };

    const toggleGeneratedUnits = (towerIdx) => {
        setShowGeneratedUnits(prev => ({
            ...prev,
            [towerIdx]: !prev[towerIdx]
        }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validateStep = () => {
        let newErrors = {};
        let hasErrors = false;

        if (towers.length === 0) {
            alert("At least one property is required");
            return false;
        }

        towers.forEach((tower, t) => {
            if (!tower.name?.trim()) {
                newErrors[`tower_name_${t}`] = "Property name is required";
                hasErrors = true;
            }

            if (!tower.category) {
                newErrors[`tower_category_${t}`] = "Property category is required";
                hasErrors = true;
            }

            if (tower.category === PROPERTY_CATEGORIES.APARTMENT) {
                if (!tower.total_floors || tower.total_floors <= 0) {
                    newErrors[`tower_floors_${t}`] = "Total floors must be greater than 0";
                    hasErrors = true;
                }

                if (!tower.floor_designs || tower.floor_designs.length === 0) {
                    newErrors[`tower_range_${t}`] = "At least one floor range required";
                    hasErrors = true;
                }

                tower.floor_designs.forEach((range, f) => {
                    if (!range.from_floor && range.from_floor !== 0) {
                        newErrors[`from_floor_${t}_${f}`] = "From floor required";
                        hasErrors = true;
                    }

                    if (!range.to_floor && range.to_floor !== 0) {
                        newErrors[`to_floor_${t}_${f}`] = "To floor required";
                        hasErrors = true;
                    }

                    if (!range.units_per_floor || range.units_per_floor <= 0) {
                        newErrors[`units_${t}_${f}`] = "Units per floor required";
                        hasErrors = true;
                    }

                    if (!range.property_type_id) {
                        newErrors[`property_${t}_${f}`] = "Property type required";
                        hasErrors = true;
                    }

                    if (range.to_floor < range.from_floor) {
                        newErrors[`range_invalid_${t}_${f}`] = "Invalid floor range";
                        hasErrors = true;
                    }
                });
            } else {
                // Villa/Bungalow validation
                if ((!tower.unit_ranges || tower.unit_ranges.length === 0) &&
                    (!tower.units || tower.units.length === 0)) {
                    newErrors[`tower_units_${t}`] = "At least one unit range or unit required";
                    hasErrors = true;
                }

                // Validate unit ranges
                tower.unit_ranges?.forEach((range, r) => {
                    if (!range.from_unit || range.from_unit <= 0) {
                        newErrors[`from_unit_${t}_${r}`] = "From unit required";
                        hasErrors = true;
                    }

                    if (!range.to_unit || range.to_unit <= 0) {
                        newErrors[`to_unit_${t}_${r}`] = "To unit required";
                        hasErrors = true;
                    }

                    if (range.to_unit < range.from_unit) {
                        newErrors[`unit_range_invalid_${t}_${r}`] = "Invalid unit range";
                        hasErrors = true;
                    }


                    if (!range.unit_size || range.unit_size <= 0) {
                        newErrors[`range_unit_size_${t}_${r}`] = "Unit size required";
                        hasErrors = true;
                    }

                    if (!range.property_type_id) {
                        newErrors[`range_property_${t}_${r}`] = "Property type required";
                        hasErrors = true;
                    }
                });

                // Validate individual units if any
                tower.units?.forEach((unit, u) => {
                    if (!unit.unit_number?.trim()) {
                        newErrors[`unit_number_${t}_${u}`] = "Unit number required";
                        hasErrors = true;
                    }
                });
            }
            
        });
console.log("Validation Errors:", newErrors);
        setErrors(newErrors);

        if (hasErrors) {
            const firstError = Object.keys(newErrors)[0];
            const towerIndex = parseInt(firstError.split("_")[1]);
            setActiveTower(towerIndex);

            setTimeout(() => {
                const el = document.getElementById(firstError);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.focus?.();
                }
            }, 300);
            return false;
        }

        return true;
    };

    const hasTowerError = (index) => {
        return Object.keys(errors).some(key =>
            key.includes(`_${index}`) || key.includes(`${index}_`)
        );
    };

    const generateRoomsFromBhk = (bhk) => {
        let rooms = {};
        for (let i = 1; i <= bhk; i++) {
            rooms[`Bedroom ${i}`] = "";
        }
        rooms["Hall"] = "";
        rooms["Kitchen"] = "";
        return rooms;
    };

    useImperativeHandle(ref, () => ({
        validate: validateStep
    }));

    // Calculate statistics
    const getTowerStats = (tower) => {
        if (tower.category === PROPERTY_CATEGORIES.APARTMENT) {
            const totalUnits = tower.floor_designs.reduce((total, range) => {
                const floors = range.to_floor && range.from_floor ?
                    parseInt(range.to_floor) - parseInt(range.from_floor) + 1 : 0;
                return total + (floors * (parseInt(range.units_per_floor) || 0));
            }, 0);

            const uniqueConfigs = new Set(tower.floor_designs.map(d => d.unit_type_id).filter(id => id)).size;

            return { totalUnits, uniqueConfigs, type: 'apartment' };
        } else {
            // Calculate from both ranges and individual units
            let totalUnits = tower.units?.length || 0;

            // If no units generated yet, estimate from ranges
            if (totalUnits === 0 && tower.unit_ranges) {
                totalUnits = tower.unit_ranges.reduce((sum, range) => {
                    return sum + (parseInt(range.to_unit) - parseInt(range.from_unit) + 1);
                }, 0);
            }

            const totalBedrooms = tower.units?.reduce((sum, unit) => sum + (unit.bedrooms || 0), 0) || 0;

            return {
                totalUnits,
                totalBedrooms,
                avgBhk: totalUnits > 0 ? Math.round(totalBedrooms / totalUnits) : 0,
                type: 'standalone'
            };
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case PROPERTY_CATEGORIES.APARTMENT:
                return <Building2 className="w-5 h-5" />;
            case PROPERTY_CATEGORIES.VILLA:
                return <Home className="w-5 h-5" />;
            case PROPERTY_CATEGORIES.BUNGALOW:
                return <Warehouse className="w-5 h-5" />;
            case PROPERTY_CATEGORIES.DUPLEX:
                return <Layers className="w-5 h-5" />;
            case PROPERTY_CATEGORIES.PENTHOUSE:
                return <DoorOpen className="w-5 h-5" />;
            default:
                return <Building2 className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Summary */}
            {towers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Properties</p>
                                <p className="text-2xl font-bold text-indigo-600">{towers.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            {towers.filter(t => t.category === PROPERTY_CATEGORIES.APARTMENT).length} Apartments
                            <span className="mx-1">•</span>
                            {towers.filter(t => t.category !== PROPERTY_CATEGORIES.APARTMENT).length} Villas/Bungalows
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Units</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {towers.reduce((sum, t) => sum + getTowerStats(t).totalUnits, 0)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Apartments</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {towers.filter(t => t.category === PROPERTY_CATEGORIES.APARTMENT).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Villas/Bungalows</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {towers.filter(t => t.category !== PROPERTY_CATEGORIES.APARTMENT).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Property Button */}
            <div className="flex justify-end">
                <button
                    onClick={addTower}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Property
                </button>
            </div>

            {/* Empty State */}
            {towers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties added yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                        Add an apartment building with multiple floors, or a villa/bungalow with individual units.
                    </p>
                    <button
                        onClick={addTower}
                        className="inline-flex items-center px-6 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-xl transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Property
                    </button>
                </div>
            ) : (
                /* Properties List */
                <div className="space-y-4">
                    {towers.map((tower, t) => {
                        const towerErrors = hasTowerError(t);
                        const stats = getTowerStats(tower);
                        const isApartment = tower.category === PROPERTY_CATEGORIES.APARTMENT;

                        return (
                            <div
                                key={tower.id || t}
                                className={`bg-white rounded-xl border-2 overflow-hidden transition-all duration-200
                                    ${towerErrors
                                        ? 'border-red-200 shadow-md shadow-red-100'
                                        : activeTower === t
                                            ? 'border-indigo-200 shadow-lg shadow-indigo-100'
                                            : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
                                    }`}
                            >
                                {/* Property Header */}
                                <div
                                    onClick={() => setActiveTower(activeTower === t ? null : t)}
                                    className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-200
                                        ${towerErrors
                                            ? 'bg-gradient-to-r from-red-50 to-red-50/50'
                                            : activeTower === t
                                                ? 'bg-gradient-to-r from-indigo-50 to-blue-50'
                                                : 'bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-blue-50'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Property Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                                            ${towerErrors
                                                ? 'bg-red-100'
                                                : activeTower === t
                                                    ? 'bg-indigo-100'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            {getCategoryIcon(tower.category)}
                                        </div>

                                        {/* Property Info */}
                                        <div>
                                            <div className="flex items-center space-x-3">
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    {tower.name || `Property ${t + 1}`}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs rounded-full
                                                    ${isApartment
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-green-100 text-green-600'
                                                    }`}
                                                >
                                                    {tower.category?.charAt(0).toUpperCase() + tower.category?.slice(1) || 'Apartment'}
                                                </span>
                                                {towerErrors && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Errors
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                                                {isApartment ? (
                                                    <>
                                                        <span className="flex items-center">
                                                            <Layers className="w-4 h-4 mr-1" />
                                                            {tower.total_floors || 0} floors
                                                        </span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span className="flex items-center">
                                                            <Home className="w-4 h-4 mr-1" />
                                                            {stats.totalUnits} units
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="flex items-center">
                                                            <Home className="w-4 h-4 mr-1" />
                                                            {stats.totalUnits} unit{stats.totalUnits !== 1 ? 's' : ''}
                                                        </span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTower(t);
                                            }}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                            title="Remove property"
                                        >
                                            <Trash2 size={20} className="text-gray-400 group-hover:text-red-600" />
                                        </button>

                                        {/* Expand/Collapse Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                                            ${activeTower === t ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {activeTower === t ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Property Content - Expandable */}
                                {activeTower === t && (
                                    <div className="p-6 space-y-6 border-t border-gray-200">
                                        {/* Basic Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Property Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Property Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id={`tower_name_${t}`}
                                                        type="text"
                                                        value={tower.name}
                                                        onChange={(e) => updateTower(t, "name", e.target.value)}
                                                        onBlur={() => handleBlur(`tower_name_${t}`)}
                                                        placeholder="e.g., Tower A, Villa 1, Bungalow 5"
                                                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 pl-11
                                                            ${errors[`tower_name_${t}`]
                                                                ? "border-red-300 bg-red-50 focus:ring-red-500"
                                                                : tower.name
                                                                    ? "border-green-300 bg-green-50 focus:ring-green-500"
                                                                    : "border-gray-200 hover:border-indigo-200 focus:ring-indigo-500"
                                                            }`}
                                                    />
                                                    <Building2 className={`w-5 h-5 absolute left-3 top-3.5
                                                        ${errors[`tower_name_${t}`]
                                                            ? 'text-red-400'
                                                            : tower.name
                                                                ? 'text-green-400'
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                </div>
                                                {errors[`tower_name_${t}`] && (
                                                    <p className="mt-2 text-xs text-red-600 flex items-center">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        {errors[`tower_name_${t}`]}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Property Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Property Category <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id={`tower_category_${t}`}
                                                    value={tower.category || PROPERTY_CATEGORIES.APARTMENT}
                                                    onChange={(e) => updateTower(t, "category", e.target.value)}
                                                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200
                                                        ${errors[`tower_category_${t}`]
                                                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                                                            : "border-gray-200 hover:border-indigo-200 focus:ring-indigo-500"
                                                        }`}
                                                >
                                                    <option value={PROPERTY_CATEGORIES.APARTMENT}>Apartment Building</option>
                                                    <option value={PROPERTY_CATEGORIES.VILLA}>Villa/Bungalow</option>

                                                </select>
                                            </div>

                                            {/* Conditional Field */}
                                            {isApartment ? (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Total Floors <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            id={`tower_floors_${t}`}
                                                            type="number"
                                                            value={tower.total_floors}
                                                            onChange={(e) => updateTower(t, "total_floors", parseInt(e.target.value) || 0)}
                                                            onBlur={() => handleBlur(`tower_floors_${t}`)}
                                                            placeholder="e.g., 10"
                                                            min="0"
                                                            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 pl-11
                                                                ${errors[`tower_floors_${t}`]
                                                                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                                                                    : tower.total_floors > 0
                                                                        ? "border-green-300 bg-green-50 focus:ring-green-500"
                                                                        : "border-gray-200 hover:border-indigo-200 focus:ring-indigo-500"
                                                                }`}
                                                        />
                                                        <Layers className={`w-5 h-5 absolute left-3 top-3.5
                                                            ${errors[`tower_floors_${t}`]
                                                                ? 'text-red-400'
                                                                : tower.total_floors > 0
                                                                    ? 'text-green-400'
                                                                    : 'text-gray-400'
                                                            }`}
                                                        />
                                                    </div>
                                                    {errors[`tower_floors_${t}`] && (
                                                        <p className="mt-2 text-xs text-red-600 flex items-center">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            {errors[`tower_floors_${t}`]}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Total Units (estimated)
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={stats.totalUnits}
                                                            disabled
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 pl-11 text-gray-500"
                                                        />
                                                        <Home className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Configuration Section */}
                                        {isApartment ? (
                                            /* APARTMENT: Floor Ranges */
                                            <div className="bg-gray-50 rounded-xl p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                                        <Grid3x3 className="w-5 h-5 mr-2 text-indigo-600" />
                                                        Floor Configuration Ranges
                                                    </h4>
                                                    <span className={`text-xs px-3 py-1.5 rounded-full border
                                                        ${tower.floor_designs?.length > 0
                                                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}
                                                    >
                                                        {tower.floor_designs?.length || 0} range{(tower.floor_designs?.length || 0) !== 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                {(!tower.floor_designs || tower.floor_designs.length === 0) ? (
                                                    <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                                        <p className="text-sm text-gray-500">No floor ranges configured yet</p>
                                                        <button
                                                            onClick={() => addFloorDesign(t)}
                                                            className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add First Range
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {tower.floor_designs.map((floor, f) => (
                                                            <div key={f} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                                {/* Range Header */}
                                                                <div
                                                                    onClick={() => toggleRange(t, f)}
                                                                    className="px-4 py-3 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-indigo-50"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
                                                                            {f + 1}
                                                                        </span>
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            Floor Range {f + 1}
                                                                        </span>
                                                                        {floor.from_floor && floor.to_floor && (
                                                                            <span className="text-xs text-gray-500">
                                                                                Floors {floor.from_floor} - {floor.to_floor}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeFloorDesign(t, f);
                                                                            }}
                                                                            className="p-1.5 hover:bg-red-100 rounded-lg"
                                                                        >
                                                                            <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
                                                                        </button>
                                                                        {expandedRanges[`${t}-${f}`] ? (
                                                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                                                        ) : (
                                                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Range Fields */}
                                                                {expandedRanges[`${t}-${f}`] && (
                                                                    <div className="p-4 border-t border-gray-200">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                            {/* From Floor */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                    From 
                                                                                </label>
                                                                                <input
                                                                                    id={`from_${t}_${f}`}
                                                                                    type="number"
                                                                                    value={floor.from_floor}
                                                                                    onChange={(e) => updateFloorDesign(
                                                                                        t, f, "from_floor", parseInt(e.target.value) || 0
                                                                                    )}
                                                                                    placeholder="Start floor"
                                                                                    min="0"
                                                                                    className={`w-full px-3 py-2 border rounded-lg
                                                                                        ${errors[`from_floor_${t}_${f}`]
                                                                                            ? "border-red-300 bg-red-50"
                                                                                            : "border-gray-300"
                                                                                        }`}
                                                                                />
                                                                            </div>

                                                                            {/* To Floor */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                    To 
                                                                                </label>
                                                                                <input
                                                                                    id={`to_${t}_${f}`}
                                                                                    type="number"
                                                                                    value={floor.to_floor}
                                                                                    onChange={(e) => updateFloorDesign(
                                                                                        t, f, "to_floor", parseInt(e.target.value) || 0
                                                                                    )}
                                                                                    placeholder="End floor"
                                                                                    min="0"
                                                                                    className={`w-full px-3 py-2 border rounded-lg
                                                                                        ${errors[`to_floor_${t}_${f}`]
                                                                                            ? "border-red-300 bg-red-50"
                                                                                            : "border-gray-300"
                                                                                        }`}
                                                                                />
                                                                            </div>

                                                                            {/* Units Per Floor */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                    Units Per Floor
                                                                                </label>
                                                                                <input
                                                                                    id={`units_${t}_${f}`}
                                                                                    type="number"
                                                                                    value={floor.units_per_floor}
                                                                                    onChange={(e) => updateFloorDesign(
                                                                                        t, f, "units_per_floor", parseInt(e.target.value) || 0
                                                                                    )}
                                                                                    placeholder="Units/floor"
                                                                                    min="1"
                                                                                    className={`w-full px-3 py-2 border rounded-lg
                                                                                        ${errors[`units_${t}_${f}`]
                                                                                            ? "border-red-300 bg-red-50"
                                                                                            : "border-gray-300"
                                                                                        }`}
                                                                                />
                                                                            </div>

                                                                            {/* Property Type */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                    Property Type
                                                                                </label>
                                                                                <select
                                                                                    id={`property_${t}_${f}`}
                                                                                    value={floor.property_type_id || ""}
                                                                                    onChange={(e) => updateFloorDesign(t, f, "property_type_id", e.target.value)}
                                                                                    className={`w-full px-3 py-2 border rounded-lg
                                                                                        ${errors[`property_${t}_${f}`]
                                                                                            ? "border-red-300 bg-red-50"
                                                                                            : "border-gray-300"
                                                                                        }`}
                                                                                >
                                                                                    <option value="">Select Property Type</option>
                                                                                    {propertyTypes.map(type => (
                                                                                        <option key={type._id} value={type._id}>
                                                                                            {type.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>

                                                                            {/* Unit Type */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                    Unit Type
                                                                                </label>
                                                                                <select
                                                                                    id={`unit_${t}_${f}`}
                                                                                    value={floor.unit_type_id}
                                                                                    onChange={(e) => {
                                                                                        const selectedId = e.target.value;
                                                                                        const selectedUnit = unitTypes.find(u => u._id === selectedId);
                                                                                        const bhk = selectedUnit?.bhk || 0;
                                                                                        const generatedRooms = generateRoomsFromBhk(bhk);

                                                                                        const updated = [...towers];
                                                                                        updated[t].floor_designs[f] = {
                                                                                            ...updated[t].floor_designs[f],
                                                                                            unit_type_id: selectedId,
                                                                                            room_sizes: generatedRooms,
                                                                                            // Auto-update bedrooms based on BHK
                                                                                            units_per_floor: floor.units_per_floor
                                                                                        };
                                                                                        setData("towers", updated);
                                                                                    }}
                                                                                    className={`w-full px-3 py-2 border rounded-lg
                                                                                        ${errors[`unit_${t}_${f}`]
                                                                                            ? "border-red-300 bg-red-50"
                                                                                            : "border-gray-300"
                                                                                        }`}
                                                                                >
                                                                                    <option value="">Select Unit Type</option>
                                                                                    {unitTypes.map(unit => (
                                                                                        <option key={unit._id} value={unit._id}>
                                                                                            {unit.name} ({unit.bhk} BHK)
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>

                                                                            {/* Unit Size */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                    Unit Size
                                                                                </label>
                                                                                <div className="relative">
                                                                                    <input
                                                                                        type="number"
                                                                                        value={floor.unit_size || ""}
                                                                                        onChange={(e) => updateFloorDesign(
                                                                                            t, f, "unit_size", parseInt(e.target.value) || ""
                                                                                        )}
                                                                                        placeholder="1200"
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-14"
                                                                                    />
                                                                                    <span className="absolute right-3 top-2 text-gray-400 text-sm">
                                                                                        sq.ft
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Room Sizes Section */}
                                                                        {floor.room_sizes && Object.keys(floor.room_sizes).length > 0 && (
                                                                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                                                                <h5 className="font-semibold mb-3 text-gray-700 flex items-center">
                                                                                    <Ruler className="w-4 h-4 mr-2 text-indigo-600" />
                                                                                    Room Sizes
                                                                                </h5>
                                                                                <div className="space-y-2">
                                                                                    {Object.entries(floor.room_sizes).map(([room, size], r) => (
                                                                                        <div key={r} className="flex gap-2">
                                                                                            <input
                                                                                                type="text"
                                                                                                value={room}
                                                                                                onChange={(e) => {
                                                                                                    const updated = [...towers];
                                                                                                    const rooms = { ...updated[t].floor_designs[f].room_sizes };
                                                                                                    const newKey = e.target.value;
                                                                                                    const val = rooms[room];
                                                                                                    delete rooms[room];
                                                                                                    rooms[newKey] = val;
                                                                                                    updated[t].floor_designs[f].room_sizes = rooms;
                                                                                                    setData("towers", updated);
                                                                                                }}
                                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                                placeholder="Room name"
                                                                                            />
                                                                                            <input
                                                                                                type="text"
                                                                                                value={size}
                                                                                                placeholder="12x10"
                                                                                                onChange={(e) => {
                                                                                                    const updated = [...towers];
                                                                                                    updated[t].floor_designs[f].room_sizes = {
                                                                                                        ...updated[t].floor_designs[f].room_sizes,
                                                                                                        [room]: e.target.value
                                                                                                    };
                                                                                                    setData("towers", updated);
                                                                                                }}
                                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                            />
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    const updated = [...towers];
                                                                                                    const rooms = { ...updated[t].floor_designs[f].room_sizes };
                                                                                                    delete rooms[room];
                                                                                                    updated[t].floor_designs[f].room_sizes = rooms;
                                                                                                    setData("towers", updated);
                                                                                                }}
                                                                                                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                                                            >
                                                                                                <Trash2 size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const updated = [...towers];
                                                                                        updated[t].floor_designs[f].room_sizes = {
                                                                                            ...updated[t].floor_designs[f].room_sizes,
                                                                                            ["New Room"]: ""
                                                                                        };
                                                                                        setData("towers", updated);
                                                                                    }}
                                                                                    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg"
                                                                                >
                                                                                    <Plus className="w-4 h-4 mr-1" />
                                                                                    Add Room
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {/* Range Summary */}
                                                                        {floor.from_floor && floor.to_floor && (
                                                                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                                                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                                                    <div>
                                                                                        <span className="text-indigo-600 font-medium">Floor Range</span>
                                                                                        <p className="text-gray-800">{floor.from_floor} - {floor.to_floor}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="text-indigo-600 font-medium">Units/Floor</span>
                                                                                        <p className="text-gray-800">{floor.units_per_floor || 0}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="text-indigo-600 font-medium">Total Units</span>
                                                                                        <p className="text-gray-800 font-semibold">
                                                                                            {(parseInt(floor.to_floor) - parseInt(floor.from_floor) + 1) * (parseInt(floor.units_per_floor) || 0)}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Add Range Button */}
                                                {tower.floor_designs?.length > 0 && (
                                                    <button
                                                        onClick={() => addFloorDesign(t)}
                                                        className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200"
                                                    >
                                                        <Plus className="w-5 h-5 mr-2" />
                                                        Add Another Floor Range
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            /* VILLA/BUNGALOW: Unit Ranges with Property/Unit Types */
                                            <div className="space-y-6">
                                                {/* Unit Ranges Section (Bulk Addition) */}
                                                <div className="bg-gray-50 rounded-xl p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-semibold text-gray-800 flex items-center">
                                                            <Copy className="w-5 h-5 mr-2 text-green-600" />
                                                            Bulk Unit Addition
                                                        </h4>
                                                        <span className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-200">
                                                            Create multiple units at once
                                                        </span>
                                                    </div>

                                                    {/* Unit Ranges */}
                                                    {(!tower.unit_ranges || tower.unit_ranges.length === 0) ? (
                                                        <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                                            <p className="text-sm text-gray-500 mb-3">
                                                                Add a unit range to create multiple units at once
                                                            </p>
                                                            <button
                                                                onClick={() => addUnitRange(t)}
                                                                className="inline-flex items-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                Add Unit Range
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {tower.unit_ranges.map((range, r) => (
                                                                <div key={r} className="bg-white border border-green-200 rounded-xl overflow-hidden">
                                                                    {/* Range Header */}
                                                                    <div
                                                                        onClick={() => toggleUnitRange(t, r)}
                                                                        className="px-4 py-3 bg-green-50 flex items-center justify-between cursor-pointer hover:bg-green-100"
                                                                    >
                                                                        <div className="flex items-center space-x-3">
                                                                            <span className="flex items-center justify-center w-6 h-6 bg-green-200 text-green-700 rounded-full text-xs font-semibold">
                                                                                {r + 1}
                                                                            </span>
                                                                            <span className="text-sm font-medium text-gray-700">
                                                                                Unit Range {r + 1}
                                                                            </span>
                                                                            {range.from_unit && range.to_unit && (
                                                                                <span className="text-xs text-gray-500">
                                                                                    Units {range.from_unit} - {range.to_unit}
                                                                                </span>
                                                                            )}
                                                                            {range.unit_type_id && unitTypes.find(u => u._id === range.unit_type_id) && (
                                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                                                    {unitTypes.find(u => u._id === range.unit_type_id)?.bhk} BHK
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    removeUnitRange(t, r);
                                                                                }}
                                                                                className="p-1.5 hover:bg-red-100 rounded-lg"
                                                                            >
                                                                                <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
                                                                            </button>
                                                                            {expandedUnitRanges[`${t}-${r}`] ? (
                                                                                <ChevronUp className="w-4 h-4 text-gray-500" />
                                                                            ) : (
                                                                                <ChevronDown className="w-4 h-4 text-gray-500" />
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Range Fields */}
                                                                    {expandedUnitRanges[`${t}-${r}`] && (
                                                                        <div className="p-4 border-t border-gray-200">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                                {/* From Unit */}
                                                                                <div>
                                                                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                        From
                                                                                    </label>
                                                                                    <input
                                                                                        id={`from_unit_${t}_${r}`}
                                                                                        type="number"
                                                                                        value={range.from_unit}
                                                                                        onChange={(e) => updateUnitRange(
                                                                                            t, r, "from_unit", parseInt(e.target.value) || 1
                                                                                        )}
                                                                                        min="1"
                                                                                        className={`w-full px-3 py-2 border rounded-lg
                                                                                            ${errors[`from_unit_${t}_${r}`]
                                                                                                ? "border-red-300 bg-red-50"
                                                                                                : "border-gray-300"
                                                                                            }`}
                                                                                    />
                                                                                </div>

                                                                                {/* To Unit */}
                                                                                <div>
                                                                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                        To
                                                                                    </label>
                                                                                    <input
                                                                                        id={`to_unit_${t}_${r}`}
                                                                                        type="number"
                                                                                        value={range.to_unit}
                                                                                        onChange={(e) => updateUnitRange(
                                                                                            t, r, "to_unit", parseInt(e.target.value) || 1
                                                                                        )}
                                                                                        min="1"
                                                                                        className={`w-full px-3 py-2 border rounded-lg
                                                                                            ${errors[`to_unit_${t}_${r}`]
                                                                                                ? "border-red-300 bg-red-50"
                                                                                                : "border-gray-300"
                                                                                            }`}
                                                                                    />
                                                                                </div>



                                                                                {/* Property Type */}
                                                                                <div>
                                                                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                        Property Type <span className="text-red-500">*</span>
                                                                                    </label>
                                                                                    <select
                                                                                        id={`range_property_${t}_${r}`}
                                                                                        value={range.property_type_id || ""}
                                                                                        onChange={(e) => updateUnitRange(
                                                                                            t, r, "property_type_id", e.target.value
                                                                                        )}
                                                                                        className={`w-full px-3 py-2 border rounded-lg
                                                                                            ${errors[`range_property_${t}_${r}`]
                                                                                                ? "border-red-300 bg-red-50"
                                                                                                : "border-gray-300"
                                                                                            }`}
                                                                                    >
                                                                                        <option value="">Select Property Type</option>
                                                                                        {propertyTypes.map(type => (
                                                                                            <option key={type._id} value={type._id}>
                                                                                                {type.name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>

                                                                                {/* Unit Type */}
                                                                                <div>
                                                                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                        Unit Type <span className="text-red-500">*</span>
                                                                                    </label>
                                                                                    <select
                                                                                        id={`range_unit_type_${t}_${r}`}
                                                                                        value={range.unit_type_id || ""}
                                                                                        onChange={(e) => {
                                                                                            const selectedId = e.target.value;
                                                                                            const selectedUnit = unitTypes.find(u => u._id === selectedId);
                                                                                            const bhk = selectedUnit?.bhk || 0;
                                                                                            const generatedRooms = generateRoomsFromBhk(bhk);

                                                                                            updateUnitRange(t, r, "unit_type_id", selectedId);
                                                                                            updateUnitRange(t, r, "bedrooms", bhk);
                                                                                            updateUnitRange(t, r, "room_sizes", generatedRooms);
                                                                                        }}
                                                                                        className={`w-full px-3 py-2 border rounded-lg
                                                                                            ${errors[`range_unit_type_${t}_${r}`]
                                                                                                ? "border-red-300 bg-red-50"
                                                                                                : "border-gray-300"
                                                                                            }`}
                                                                                    >
                                                                                        <option value="">Select Unit Type</option>
                                                                                        {unitTypes.map(unit => (
                                                                                            <option key={unit._id} value={unit._id}>
                                                                                                {unit.name} ({unit.bhk} BHK)
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>









                                                                                {/* Built-up Area */}
                                                                                <div>
                                                                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                                        Unit Size <span className="text-red-500">*</span>
                                                                                    </label>
                                                                                    <div className="relative">
                                                                                        <input
                                                                                            id={`range_unit_size_${t}_${r}`}
                                                                                            type="number"
                                                                                            value={range.unit_size}
                                                                                            onChange={(e) => updateUnitRange(
                                                                                                t, r, "unit_size", parseInt(e.target.value) || 0
                                                                                            )}
                                                                                            placeholder="2500"
                                                                                            className={`w-full px-3 py-2 border rounded-lg pr-14
                                                                                                ${errors[`range_unit_size_${t}_${r}`]
                                                                                                    ? "border-red-300 bg-red-50"
                                                                                                    : "border-gray-300"
                                                                                                }`}
                                                                                        />
                                                                                        <span className="absolute right-3 top-2 text-gray-400 text-sm">
                                                                                            sq.ft
                                                                                        </span>
                                                                                    </div>
                                                                                </div>


                                                                            </div>



                                                                            {/* Room Sizes Section (from Unit Type) */}
                                                                            {range.room_sizes && Object.keys(range.room_sizes).length > 0 && (
                                                                                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                                                                    <h5 className="font-semibold mb-3 text-gray-700 flex items-center">
                                                                                        <Ruler className="w-4 h-4 mr-2 text-green-600" />
                                                                                        Room Sizes (same for all units in range)
                                                                                    </h5>
                                                                                    <div className="space-y-2">
                                                                                        {Object.entries(range.room_sizes).map(([room, size], s) => (
                                                                                            <div key={s} className="flex gap-2">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={room}
                                                                                                    onChange={(e) => {
                                                                                                        const updated = [...towers];
                                                                                                        const rooms = { ...updated[t].unit_ranges[r].room_sizes };
                                                                                                        const newKey = e.target.value;
                                                                                                        const val = rooms[room];
                                                                                                        delete rooms[room];
                                                                                                        rooms[newKey] = val;
                                                                                                        updated[t].unit_ranges[r].room_sizes = rooms;
                                                                                                        setData("towers", updated);
                                                                                                    }}
                                                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                                    placeholder="Room name"
                                                                                                />
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={size}
                                                                                                    placeholder="12x10"
                                                                                                    onChange={(e) => {
                                                                                                        const updated = [...towers];
                                                                                                        updated[t].unit_ranges[r].room_sizes = {
                                                                                                            ...updated[t].unit_ranges[r].room_sizes,
                                                                                                            [room]: e.target.value
                                                                                                        };
                                                                                                        setData("towers", updated);
                                                                                                    }}
                                                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                                />
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        const updated = [...towers];
                                                                                                        const rooms = { ...updated[t].unit_ranges[r].room_sizes };
                                                                                                        delete rooms[room];
                                                                                                        updated[t].unit_ranges[r].room_sizes = rooms;
                                                                                                        setData("towers", updated);
                                                                                                    }}
                                                                                                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                                                                >
                                                                                                    <Trash2 size={16} />
                                                                                                </button>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const updated = [...towers];
                                                                                            updated[t].unit_ranges[r].room_sizes = {
                                                                                                ...updated[t].unit_ranges[r].room_sizes,
                                                                                                ["New Room"]: ""
                                                                                            };
                                                                                            setData("towers", updated);
                                                                                        }}
                                                                                        className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-700 font-medium hover:bg-green-50 rounded-lg"
                                                                                    >
                                                                                        <Plus className="w-4 h-4 mr-1" />
                                                                                        Add Room
                                                                                    </button>
                                                                                </div>
                                                                            )}

                                                                            {/* Range Summary */}
                                                                            {range.from_unit && range.to_unit && (
                                                                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                                                        <div>
                                                                                            <span className="text-green-600 font-medium">Unit Range</span>
                                                                                            <p className="text-gray-800">
                                                                                                {range.from_unit} - {range.to_unit}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span className="text-green-600 font-medium">Total Units</span>
                                                                                            <p className="text-gray-800 font-semibold">
                                                                                                {parseInt(range.to_unit) - parseInt(range.from_unit) + 1}
                                                                                            </p>
                                                                                        </div>
                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}


                                                        </div>
                                                    )}

                                                    {/* Add Another Range Button */}
                                                    {tower.unit_ranges?.length > 0 && (
                                                        <button
                                                            onClick={() => addUnitRange(t)}
                                                            className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl border border-green-200"
                                                        >
                                                            <Plus className="w-5 h-5 mr-2" />
                                                            Add Another Unit Range
                                                        </button>
                                                    )}
                                                </div>


                                            </div>
                                        )}


                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}


        </div>
    );
});

export default Step3Units;