import { Settings, Building2, Home, Plus, Trash2, RefreshCw, ChevronRight, ChevronDown, Zap, Copy, LayoutGrid, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function Step3Units({ data, setData, prevStep, nextStep }) {
    const [projectType, setProjectType] = useState(
        data.bungalows?.length > 0 ? "bungalow" : "apartment"
    );
    const [expandedTowers, setExpandedTowers] = useState({});
    const [expandedFloors, setExpandedFloors] = useState({});
    const [autoGenerate, setAutoGenerate] = useState(true);
    const towers = data.towers || [];
    const bungalows = data.bungalows || [];
    // Status options
    const statusOptions = [
        { value: "available", label: "Available", color: "bg-green-100 text-green-700", icon: CheckCircle },
        { value: "sold", label: "Sold", color: "bg-red-100 text-red-700", icon: XCircle },
        { value: "blocked", label: "Blocked", color: "bg-yellow-100 text-yellow-700", icon: Clock },
        { value: "booked", label: "Booked", color: "bg-blue-100 text-blue-700", icon: Clock },
    ];

    // State for bulk BHK configuration (Apartments)
    const [bulkBHK, setBulkBHK] = useState({
        show: false,
        towerIndex: null,
        bhkTypes: [{ type: "2BHK", count: 2 }],
        applyToAllFloors: true,
        fromFloor: 1,
        toFloor: null
    });

    // State for bulk Bungalow configuration
    const [bulkBungalow, setBulkBungalow] = useState({
        show: false,
        bhkTypes: [{ type: "3BHK", count: 1 }],
        startNumber: 1,
        prefix: "B"
    });

    const [setup, setSetup] = useState({
        towers: 1,
        floors: 1,
        prefix: "A",
        bungalows: 4,
        bungalowPrefix: "B"
    });

    // Toggle functions for accordion
    const toggleTower = (t) => {
        setExpandedTowers(prev => ({
            ...prev,
            [t]: !prev[t]
        }));
    };

    const toggleFloor = (t, f) => {
        const key = `${t}-${f}`;
        setExpandedFloors(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.color : "bg-gray-100 text-gray-700";
    };

    // Helper function to get status icon
    const getStatusIcon = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.icon : CheckCircle;
    };

    /* ================= APARTMENT FUNCTIONS ================= */
    const generateUnits = () => {

        if (towers.length > 0 || bungalows.length > 0) {
            if (!confirm("This will replace existing units. Continue?")) {
                return;
            }
        }

        let newTowers = [];

        for (let t = 0; t < setup.towers; t++) {
            let towerName = String.fromCharCode(setup.prefix.charCodeAt(0) + t);
            let floors = [];

            for (let f = 1; f <= setup.floors; f++) {
                floors.push({
                    floor_number: f,
                    bhkTypes: [{ type: "2BHK", count: 2 }],
                    units: []
                });
            }

            newTowers.push({
                name: towerName,
                floors
            });
        }

        setData("towers", newTowers);
        setData("bungalows", []);
    };

    const updateFloorBhk = (t, f, i, field, value) => {
        let towers = [...data.towers];
        towers[t].floors[f].bhkTypes[i][field] = value;
        setData("towers", towers);

        if (autoGenerate) {
            setTimeout(() => generateFloorUnits(t, f), 0);
        }
    };

    const addFloorBhk = (t, f) => {
        let towers = [...data.towers];
        towers[t].floors[f].bhkTypes.push({
            type: "2BHK",
            count: 1
        });
        setData("towers", towers);

        if (autoGenerate) {
            setTimeout(() => generateFloorUnits(t, f), 0);
        }
    };

    const removeFloorBhk = (t, f, i) => {
        let towers = [...data.towers];
        towers[t].floors[f].bhkTypes = towers[t].floors[f].bhkTypes.filter((_, x) => x !== i);
        setData("towers", towers);

        if (autoGenerate) {
            setTimeout(() => generateFloorUnits(t, f), 0);
        }
    };

    const generateFloorUnits = (t, f) => {
        let towers = [...data.towers];
        let tower = towers[t];
        let floor = tower.floors[f];
        let units = [];
        let index = 1;

        floor.bhkTypes.forEach(bhk => {
            for (let i = 0; i < bhk.count; i++) {
                units.push({
                    unit_number: tower.name + "-" + floor.floor_number + ("0" + index).slice(-2),
                    bhk: bhk.type,
                    status: "available",// Default status
                    view: "garden"
                });
                index++;
            }
        });

        floor.units = units;
        setData("towers", towers);
    };

    const openBulkBHKConfig = (t) => {
        const tower = data.towers[t];
        const maxFloor = tower.floors.length;

        setBulkBHK({
            show: true,
            towerIndex: t,
            bhkTypes: [{ type: "2BHK", count: 2 }],
            applyToAllFloors: true,
            fromFloor: 1,
            toFloor: maxFloor
        });
    };

    const updateBulkBHK = (i, field, value) => {
        let updatedBhkTypes = [...bulkBHK.bhkTypes];
        updatedBhkTypes[i][field] = value;
        setBulkBHK({
            ...bulkBHK,
            bhkTypes: updatedBhkTypes
        });
    };

    const addBulkBHK = () => {
        setBulkBHK({
            ...bulkBHK,
            bhkTypes: [...bulkBHK.bhkTypes, { type: "2BHK", count: 1 }]
        });
    };

    const removeBulkBHK = (i) => {
        let updatedBhkTypes = bulkBHK.bhkTypes.filter((_, x) => x !== i);
        setBulkBHK({
            ...bulkBHK,
            bhkTypes: updatedBhkTypes
        });
    };

    const applyBulkBHKConfig = () => {
        let towers = [...data.towers];
        const tower = towers[bulkBHK.towerIndex];

        const floorsToApply = tower.floors.filter(floor => {
            if (bulkBHK.applyToAllFloors) return true;
            return floor.floor_number >= bulkBHK.fromFloor && floor.floor_number <= bulkBHK.toFloor;
        });

        floorsToApply.forEach(floor => {
            floor.bhkTypes = JSON.parse(JSON.stringify(bulkBHK.bhkTypes));
        });

        setData("towers", towers);

        setTimeout(() => {
            floorsToApply.forEach((_, fIndex) => {
                const originalFloorIndex = tower.floors.findIndex(f => f.floor_number === floorsToApply[fIndex].floor_number);
                generateFloorUnits(bulkBHK.towerIndex, originalFloorIndex);
            });
        }, 0);

        setBulkBHK({ ...bulkBHK, show: false });
    };

    const copyFloorBHKToOthers = (t, sourceF) => {
        let towers = [...data.towers];
        const sourceFloor = towers[t].floors[sourceF];
        const sourceBHKTypes = JSON.parse(JSON.stringify(sourceFloor.bhkTypes));

        const maxFloor = towers[t].floors.length;
        const fromFloor = prompt(`Copy from Floor ${sourceFloor.floor_number} to which floors?\nEnter range (e.g., 1-${maxFloor}) or 'all' for all floors:`, 'all');

        if (!fromFloor) return;

        let floorsToApply = [];

        if (fromFloor.toLowerCase() === 'all') {
            floorsToApply = towers[t].floors;
        } else {
            const [start, end] = fromFloor.split('-').map(Number);
            if (start && end) {
                floorsToApply = towers[t].floors.filter(f => f.floor_number >= start && f.floor_number <= end);
            } else {
                alert('Invalid range. Please use format: start-end (e.g., 1-5)');
                return;
            }
        }

        floorsToApply.forEach(floor => {
            floor.bhkTypes = JSON.parse(JSON.stringify(sourceBHKTypes));
        });

        setData("towers", towers);

        setTimeout(() => {
            floorsToApply.forEach((_, fIndex) => {
                const originalFloorIndex = towers[t].floors.findIndex(f => f.floor_number === floorsToApply[fIndex].floor_number);
                generateFloorUnits(t, originalFloorIndex);
            });
        }, 0);
    };

    const addFloor = (t) => {
        let towers = [...data.towers];
        let tower = towers[t];
        let nextFloor = tower.floors.length > 0 ? Math.max(...tower.floors.map(x => x.floor_number)) + 1 : 1;
        tower.floors.push({
            floor_number: nextFloor,
            bhkTypes: [{ type: "2BHK", count: 2 }],
            units: []
        });
        setData("towers", towers);
    };

    const removeFloor = (t, f) => {
        let towers = [...data.towers];
        towers[t].floors = towers[t].floors.filter((_, i) => i !== f);
        setData("towers", towers);
    };

    const updateUnit = (t, f, u, field, value) => {
        let towers = [...data.towers];
        towers[t].floors[f].units[u][field] = value;
        setData("towers", towers);
    };

    const removeUnit = (t, f, u) => {
        let towers = [...data.towers];
        towers[t].floors[f].units = towers[t].floors[f].units.filter((_, i) => i !== u);
        setData("towers", towers);
    };

    /* ================= BUNGALOW FUNCTIONS ================= */
    const generateBungalows = () => {
        let b = [];
        for (let i = 1; i <= setup.bungalows; i++) {
            b.push({
                unit_number: setup.bungalowPrefix + "-" + i,
                bhk: "3BHK",
                status: "available", // Default status
                view: "garden"
            });
        }
        setData("bungalows", b);
        setData("towers", []);
    };

    const updateBungalow = (i, field, value) => {
        let b = [...data.bungalows];
        b[i][field] = value;
        setData("bungalows", b);
    };

    const removeBungalow = (i) => {
        setData("bungalows", data.bungalows.filter((_, x) => x !== i));
    };

    const addBungalow = () => {
        let b = [...data.bungalows];
        b.push({
            unit_number: "",
            bhk: "3BHK",
            status: "available" // Default status
        });
        setData("bungalows", b);
    };

    /* ================= BULK BUNGALOW CONFIGURATION ================= */
    const openBulkBungalowConfig = () => {
        setBulkBungalow({
            show: true,
            bhkTypes: [{ type: "3BHK", count: 1 }],
            startNumber: data.bungalows?.length ? data.bungalows.length + 1 : 1,
            prefix: setup.bungalowPrefix
        });
    };

    const updateBulkBungalowBHK = (i, field, value) => {
        let updatedBhkTypes = [...bulkBungalow.bhkTypes];
        updatedBhkTypes[i][field] = value;
        setBulkBungalow({
            ...bulkBungalow,
            bhkTypes: updatedBhkTypes
        });
    };

    const addBulkBungalowBHK = () => {
        setBulkBungalow({
            ...bulkBungalow,
            bhkTypes: [...bulkBungalow.bhkTypes, { type: "3BHK", count: 1 }]
        });
    };

    const removeBulkBungalowBHK = (i) => {
        let updatedBhkTypes = bulkBungalow.bhkTypes.filter((_, x) => x !== i);
        setBulkBungalow({
            ...bulkBungalow,
            bhkTypes: updatedBhkTypes
        });
    };

    const applyBulkBungalowConfig = () => {
        let bungalows = [];
        let unitNumber = bulkBungalow.startNumber;

        // Calculate total units from all BHK types
        const totalUnits = bulkBungalow.bhkTypes.reduce((sum, bhk) => sum + bhk.count, 0);

        // Generate bungalows for each BHK type
        bulkBungalow.bhkTypes.forEach(bhk => {
            for (let i = 0; i < bhk.count; i++) {
                bungalows.push({
                    unit_number: bulkBungalow.prefix + "-" + unitNumber,
                    bhk: bhk.type,
                    status: "available" // Default status
                });
                unitNumber++;
            }
        });

        // If there are existing bungalows, append to them
        if (data.bungalows?.length > 0) {
            setData("bungalows", [...data.bungalows, ...bungalows]);
        } else {
            setData("bungalows", bungalows);
        }

        // Update setup prefix
        setSetup({
            ...setup,
            bungalowPrefix: bulkBungalow.prefix
        });

        setBulkBungalow({ ...bulkBungalow, show: false });
    };

    const copyBungalowConfig = (sourceIndex) => {
        const sourceBungalow = data.bungalows[sourceIndex];

        const count = prompt("How many bungalows do you want to add with this configuration?", "1");
        if (!count) return;

        const numCount = parseInt(count);
        if (isNaN(numCount) || numCount < 1) return;

        let bungalows = [...data.bungalows];
        const nextNumber = bungalows.length + 1;

        for (let i = 0; i < numCount; i++) {
            bungalows.push({
                unit_number: setup.bungalowPrefix + "-" + (nextNumber + i),
                bhk: sourceBungalow.bhk,
                status: "available" // Default status
            });
        }

        setData("bungalows", bungalows);
    };

    const reorderBungalows = () => {
        let bungalows = [...data.bungalows];

        // Sort by unit_number if possible
        bungalows.sort((a, b) => {
            const aNum = parseInt(a.unit_number.split('-')[1]) || 0;
            const bNum = parseInt(b.unit_number.split('-')[1]) || 0;
            return aNum - bNum;
        });

        // Renumber them sequentially
        bungalows.forEach((b, index) => {
            b.unit_number = setup.bungalowPrefix + "-" + (index + 1);
        });

        setData("bungalows", bungalows);
    };

    /* ================= STATUS SUMMARY FUNCTIONS ================= */
    const getStatusSummary = (units) => {
        const summary = {};
        statusOptions.forEach(opt => {
            summary[opt.value] = units.filter(u => u.status === opt.value).length;
        });
        return summary;
    };
    const viewOptions = [
        { value: "garden", label: "Garden View" },
        { value: "sunset", label: "Sunset View" },
        { value: "road", label: "Road View" },
        { value: "pool", label: "Pool View" },
        { value: "city", label: "City View" }
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 border-b pb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <Settings className="text-indigo-600" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Units Setup</h2>
                    <p className="text-sm text-gray-500">Configure your project units and layouts</p>
                </div>
            </div>

            {/* Project Type Selector */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Project Type</label>
                <div className="flex gap-4">
                    <button
                        onClick={() => setProjectType("apartment")}
                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${projectType === "apartment"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                            }`}
                    >
                        <Building2 size={24} />
                        <span className="font-medium">Apartment / Tower</span>
                    </button>
                    <button
                        onClick={() => setProjectType("bungalow")}
                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${projectType === "bungalow"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                            }`}
                    >
                        <Home size={24} />
                        <span className="font-medium">Bungalow / Villa</span>
                    </button>
                </div>
            </div>

            {/* ================= APARTMENT SECTION ================= */}
            {projectType === "apartment" && (
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
                                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${autoGenerate ? 'bg-indigo-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoGenerate ? 'translate-x-7' : 'translate-x-1'
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
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-indigo-600" />
                                Project Summary
                            </h4>

                            {/* Overall Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                    <span className="text-xs text-indigo-600">Total Towers</span>
                                    <p className="text-xl font-bold text-indigo-700">{data.towers.length}</p>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                    <span className="text-xs text-indigo-600">Total Floors</span>
                                    <p className="text-xl font-bold text-indigo-700">
                                        {data.towers.reduce((sum, tower) => sum + tower.floors.length, 0)}
                                    </p>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                    <span className="text-xs text-indigo-600">Total Units</span>
                                    <p className="text-xl font-bold text-indigo-700">
                                        {data.towers.reduce((sum, tower) =>
                                            sum + tower.floors.reduce((floorSum, floor) =>
                                                floorSum + floor.units.length, 0
                                            ), 0
                                        )}
                                    </p>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-lg text-center col-span-2">
                                    <span className="text-xs text-indigo-600">Avg Units/Floor</span>
                                    <p className="text-xl font-bold text-indigo-700">
                                        {Math.round(
                                            data.towers.reduce((sum, tower) =>
                                                sum + tower.floors.reduce((floorSum, floor) =>
                                                    floorSum + floor.units.length, 0
                                                ), 0
                                            ) / data.towers.reduce((sum, tower) =>
                                                sum + tower.floors.length, 0
                                            ) || 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* BHK-wise Summary */}
                            <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">BHK Distribution (All Towers)</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['1BHK', '2BHK', '3BHK', '4BHK'].map(type => {
                                        const count = data.towers.reduce((sum, tower) =>
                                            sum + tower.floors.reduce((floorSum, floor) =>
                                                floorSum + floor.units.filter(u => u.bhk === type).length, 0
                                            ), 0
                                        );
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
                                        const count = data.towers.reduce((sum, tower) =>
                                            sum + tower.floors.reduce((floorSum, floor) =>
                                                floorSum + floor.units.filter(u => u.status === opt.value).length, 0
                                            ), 0
                                        );
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
                    )}

                    {/* Towers List */}
                    {data.towers?.map((tower, t) => {
                        // Calculate tower stats
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
                            <div key={t} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                {/* Tower Header */}
                                <div
                                    onClick={() => toggleTower(t)}
                                    className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <ChevronRight
                                            size={20}
                                            className={`text-gray-500 transition-transform ${expandedTowers[t] ? 'rotate-90' : ''}`}
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
                                            onClick={(e) => { e.stopPropagation(); openBulkBHKConfig(t); }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Zap size={16} />
                                            Bulk Configure
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addFloor(t); }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Floor
                                        </button>
                                    </div>
                                </div>

                                {/* Tower Content */}
                                {expandedTowers[t] && (
                                    <div className="p-4 space-y-4">
                                        {/* Tower BHK Summary */}
                                        {Object.keys(towerBHKStats).length > 0 && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <h5 className="text-xs font-medium text-gray-600 mb-2">Tower {tower.name} BHK Distribution</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(towerBHKStats).map(([bhk, count]) => (
                                                        <div key={bhk} className="bg-white px-3 py-1 rounded-full text-sm border">
                                                            <span className="text-gray-600">{bhk}:</span>
                                                            <span className="font-bold text-gray-800 ml-1">{count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tower Status Summary */}
                                        {Object.keys(towerStatusStats).length > 0 && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <h5 className="text-xs font-medium text-gray-600 mb-2">Tower {tower.name} Status Distribution</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(towerStatusStats).map(([status, count]) => {
                                                        const option = statusOptions.find(opt => opt.value === status);
                                                        if (!option) return null;
                                                        const Icon = option.icon;
                                                        return (
                                                            <div key={status} className={`${option.color} px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                                                                <Icon size={12} />
                                                                <span>{option.label}:</span>
                                                                <span className="font-bold">{count}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {tower.floors.map((floor, f) => (
                                            <div key={f} className="border border-gray-200 rounded-lg overflow-hidden">
                                                {/* Floor Header */}
                                                <div
                                                    onClick={() => toggleFloor(t, f)}
                                                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer border-b"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ChevronDown
                                                            size={18}
                                                            className={`text-gray-500 transition-transform ${expandedFloors[`${t}-${f}`] ? '' : '-rotate-90'}`}
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
                                                            onClick={(e) => { e.stopPropagation(); copyFloorBHKToOthers(t, f); }}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                            title="Copy this floor's BHK configuration to other floors"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeFloor(t, f); }}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Floor Content */}
                                                {expandedFloors[`${t}-${f}`] && (
                                                    <div className="p-4 bg-gray-50 space-y-4">
                                                        {/* BHK Distribution */}
                                                        <div className="bg-white p-4 rounded-lg border">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-3">BHK Distribution</h5>
                                                            <div className="space-y-2">
                                                                {floor.bhkTypes.map((bhk, i) => (
                                                                    <div key={i} className="flex gap-2 items-center">
                                                                        <select
                                                                            value={bhk.type}
                                                                            onChange={(e) => updateFloorBhk(t, f, i, "type", e.target.value)}
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
                                                                            onChange={(e) => updateFloorBhk(t, f, i, "count", parseInt(e.target.value) || 0)}
                                                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                                        />
                                                                        <button
                                                                            onClick={() => removeFloorBhk(t, f, i)}
                                                                            className="text-red-600 hover:text-red-800 p-2"
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    onClick={() => addFloorBhk(t, f)}
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

                                                        {/* Manual Generate Button (only shown if auto-generate is off) */}
                                                        {!autoGenerate && (
                                                            <button
                                                                onClick={() => generateFloorUnits(t, f)}
                                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <RefreshCw size={16} />
                                                                Generate Units for Floor {floor.floor_number}
                                                            </button>
                                                        )}

                                                        {/* Units Grid */}
                                                        {floor.units.length > 0 && (
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
                                                                                    onChange={(e) => updateUnit(t, f, u, "unit_number", e.target.value)}
                                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                    placeholder="Unit Number"
                                                                                />
                                                                                <select
                                                                                    value={unit.bhk}
                                                                                    onChange={(e) => updateUnit(t, f, u, "bhk", e.target.value)}
                                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                >
                                                                                    <option>1BHK</option>
                                                                                    <option>2BHK</option>
                                                                                    <option>3BHK</option>
                                                                                    <option>4BHK</option>
                                                                                </select>
                                                                                <select
                                                                                    value={unit.view || "garden"}
                                                                                    onChange={(e) => updateUnit(t, f, u, "view", e.target.value)}
                                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                                >
                                                                                    {viewOptions.map(opt => (
                                                                                        <option key={opt.value} value={opt.value}>
                                                                                            {opt.label}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                                {/* Status Dropdown */}
                                                                                <div className="relative">
                                                                                    <select
                                                                                        value={unit.status}
                                                                                        onChange={(e) => updateUnit(t, f, u, "status", e.target.value)}
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
                                                                                    onClick={() => removeUnit(t, f, u)}
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
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ================= BUNGALOW SECTION ================= */}
            {projectType === "bungalow" && (
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
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                {['1BHK', '2BHK', '3BHK', '4BHK'].map(type => {
                                    const count = data.bungalows.filter(b => b.bhk === type).length;
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
                                    <p className="font-bold text-indigo-700">{data.bungalows.length}</p>
                                </div>
                            </div>

                            {/* Status Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                {statusOptions.map(opt => {
                                    const count = data.bungalows.filter(b => b.status === opt.value).length;
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

                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {data.bungalows.map((b, i) => {
                                    const StatusIcon = getStatusIcon(b.status);
                                    return (
                                        <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                                            <div className="flex-1 grid md:grid-cols-3 gap-3">
                                                <input
                                                    value={b.unit_number}
                                                    onChange={(e) => updateBungalow(i, "unit_number", e.target.value)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Unit Number"
                                                />
                                                <select
                                                    value={b.bhk}
                                                    onChange={(e) => updateBungalow(i, "bhk", e.target.value)}
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
                                                        value={b.status}
                                                        onChange={(e) => updateBungalow(i, "status", e.target.value)}
                                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 pl-8 ${getStatusColor(b.status)}`}
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
                                                    onClick={() => copyBungalowConfig(i)}
                                                    className="text-blue-600 hover:text-blue-800 p-2"
                                                    title="Copy this configuration"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeBungalow(i)}
                                                    className="text-red-600 hover:text-red-800 p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
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
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
                <button
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200"
                >
                    Next Step
                </button>
            </div>

            {/* Bulk BHK Configuration Modal (Apartments) */}
            {bulkBHK.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Bulk BHK Configuration</h3>
                                <button
                                    onClick={() => setBulkBHK({ ...bulkBHK, show: false })}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Configure BHK distribution for multiple floors at once. Units will be generated automatically after configuration.
                            </p>

                            {/* BHK Types */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">BHK Distribution</label>
                                <div className="space-y-2">
                                    {bulkBHK.bhkTypes.map((bhk, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <select
                                                value={bhk.type}
                                                onChange={(e) => updateBulkBHK(i, "type", e.target.value)}
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
                                                onChange={(e) => updateBulkBHK(i, "count", parseInt(e.target.value) || 0)}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button
                                                onClick={() => removeBulkBHK(i)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addBulkBHK}
                                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Plus size={16} />
                                        Add BHK Type
                                    </button>
                                </div>
                            </div>

                            {/* Apply Options */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apply to</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={bulkBHK.applyToAllFloors}
                                            onChange={() => setBulkBHK({ ...bulkBHK, applyToAllFloors: true })}
                                            className="text-indigo-600"
                                        />
                                        <span className="text-sm">All floors in this tower</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={!bulkBHK.applyToAllFloors}
                                            onChange={() => setBulkBHK({ ...bulkBHK, applyToAllFloors: false })}
                                            className="text-indigo-600"
                                        />
                                        <span className="text-sm">Specific floor range</span>
                                    </label>

                                    {!bulkBHK.applyToAllFloors && (
                                        <div className="flex gap-2 mt-2 pl-6">
                                            <div>
                                                <label className="block text-xs text-gray-500">From Floor</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={bulkBHK.fromFloor}
                                                    onChange={(e) => setBulkBHK({ ...bulkBHK, fromFloor: parseInt(e.target.value) || 0 })}
                                                    className="w-20 px-2 py-1 border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">To Floor</label>
                                                <input
                                                    type="number"
                                                    min={bulkBHK.fromFloor}
                                                    value={bulkBHK.toFloor || ''}
                                                    onChange={(e) => setBulkBHK({ ...bulkBHK, toFloor: parseInt(e.target.value) || null })}
                                                    className="w-20 px-2 py-1 border rounded"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setBulkBHK({ ...bulkBHK, show: false })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyBulkBHKConfig}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                                >
                                    Apply & Generate Units
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Bungalow Configuration Modal */}
            {bulkBungalow.show && (
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
                                <p className="text-xs text-gray-500 mt-1">Units will be numbered as: {bulkBungalow.prefix}-{bulkBungalow.startNumber}, {bulkBungalow.prefix}-{bulkBungalow.startNumber + 1}, etc.</p>
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
                                    Total bungalows to add: <span className="font-bold text-indigo-600">
                                        {bulkBungalow.bhkTypes.reduce((sum, bhk) => sum + bhk.count, 0)}
                                    </span>
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
            )}
        </div>
    );
}