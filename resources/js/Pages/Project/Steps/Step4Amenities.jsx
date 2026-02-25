export default function Step4Amenities({
    data,
    setData,
    submitAll,
    prevStep,
    amenities 
}) {
 console.log('Selected Amenities:', amenities );
    const selectedAmenities = data.project.amenity_ids || [];

    const toggleAmenity = (id) => {

        const exists = selectedAmenities.includes(id);

        if (exists) {
            setData('project', {
                ...data.project,
                amenity_ids: selectedAmenities.filter(a => a !== id)
            });
        } else {
            setData('project', {
                ...data.project,
                amenity_ids: [...selectedAmenities, id]
            });
        }
    };

    return (
        <div className="space-y-6">

            <h3 className="text-xl font-semibold">
                Select Amenities
            </h3>

            {amenities.length === 0 && (
                <p className="text-gray-500">No amenities found</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {amenities.map(item => {

                    const isSelected = selectedAmenities.includes(item._id);

                    return (
                        <div
                            key={item._id}
                            onClick={() => toggleAmenity(item._id)}
                            className={`border rounded-lg p-4 cursor-pointer transition-all
                                ${isSelected
                                    ? 'bg-indigo-100 border-indigo-500 shadow'
                                    : 'hover:border-indigo-300'
                                }`}
                        >
                            <div className="flex items-center space-x-3">

                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleAmenity(item._id)}
                                />

                                {/* Icon */}
                                {item.icon && (
                                    <img
                                        src={item.icon.startsWith('http')
                                            ? item.icon
                                            : `/storage/${item.icon}`
                                        }
                                        alt={item.name}
                                        className="w-8 h-8 object-cover rounded"
                                    />
                                )}

                                <span className="font-medium">
                                    {item.name}
                                </span>

                            </div>
                        </div>
                    );
                })}

            </div>

         

             <div className="flex justify-between">
                <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Back
                </button>

                <button
                    onClick={submitAll}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Submit All
                </button>
            </div>
        </div>
    );
}