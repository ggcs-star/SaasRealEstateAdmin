import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {

    const { roles, permissionsList, auth } = usePage().props;

    const [selectedRole, setSelectedRole] = useState(null);
    const [search, setSearch] = useState('');

    const { data, setData, post } = useForm({
        role: '',
        permissions: []
    });

    // select role
    function selectRole(role) {
        setSelectedRole(role);

        setData({
            role: role.name,
            permissions: role.permissions || []
        });
    }

    // toggle permission
    function togglePermission(permission) {
        if (data.permissions.includes(permission)) {
            setData('permissions', data.permissions.filter(p => p !== permission));
        } else {
            setData('permissions', [...data.permissions, permission]);
        }
    }

    function submit(e) {
        e.preventDefault();
        post('/roles/update-permissions');
    }

    // filter permissions
    const filteredPermissions = permissionsList.filter(p =>
        p.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user}>

            <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

                {/* LEFT - ROLES */}
                <div className="w-1/4 bg-white p-4 shadow-xl rounded-2xl">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">Roles</h2>

                        <Link
                            href="/roles/create"
                            className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            + Add
                        </Link>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto">

                        {roles.map(role => (
                            <div
                                key={role._id}
                                onClick={() => selectRole(role)}
                                className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center
                                ${selectedRole?._id === role._id
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{role.name}</span>

                                {selectedRole?._id === role._id && (
                                    <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded">
                                        Active
                                    </span>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

                {/* RIGHT - PERMISSIONS */}
                <div className="w-3/4 bg-white p-6 shadow-xl rounded-2xl">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Permissions</h2>

                        {selectedRole && (
                            <button
                                onClick={submit}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>

                    {selectedRole ? (
                        <>
                            {/* Selected Role */}
                            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                                <span className="text-gray-600">Selected Role:</span>
                                <span className="ml-2 font-bold text-blue-600">
                                    {selectedRole.name}
                                </span>
                            </div>

                            {/* Search + Actions */}
                            <div className="flex gap-3 mb-4">

                                <input
                                    type="text"
                                    placeholder="Search permission..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />

                                <button
                                    onClick={() => setData('permissions', permissionsList)}
                                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Select All
                                </button>

                                <button
                                    onClick={() => setData('permissions', [])}
                                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Clear
                                </button>

                            </div>

                            {/* Permissions Grid */}
                            <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">

                                {filteredPermissions.map(p => (
                                    <label
                                        key={p}
                                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition 
                                        ${data.permissions.includes(p)
                                                ? 'bg-blue-100 border-blue-400'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.includes(p)}
                                            onChange={() => togglePermission(p)}
                                            className="accent-blue-600"
                                        />
                                        <span className="text-sm">{p}</span>
                                    </label>
                                ))}

                            </div>

                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-20">
                            👉 Please select a role from left panel
                        </div>
                    )}

                </div>

            </div>

        </AuthenticatedLayout>
    );
}