import { Building2, Home, Layers } from "lucide-react";

export default function View({ project, configurations, towers, bungalows }) {

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* ================= PROJECT HEADER ================= */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <div className="flex items-center gap-4">
                    {project.logo_image && (
                        <img
                            src={project.logo_image}
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                        <p className="text-gray-500">Builder: {project.builder}</p>
                        <p className="text-sm text-gray-400">Status: {project.status}</p>
                    </div>
                </div>
            </div>

            {/* ================= CONFIGURATIONS ================= */}
            {configurations.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Layers size={18} /> Configurations
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {configurations.map((config, i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">
                                    {config.title || "Configuration"}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Rooms: {config.rooms?.join(", ")}
                                </p>

                                {config.imageslider?.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                        {config.imageslider.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                className="w-20 h-20 rounded object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ================= TOWERS ================= */}
            {towers.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Building2 size={18} /> Towers
                    </h2>

                    {towers.map((tower, i) => (
                        <div key={i} className="mb-6 border rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-3">
                                Tower {tower.name}
                            </h3>

                            {tower.floors?.map((floor, fIndex) => (
                                <div key={fIndex} className="mb-4">
                                    <h4 className="font-medium mb-2">
                                        Floor {floor.floor_number}
                                    </h4>

                                    <div className="grid md:grid-cols-3 gap-3">
                                        {floor.units?.map((unit, uIndex) => (
                                            <div
                                                key={uIndex}
                                                className="border p-3 rounded-lg bg-gray-50"
                                            >
                                                <p className="font-semibold">
                                                    {unit.unit_number}
                                                </p>
                                                <p className="text-sm">
                                                    {unit.bhk}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Status: {unit.status}
                                                </p>
                                                {unit.view && (
                                                    <p className="text-sm text-gray-500">
                                                        View: {unit.view}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ================= BUNGALOWS ================= */}
            {bungalows.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Home size={18} /> Bungalows
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        {bungalows.map((bungalow, i) => (
                            <div
                                key={i}
                                className="border rounded-lg p-4 bg-gray-50"
                            >
                                <p className="font-semibold">
                                    {bungalow.unit_number}
                                </p>
                                <p>{bungalow.bhk}</p>
                                <p className="text-sm text-gray-500">
                                    Status: {bungalow.status}
                                </p>
                                {bungalow.view && (
                                    <p className="text-sm text-gray-500">
                                        View: {bungalow.view}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}