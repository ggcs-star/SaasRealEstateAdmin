import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, Building, MessageSquare, Settings, LogOut, Bell,
    Megaphone, Handshake, FileText, IndianRupee, HardHat, LifeBuoy, ShieldCheck,
    Briefcase, BarChart3, Bot, Image, Palette, Server
} from 'lucide-react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const isActive = (href) => {
        return route().current(href);
    };



    const SidebarSection = ({ title, children }) => (
        <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">{title}</h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );
    const SidebarItem = ({ href, icon: Icon, label, permission }) => {
        if (permission && !permissions.includes(permission)) return null;

        const active = route().current(href);

        return (
            <Link
                href={route(href)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                ${active
                        ? 'bg-sky-700 text-white'
                        : 'text-slate-300 hover:bg-sky-700 hover:text-white'
                    }
            `}
            >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
            </Link>
        );
    };


    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside class="w-64 bg-[#0C4A6E] text-white flex flex-col shadow-xl z-20 hidden md:flex">
                <div className="p-6 border-b border-brand-700 flex-shrink-0">
                    <h1 className="text-2xl font-bold tracking-tight">
                        <Link href="/" className="hover:text-brand-500 transition-colors">
                            ProTech<span className="text-brand-500">.</span>
                        </Link>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Builder Operating System</p>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-700">

                    {/* Dashboard */}
                    <SidebarItem
                        href="dashboard"
                        icon={LayoutDashboard}
                        label="Command Center"
                    />
                     <SidebarSection title="Project Management">

                        <SidebarItem
                            href="projects.index"
                            icon={Building}
                            label="Projects"
                            permission="view project"
                        />
        
                        
                      {/* <SidebarItem
                            href="projects.create"
                            icon={Building}
                            label="Create Project"
                            permission="add project"
                        /> */}
                        <SidebarItem
                            href="amenities.index"
                            icon={Building}
                            label="Amenities"
                            permission="view amenities"
                        />

                    </SidebarSection>

                    {/* USERS & ROLES SECTION */}
                    <SidebarSection title="User Management">

                        <SidebarItem
                            href="users.index"
                            icon={Users}
                            label="Users"
                            permission="view users"
                        />

                        <SidebarItem
                            href="roles.index"
                            icon={ShieldCheck}
                            label="Roles & Permissions"
                            permission="view roles"
                        />

                    </SidebarSection>

                </nav>

                <div className="p-4 border-t border-brand-700 flex-shrink-0">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center space-x-3 text-slate-300 hover:text-white w-full px-4 py-2"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {header && (
                            <div className="px-6 py-4">{header}</div>
                        )}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Systems Operational
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold cursor-pointer hover:bg-brand-200 transition-colors"
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </button>

                            {showingNavigationDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Optional Header from props */}


                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    className="bg-brand-900 text-white p-3 rounded-full shadow-lg hover:bg-brand-800 transition-colors"
                >
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path
                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                        <path
                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}