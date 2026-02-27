import { Layers } from "lucide-react";

export default function ConfigurationsSection({ configurations }) {
    if (!configurations?.length) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Layers size={18} /> Configurations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {configurations.map((config) => (
                    <div
                        key={config._id}
                        className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition duration-200"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">
                                    {config.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Type: {config.type || "N/A"}
                                </p>
                            </div>

                            <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    config.status
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                }`}
                            >
                                {config.status ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {/* Room Sizes */}
                        {config.room_sizes?.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 uppercase mb-1">
                                    Room Sizes
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {config.room_sizes.map((size, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-white border px-2 py-1 rounded-md"
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {config.description && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                                {config.description}
                            </p>
                        )}

                        {/* Categories */}
                        {config.categories?.length > 0 && (
                            <div className="mt-4 pt-3 border-t">
                                <p className="text-xs text-gray-500 uppercase mb-2">
                                    Categories
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {config.categories.map((cat) => (
                                        <span
                                            key={cat._id}
                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
                                        >
                                            {cat.name}
                                        </span>
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