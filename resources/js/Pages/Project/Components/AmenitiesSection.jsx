import { Star } from "lucide-react";

export default function AmenitiesSection({ amenities }) {
    if (!amenities?.length) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Star size={18} className="text-yellow-500" />
                Amenities
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {amenities.map((amenity) => (
                    <div
                        key={amenity._id}
                        className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <Star size={16} className="text-yellow-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                                {amenity.name}
                            </span>
                        </div>

                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                amenity.status
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {amenity.status ? "Active" : "Inactive"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}