export default function ProjectDetails({ project }) {

    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            
            <h2 className="text-xl font-semibold mb-6">
                Project Details
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-sm">

                <DetailItem label="Price" value={formatPrice(project.price)} />
                <DetailItem label="Total Units" value={project.total_units ?? "N/A"} />
                <DetailItem label="Total Towers" value={project.total_towers ?? "N/A"} />
                <DetailItem label="Total Floors" value={project.total_floors ?? "N/A"} />
                <DetailItem label="RERA Number" value={project.rera_number ?? "N/A"} />
                <DetailItem label="Launch Date" value={formatDate(project.launch_date)} />
                <DetailItem label="Possession Date" value={formatDate(project.possession_date)} />
                <DetailItem label="Project Type" value={project.project_type ?? "N/A"} />

                <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">
                        Status
                    </p>
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                            project.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                        }`}
                    >
                        {project.status ? "Active" : "Inactive"}
                    </span>
                </div>

            </div>
        </div>
    );
}


/* 🔹 Reusable Detail Item Component */
function DetailItem({ label, value }) {
    return (
        <div>
            <p className="text-gray-500 text-xs uppercase mb-1">
                {label}
            </p>
            <p className="font-medium text-gray-800">
                {value}
            </p>
        </div>
    );
}