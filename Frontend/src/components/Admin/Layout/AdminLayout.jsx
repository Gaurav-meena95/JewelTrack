import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Gem,
    Settings,
    BarChart
} from 'lucide-react';
import ThemeToggle from '../../ThemeToggle';

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/admin');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin-dashboard' },
        { icon: Users, label: 'Shopkeepers', path: '/admin-dashboard/shopkeepers' },
        { icon: MessageSquare, label: 'Feedback', path: '/admin-dashboard/feedback' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-card border-r border-border/50 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-12 px-2">
                        <div className="p-2 bg-amber-400/20 rounded">
                            <Gem className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">JewelTrack</h2>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Admin Portal</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin-dashboard'}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3.5 rounded transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-border/50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3.5 rounded text-red-500 hover:bg-red-500/10 transition-colors w-full group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
                {/* Header */}
                <header className="h-20 bg-card/30 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 shrink-0">
                    <button
                        className="lg:hidden p-2 hover:bg-secondary rounded"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex justify-end items-center gap-4">
                        <ThemeToggle />
                        <div className="w-px h-6 bg-border/50 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold">System Admin</p>
                                <p className="text-xs text-muted-foreground">Main Controller</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black border-2 border-background shadow-sm">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-auto bg-linear-to-b from-background to-secondary/10">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export { AdminLayout };
