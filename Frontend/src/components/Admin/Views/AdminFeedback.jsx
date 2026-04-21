import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MessageSquare,
    Clock,
    User,
    Store,
    Mail,
    CheckCircle2,
    Circle,
    Inbox,
    Search,
    Filter
} from 'lucide-react';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';
import { GlassCard } from '../../GlassCard';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, feedback, issue

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`${VITE_API_BASE_KEY}/admin/feedback`, { headers: getAuthHeaders() });
                if (res.data?.success) {
                    setFeedbacks(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const filteredFeedbacks = feedbacks.filter(fb => filter === 'all' || fb.type === filter);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Clock className="animate-spin" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Support <span className="text-amber-400">Inbox</span></h1>
                    <p className="text-muted-foreground mt-1">Review shopkeeper feedback and critical issues.</p>
                </div>
                <div className="flex bg-secondary p-1 rounded border border-border/50">
                    {['all', 'feedback', 'issue'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-amber-400 text-black' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {filteredFeedbacks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                        <Inbox className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold">Your inbox is clear</h3>
                    <p className="text-muted-foreground">No support requests found for the selected category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredFeedbacks.map((fb) => (
                        <GlassCard key={fb._id} className="p-6 border-border/40 hover:border-amber-400/30 transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Meta Info */}
                                <div className="md:w-64 border-b md:border-b-0 md:border-r border-border/30 pb-4 md:pb-0 md:pr-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                                            <Store className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate max-w-[150px]">{fb.shopkeeperId?.shopName || 'Unknown Shop'}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{fb.shopkeeperId?.name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail className="w-3.5 h-3.5 text-amber-400/50" />
                                            {fb.shopkeeperId?.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5 text-amber-400/50" />
                                            {formatDate(fb.createdAt)}
                                        </div>
                                    </div>
                                    <div className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full w-fit ${fb.type === 'issue' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {fb.type}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-xl font-bold text-foreground">{fb.subject}</h3>
                                    <div className="p-4 bg-secondary/30 rounded-2xl border border-border/30 italic text-muted-foreground leading-relaxed">
                                        "{fb.message}"
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-500 transition-colors uppercase tracking-widest">
                                            Mark as Resolved
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFeedback;
