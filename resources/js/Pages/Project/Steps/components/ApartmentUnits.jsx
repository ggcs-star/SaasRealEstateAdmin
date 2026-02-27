import { Building2, RefreshCw, Plus, Zap, Copy, Trash2, ChevronRight, ChevronDown } from "lucide-react";

export default function ApartmentUnits({
    data,
    setData,
    setup,
    setSetup,
    autoGenerate,
    setAutoGenerate,
    expandedTowers,
    expandedFloors,
    toggleTower,
    toggleFloor,
    generateUnits,
    updateFloorBhk,
    addFloorBhk,
    removeFloorBhk,
    generateFloorUnits,
    openBulkBHKConfig,
    copyFloorBHKToOthers,
    addFloor,
    removeFloor,
    updateUnit,
    removeUnit,
    statusOptions,
    getStatusColor,
    getStatusIcon
}) {
    return (
        <div className="space-y-6">
            {/* Quick Setup Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Building2 size={20} className="text-indigo-600" />
                        Tower Configuration
                    </h4>

                    {/* Auto-generate Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm text-gray-600">Auto-generate units</span>
                        <div
                            onClick={() => setAutoGenerate(!autoGenerate)}
                            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                autoGenerate ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    autoGenerate ? 'translate-x-7' : 'translate-x-1'
                                }`}
                            />
                        </div>
                    </label>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Total Towers</label>
                        <input
                            type="number"
                            min="0"
                            value={setup.towers}
                            onChange={(e) => setSetup({ ...setup, towers: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Floors per Tower</label>
                        <input
                            type="number"
                            min="0"
                            value={setup.floors}
                            onChange={(e) => setSetup({ ...setup, floors: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tower Prefix</label>
                        <input
                            value={setup.prefix}
                            onChange={(e) => setSetup({ ...setup, prefix: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="A"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={generateUnits}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Generate Towers
                        </button>
                    </div>
                </div>
            </div>

            {/* Project Summary Stats */}
            {data.towers?.length > 0 && (
                <ProjectSummary data={data} statusOptions={statusOptions} />
            )}

            {/* Towers List */}
            {data.towers?.map((tower, t) => (
                <TowerCard
                    key={t}
                    tower={tower}
                    towerIndex={t}
                    expandedTowers={expandedTowers}
                    toggleTower={toggleTower}
                    expandedFloors={expandedFloors}
                    toggleFloor={toggleFloor}
                    openBulkBHKConfig={openBulkBHKConfig}
                    addFloor={addFloor}
                    copyFloorBHKToOthers={copyFloorBHKToOthers}
                    removeFloor={removeFloor}
                    updateFloorBhk={updateFloorBhk}
                    addFloorBhk={addFloorBhk}
                    removeFloorBhk={removeFloorBhk}
                    autoGenerate={autoGenerate}
                    generateFloorUnits={generateFloorUnits}
                    updateUnit={updateUnit}
                    removeUnit={removeUnit}
                    statusOptions={statusOptions}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                />
            ))}
        </div>
    );
}

// Project Summary Component
function ProjectSummary({ data, statusOptions }) {
    const getTotalUnits = () => {
        return data.towers.reduce((sum, tower) =>
            sum + tower.floors.reduce((floorSum, floor) =>
                floorSum + floor.units.length, 0
            ), 0
        );
    };

    const getTotalFloors = () => {
        return data.towers.reduce((sum, tower) => sum + tower.floors.length, 0);
    };

    const getAvgUnitsPerFloor = () => {
        const totalUnits = getTotalUnits();
        const totalFloors = getTotalFloors();
        return Math.round(totalUnits / totalFloors) || 0;
    };

    const getBHKCount = (type) => {
        return data.towers.reduce((sum, tower) =>
            sum + tower.floors.reduce((floorSum, floor) =>
                floorSum + floor.units.filter(u => u.bhk === type).length, 0
            ), 0
        );
    };

    const getStatusCount = (status) => {
        return data.towers.reduce((sum, tower) =>
            sum + tower.floors.reduce((floorSum, floor) =>
                floorSum + floor.units.filter(u => u.status === status).length, 0
            ), 0
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-indigo-600" />
                Project Summary
            </h4>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <StatCard label="Total Towers" value={data.towers.length} color="indigo" />
                <StatCard label="Total Floors" value={getTotalFloors()} color="indigo" />
                <StatCard label="Total Units" value={getTotalUnits()} color="indigo" />
                <StatCard label="Avg Units/Floor" value={getAvgUnitsPerFloor()} color="indigo" span={2} />
            </div>

            {/* BHK-wise Summary */}
            <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">BHK Distribution (All Towers)</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['1BHK', '2BHK', '3BHK', '4BHK'].map(type => {
                        const count = getBHKCount(type);
                        if (count === 0) return null;
                        return (
                            <div key={type} className="bg-gray-50 p-3 rounded-lg text-center">
                                <span className="text-xs text-gray-500">{type}</span>
                                <p className="text-lg font-bold text-gray-800">{count}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status-wise Summary */}
            <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Status Distribution (All Towers)</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {statusOptions.map(opt => {
                        const count = getStatusCount(opt.value);
                        if (count === 0) return null;
                        const Icon = opt.icon;
                        return (
                            <div key={opt.value} className={`${opt.color} p-3 rounded-lg text-center`}>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Icon size={14} />
                                    <span className="text-xs">{opt.label}</span>
                                </div>
                                <p className="text-lg font-bold">{count}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ label, value, color, span }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600"
    };

    return (
        <div className={`${colors[color]} p-3 rounded-lg text-center ${span ? 'col-span-2' : ''}`}>
            <span className="text-xs">{label}</span>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}

// Tower Card Component
function TowerCard({
    tower,
    towerIndex,
    expandedTowers,
    toggleTower,
    expandedFloors,
    toggleFloor,
    openBulkBHKConfig,
    addFloor,
    copyFloorBHKToOthers,
    removeFloor,
    updateFloorBhk,
    addFloorBhk,
    removeFloorBhk,
    autoGenerate,
    generateFloorUnits,
    updateUnit,
    removeUnit,
    statusOptions,
    getStatusColor,
    getStatusIcon
}) {
    const towerTotalFloors = tower.floors.length;
    const towerTotalUnits = tower.floors.reduce((sum, floor) => sum + floor.units.length, 0);
    
    const towerBHKStats = {};
    const towerStatusStats = {};

    tower.floors.forEach(floor => {
        floor.units.forEach(unit => {
            towerBHKStats[unit.bhk] = (towerBHKStats[unit.bhk] || 0) + 1;
            towerStatusStats[unit.status] = (towerStatusStats[unit.status] || 0) + 1;
        });
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Tower Header */}
            <div
                onClick={() => toggleTower(towerIndex)}
                className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <ChevronRight
                        size={20}
                        className={`text-gray-500 transition-transform ${expandedTowers[towerIndex] ? 'rotate-90' : ''}`}
                    />
                    <div className="flex items-center gap-2">
                        <Building2 size={20} className="text-indigo-600" />
                        <span className="font-semibold text-gray-800">Tower {tower.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {towerTotalFloors} Floor{towerTotalFloors !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {towerTotalUnits} Unit{towerTotalUnits !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); openBulkBHKConfig(towerIndex); }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Zap size={16} />
                        Bulk Configure
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); addFloor(towerIndex); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Floor
                    </button>
                </div>
            </div>

            {/* Tower Content */}
            {expandedTowers[towerIndex] && (
                <div className="p-4 space-y-4">
                    {/* Tower BHK Summary */}
                    {Object.keys(towerBHKStats).length > 0 && (
                        <TowerSummary
                            title={`Tower ${tower.name} BHK Distribution`}
                            stats={towerBHKStats}
                        />
                    )}

                    {/* Tower Status Summary */}
                    {Object.keys(towerStatusStats).length > 0 && (
                        <TowerSummary
                            title={`Tower ${tower.name} Status Distribution`}
                            stats={towerStatusStats}
                            statusOptions={statusOptions}
                            colorMap={true}
                        />
                    )}

                    {tower.floors.map((floor, f) => (
                        <FloorCard
                            key={f}
                            towerIndex={towerIndex}
                            floor={floor}
                            floorIndex={f}
                            towerName={tower.name}
                            expandedFloors={expandedFloors}
                            toggleFloor={toggleFloor}
                            copyFloorBHKToOthers={copyFloorBHKToOthers}
                            removeFloor={removeFloor}
                            updateFloorBhk={updateFloorBhk}
                            addFloorBhk={addFloorBhk}
                            removeFloorBhk={removeFloorBhk}
                            autoGenerate={autoGenerate}
                            generateFloorUnits={generateFloorUnits}
                            updateUnit={updateUnit}
                            removeUnit={removeUnit}
                            statusOptions={statusOptions}
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Tower Summary Component
function TowerSummary({ title, stats, statusOptions, colorMap }) {
    return (
        <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="text-xs font-medium text-gray-600 mb-2">{title}</h5>
            <div className="flex flex-wrap gap-2">
                {Object.entries(stats).map(([key, count]) => {
                    if (colorMap) {
                        const option = statusOptions.find(opt => opt.value === key);
                        if (!option) return null;
                        const Icon = option.icon;
                        return (
                            <div key={key} className={`${option.color} px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                                <Icon size={12} />
                                <span>{option.label}:</span>
                                <span className="font-bold">{count}</span>
                            </div>
                        );
                    } else {
                        return (
                            <div key={key} className="bg-white px-3 py-1 rounded-full text-sm border">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-bold text-gray-800 ml-1">{count}</span>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

// Floor Card Component
function FloorCard({
    towerIndex,
    floor,
    floorIndex,
    towerName,
    expandedFloors,
    toggleFloor,
    copyFloorBHKToOthers,
    removeFloor,
    updateFloorBhk,
    addFloorBhk,
    removeFloorBhk,
    autoGenerate,
    generateFloorUnits,
    updateUnit,
    removeUnit,
    statusOptions,
    getStatusColor,
    getStatusIcon
}) {
    const floorKey = `${towerIndex}-${floorIndex}`;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Floor Header */}
            <div
                onClick={() => toggleFloor(towerIndex, floorIndex)}
                className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer border-b"
            >
                <div className="flex items-center gap-3">
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform ${expandedFloors[floorKey] ? '' : '-rotate-90'}`}
                    />
                    <span className="font-medium text-gray-700">
                        Floor {floor.floor_number}
                    </span>
                    {floor.units.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {floor.units.length} Units
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); copyFloorBHKToOthers(towerIndex, floorIndex); }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Copy this floor's BHK configuration to other floors"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); removeFloor(towerIndex, floorIndex); }}
                        className="text-red-600 hover:text-red-800 p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Floor Content */}
            {expandedFloors[floorKey] && (
                <div className="p-4 bg-gray-50 space-y-4">
                    {/* BHK Distribution */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">BHK Distribution</h5>
                        <div className="space-y-2">
                            {floor.bhkTypes.map((bhk, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <select
                                        value={bhk.type}
                                        onChange={(e) => updateFloorBhk(towerIndex, floorIndex, i, "type", e.target.value)}
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
                                        onChange={(e) => updateFloorBhk(towerIndex, floorIndex, i, "count", parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={() => removeFloorBhk(towerIndex, floorIndex, i)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => addFloorBhk(towerIndex, floorIndex)}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Add BHK Type
                            </button>
                        </div>

                        {/* Auto-generate hint */}
                        {autoGenerate && (
                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <Zap size={12} />
                                Units will auto-generate when you change BHK types
                            </p>
                        )}
                    </div>

                    {/* Manual Generate Button */}
                    {!autoGenerate && (
                        <button
                            onClick={() => generateFloorUnits(towerIndex, floorIndex)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Generate Units for Floor {floor.floor_number}
                        </button>
                    )}

                    {/* Units Grid */}
                    {floor.units.length > 0 && (
                        <UnitsGrid
                            towerIndex={towerIndex}
                            floorIndex={floorIndex}
                            floor={floor}
                            towerName={towerName}
                            updateUnit={updateUnit}
                            removeUnit={removeUnit}
                            statusOptions={statusOptions}
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// Units Grid Component
function UnitsGrid({
    towerIndex,
    floorIndex,
    floor,
    towerName,
    updateUnit,
    removeUnit,
    statusOptions,
    getStatusColor,
    getStatusIcon
}) {
    return (
        <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
                <h5 className="text-sm font-medium text-gray-700">
                    Units on Floor {floor.floor_number}
                </h5>

                {/* Floor Status Summary */}
                <div className="flex gap-2">
                    {statusOptions.map(opt => {
                        const count = floor.units.filter(u => u.status === opt.value).length;
                        if (count === 0) return null;
                        const Icon = opt.icon;
                        return (
                            <span key={opt.value} className={`${opt.color} text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                                <Icon size={10} />
                                {opt.label}: {count}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {floor.units.map((unit, u) => {
                    const StatusIcon = getStatusIcon(unit.status);
                    return (
                        <div key={u} className="border border-gray-200 rounded-lg p-3 space-y-2">
                            <input
                                value={unit.unit_number}
                                onChange={(e) => updateUnit(towerIndex, floorIndex, u, "unit_number", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Unit Number"
                            />
                            <select
                                value={unit.bhk}
                                onChange={(e) => updateUnit(towerIndex, floorIndex, u, "bhk", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option>1BHK</option>
                                <option>2BHK</option>
                                <option>3BHK</option>
                                <option>4BHK</option>
                            </select>

                            {/* Status Dropdown */}
                            <div className="relative">
                                <select
                                    value={unit.status}
                                    onChange={(e) => updateUnit(towerIndex, floorIndex, u, "status", e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm pl-8 ${getStatusColor(unit.status)}`}
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <StatusIcon size={14} className="absolute left-2 top-3" />
                            </div>

                            <button
                                onClick={() => removeUnit(towerIndex, floorIndex, u)}
                                className="w-full text-red-600 hover:text-red-800 text-sm flex items-center justify-center gap-1"
                            >
                                <Trash2 size={14} />
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}