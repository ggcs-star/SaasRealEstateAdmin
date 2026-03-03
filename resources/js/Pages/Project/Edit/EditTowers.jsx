import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Trash2 } from "lucide-react";

export default function EditTowers({ auth, project, configurations }) {
    const { data, setData, put, processing } = useForm({
        towers: (project.towers || []).map(t => ({
            ...t,
            id: t._id, // normalize id for frontend
        }))
    });

    const [activeTower, setActiveTower] = useState(null);
    const [errors, setErrors] = useState({});

    const towers = data.towers || [];

    const addTower = () => {
        setData("towers", [
            ...towers,
            {
                name: "",
                id: "tw_" + Date.now(),
                total_floors: 0,
                floor_designs: [
                    {
                        from_floor: 1,
                        to_floor: 1,
                        units_per_floor: 1,
                        configuration_id: ""
                    }
                ],
                status: true
            }
        ]);
        setActiveTower(towers.length);
    };

    const updateTower = (t, field, value) => {
        let updated = [...towers];
        updated[t][field] = value;
        setData("towers", updated);
    };

    const addFloorDesign = (t) => {
        let updated = [...towers];
        updated[t].floor_designs.push({
            from_floor: 1,
            to_floor: 1,
            units_per_floor: 1,
            configuration_id: ""
        });
        setData("towers", updated);
    };

    const updateFloorDesign = (t, f, field, value) => {
        let updated = [...towers];
        updated[t].floor_designs[f][field] = value;
        setData("towers", updated);
    };

    const removeFloorDesign = (t, f) => {
        let updated = [...towers];
        updated[t].floor_designs = updated[t].floor_designs.filter((_, i) => i !== f);
        setData("towers", updated);
    };

    const removeTower = (t) => {
        if (confirm("Are you sure you want to remove this tower?")) {
            setData("towers", towers.filter((_, i) => i !== t));
            if (activeTower === t) setActiveTower(null);
        }
    };

    const validateStep = () => {
        let newErrors = {};

        if (towers.length === 0) {
            alert("At least one tower is required");
            return false;
        }

        towers.forEach((tower, t) => {
            if (!tower.name?.trim())
                newErrors[`tower_name_${t}`] = "Tower name is required";

            if (!tower.total_floors || tower.total_floors <= 0)
                newErrors[`tower_floors_${t}`] = "Total floors must be greater than 0";

            if (!tower.floor_designs || tower.floor_designs.length === 0)
                newErrors[`tower_range_${t}`] = "At least one floor range required";

            tower.floor_designs.forEach((range, f) => {
                if (!range.from_floor && range.from_floor !== 0)
                    newErrors[`from_floor_${t}_${f}`] = "From floor required";

                if (!range.to_floor && range.to_floor !== 0)
                    newErrors[`to_floor_${t}_${f}`] = "To floor required";

                if (!range.units_per_floor || range.units_per_floor <= 0)
                    newErrors[`units_${t}_${f}`] = "Units per floor required";

                if (!range.configuration_id)
                    newErrors[`config_${t}_${f}`] = "Configuration required";

                if (range.to_floor < range.from_floor)
                    newErrors[`range_invalid_${t}_${f}`] = "Invalid floor range";
            });
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.keys(newErrors)[0];
            const towerIndex = parseInt(firstError.split("_")[2] || firstError.split("_")[1]);

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
            key.includes(`_${index}_`) || key.includes(`_${index}`)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep()) {
            put(route("projects.update.towers", project._id));
        }
    };

    const calculateTotalUnits = (tower) => {
        return tower.floor_designs.reduce((total, range) => {
            const floors = range.to_floor && range.from_floor ?
                parseInt(range.to_floor) - parseInt(range.from_floor) + 1 : 0;
            return total + (floors * (parseInt(range.units_per_floor) || 0));
        }, 0);
    };

    const getUniqueConfigCount = (tower) => {
        return new Set(tower.floor_designs.map(d => d.configuration_id).filter(id => id)).size;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Towers - {project.name}
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

                    {/* Add Tower Button */}
                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={addTower}
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Tower
                        </button>
                    </div>

                    {/* Empty State */}
                    {towers.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No towers added yet</h3>
                            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                                Start by adding a new tower to configure floor ranges and unit distribution.
                            </p>
                            <button
                                onClick={addTower}
                                className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Your First Tower
                            </button>
                        </div>
                    ) : (
                        /* Towers List */
                        <div className="space-y-6">
                            {towers.map((tower, t) => (
                                <div key={tower.id || t} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                    {/* Tower Header */}
                                    <div 
                                        onClick={() => setActiveTower(activeTower === t ? null : t)}
                                        className={`px-6 py-4 border-b flex justify-between items-center cursor-pointer transition-colors
                                            ${hasTowerError(t) ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <span className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
                                                ${hasTowerError(t) ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                {t + 1}
                                            </span>
                                            <h3 className="font-semibold text-gray-800">
                                                {tower.name || `Tower ${t + 1}`}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                tower.total_floors > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {tower.total_floors || 0} floors
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTower(t);
                                            }}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                            title="Remove tower"
                                        >
                                            <Trash2 size={20} className="text-gray-400 group-hover:text-red-600" />
                                        </button>
                                    </div>

                                    {/* Tower Content */}
                                    {activeTower === t && (
                                        <div className="p-6 space-y-6">
                                            {/* Tower Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Tower Name */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tower Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        id={`tower_name_${t}`}
                                                        value={tower.name || ""}
                                                        onChange={(e) => updateTower(t, "name", e.target.value)}
                                                        placeholder="e.g., Tower A, Tower B, Block C"
                                                        className={`w-full px-4 py-2.5 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500
                                                            ${errors[`tower_name_${t}`] ? "border-red-500" : "border-gray-300"}`}
                                                    />
                                                    {errors[`tower_name_${t}`] && (
                                                        <p className="mt-1 text-xs text-red-500">{errors[`tower_name_${t}`]}</p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-500">Enter a unique name for this tower</p>
                                                </div>

                                                {/* Total Floors */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Total Floors <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        id={`tower_floors_${t}`}
                                                        type="number"
                                                        value={tower.total_floors || ""}
                                                        onChange={(e) => updateTower(t, "total_floors", parseInt(e.target.value) || 0)}
                                                        placeholder="e.g., 10 (G+9)"
                                                        min="0"
                                                        className={`w-full px-4 py-2.5 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500
                                                            ${errors[`tower_floors_${t}`] ? "border-red-500" : "border-gray-300"}`}
                                                    />
                                                    {errors[`tower_floors_${t}`] && (
                                                        <p className="mt-1 text-xs text-red-500">{errors[`tower_floors_${t}`]}</p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-500">Enter total number of floors (including ground floor)</p>
                                                </div>
                                            </div>

                                            {/* Floor Design Ranges */}
                                            <div className="bg-gray-50 rounded-lg p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                        </svg>
                                                        Floor Configuration Ranges
                                                    </h4>
                                                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                                                        {tower.floor_designs.length} range{tower.floor_designs.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                {tower.floor_designs.length === 0 ? (
                                                    <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                                        <p className="text-sm text-gray-500">No floor ranges configured yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {tower.floor_designs.map((floor, f) => (
                                                            <div key={f} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                                                                {/* Range Header */}
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
                                                                            {f + 1}
                                                                        </span>
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            Floor Range {f + 1}
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeFloorDesign(t, f)}
                                                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                                                                        title="Remove range"
                                                                    >
                                                                        <Trash2 size={16} className="text-gray-400 group-hover:text-red-600" />
                                                                    </button>
                                                                </div>

                                                                {/* Range Fields Grid */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                            From Floor
                                                                        </label>
                                                                        <input
                                                                            id={`from_floor_${t}_${f}`}
                                                                            type="number"
                                                                            value={floor.from_floor || ""}
                                                                            onChange={(e) => updateFloorDesign(
                                                                                t,
                                                                                f,
                                                                                "from_floor",
                                                                                parseInt(e.target.value) || 0
                                                                            )}
                                                                            placeholder="Start floor"
                                                                            min="0"
                                                                            className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500
                                                                                ${errors[`from_floor_${t}_${f}`] ? "border-red-500" : "border-gray-300"}`}
                                                                        />
                                                                        {errors[`from_floor_${t}_${f}`] && (
                                                                            <p className="mt-1 text-xs text-red-500">{errors[`from_floor_${t}_${f}`]}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                            To Floor
                                                                        </label>
                                                                        <input
                                                                            id={`to_floor_${t}_${f}`}
                                                                            type="number"
                                                                            value={floor.to_floor || ""}
                                                                            onChange={(e) => updateFloorDesign(
                                                                                t,
                                                                                f,
                                                                                "to_floor",
                                                                                parseInt(e.target.value) || 0
                                                                            )}
                                                                            placeholder="End floor"
                                                                            min="0"
                                                                            className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500
                                                                                ${errors[`to_floor_${t}_${f}`] ? "border-red-500" : "border-gray-300"}`}
                                                                        />
                                                                        {errors[`to_floor_${t}_${f}`] && (
                                                                            <p className="mt-1 text-xs text-red-500">{errors[`to_floor_${t}_${f}`]}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                            Units Per Floor
                                                                        </label>
                                                                        <input
                                                                            id={`units_${t}_${f}`}
                                                                            type="number"
                                                                            value={floor.units_per_floor || ""}
                                                                            onChange={(e) => updateFloorDesign(
                                                                                t,
                                                                                f,
                                                                                "units_per_floor",
                                                                                parseInt(e.target.value) || 0
                                                                            )}
                                                                            placeholder="Units/floor"
                                                                            min="1"
                                                                            className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500
                                                                                ${errors[`units_${t}_${f}`] ? "border-red-500" : "border-gray-300"}`}
                                                                        />
                                                                        {errors[`units_${t}_${f}`] && (
                                                                            <p className="mt-1 text-xs text-red-500">{errors[`units_${t}_${f}`]}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                            Configuration Type
                                                                        </label>
                                                                        <select
                                                                            id={`config_${t}_${f}`}
                                                                            value={floor.configuration_id || ""}
                                                                            onChange={(e) =>
                                                                                updateFloorDesign(t, f, "configuration_id", e.target.value)
                                                                            }
                                                                            className={`w-full px-3 py-2 border rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500
                                                                                ${errors[`config_${t}_${f}`] ? "border-red-500" : "border-gray-300"}`}
                                                                        >
                                                                            <option value="">Select configuration</option>
                                                                            {configurations?.map(config => (
                                                                                <option
                                                                                    key={config.id || config._id}
                                                                                    value={config.id || config._id}
                                                                                >
                                                                                    {config.name} ({config.type})
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        {errors[`config_${t}_${f}`] && (
                                                                            <p className="mt-1 text-xs text-red-500">{errors[`config_${t}_${f}`]}</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Range Summary */}
                                                                {floor.from_floor && floor.to_floor && (
                                                                    <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                                                        <span className="font-medium">Summary:</span>{' '}
                                                                        Floors {floor.from_floor} to {floor.to_floor} •{' '}
                                                                        {floor.units_per_floor || 0} units per floor •{' '}
                                                                        Total {(parseInt(floor.to_floor) - parseInt(floor.from_floor) + 1) * (parseInt(floor.units_per_floor) || 0)} units
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Add Range Button */}
                                                <button
                                                    onClick={() => addFloorDesign(t)}
                                                    className="mt-4 inline-flex items-center px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 font-medium rounded-lg transition-colors duration-200 border border-indigo-200 hover:border-indigo-300"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Add Another Floor Range
                                                </button>
                                            </div>

                                            {/* Tower Summary */}
                                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                                <h5 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Tower Summary
                                                </h5>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-indigo-600 font-medium">Total Floors:</span>
                                                        <p className="text-gray-800">{tower.total_floors || 0}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-indigo-600 font-medium">Floor Ranges:</span>
                                                        <p className="text-gray-800">{tower.floor_designs.length}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-indigo-600 font-medium">Total Units:</span>
                                                        <p className="text-gray-800">{calculateTotalUnits(tower)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-indigo-600 font-medium">Configurations:</span>
                                                        <p className="text-gray-800">{getUniqueConfigCount(tower)}</p>
                                                    </div>
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
                            onClick={() => window.history.back()}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
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
                                    Update Towers
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}