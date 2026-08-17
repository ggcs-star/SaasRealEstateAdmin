import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Users,
    Home,
    FolderKanban,
    TrendingUp,
    TrendingDown,
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
    AlertTriangle,
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
    Zap,
    IndianRupee,
    Target,
    Banknote
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({
    auth,
    stats,
    bookingStatusDistribution,
    monthlyRevenue,
    projectWiseBookings,
    recentBookings,
    recentCollections,
    recentProjects,
    upcomingPayments,
    overduePayments,
    pendingCommissions,
    userPerformance,
    currentRole,
    userName,
    currentDate,
    filters
}) {
    
    const [selectedPeriod, setSelectedPeriod] = useState(filters?.selectedPeriod || 'monthly');
    const [selectedYear, setSelectedYear] = useState(filters?.selectedYear || new Date().getFullYear());

    // Format Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get Status Color
    const getStatusColor = (status) => {
        const statusColors = {
            'Enquiry': 'slate',
            'Hold': 'amber',
            'Booked': 'blue',
            'Agreement Done': 'indigo',
            'Registered': 'emerald',
            'Completed': 'green',
            'Cancelled': 'red',
            'Refunded': 'rose',
            'Pending': 'amber',
            'Paid': 'emerald',
            'Partially Paid': 'orange',
            'Overdue': 'red',
            'active': 'emerald',
            'inactive': 'gray',
            'Active': 'emerald',
            'Inactive': 'gray',
        };
        return statusColors[status] || 'gray';
    };

    const StatusBadge = ({ status }) => {
        const color = getStatusColor(status);
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700 border border-${color}-200`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-${color}-500`}></span>
                {status || 'Unknown'}
            </span>
        );
    };

    // Calculate max revenue for chart scaling
    const maxRevenue = Math.max(...monthlyRevenue.map(item => item.revenue), 1);
    const maxBookings = Math.max(...monthlyRevenue.map(item => item.bookings), 1);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="bg-gray-50 min-h-screen">
                <div className="p-4 lg:p-8">
                    
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
                                            Welcome back, {userName}!
                                        </h1>
                                        <p className="text-slate-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {currentDate} | Role: <span className="capitalize font-medium">{currentRole?.replace('_', ' ')}</span>
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

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Total Projects" 
                            value={stats.totalProjects}
                            subtitle={`${stats.activeProjects} Active`}
                            icon={FolderKanban}
                            color="emerald"
                            trend="up"
                            trendValue="12%"
                        />
                        <StatCard 
                            title="Total Bookings" 
                            value={stats.totalBookings}
                            subtitle={`${stats.currentMonthBookings} this month`}
                            icon={Home}
                            color="blue"
                            trend={stats.currentMonthBookings > stats.lastMonthBookings ? "up" : "down"}
                            trendValue={`${Math.abs(stats.currentMonthBookings - stats.lastMonthBookings)}`}
                        />
                        <StatCard 
                            title="Total Revenue" 
                            value={formatCurrency(stats.totalRevenue)}
                            subtitle={`${formatCurrency(stats.currentMonthRevenue)} this month`}
                            icon={IndianRupee}
                            color="purple"
                            trend="up"
                            trendValue=""
                        />
                        <StatCard 
                            title="Total Customers" 
                            value={stats.totalCustomers}
                            subtitle="Active clients"
                            icon={Users}
                            color="amber"
                            trend="up"
                            trendValue="8%"
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard 
                            title="Due Amount" 
                            value={formatCurrency(stats.totalDueAmount)}
                            subtitle="Pending collections"
                            icon={AlertTriangle}
                            color="red"
                        />
                        <StatCard 
                            title="Units Booked" 
                            value={stats.totalUnitsBooked}
                            subtitle="Total inventory sold"
                            icon={CheckCircle}
                            color="indigo"
                        />
                        <StatCard 
                            title="Total Commission" 
                            value={formatCurrency(stats.totalCommission)}
                            subtitle={`${formatCurrency(stats.pendingCommission)} pending`}
                            icon={Percent}
                            color="pink"
                        />
                        <StatCard 
                            title="Total Users" 
                            value={stats.totalUsers}
                            subtitle="System users"
                            icon={Building2}
                            color="teal"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                        <h2 className="font-semibold text-lg text-slate-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <QuickActionButton 
                                icon={Plus} 
                                title="New Project" 
                                href={route('projects.create')} 
                                color="emerald" 
                            />
                            <QuickActionButton 
                                icon={UserPlus} 
                                title="Add Booking" 
                                href={route('bookings.create')} 
                                color="blue" 
                            />
                            <QuickActionButton 
                                icon={Banknote} 
                                title="Add Collection" 
                                href="#" 
                                color="purple" 
                            />
                            <QuickActionButton 
                                icon={Target} 
                                title="Add Customer" 
                                href="#" 
                                color="amber" 
                            />
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        
                        {/* Monthly Revenue Chart */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-800">Revenue & Bookings Trend</h2>
                                    <p className="text-sm text-slate-500">Last 6 months performance</p>
                                </div>
                                <BarChart3 className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="space-y-6">
                                {monthlyRevenue.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-slate-700">{item.month}</span>
                                            <div className="flex gap-4">
                                                <span className="text-emerald-600 font-semibold">
                                                    {formatCurrency(item.revenue)}
                                                </span>
                                                <span className="text-blue-600">
                                                    {item.bookings} bookings
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                                                />
                                            </div>
                                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${(item.bookings / maxBookings) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mt-1 text-xs text-slate-400">
                                            <span className="flex-1">Revenue</span>
                                            <span className="w-20">Bookings</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Booking Status Distribution */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-800">Booking Status</h2>
                                    <p className="text-sm text-slate-500">Distribution by status</p>
                                </div>
                                <PieChart className="w-5 h-5 text-slate-400" />
                            </div>
                            {Object.keys(bookingStatusDistribution).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(bookingStatusDistribution).map(([status, count]) => {
                                        const total = Object.values(bookingStatusDistribution).reduce((a, b) => a + b, 0);
                                        const percentage = ((count / total) * 100).toFixed(1);
                                        const color = getStatusColor(status);
                                        return (
                                            <div key={status}>
                                                <div className="flex justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-3 h-3 rounded-full bg-${color}-500`}></span>
                                                        <span className="text-sm font-medium text-slate-700">{status}</span>
                                                    </div>
                                                    <span className="text-sm text-slate-500">{count} ({percentage}%)</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">No booking data available</div>
                            )}
                        </div>
                    </div>

                    {/* Project-wise Booking Distribution */}
                    {projectWiseBookings?.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                            <h2 className="font-semibold text-lg text-slate-800 mb-4">Project-wise Bookings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projectWiseBookings.map((project, index) => (
                                    <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all">
                                        <h3 className="font-medium text-slate-800 mb-2">{project.project_name}</h3>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Bookings:</span>
                                            <span className="font-semibold">{project.total_bookings}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-slate-500">Value:</span>
                                            <span className="font-semibold text-emerald-600">{formatCurrency(project.total_value)}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                {project.project_type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Alerts Section - Overdue Payments */}
                    {overduePayments?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-800 text-lg">
                                        Overdue Payments ({overduePayments.length})
                                    </h3>
                                    <div className="mt-3 space-y-2">
                                        {overduePayments.slice(0, 3).map((payment, index) => (
                                            <div key={index} className="flex justify-between items-center bg-white/50 rounded-lg p-3">
                                                <div>
                                                    <p className="font-medium text-slate-800">{payment.customer_name}</p>
                                                    <p className="text-sm text-slate-500">{payment.booking_number} | {payment.installment_name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-red-600">{formatCurrency(payment.scheduled_amount)}</p>
                                                    <p className="text-xs text-red-500">{payment.days_overdue} days overdue</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tables Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        
                        {/* Recent Bookings */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-800">Recent Bookings</h2>
                                    <p className="text-sm text-slate-500">Latest reservations</p>
                                </div>
                                <Link href={route('bookings.index')} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Booking</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Customer/Project</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Amount</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {recentBookings?.length > 0 ? (
                                            recentBookings.map((booking, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    <td className="p-4">
                                                        <span className="font-medium text-blue-600">{booking.booking_number}</span>
                                                        <p className="text-xs text-slate-400">{formatDate(booking.booking_date)}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="font-medium text-slate-800">{booking.customer_name}</p>
                                                        <p className="text-xs text-slate-500">{booking.project_name}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="font-semibold text-emerald-600">{formatCurrency(booking.total_amount)}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <StatusBadge status={booking.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-slate-500">No recent bookings</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Collections */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-800">Recent Collections</h2>
                                    <p className="text-sm text-slate-500">Latest payments received</p>
                                </div>
                                <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Receipt</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Amount</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {recentCollections?.length > 0 ? (
                                            recentCollections.map((collection, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    <td className="p-4">
                                                        <span className="font-medium text-blue-600">{collection.receipt_number}</span>
                                                        <p className="text-xs text-slate-400">{formatDate(collection.payment_date)}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="font-medium text-slate-800">{collection.customer_name}</p>
                                                        <p className="text-xs text-slate-500">{collection.booking_number}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="font-semibold text-emerald-600">{formatCurrency(collection.paid_amount)}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                            {collection.payment_mode}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="p-6 text-center text-slate-500">No recent collections</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Payments & Pending Commissions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        
                        {/* Upcoming Payments */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-amber-50">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <h2 className="font-semibold text-lg text-slate-800">Upcoming Payments</h2>
                                        <p className="text-sm text-slate-500">Scheduled this month</p>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-200">
                                {upcomingPayments?.length > 0 ? (
                                    upcomingPayments.map((payment, index) => (
                                        <div key={index} className="px-6 py-4 hover:bg-slate-50">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-slate-800">{payment.customer_name}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {payment.booking_number} | {payment.installment_name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-slate-800">{formatCurrency(payment.scheduled_amount)}</p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(payment.scheduled_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-slate-500">No upcoming payments</div>
                                )}
                            </div>
                        </div>

                        {/* Pending Commissions */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-purple-50">
                                <div className="flex items-center gap-2">
                                    <Percent className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <h2 className="font-semibold text-lg text-slate-800">Pending Commissions</h2>
                                        <p className="text-sm text-slate-500">Awaiting approval</p>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-200">
                                {pendingCommissions?.length > 0 ? (
                                    pendingCommissions.map((commission, index) => (
                                        <div key={index} className="px-6 py-4 hover:bg-slate-50">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-slate-800">{commission.channel_partner}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {commission.booking_number} | {commission.commission_type}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-purple-600">{formatCurrency(commission.commission_amount)}</p>
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Pending</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-slate-500">No pending commissions</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Projects Grid */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg text-slate-800">Recent Projects</h2>
                                <p className="text-sm text-slate-500">Latest additions</p>
                            </div>
                            <Link href={route('projects.index')} className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {recentProjects?.length > 0 ? (
                                recentProjects.map((project, index) => (
                                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all group">
                                        <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
                                            {project.cover_image_url ? (
                                                <img src={project.cover_image_url} alt={project.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-16 h-16 text-slate-400" />
                                            )}
                                            {project.is_featured && (
                                                <div className="absolute top-2 right-2 bg-amber-400 text-white p-1 rounded-full">
                                                    <Star className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-slate-800 mb-1">{project.name}</h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                                                <MapPin className="w-3 h-3" />
                                                {project.location || 'Location N/A'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    {project.project_type}
                                                </span>
                                                <StatusBadge status={project.status} />
                                            </div>
                                            {project.builder_name && (
                                                <p className="text-xs text-slate-400 mt-2">
                                                    Builder: {project.builder_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full p-6 text-center text-slate-500">No recent projects</div>
                            )}
                        </div>
                    </div>

                    {/* Team Performance (Admin/Manager only) */}
                    {(currentRole === 'super_admin' || currentRole === 'manager') && userPerformance?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <h2 className="font-semibold text-lg text-slate-800">Team Performance</h2>
                                        <p className="text-sm text-slate-500">Employee-wise metrics</p>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Employee</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Total Bookings</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Monthly</th>
                                            <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {userPerformance.map((user, index) => (
                                            <tr key={index} className="hover:bg-slate-50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center font-semibold text-emerald-700">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800">{user.name}</p>
                                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-slate-800">{user.total_bookings}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-blue-600">{user.month_bookings}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-emerald-600">{formatCurrency(user.total_revenue)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

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

// Reusable Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => {
    const colorClasses = {
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-pink-500' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-500' },
        red: { bg: 'bg-red-50', text: 'text-red-600', gradient: 'from-red-500 to-rose-500' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', gradient: 'from-indigo-500 to-blue-500' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-600', gradient: 'from-pink-500 to-rose-500' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-600', gradient: 'from-teal-500 to-green-500' },
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h2 className="text-2xl font-bold text-slate-800 mt-1 break-all">{value}</h2>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1">
                    {trend === 'up' ? 
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : 
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                    }
                    <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trendValue}
                    </span>
                    {trendValue && <span className="text-xs text-slate-400">vs last period</span>}
                </div>
            )}
        </div>
    );
};

// Reusable Quick Action Button
const QuickActionButton = ({ icon: Icon, title, href, color }) => {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    };

    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-3 p-5 rounded-xl ${colorClasses[color]} transition-all duration-200 hover:scale-105 hover:shadow-md`}
        >
            <Icon className="w-6 h-6" />
            <span className="text-sm font-medium">{title}</span>
        </Link>
    );
};