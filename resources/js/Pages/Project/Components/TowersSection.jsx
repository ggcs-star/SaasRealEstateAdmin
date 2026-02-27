import { Building2 } from "lucide-react";

export default function TowersSection({ towers }) {
    if (!towers?.length) return null;

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



                        {/* Configurations */}

                        {tower.configurations?.length > 0 && (

                            <div className="border-t pt-3">

                                <p className="text-xs text-gray-500 uppercase mb-2">
                                    Configurations
                                </p>

                                <div className="flex flex-wrap gap-2">

                                    {tower.configurations.map((config) => (

                                        <span
                                            key={config._id}
                                            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md"
                                        >
                                            {config.name}
                                        </span>

                                    ))}

                                </div>

                            </div>
                        )}



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



                        {/* Units Section 🔥 */}

                        {tower.floors?.length > 0 && (

                            <div className="border-t mt-4 pt-3">

                                <p className="text-xs text-gray-500 uppercase mb-3">
                                    Units
                                </p>


                                <div className="space-y-4">

                                    {tower.floors.map((floor) => (

                                        <div
                                            key={floor.floor_number}
                                            className="bg-white border rounded-lg p-3"
                                        >

                                            <p className="text-sm font-semibold mb-2">
                                                Floor {floor.floor_number}
                                            </p>


                                            <div className="flex flex-wrap gap-2">

                                                {floor.units.map((unit, i) => (

                                                    <span
                                                        key={i}
                                                        className="text-xs border px-2 py-1 rounded-md bg-gray-100"
                                                    >
                                                        {unit.unit_number}
                                                        {" "}
                                                        ({unit.configuration_name})
                                                    </span>

                                                ))}

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
            <p className="text-xs text-gray-500 uppercase mb-1">
                {label}
            </p>
            <p className="font-medium text-gray-800">
                {value ?? "N/A"}
            </p>
        </div>
    );
}


function Detail({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-500 uppercase mb-1">
                {label}
            </p>
            <p className="font-medium text-gray-800">
                {value ?? "N/A"}
            </p>
        </div>
    );
}