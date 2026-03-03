import { MapPin } from "lucide-react";

export default function ProjectHeader({ project }) {
    console.log("ProjectHeader project:", project);
    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            <div className="flex items-center gap-4">
                {project.cover_image_url && (
                    <img
                        src={project.cover_image_url}
                        className="w-24 h-24 rounded-lg object-cover"
                        alt="cover"
                    />
                )}
                <div>
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <p className="text-gray-600">
                        Builder: {project.builder?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-400">
                        Status: {project.project_status}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-gray-500 mt-1">
                        <MapPin size={14} />
                        {project.area}, {project.city}, {project.state}
                    </p>
                </div>
            </div>
        </div>
    );
}