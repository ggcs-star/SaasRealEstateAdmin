import { Building } from 'lucide-react';

export default function Step1Basic({ config, setConfig }) {

    const handleChange = (field, value) => {
        setConfig({
            ...config,
            project: {
                ...config.project,
                [field]: value
            }
        });
    };

    const handleLocationChange = (field, value) => {
        setConfig({
            ...config,
            project: {
                ...config.project,
                location: {
                    ...config.project?.location,
                    [field]: value
                }
            }
        });
    };
    const updateProject = (field, value) => {
        setConfig(prev => ({
            ...prev,
            project: {
                ...prev.project,
                [field]: value
            }
        }));
    };
    const updateLocation = (field, value) => {
        setConfig(prev => ({
            ...prev,
            project: {
                ...prev.project,
                location: {
                    ...prev.project.location,
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="p-8 space-y-6">

            <h3 className="text-lg font-bold flex items-center gap-2">
                <Building /> Basic Info
            </h3>

            {/* Project Name */}
            <input
                type="text"
                placeholder="Project Name"
                value={config.project?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* Slug */}
            <input
                type="text"
                placeholder="Slug"
                value={config.project?.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* Type */}
            <input
                type="text"
                placeholder="Project Type"
                value={config.project?.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* Address */}
            <textarea
                placeholder="Address"
                value={config.project?.location?.address || ''}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* City */}
            <input
                type="text"
                placeholder="City"
                value={config.project?.location?.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* Area */}
            <input
                type="text"
                placeholder="Area"
                value={config.project?.location?.area || ''}
                onChange={(e) => handleLocationChange('area', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* Latitude */}
            <input
                type="number"
                placeholder="Latitude"
                value={config.project?.location?.latitude || ''}
                onChange={(e) => handleLocationChange('latitude', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

            {/* Longitude */}
            <input
                type="number"
                placeholder="Longitude"
                value={config.project?.location?.longitude || ''}
                onChange={(e) => handleLocationChange('longitude', e.target.value)}
                className="w-full border p-3 rounded-lg"
            />

        </div>
    );
}