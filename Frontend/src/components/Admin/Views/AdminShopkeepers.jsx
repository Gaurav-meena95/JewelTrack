import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Users,
    Search,
    ShieldAlert,
    ShieldCheck,
    Send,
    IndianRupee,
    Filter,
    Download,
    Mail,
    Phone,
    MoreVertical,
    Clock,
    X,
    Bell
} from 'lucide-react';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';
import { GlassCard } from '../../GlassCard';

const AdminShopkeepers = () => {
    const [shopkeepers, setShopkeepers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal states
    const [alertModal, setAlertModal] = useState({ show: false, skId: null, skName: '' });
    const [alertMessage, setAlertMessage] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchShopkeepers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${VITE_API_BASE_KEY}/admin/shopkeepers`, { headers: getAuthHeaders() });
            if (res.data?.success) {
                setShopkeepers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching shopkeepers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopkeepers();
    }, []);

    const filteredSK = useMemo(() => {
        return shopkeepers.filter(sk => {
            const matchesSearch =
                sk.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sk.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sk.email?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'blocked' && sk.isBlocked) ||
                (statusFilter === 'active' && !sk.isBlocked);

            return matchesSearch && matchesStatus;
        });
    }, [shopkeepers, searchQuery, statusFilter]);

    const handleBlockToggle = async (skId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this shopkeeper?`)) return;

        try {
            setActionLoading(true);
            await axios.patch(`${VITE_API_BASE_KEY}/admin/shopkeepers/${skId}/block`,
                { isBlocked: !currentStatus },
                { headers: getAuthHeaders() }
            );
            fetchShopkeepers();
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendAlert = async () => {
        if (!alertMessage.trim()) return;
        try {
            setActionLoading(true);
            await axios.post(`${VITE_API_BASE_KEY}/admin/shopkeepers/${alertModal.skId}/alert`,
                { message: alertMessage },
                { headers: getAuthHeaders() }
            );
            setAlertModal({ show: false, skId: null, skName: '' });
            setAlertMessage('');
            alert("Alert sent successfully");
        } catch (error) {
            alert("Failed to send alert");
        } finally {
            setActionLoading(false);
        }
    };

    const downloadCSV = () => {
        const headers = ["Shop Name", "Owner", "Email", "Phone", "Customers", "Revenue", "Status"];
        const rows = filteredSK.map(sk => [
            sk.shopName,
            sk.name,
            sk.email,
            sk.phone,
            sk.customerCount,
            sk.totalRevenue,
            sk.isBlocked ? "Blocked" : "Active"
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "shopkeepers_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Shopkeeper <span className="text-amber-400">Directory</span></h1>
                    <p className="text-muted-foreground mt-1">Manage, monitor, and regulate platform vendors.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary/80 border border-border/50 rounded text-sm font-bold transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <GlassCard className="p-4 border-border/40 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-amber-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, shop, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-card border border-border/50 rounded outline-none focus:border-amber-400/50 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-muted-foreground ml-2 hidden md:block" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 md:w-40 px-4 py-3 bg-card border border-border/50 rounded outline-none focus:border-amber-400/50 text-sm appearance-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="blocked">Blocked Only</option>
                    </select>
                </div>
            </GlassCard>

            {/* Table */}
            <GlassCard className="overflow-hidden border-border/40 shadow-xl">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/30 border-b border-border/50">
                                <th className="px-6 py-5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Shop & Owner</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Contact</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">customers</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Revenue</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground italic">
                                        <Clock className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" />
                                        Fetching global data...
                                    </td>
                                </tr>
                            ) : filteredSK.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground italic">No shopkeepers found matching criteria.</td>
                                </tr>
                            ) : (
                                filteredSK.map((sk) => (
                                    <tr key={sk._id} className="hover:bg-amber-400/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-foreground">{sk.shopName}</p>
                                                <p className="text-xs text-muted-foreground">{sk.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Mail className="w-3 h-3 text-amber-400" />
                                                    {sk.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Phone className="w-3 h-3 text-amber-400" />
                                                    {sk.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold bg-secondary px-3 py-1 rounded-full text-xs">{sk.customerCount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-black text-amber-400 flex items-center gap-0.5">
                                                <IndianRupee className="w-3 h-3" />
                                                {(sk.totalRevenue || 0).toLocaleString('en-IN')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sk.isBlocked ? (
                                                <div className="flex items-center gap-1.5 text-rose-500 font-bold text-[10px] uppercase bg-rose-500/10 px-2 py-1 rounded-full w-fit">
                                                    <ShieldAlert className="w-3 h-3" />
                                                    Blocked
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    Active
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setAlertModal({ show: true, skId: sk._id, skName: sk.shopName })}
                                                    className="p-2 hover:bg-amber-400/20 text-amber-500 rounded transition-colors"
                                                    title="Send Alert"
                                                >
                                                    <Bell className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleBlockToggle(sk._id, sk.isBlocked)}
                                                    className={`p-2 \${sk.isBlocked ? 'hover:bg-emerald-500/20 text-emerald-500' : 'hover:bg-rose-500/20 text-rose-500'} rounded transition-colors`}
                                                    title={sk.isBlocked ? "Unblock User" : "Block User"}
                                                >
                                                    {sk.isBlocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Alert Modal */}
            {alertModal.show && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <GlassCard className="w-full max-w-md p-8 border-border/40 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 blur-3xl" />

                        <div className="flex justify-between items-start mb-6 relative">
                            <div>
                                <h3 className="text-xl font-bold">Send <span className="text-amber-400">Official Alert</span></h3>
                                <p className="text-sm text-muted-foreground mt-1">To: {alertModal.skName}</p>
                            </div>
                            <button onClick={() => setAlertModal({ show: false, skId: null, skName: '' })} className="p-1 hover:bg-secondary rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 relative">
                            <textarea
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                                placeholder="Enter your message to the shopkeeper..."
                                className="w-full h-32 p-4 bg-secondary/50 border border-border/50 rounded-2xl outline-none focus:border-amber-400/50 transition-all resize-none text-sm leading-relaxed"
                            />
                            <button
                                onClick={handleSendAlert}
                                disabled={actionLoading || !alertMessage.trim()}
                                className="w-full py-4 bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                Broadcast Alert
                            </button>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default AdminShopkeepers;
