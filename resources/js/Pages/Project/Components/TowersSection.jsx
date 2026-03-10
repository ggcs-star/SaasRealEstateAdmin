import { Building2 } from "lucide-react";

export default function TowersSection({ towers, unitTypes = [], propertyTypes = [] }) {
    if (!towers?.length) return null;

    const getUnitType = (id) => unitTypes.find(u => u._id === id);
    const getPropertyType = (id) => propertyTypes.find(p => p._id === id);
    console.log("TowersSection Rendered", { towers, unitTypes, propertyTypes });
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Building2 size={18} className="text-indigo-600" />
                Towers
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {towers.map((tower) => (

                    <div
                        key={tower._id}
                        className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                    >

                        {/* Header */}

                        <div className="flex justify-between items-start mb-4">

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Tower {tower.name}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    Type: {tower.type || "N/A"}
                                </p>
                            </div>

                            <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    tower.status
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                }`}
                            >
                                {tower.status ? "Active" : "Inactive"}
                            </span>

                        </div>

                        {/* Stats */}

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">

                            <Stat label="Total Floors" value={tower.total_floors} />

                            <Stat label="Total Units" value={tower.total_units} />

                        </div>


                        {/* Floor Designs */}

                        {tower.floor_designs?.length > 0 && (

                            <div className="border-t mt-4 pt-3">

                                <p className="text-xs text-gray-500 uppercase mb-3">
                                    Floor Designs
                                </p>

                                <div className="space-y-3">

                                    {tower.floor_designs.map((floor, i) => (

                                        <div
                                            key={i}
                                            className="bg-white border rounded-lg p-3 text-sm"
                                        >

                                            <div className="grid grid-cols-2 gap-3">

                                                <Detail label="From Floor" value={floor.from_floor} />

                                                <Detail label="To Floor" value={floor.to_floor} />

                                                <Detail
                                                    label="Units / Floor"
                                                    value={floor.units_per_floor}
                                                />

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )}


                        {/* Units Section */}

                        {tower.floors?.length > 0 && (

                            <div className="border-t mt-4 pt-4">

                                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between">
                                    <span>Tower {tower.name}</span>

                                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                        {
                                            tower.floors
                                                .flatMap(f => f.units)
                                                .filter(u => u.status === "available").length
                                        } Available
                                    </span>
                                </h2>

                                <div className="space-y-3">

                                    {tower.floors
                                        .sort((a, b) => b.floor_number - a.floor_number)
                                        .map((floor) => (

                                            <div key={floor.floor_number} className="flex items-start gap-4">

                                                {/* Floor Label */}

                                                <div className="w-12 text-sm font-semibold text-slate-400 pt-2">
                                                    Flr {floor.floor_number}
                                                </div>

                                                {/* Units */}

                                                <div className="flex-1 flex flex-wrap gap-2">

                                                    {floor.units.map((unit, i) => {

                                                        const unitType = getUnitType(unit.unit_type_id);
                                                        const propertyType = getPropertyType(unit.property_type_id);

                                                        const isAvailable = unit.status === "available";
                                                        const isBooked = unit.status === "booked";
                                                        const isHold = unit.status === "hold";

                                                        const bgColor = isAvailable
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : isBooked
                                                                ? "bg-red-500 hover:bg-red-600 cursor-not-allowed opacity-80"
                                                                : "bg-yellow-400 hover:bg-yellow-500";

                                                        return (
                                                            <div key={i} className="relative group">

                                                                <button
                                                                    disabled={isBooked}
                                                                    className={`h-10 w-14 rounded text-[10px] font-bold text-white shadow-sm transition-all transform hover:scale-105 flex flex-col items-center justify-center leading-tight ${bgColor}`}
                                                                >
                                                                    <span>{unit.unit_number}</span>

                                                                    <span className="opacity-75 text-[8px]">
                                                                        {unitType?.name || ""}
                                                                    </span>

                                                                </button>

                                                                {/* Tooltip */}

                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-slate-800 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">

                                                                    <div className="font-bold border-b border-slate-600 pb-1 mb-1">
                                                                        {unitType?.name || "Unit"}
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <span>Property:</span>
                                                                        <span>{propertyType?.name || "N/A"}</span>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <span>Size:</span>
                                                                        <span>{unit.unit_size || "N/A"} sqft</span>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        );

                                                    })}

                                                </div>

                                            </div>

                                        ))}

                                </div>

                            </div>

                        )}

                    </div>

                ))}
            </div>
        </div>
    );
}


/* Small Components */

function Stat({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-500 uppercase mb-1">{label}</p>
            <p className="font-medium text-gray-800">{value ?? "N/A"}</p>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-500 uppercase mb-1">{label}</p>
            <p className="font-medium text-gray-800">{value ?? "N/A"}</p>
        </div>
    );
}