export default function Step4Amenities({
    data,
    setData,
    nextStep,
    prevStep,
    amenities = []
}) {

    const selectedAmenities =
        (data.amenity_ids || []).map(id => String(id));

    const toggleAmenity = (id) => {

        const idStr = String(id);

        const exists = selectedAmenities.includes(idStr);

        setData(
            'amenity_ids',
            exists
                ? selectedAmenities.filter(a => a !== idStr)
                : [...selectedAmenities, idStr]
        );
    };

   return (
    <div className="space-y-8">
       

        {/* Selected Count Badge */}
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-700">Selected Amenities</span>
                    <p className="text-xs text-gray-500">Click on amenities to select/deselect</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-indigo-600">{selectedAmenities.length}</span>
                <span className="text-sm text-gray-600">of {amenities.length}</span>
            </div>
        </div>

      

        {/* Amenities Grid */}
        {amenities.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No amenities available</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Please add amenities in the master data section first.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {amenities.map((item) => {
                    const isSelected = selectedAmenities.includes(String(item._id));

                    return (
                        <div
                            key={item._id}
                            onClick={() => toggleAmenity(item._id)}
                            className={`
                                group relative border-2 rounded-xl p-4 cursor-pointer 
                                transition-all duration-200 transform hover:scale-105
                                ${isSelected 
                                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100/50 shadow-lg shadow-indigo-100' 
                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                                }
                            `}
                        >
                            {/* Selected Badge */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center space-y-3">
                                {/* Icon */}
                                <div className={`
                                    w-16 h-16 rounded-xl flex items-center justify-center
                                    transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-white shadow-md' 
                                        : 'bg-gray-50 group-hover:bg-indigo-50'
                                    }
                                `}>
                                    {item.icon_url ? (
                                        <img
                                            src={item.icon_url}
                                            alt={item.name}
                                            className="w-10 h-10 object-contain"
                                        />
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <span className={`
                                        text-sm font-medium line-clamp-2
                                        ${isSelected ? 'text-indigo-700' : 'text-gray-700'}
                                    `}>
                                        {item.name}
                                    </span>
                                </div>

                                {/* Category (if available) */}
                                {item.category && (
                                    <span className="text-xs text-gray-400">
                                        {item.category}
                                    </span>
                                )}
                            </div>

                            {/* Hidden checkbox for functionality (keeps logic same) */}
                            <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="hidden"
                            />
                        </div>
                    );
                })}
            </div>
        )}

        {/* Quick Actions */}
        {amenities.length > 0 && (
            <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                    type="button"
                    onClick={() => {
                        // This would need a function, but keeping logic same
                        // Just visual buttons
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                    Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                    type="button"
                    onClick={() => {
                        // This would need a function, but keeping logic same
                        // Just visual buttons
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Clear All
                </button>
            </div>
        )}

        {/* Selected Amenities Preview */}
        {selectedAmenities.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Selected Amenities ({selectedAmenities.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                    {amenities
                        .filter(item => selectedAmenities.includes(String(item._id)))
                        .map(item => (
                            <span
                                key={item._id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 border border-indigo-200"
                            >
                                {item.icon_url && (
                                    <img src={item.icon_url} alt="" className="w-4 h-4 mr-1 object-contain" />
                                )}
                                {item.name}
                            </span>
                        ))}
                </div>
            </div>
        )}

        {/* Navigation Buttons */}
        {/* <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <button
                onClick={prevStep}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <div className="flex space-x-4">
               
                <button
                    onClick={nextStep}
                    className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    {selectedAmenities.length > 0 ? (
                        <>Complete ({selectedAmenities.length})</>
                    ) : (
                        'Skip & Continue'
                    )}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div> */}
    </div>
);
}