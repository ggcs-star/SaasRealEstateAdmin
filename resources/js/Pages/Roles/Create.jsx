import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';

export default function Create() {

    const { permissionsList, auth } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        name: '',
        permissions: []
    });

    function togglePermission(permission) {
        if (data.permissions.includes(permission)) {
            setData('permissions', data.permissions.filter(p => p !== permission));
        } else {
            setData('permissions', [...data.permissions, permission]);
        }
    }

    function submit(e) {
        e.preventDefault();
        post('/roles');
    }

    return (
        <AuthenticatedLayout user={auth.user}>

            <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">

                <h2 className="text-2xl font-semibold mb-6">
                    Create New Role
                </h2>

                <form onSubmit={submit}>

                    {/* Role Name */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Role Name
                        </label>

                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Permissions */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">
                            Assign Permissions
                        </h3>

                        <div className="grid grid-cols-3 gap-3">

                            {permissionsList.map(p => (
                                <label
                                    key={p}
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer
                                    ${data.permissions.includes(p)
                                            ? 'bg-blue-100 border-blue-400'
                                            : 'bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.permissions.includes(p)}
                                        onChange={() => togglePermission(p)}
                                    />
                                    <span>{p}</span>
                                </label>
                            ))}

                        </div>
                    </div>

                    <button
                        disabled={processing}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Role
                    </button>

                </form>

            </div>

        </AuthenticatedLayout>
    );
}