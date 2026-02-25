import { Eye, Grid, List, CheckCircle, XCircle, Clock } from "lucide-react";

export default function UnitView({
    unitView,
    setUnitView,
    getFilteredUnits,
    getAllUnits,
    openUnitDetails,
    closeUnitDetails,
    updateSelectedUnit,
    deleteSelectedUnit,
    statusOptions,
    getStatusColor,
    getStatusIcon,
    getStatusBgColor
}) {
    const filteredUnits = getFilteredUnits();
    const allUnits = getAllUnits();

    return (
        <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Eye size={20} className="text-indigo-600" />
                    Units View
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setUnitView({...unitView, mode: "grid"})}
                        className={`p-2 rounded-lg transition-colors ${
                            unitView.mode === "grid" 
                                ? "bg-indigo-100 text-indigo-600" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title="Grid View"
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setUnitView({...unitView, mode: "list"})}
                        className={`p-2 rounded-lg transition-colors ${
                            unitView.mode === "list" 
                                ? "bg-indigo-100 text-indigo-600" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-3 mb-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Filter by BHK</label>
                    <select
                        value={unitView.filters.bhk}
                        onChange={(e) => setUnitView({...unitView, filters: {...unitView.filters, bhk: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="all">All BHK Types</option>
                        <option value="1BHK">1BHK</option>
                        <option value="2BHK">2BHK</option>
                        <option value="3BHK">3BHK</option>
                        <option value="4BHK">4BHK</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Filter by Status</label>
                    <select
                        value={unitView.filters.status}
                        onChange={(e) => setUnitView({...unitView, filters: {...unitView.filters, status: e.target.value}})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="all">All Status</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Search</label>
                    <input
                        type="text"
                        value={unitView.filters.search}
                        onChange={(e) => setUnitView({...unitView, filters: {...unitView.filters, search: e.target.value}})}
                        placeholder="Search by unit number, BHK, location..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* Units Display */}
            {filteredUnits.length > 0 ? (
                unitView.mode === "grid" ? (
                    // Grid View
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {filteredUnits.map((unit) => {
                            const StatusIcon = getStatusIcon(unit.status);
                            return (
                                <div
                                    key={unit.id}
                                    onClick={() => openUnitDetails(unit)}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusBgColor(unit.status)} ${
                                        unitView.selectedUnit?.id === unit.id ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
                                    }`}
                                >
                                    <div className="text-xs text-gray-500 mb-1">
                                        {unit.type === 'apartment' ? '🏢' : '🏠'} {unit.location}
                                    </div>
                                    <div className="font-bold text-sm truncate">{unit.unit_number}</div>
                                    <div className="text-xs text-gray-600 mt-1">{unit.bhk}</div>
                                    <div className={`mt-2 text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(unit.status)}`}>
                                        <StatusIcon size={10} />
                                        <span className="truncate">
                                            {statusOptions.find(opt => opt.value === unit.status)?.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // List View
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Number</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">BHK</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUnits.map((unit) => {
                                    const StatusIcon = getStatusIcon(unit.status);
                                    return (
                                        <tr
                                            key={unit.id}
                                            className={`hover:bg-gray-50 cursor-pointer ${
                                                unitView.selectedUnit?.id === unit.id ? 'bg-indigo-50' : ''
                                            }`}
                                            onClick={() => openUnitDetails(unit)}
                                        >
                                            <td className="px-4 py-2 text-sm">
                                                {unit.type === 'apartment' ? '🏢 Apartment' : '🏠 Bungalow'}
                                            </td>
                                            <td className="px-4 py-2 text-sm">{unit.location}</td>
                                            <td className="px-4 py-2 text-sm font-medium">{unit.unit_number}</td>
                                            <td className="px-4 py-2 text-sm">{unit.bhk}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(unit.status)}`}>
                                                    <StatusIcon size={12} />
                                                    {statusOptions.find(opt => opt.value === unit.status)?.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openUnitDetails(unit);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-800 mr-2"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No units found matching the filters.
                </div>
            )}

            {/* Summary */}
            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        Total Units: <span className="font-bold text-indigo-600">{filteredUnits.length}</span> / {allUnits.length}
                    </span>
                    <div className="flex gap-2">
                        {statusOptions.map(opt => {
                            const count = filteredUnits.filter(u => u.status === opt.value).length;
                            if (count === 0) return null;
                            const Icon = opt.icon;
                            return (
                                <span key={opt.value} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${opt.color}`}>
                                    <Icon size={10} />
                                    {opt.label}: {count}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Unit Details Modal */}
            {unitView.showUnitDetails && unitView.selectedUnit && (
                <UnitDetailsModal
                    selectedUnit={unitView.selectedUnit}
                    closeUnitDetails={closeUnitDetails}
                    updateSelectedUnit={updateSelectedUnit}
                    deleteSelectedUnit={deleteSelectedUnit}
                    statusOptions={statusOptions}
                    getStatusColor={getStatusColor}
                />
            )}
        </div>
    );
}

// Unit Details Modal Component
function UnitDetailsModal({ selectedUnit, closeUnitDetails, updateSelectedUnit, deleteSelectedUnit, statusOptions, getStatusColor }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Unit Details</h3>
                        <button
                            onClick={closeUnitDetails}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Unit Type Badge */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Type</span>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                {selectedUnit.type === 'apartment' ? 'Apartment' : 'Bungalow'}
                            </span>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Location</label>
                            <p className="text-gray-800 font-medium">{selectedUnit.location}</p>
                        </div>

                        {/* Unit Number */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Unit Number</label>
                            <input
                                type="text"
                                value={selectedUnit.unit_number}
                                onChange={(e) => updateSelectedUnit("unit_number", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* BHK Type */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">BHK Type</label>
                            <select
                                value={selectedUnit.bhk}
                                onChange={(e) => updateSelectedUnit("bhk", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option>1BHK</option>
                                <option>2BHK</option>
                                <option>3BHK</option>
                                <option>4BHK</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Status</label>
                            <select
                                value={selectedUnit.status}
                                onChange={(e) => updateSelectedUnit("status", e.target.value)}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 ${getStatusColor(selectedUnit.status)}`}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Additional Info */}
                        {selectedUnit.type === 'apartment' && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Tower:</span> {selectedUnit.tower}<br />
                                    <span className="font-medium">Floor:</span> {selectedUnit.floor}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <button
                            onClick={closeUnitDetails}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            onClick={deleteSelectedUnit}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete Unit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}