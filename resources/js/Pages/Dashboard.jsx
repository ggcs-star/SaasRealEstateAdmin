import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Users,
    Home,
    FolderKanban,
    TrendingUp,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Clock,
    MapPin,
    Mail,
    Phone,
    Star,
    Eye,
    Edit,
    UserPlus,
    Briefcase,
    Award,
    CheckCircle,
    XCircle,
    AlertCircle,
    Activity,
    BarChart3,
    PieChart,
    DollarSign,
    Percent,
    CreditCard,
    Settings,
    Bell,
    Search,
    Filter,
    Download,
    RefreshCw,
    ChevronRight,
    MoreVertical,
    Crown,
    Gift,
    Sparkles,
    LayoutDashboard,
    Package,
    Truck,
    Wifi,
    Coffee,
    Car,
    Dumbbell,
    Waves,
    Trees,
    Shield,
    Lock,
    Zap
} from 'lucide-react';

export default function Dashboard({ auth }) {
    const stats = [
        {
            title: 'Total Projects',
            value: '145',
            icon: FolderKanban,
            change: '+12%',
            trend: 'up',
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Properties',
            value: '1,250',
            icon: Home,
            change: '+8%',
            trend: 'up',
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Builders',
            value: '52',
            icon: Building2,
            change: '+5%',
            trend: 'up',
            color: 'purple',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Total Users',
            value: '842',
            icon: Users,
            change: '-2%',
            trend: 'down',
            color: 'amber',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        },
    ];

    const quickActions = [
        { title: 'New Project', icon: Plus, href: '/projects/create', color: 'emerald' },
        { title: 'Add Builder', icon: UserPlus, href: '/builder/create', color: 'blue' },
        { title: 'Add Property', icon: Home, href: '/properties/create', color: 'purple' },
        { title: 'Add User', icon: Users, href: '/users/create', color: 'amber' },
    ];

    const projects = [
        { name: 'Sky Heights', builder: 'ABC Builders', location: 'Ahmedabad', units: 120, status: 'Active', progress: 75 },
        { name: 'Green Valley', builder: 'XYZ Group', location: 'Surat', units: 85, status: 'Active', progress: 60 },
        { name: 'Royal Residency', builder: 'Prime Build', location: 'Rajkot', units: 60, status: 'Pending', progress: 30 },
        { name: 'Ocean View', builder: 'Coastal Builders', location: 'Bhavnagar', units: 45, status: 'Active', progress: 90 },
    ];

    const leads = [
        { name: 'Rahul Mehta', email: 'rahul@example.com', phone: '+91 98765 43210', interested: 'Sky Heights', status: 'Hot', date: '2026-06-10', value: '₹1.2 Cr' },
        { name: 'Priya Shah', email: 'priya@example.com', phone: '+91 98765 43211', interested: 'Green Valley', status: 'Warm', date: '2026-06-09', value: '₹85 L' },
        { name: 'Amit Patel', email: 'amit@example.com', phone: '+91 98765 43212', interested: 'Royal Residency', status: 'Cold', date: '2026-06-08', value: '₹60 L' },
        { name: 'Neha Singh', email: 'neha@example.com', phone: '+91 98765 43213', interested: 'Ocean View', status: 'Hot', date: '2026-06-07', value: '₹95 L' },
    ];

    const recentUsers = [
        { name: 'Navin Patel', email: 'navin@gmail.com', role: 'Admin', status: 'Active', avatar: 'NP' },
        { name: 'Rahul Shah', email: 'rahul@gmail.com', role: 'Manager', status: 'Active', avatar: 'RS' },
        { name: 'Amit Patel', email: 'amit@gmail.com', role: 'Agent', status: 'Inactive', avatar: 'AP' },
        { name: 'Priya Mehta', email: 'priya@gmail.com', role: 'Agent', status: 'Active', avatar: 'PM' },
    ];

    const activities = [
        { user: 'Navin Patel', action: 'created a new project', target: 'Sky Heights', time: '2 minutes ago' },
        { user: 'Rahul Shah', action: 'added a new builder', target: 'ABC Builders', time: '1 hour ago' },
        { user: 'Amit Patel', action: 'updated property', target: 'Green Valley', time: '3 hours ago' },
        { user: 'Priya Mehta', action: 'assigned role to', target: 'New Agent', time: '5 hours ago' },
    ];

    const categories = [
        { name: 'Apartment', count: 650, percentage: 45, color: 'emerald' },
        { name: 'Villa', count: 210, percentage: 20, color: 'blue' },
        { name: 'Plot', count: 180, percentage: 15, color: 'purple' },
        { name: 'Commercial', count: 145, percentage: 12, color: 'amber' },
        { name: 'Penthouse', count: 65, percentage: 8, color: 'rose' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'emerald';
            case 'Pending': return 'amber';
            case 'Hot': return 'emerald';
            case 'Warm': return 'blue';
            case 'Cold': return 'gray';
            default: return 'gray';
        }
    };

    const LeadStatusBadge = ({ status }) => {
        const colors = {
            Hot: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            Warm: 'bg-blue-100 text-blue-700 border-blue-200',
            Cold: 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.Cold}`}>
                <div className={`w-1.5 h-1.5 rounded-full mr-1 ${status === 'Hot' ? 'bg-emerald-500' : status === 'Warm' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="bg-gray-50 min-h-screen">
                <div className="p-6 lg:p-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                                        <LayoutDashboard className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                                            Dashboard
                                        </h1>
                                        <p className="text-slate-500">
                                            Welcome back, {auth.user.name}! Here's what's happening with your real estate business.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64 text-sm"
                                    />
                                </div>
                                <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-slate-500 text-sm">{item.title}</p>
                                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{item.value}</h2>
                                        </div>
                                        <div className={`h-12 w-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-6 h-6 ${item.textColor}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.trend === 'up' ? 
                                            <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : 
                                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                                        }
                                        <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>{item.change}</span>
                                        <span className="text-xs text-slate-400">vs last month</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-semibold text-lg text-slate-800">Quick Actions</h2>
                                <p className="text-sm text-slate-500">Common tasks and operations</p>
                            </div>
                            <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                const colorClasses = {
                                    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                                    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
                                    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
                                    amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                };
                                return (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl ${colorClasses[action.color]} transition-all duration-200 hover:scale-105`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-sm font-medium">{action.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Property Distribution */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-800">Property Distribution</h2>
                                    <p className="text-sm text-slate-500">By category type</p>
                                </div>
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <PieChart className="w-5 h-5 text-slate-600" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {categories.map((cat, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                            <span className="text-sm text-slate-500">{cat.count} units ({cat.percentage}%)</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-2 rounded-full bg-${cat.color}-500 transition-all duration-500`}
                                                style={{ width: `${cat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Projects */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-800">Monthly Projects</h2>
                                    <p className="text-sm text-slate-500">Projects created per month</p>
                                </div>
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-slate-600" />
                                </div>
                            </div>
                            <div className="flex justify-between items-end h-64 gap-3">
                                {[
                                    { month: 'Jan', value: 12, height: 48 },
                                    { month: 'Feb', value: 18, height: 72 },
                                    { month: 'Mar', value: 25, height: 100 },
                                    { month: 'Apr', value: 20, height: 80 },
                                    { month: 'May', value: 30, height: 120 },
                                    { month: 'Jun', value: 28, height: 112 },
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1 group">
                                        <div className="relative w-full flex justify-center">
                                            <div 
                                                className="bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg w-full max-w-12 transition-all duration-500 hover:opacity-80"
                                                style={{ height: `${item.height}px` }}
                                            >
                                                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {item.value} Projects
                                                </div>
                                            </div>
                                        </div>
                                        <span className="mt-2 text-sm text-slate-500">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Projects Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg text-slate-800">Recent Projects</h2>
                                <p className="text-sm text-slate-500">Latest projects added to the system</p>
                            </div>
                            <Link href="/projects" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Project</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Builder</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Units</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Progress</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {projects.map((project, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                                                        {project.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-800">{project.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Calendar size={10} />
                                                            Updated recently
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-700">{project.builder}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-700">{project.location}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-semibold text-slate-800">{project.units}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="w-32">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-slate-600">{project.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${getStatusColor(project.status)}-100 text-${getStatusColor(project.status)}-800`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CRM Leads Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg text-slate-800">CRM - Recent Leads</h2>
                                <p className="text-sm text-slate-500">Latest inquiries and leads from customers</p>
                            </div>
                            <Link href="/leads" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                View All Leads <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Interested In</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Value</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {leads.map((lead, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-semibold text-slate-600">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-800">{lead.name}</div>
                                                        <div className="text-xs text-slate-400">{lead.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-700">{lead.phone}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-slate-700">{lead.interested}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-semibold text-emerald-600">{lead.value}</span>
                                            </td>
                                            <td className="p-4">
                                                <LeadStatusBadge status={lead.status} />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    <span>{new Date(lead.date).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Convert to Client">
                                                        <UserPlus size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">Hot Leads: 2</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">Warm Leads: 1</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">Cold Leads: 1</span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500">
                                    Total Lead Value: ₹3.6 Cr
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Users */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-lg text-slate-800">Recent Users</h2>
                                        <p className="text-sm text-slate-500">Latest users joined</p>
                                    </div>
                                    <Users className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            <div className="divide-y divide-slate-200">
                                {recentUsers.map((user, index) => (
                                    <div key={index} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center font-semibold text-emerald-700">
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{user.name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded-full bg-${user.status === 'Active' ? 'emerald' : 'red'}-100 text-${user.status === 'Active' ? 'emerald' : 'red'}-800`}>
                                                    {user.status}
                                                </span>
                                                <p className="text-xs text-slate-400 mt-1">{user.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                                <Link href="/users" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1">
                                    View All Users <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-lg text-slate-800">Recent Activities</h2>
                                        <p className="text-sm text-slate-500">Latest system activities</p>
                                    </div>
                                    <Activity className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            <div className="divide-y divide-slate-200">
                                {activities.map((activity, index) => (
                                    <div key={index} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                <Activity className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-700">
                                                    <span className="font-medium">{activity.user}</span>
                                                    {' '}{activity.action}{' '}
                                                    <span className="font-medium">{activity.target}</span>
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                                <Link href="/activities" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1">
                                    View All Activities <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Performance & Categories */}
                        <div className="space-y-6">
                            {/* Top Categories */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="font-semibold text-lg text-slate-800">Top Categories</h2>
                                        <p className="text-sm text-slate-500">Most popular property types</p>
                                    </div>
                                    <Award className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="space-y-3">
                                    {categories.slice(0, 3).map((cat, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm text-slate-700">{cat.name}</span>
                                            <span className="text-sm font-semibold text-slate-800">{cat.count} units</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="font-semibold text-lg">Performance</h2>
                                        <p className="text-sm text-emerald-100">Key metrics overview</p>
                                    </div>
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Completion Rate</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-[85%] h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Customer Satisfaction</span>
                                            <span>92%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-[92%] h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Revenue Growth</span>
                                            <span>+18%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-[18%] h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Real Estate+ Admin Panel | Version 2.0.0
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}