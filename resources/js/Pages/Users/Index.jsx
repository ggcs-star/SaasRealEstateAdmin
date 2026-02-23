import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm } from '@inertiajs/react';

export default function Index() {

    const { users, roles, auth } = usePage().props;

    const { data, setData, post } = useForm({
        user_id: '',
        role: ''
    });

    function submit(e) {
        e.preventDefault();
        post('/users/assign-role');
    }

    return (
        <AuthenticatedLayout user={auth.user}>

            <div className="p-6">

                {/* PAGE TITLE */}
                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    👥 User Role Management
                </h1>

                {/* FORM CARD */}
                <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">

                    <h2 className="text-lg font-semibold mb-4 text-slate-700">
                        Assign Role
                    </h2>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* USER SELECT */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                Select User
                            </label>
                            <select
                                onChange={e => setData('user_id', e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ROLE SELECT */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                Select Role
                            </label>
                            <select
                                onChange={e => setData('role', e.target.value)}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* BUTTON */}
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-sky-700 hover:bg-sky-800 text-white py-2 rounded-lg transition"
                            >
                                Assign Role
                            </button>
                        </div>

                    </form>
                </div>

                {/* USERS LIST */}
                <div className="bg-white shadow-xl rounded-2xl p-6">

                    <h2 className="text-lg font-semibold mb-4 text-slate-700">
                        Users List
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border rounded-lg overflow-hidden">

                            <thead className="bg-slate-100 text-left">
                                <tr>
                                    <th className="p-3 text-sm font-semibold">User</th>
                                    <th className="p-3 text-sm font-semibold">Role</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-t hover:bg-gray-50 transition">

                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-sky-200 flex items-center justify-center font-bold text-sky-700">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <span className="font-medium text-slate-700">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${user.role
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {user.role || 'No Role'}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}
