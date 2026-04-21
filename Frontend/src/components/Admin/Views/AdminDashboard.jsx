import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    IndianRupee,
    Package,
    MessageCircle,
    ArrowUpRight,
    Clock,
    TrendingUp,
    Store,
    BarChart
} from 'lucide-react';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';
import { GlassCard } from '../../GlassCard';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalShopkeepers: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        unreadFeedback: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${VITE_API_BASE_KEY}/admin/stats`, { headers: getAuthHeaders() });
                if (res.data?.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Shopkeepers',
            count: stats.totalShopkeepers,
            icon: Store,
            color: 'from-blue-500 to-indigo-600',
            trend: '+5% this month'
        },
        {
            title: 'Active Customers',
            count: stats.totalCustomers,
            icon: Users,
            color: 'from-emerald-500 to-teal-600',
            trend: '+12% growth'
        },
        {
            title: 'Platform Revenue',
            count: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
            icon: IndianRupee,
            color: 'from-amber-500 to-orange-600',
            trend: 'Live monitoring'
        },
        {
            title: 'Support Requests',
            count: stats.unreadFeedback,
            icon: MessageCircle,
            color: 'from-rose-500 to-pink-600',
            trend: 'New messages'
        }
    ];

    if (loading) return <div className="flex items-center justify-center h-full"><Clock className="animate-spin" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">Executive <span className="text-amber-400">Overview</span></h1>
                <p className="text-muted-foreground mt-2 text-lg">Real-time performance metrics for JewelTrack platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <GlassCard key={i} className="relative overflow-hidden group border-border/40" hover>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${card.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-linear-to-tr ${card.color} shadow-lg shadow-black/20`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    {card.trend}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{card.title}</p>
                                <h2 className="text-4xl font-black">{card.count}</h2>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Feedbacks / Quick look */}
                <GlassCard className="lg:col-span-2 p-8 border-border/40">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BarChart className="text-amber-400 w-6 h-6" />
                                Platform Growth
                            </h2>
                            <p className="text-muted-foreground text-sm">Visualizing shopkeeper acquisition velocity</p>
                        </div>
                        <button className="text-xs font-bold text-amber-400 hover:underline uppercase tracking-widest">Full Report</button>
                    </div>

                    <div className="h-64 flex items-center justify-center border border-dashed border-border/50 rounded-2xl bg-secondary/20 group cursor-help">
                        <div className="text-center group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-12 h-12 text-amber-400/20 mx-auto mb-2" />
                            <p className="text-muted-foreground font-medium">Chart visualization pending more data points</p>
                        </div>
                    </div>
                </GlassCard>

                {/* System Announcements / Quick Controls */}
                <GlassCard className="p-8 border-border/40 bg-linear-to-b from-card to-secondary/20">
                    <h2 className="text-2xl font-bold mb-6">Quick <span className="text-amber-400">Actions</span></h2>
                    <div className="space-y-4">
                        <ActionButton label="Export System CSV" icon={Package} />
                        <ActionButton label="System Heath Check" icon={Clock} />
                        <div className="p-6 rounded-2xl bg-amber-400/10 border border-amber-400/20 mt-6 mt-12">
                            <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                                <Store className="w-4 h-4" />
                                Admin Tip
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You can now send direct alerts to shopkeepers from the list view. Use this to notify about maintenance or critical updates.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

const ActionButton = ({ label, icon: Icon }) => (
    <button className="w-full flex items-center justify-between p-4 rounded bg-card border border-border/50 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all group">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded group-hover:bg-amber-400/20 group-hover:text-amber-400 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">{label}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400" />
    </button>
);

export default AdminDashboard;
