import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Step3Units({ data, setData, prevStep, nextStep }) {

    const towers = data.towers || [];
    const configurations = data.configurations || [];

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
        updated[t].floor_designs =
            updated[t].floor_designs.filter((_, i) => i !== f);
        setData("towers", updated);
    };

    const removeTower = (t) => {
        setData("towers",
            towers.filter((_, i) => i !== t)
        );
    };

    return (
        <div className="space-y-8">
            {/* Header with progress */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tower Configuration</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Step 3 of 4
                </span>
            </div>

            {/* Add Tower Button */}
            <div className="flex justify-end">
                <button
                    onClick={addTower}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Tower
                </button>
            </div>

            {/* Empty State */}
            {towers.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
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
                        <div key={t} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            {/* Tower Header */}
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {tower.name || `Tower ${t + 1}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {tower.total_floors || 0} floors total
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeTower(t)}
                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                    title="Remove tower"
                                >
                                    <Trash2 size={20} className="text-gray-400 group-hover:text-red-600" />
                                </button>
                            </div>

                            {/* Tower Content */}
                            <div className="p-6 space-y-6">
                                {/* Tower Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tower Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tower Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={tower.name}
                                            onChange={(e) => updateTower(t, "name", e.target.value)}
                                            placeholder="e.g., Tower A, Tower B, Block C"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Enter a unique name for this tower
                                        </p>
                                    </div>

                                    {/* Total Floors */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Floors <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={tower.total_floors}
                                            onChange={(e) => updateTower(t, "total_floors", parseInt(e.target.value) || 0)}
                                            placeholder="e.g., 10 (G+9)"
                                            min="0"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Enter total number of floors (including ground floor)
                                        </p>
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
                                                                type="number"
                                                                value={floor.from_floor}
                                                                onChange={(e) => updateFloorDesign(
                                                                    t,
                                                                    f,
                                                                    "from_floor",
                                                                    parseInt(e.target.value) || 0
                                                                )}
                                                                placeholder="Start floor"
                                                                min="0"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                To Floor
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={floor.to_floor}
                                                                onChange={(e) => updateFloorDesign(
                                                                    t,
                                                                    f,
                                                                    "to_floor",
                                                                    parseInt(e.target.value) || 0
                                                                )}
                                                                placeholder="End floor"
                                                                min="0"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                Units Per Floor
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={floor.units_per_floor}
                                                                onChange={(e) => updateFloorDesign(
                                                                    t,
                                                                    f,
                                                                    "units_per_floor",
                                                                    parseInt(e.target.value) || 0
                                                                )}
                                                                placeholder="Units/floor"
                                                                min="1"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                Configuration Type
                                                            </label>
                                                            <select
                                                                value={floor.configuration_id}
                                                                onChange={(e) =>
                                                                    updateFloorDesign(t, f, "configuration_id", e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select configuration</option>

                                                                {configurations.map(config => (
                                                                    <option
                                                                        key={config.id}
                                                                        value={config.id}
                                                                    >
                                                                        {config.name} ({config.type})
                                                                    </option>
                                                                ))}
                                                            </select>
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
                                            <p className="text-gray-800">
                                                {tower.floor_designs.reduce((total, range) => {
                                                    const floors = range.to_floor && range.from_floor ?
                                                        parseInt(range.to_floor) - parseInt(range.from_floor) + 1 : 0;
                                                    return total + (floors * (parseInt(range.units_per_floor) || 0));
                                                }, 0)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-indigo-600 font-medium">Configurations:</span>
                                            <p className="text-gray-800">
                                                {new Set(tower.floor_designs.map(d => d.configuration_id).filter(id => id)).size}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                <button
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
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={nextStep}
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