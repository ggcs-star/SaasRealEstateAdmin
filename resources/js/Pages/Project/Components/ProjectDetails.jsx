import { useState } from "react";

export default function ProjectDetails({ project }) {
    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };
    console.log("Project Data:", project); // Debugging log to check project data structure

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
console.log("Project Data:", project); // Debugging log to check project data structure
    // Status badges configuration
    const statusBadges = [
        { condition: project.is_featured, label: "Featured", color: "bg-purple-100 text-purple-700 border-purple-200" },
        { condition: project.is_emerging_property, label: "Emerging", color: "bg-blue-100 text-blue-700 border-blue-200" },
        { condition: project.is_new_launch, label: "New Launch", color: "bg-green-100 text-green-700 border-green-200" },
        { condition: project.is_trending, label: "Trending", color: "bg-orange-100 text-orange-700 border-orange-200" },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* 🔹 Header Section with Hero */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status ? 'bg-green-400 text-white' : 'bg-gray-400 text-white'
                        }`}>
                            {project.status ? 'Active' : 'Inactive'}
                        </span>
                        {statusBadges.map((badge, idx) => 
                            badge.condition && (
                                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                                    {badge.label}
                                </span>
                            )
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {project.name}
                    </h1>
                    <div className="flex items-center text-white/90 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {project.city}, {project.state} {project.pincode && `- ${project.pincode}`}
                    </div>
                </div>
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "40px 40px"
                    }}></div>
                </div>
            </div>

            {/* 🔹 Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white px-8 py-6 border-b border-gray-100">
                <QuickStat icon="💰" label="Price" value={project.price} />
                <QuickStat icon="📐" label="Carpet Area" value={`${project.carpet_area ?? "N/A"}`} />
                <QuickStat icon="🏗️" label="Type" value={project.project_type ?? "N/A"} />
                <QuickStat icon="📅" label="Possession" value={formatDate(project.possession_date)} />
            </div>

            {/* 🔹 Main Content */}
            <div className="p-8 space-y-10">
                
                {/* 🔹 BASIC DETAILS */}
                <Section title="Project Specifications" icon="📋">
                    <DetailItem label="Project Status" value={project.project_status} />
                    <DetailItem label="Total Units" value={project.total_units} />
                    <DetailItem label="Total Towers" value={project.total_towers} />
                    <DetailItem label="RERA Number" value={project.rera_number} />
                    <DetailItem label="Launch Date" value={formatDate(project.launch_date)} />
                </Section>

                {/* 🔹 LOCATION DETAILS */}
                <Section title="Location Details" icon="📍">
                    <DetailItem label="Complete Address" value={project.address} />
                    <DetailItem label="Area/Locality" value={project.area} />
                    <DetailItem label="Coordinates" value={
                        project.latitude && project.longitude ? 
                        `${project.latitude}, ${project.longitude}` : "N/A"
                    } />
                </Section>

                {/* 🔹 DEVELOPER INFO */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-900">
                        <span className="text-xl">🏢</span> Developer Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <DeveloperCard 
                            type="Builder" 
                            name={project.builder?.name} 
                            icon="👷"
                        />
                        <DeveloperCard 
                            type="Promoter" 
                            name={project.promoter?.name} 
                            icon="🤝"
                        />
                    </div>
                </div>

                {/* 🔹 DESCRIPTION SECTIONS */}
                {project.short_description && (
                    <TextSection 
                        title="Quick Overview" 
                        text={project.short_description}
                        variant="compact"
                    />
                )}

                {project.description && (
                    <TextSection 
                        title="Detailed Description" 
                        text={project.description}
                        variant="expanded"
                    />
                )}

                {/* 🔹 CATEGORIES */}
                {project.categories?.length > 0 && (
                    <TagSection title="Categories" items={project.categories} />
                )}

                {/* 🔹 MEDIA GALLERIES */}
                {project.slider_image_url?.length > 0 && (
                    <ImageSection 
                        title="Featured Images" 
                        images={project.slider_image_url}
                        badge="Slider"
                    />
                )}

                {project.gallery_images_url?.length > 0 && (
                    <ImageSection 
                        title="Gallery" 
                        images={project.gallery_images_url}
                        badge="Gallery"
                    />
                )}

                {project.floorPlans_images_url?.length > 0 && (
                    <ImageSection 
                        title="Floor Plans" 
                        images={project.floorPlans_images_url}
                        badge="Floor Plan"
                        layout="compact"
                    />
                )}
            </div>
        </div>
    );
}

/* 🔹 Quick Stat Component */
function QuickStat({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

/* 🔹 Enhanced Section Wrapper */
function Section({ title, icon, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-3">
                {icon && <span className="text-xl">{icon}</span>}
                {title}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
}

/* 🔹 Enhanced Detail Item */
function DetailItem({ label, value }) {
    return (
        <div className="group">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 group-hover:text-indigo-500 transition-colors">
                {label}
            </p>
            <p className="font-medium text-gray-800 break-words bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-indigo-50 transition-colors">
                {value || "N/A"}
            </p>
        </div>
    );
}

/* 🔹 Developer Card */
function DeveloperCard({ type, name, icon }) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className="text-xs text-indigo-600 font-medium">{type}</p>
                    <p className="font-semibold text-gray-800">{name || "N/A"}</p>
                </div>
            </div>
        </div>
    );
}

/* 🔹 Enhanced Tag Section */
function TagSection({ title, items }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                {title}
            </h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <span
                        key={item._id}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm px-4 py-2 rounded-full border border-indigo-100 hover:shadow-md transition-all cursor-default"
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* 🔹 Enhanced Text Section */
function TextSection({ title, text, variant = "compact" }) {
    const variants = {
        compact: "bg-gray-50 rounded-xl p-6 border border-gray-100",
        expanded: "bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
    };

    return (
        <div className={variants[variant]}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <span className="text-xl">📝</span>
                {title}
            </h3>
            <p className={`text-gray-600 leading-relaxed ${
                variant === 'compact' ? 'text-sm' : 'text-base'
            }`}>
                {text}
            </p>
        </div>
    );
}

/* 🔹 Enhanced Image Section */
function ImageSection({ title, images, badge, layout = "grid" }) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <span className="text-xl">🖼️</span>
                    {title}
                </h3>
                {badge && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {badge}
                    </span>
                )}
            </div>

            <div className={`grid gap-4 ${
                layout === 'compact' 
                    ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' 
                    : 'grid-cols-2 md:grid-cols-4'
            }`}>
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300"
                    >
                        <div className="aspect-w-16 aspect-h-12">
                            <img
                                src={img}
                                alt={`${title} ${index + 1}`}
                                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img 
                            src={selectedImage} 
                            alt="Enlarged view" 
                            className="w-full h-full object-contain"
                        />
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}