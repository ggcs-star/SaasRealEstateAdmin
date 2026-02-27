import { Home, RefreshCw, Plus, Zap, Copy, Trash2, LayoutGrid } from "lucide-react";

export default function BungalowUnits({
    data,
    setData,
    setup,
    setSetup,
    generateBungalows,
    updateBungalow,
    removeBungalow,
    addBungalow,
    openBulkBungalowConfig,
    copyBungalowConfig,
    reorderBungalows,
    statusOptions,
    getStatusColor,
    getStatusIcon
}) {
    return (
        <div className="space-y-6">
            {/* Bungalow Setup Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Home size={20} className="text-indigo-600" />
                        Bungalow Configuration
                    </h4>

                    {/* Bulk Configure Button */}
                    <button
                        onClick={openBulkBungalowConfig}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Zap size={16} />
                        Bulk Configure
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Number of Bungalows</label>
                        <input
                            type="number"
                            min="0"
                            value={setup.bungalows}
                            onChange={(e) => setSetup({ ...setup, bungalows: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Prefix</label>
                        <input
                            value={setup.bungalowPrefix}
                            onChange={(e) => setSetup({ ...setup, bungalowPrefix: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="B"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={generateBungalows}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Generate Basic
                        </button>
                    </div>
                </div>
            </div>

            {/* Bungalows List */}
            {data.bungalows?.length > 0 && (
                <BungalowList
                    bungalows={data.bungalows}
                    updateBungalow={updateBungalow}
                    removeBungalow={removeBungalow}
                    addBungalow={addBungalow}
                    reorderBungalows={reorderBungalows}
                    copyBungalowConfig={copyBungalowConfig}
                    statusOptions={statusOptions}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                />
            )}
        </div>
    );
}

// Bungalow List Component
function BungalowList({
    bungalows,
    updateBungalow,
    removeBungalow,
    addBungalow,
    reorderBungalows,
    copyBungalowConfig,
    statusOptions,
    getStatusColor,
    getStatusIcon
}) {
    const getBHKCount = (type) => {
        return bungalows.filter(b => b.bhk === type).length;
    };

    const getStatusCount = (status) => {
        return bungalows.filter(b => b.status === status).length;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Bungalow List</h4>
                <button
                    onClick={reorderBungalows}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                    title="Reorder and renumber bungalows"
                >
                    <LayoutGrid size={16} />
                    Reorder
                </button>
            </div>

            {/* Summary Stats */}
            <BungalowSummary
                bungalows={bungalows}
                getBHKCount={getBHKCount}
                getStatusCount={getStatusCount}
                statusOptions={statusOptions}
            />

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {bungalows.map((b, i) => {
                    const StatusIcon = getStatusIcon(b.status);
                    return (
                        <BungalowItem
                            key={i}
                            index={i}
                            bungalow={b}
                            updateBungalow={updateBungalow}
                            removeBungalow={removeBungalow}
                            copyBungalowConfig={copyBungalowConfig}
                            getStatusColor={getStatusColor}
                            StatusIcon={StatusIcon}
                            statusOptions={statusOptions}
                        />
                    );
                })}
            </div>

            <button
                onClick={addBungalow}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} />
                Add Single Bungalow
            </button>
        </div>
    );
}

// Bungalow Summary Component
function BungalowSummary({ bungalows, getBHKCount, getStatusCount, statusOptions }) {
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {['1BHK', '2BHK', '3BHK', '4BHK'].map(type => {
                    const count = getBHKCount(type);
                    if (count === 0) return null;
                    return (
                        <div key={type} className="bg-gray-50 p-2 rounded-lg text-center">
                            <span className="text-xs text-gray-500">{type}</span>
                            <p className="font-bold text-gray-800">{count}</p>
                        </div>
                    );
                })}
                <div className="bg-indigo-50 p-2 rounded-lg text-center">
                    <span className="text-xs text-indigo-600">Total</span>
                    <p className="font-bold text-indigo-700">{bungalows.length}</p>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {statusOptions.map(opt => {
                    const count = getStatusCount(opt.value);
                    if (count === 0) return null;
                    const Icon = opt.icon;
                    return (
                        <div key={opt.value} className={`${opt.color} p-2 rounded-lg text-center`}>
                            <div className="flex items-center justify-center gap-1">
                                <Icon size={14} />
                                <span className="text-xs">{opt.label}</span>
                            </div>
                            <p className="font-bold">{count}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

// Bungalow Item Component
function BungalowItem({ index, bungalow, updateBungalow, removeBungalow, copyBungalowConfig, getStatusColor, StatusIcon, statusOptions }) {
    return (
        <div className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
            <div className="flex-1 grid md:grid-cols-3 gap-3">
                <input
                    value={bungalow.unit_number}
                    onChange={(e) => updateBungalow(index, "unit_number", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Unit Number"
                />
                <select
                    value={bungalow.bhk}
                    onChange={(e) => updateBungalow(index, "bhk", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                    <option>1BHK</option>
                    <option>2BHK</option>
                    <option>3BHK</option>
                    <option>4BHK</option>
                </select>

                {/* Status Dropdown */}
                <div className="relative">
                    <select
                        value={bungalow.status}
                        onChange={(e) => updateBungalow(index, "status", e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 pl-8 ${getStatusColor(bungalow.status)}`}
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <StatusIcon size={16} className="absolute left-2 top-3" />
                </div>
            </div>
            <div className="flex gap-1">
                <button
                    onClick={() => copyBungalowConfig(index)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Copy this configuration"
                >
                    <Copy size={16} />
                </button>
                <button
                    onClick={() => removeBungalow(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}