import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, Building, MessageSquare, Settings, LogOut, Bell,
    Megaphone, Handshake, FileText, IndianRupee, HardHat, LifeBuoy, ShieldCheck,
    Briefcase, BarChart3, Bot, Image, Palette, Server, ChevronDown, Menu, X,
    Home, Grid, Key, UserCog, Star, Trophy, Target, Clock, Calendar,
    TrendingUp, PieChart, Award, Globe, Mail, Phone, MapPin
} from 'lucide-react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        projectManagement: true,
        userManagement: true,
    });
    
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const SidebarItem = ({ href, icon: Icon, label, permission, badge }) => {
        if (permission && !permissions.includes(permission)) return null;

        const active = route().current(href);

        return (
            <Link
                href={route(href)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
                    ${active 
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' 
                        : 'text-sky-100 hover:bg-sky-700/70 hover:text-white'
                    }
                `}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? 'text-white' : 'text-sky-300'} />
                    <span className="font-medium">{label}</span>
                </div>
                {badge && (
                    <span className="px-2 py-0.5 text-xs bg-sky-500 text-white rounded-full">
                        {badge}
                    </span>
                )}
            </Link>
        );
    };

    const SidebarSection = ({ title, icon: Icon, section, children }) => {
        const hasVisibleChildren = React.Children.toArray(children).some(
            child => child.type === SidebarItem && !child.props.permission || 
                    (child.props.permission && permissions.includes(child.props.permission))
        );

        if (!hasVisibleChildren) return null;

        return (
            <div className="mb-4">
                <button
                    onClick={() => toggleSection(section)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-sky-300 uppercase tracking-wider hover:text-sky-200 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={14} />}
                        <span>{title}</span>
                    </div>
                    <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''}`}
                    />
                </button>
                
                {expandedSections[section] && (
                    <div className="mt-1 space-y-1 pl-2">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Desktop */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-30 w-72
                bg-gradient-to-b from-sky-800 to-sky-900 text-white
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col shadow-2xl
            `}>
                {/* Logo Section */}
                <div className="p-6 border-b border-sky-700/50">
                    <Link href="/" className="block">
                        <h1 className="text-2xl font-bold tracking-tight">
                            ProTech<span className="text-sky-300">.</span>
                        </h1>
                        <p className="text-xs text-sky-300/80 mt-1">Builder Operating System</p>
                    </Link>
                </div>

                {/* Close button for mobile */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="md:hidden absolute top-4 right-4 p-1 text-sky-300 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-thumb-sky-700">
                    {/* Dashboard */}
                    <div className="mb-6 px-2">
                        <SidebarItem
                            href="dashboard"
                            icon={LayoutDashboard}
                            label="Dashboard"
                        />
                    </div>

                    {/* Project Management Section */}
                    <SidebarSection 
                        title="Project Management" 
                        icon={Building}
                        section="projectManagement"
                    >

                         <SidebarItem
                            href="builder.index"
                            icon={HardHat}
                            label="Builders"
                            permission="view builder"
                        />
                        
                        {/* <SidebarItem
                            href="promoters.index"
                            icon={Megaphone}
                            label="Promoters"
                            permission="view promoters"
                        /> */}
                        <SidebarItem
                            href="amenities.index"
                            icon={Star}
                            label="Amenities"
                            permission="view amenities"
                        />
                        <SidebarItem
                            href="categories.index"
                            icon={Grid}
                            label="Categories"
                            permission="view categories"
                        />
                       
                        <SidebarItem
                            href="property-types.index"
                            icon={Home}
                            label="Property Types"
                            permission="view property types"
                        />
                        <SidebarItem
                            href="unit-types.index"
                            icon={Grid}
                            label="Unit Types"
                            permission="view unit types"
                        />

                        <SidebarItem
                            href="projects.index"
                            icon={Building}
                            label="Projects"
                            permission="view project"
                        />
                    </SidebarSection>

                    {/* User Management Section */}
                    <SidebarSection 
                        title="User Management" 
                        icon={Users}
                        section="userManagement"
                    >
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

                    {/* Additional sections can be added here */}
                </nav>

                {/* User Profile & Logout */}
                {/* <div className="p-4 border-t border-sky-700/50 mt-auto">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-sky-700/30 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-lg border-2 border-sky-400">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-sky-300 truncate">{user?.email}</p>
                        </div>
                    </div>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 text-sky-200 hover:text-white w-full px-4 py-2.5 rounded-lg hover:bg-sky-700/50 transition-all duration-200 text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </Link>
                </div> */}
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        
                        {/* Page Title */}
                        {header && (
                            <div className="text-lg md:text-xl font-semibold text-gray-800">
                                {header}
                            </div>
                        )}
                    </div>

                    {/* Right Side Header Items */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Status Indicator */}
                        <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>System Online</span>
                        </div>

                        {/* Notifications */}
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 rounded-full pl-1 pr-3 py-1 transition-colors border border-sky-200"
                            >
                                <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user?.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
                            </button>

                            {/* Dropdown Menu */}
                            {showingNavigationDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowingNavigationDropdown(false)}
                                    />
                                    
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                                        </div>
                                        
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowingNavigationDropdown(false)}
                                        >
                                            <Settings size={16} />
                                            Profile Settings
                                        </Link>
                                        
                                        <div className="border-t border-gray-200 my-2"></div>
                                        
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={() => setShowingNavigationDropdown(false)}
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}