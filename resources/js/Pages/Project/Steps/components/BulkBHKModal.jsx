import { Plus, Trash2 } from "lucide-react";

export default function BulkBungalowModal({
    bulkBungalow,
    setBulkBungalow,
    updateBulkBungalowBHK,
    addBulkBungalowBHK,
    removeBulkBungalowBHK,
    applyBulkBungalowConfig
}) {
    const totalUnits = bulkBungalow.bhkTypes.reduce((sum, bhk) => sum + bhk.count, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Bulk Bungalow Configuration</h3>
                        <button
                            onClick={() => setBulkBungalow({ ...bulkBungalow, show: false })}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Configure multiple bungalows with different BHK types in one go.
                    </p>

                    {/* Prefix */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
                        <input
                            type="text"
                            value={bulkBungalow.prefix}
                            onChange={(e) => setBulkBungalow({ ...bulkBungalow, prefix: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="B"
                        />
                    </div>

                    {/* Start Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Number</label>
                        <input
                            type="number"
                            min="0"
                            value={bulkBungalow.startNumber}
                            onChange={(e) => setBulkBungalow({ ...bulkBungalow, startNumber: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Units will be numbered as: {bulkBungalow.prefix}-{bulkBungalow.startNumber}, {bulkBungalow.prefix}-{bulkBungalow.startNumber + 1}, etc.
                        </p>
                    </div>

                    {/* BHK Types */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">BHK Distribution</label>
                        <div className="space-y-2">
                            {bulkBungalow.bhkTypes.map((bhk, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <select
                                        value={bhk.type}
                                        onChange={(e) => updateBulkBungalowBHK(i, "type", e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option>1BHK</option>
                                        <option>2BHK</option>
                                        <option>3BHK</option>
                                        <option>4BHK</option>
                                    </select>
                                    <input
                                        type="number"
                                        min="0"
                                        value={bhk.count}
                                        onChange={(e) => updateBulkBungalowBHK(i, "count", parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={() => removeBulkBungalowBHK(i)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addBulkBungalowBHK}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Add BHK Type
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">
                            Total bungalows to add: <span className="font-bold text-indigo-600">{totalUnits}</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            onClick={() => setBulkBungalow({ ...bulkBungalow, show: false })}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={applyBulkBungalowConfig}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                        >
                            Generate Bungalows
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}