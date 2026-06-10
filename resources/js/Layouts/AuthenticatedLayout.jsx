import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';

import {
    LayoutDashboard, Users, Building, MessageSquare, Settings, LogOut, Bell,
    Megaphone, Handshake, FileText, IndianRupee, HardHat, LifeBuoy, ShieldCheck,
    Briefcase, BarChart3, Bot, Image, Palette, Server, ChevronDown, Menu, X,
    Home, Grid, Key, UserCog, Star, Trophy, Target, Clock, Calendar,
    TrendingUp, PieChart, Award, Globe, Mail, Phone, MapPin, Search,
    DollarSign, Activity, CheckCircle
} from 'lucide-react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        projectManagement: true,
        userManagement: true,
        analytics: false,
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
                className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 text-sm
                    ${active 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700'
                    }
                `}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} className={`transition-all duration-300 ${active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                    <span className="font-medium">{label}</span>
                </div>
                {badge && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${active ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
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
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-emerald-600 transition-all duration-300 group"
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={14} className="group-hover:text-emerald-600 transition-colors" />}
                        <span>{title}</span>
                    </div>
                    <ChevronDown 
                        size={14} 
                        className={`transition-all duration-300 ${expandedSections[section] ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`}
                    />
                </button>
                
                {expandedSections[section] && (
                    <div className="mt-2 space-y-1 pl-2">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Sidebar - Desktop */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-30 w-72
                bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-200/50
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col border-r border-slate-200/50
            `}>
                {/* Logo Section - Keeping original logo */}
                <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-emerald-50/30 to-teal-50/30">
                    <Link href="/" className="block">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-12 w-auto"
                        />
                    </Link>
                </div>

                {/* Close button for mobile */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="md:hidden absolute top-6 right-6 p-1 text-slate-500 hover:text-emerald-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-thumb-emerald-200">
                    {/* Dashboard */}
                    <div className="mb-6 px-2">
                        <SidebarItem
                            href="dashboard"
                            icon={LayoutDashboard}
                            label="Dashboard"
                        />
                    </div>

 

<SidebarItem
    href="builder.index"
    icon={HardHat}
    label="Builders"
    permission="view builder"
/>

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
                </nav>

                {/* User Profile & Stats */}
            
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200/50">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-slate-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300"
                        >
                            <Menu size={20} />
                        </button>
                        
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center max-w-md">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search properties, projects, or clients..." 
                                    className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>
                        </div>
                        
                        {/* Page Title */}
                        {header && (
                            <div className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent ml-4">
                                {header}
                            </div>
                        )}
                    </div>

                    {/* Right Side Header Items */}
                    <div className="flex items-center gap-2 md:gap-4">
                      

                        {/* Notifications */}
                        <button className="relative p-2 text-slate-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl pl-1 pr-3 py-1 transition-all duration-300 border border-emerald-200/50"
                            >
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                    {user?.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={16} className="text-slate-500 hidden sm:block" />
                            </button>

                            {/* Dropdown Menu */}
                            {showingNavigationDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowingNavigationDropdown(false)}
                                    />
                                    
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
                                            <div className="mt-2 flex items-center gap-2 text-xs">
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Property Expert</span>
                                            </div>
                                        </div>
                                        
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                                            onClick={() => setShowingNavigationDropdown(false)}
                                        >
                                            <UserCog size={16} />
                                            Profile Settings
                                        </Link>
                                        
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                                            onClick={() => setShowingNavigationDropdown(false)}
                                        >
                                            <Building size={16} />
                                            My Properties
                                        </Link>
                                        
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300"
                                            onClick={() => setShowingNavigationDropdown(false)}
                                        >
                                            <MessageSquare size={16} />
                                            Messages
                                            <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                                        </Link>
                                        
                                        <div className="border-t border-slate-200 my-2"></div>
                                        
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
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
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}