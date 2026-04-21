import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    MessageSquare, 
    Send, 
    AlertCircle, 
    Clock, 
    Bell,
    CheckCircle2,
    HelpCircle,
    Info
} from 'lucide-react';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';
import { GlassCard } from '../../GlassCard';
import SectionHeader from '../../../utils/SectionHeader';

const Support = () => {
    const header = getAuthHeaders();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        type: 'feedback'
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchMyData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${VITE_API_BASE_KEY}/auth/me`, { headers: header });
            if (res.data?.success) {
                setAlerts(res.data.data.user.alerts || []);
            }
        } catch (err) {
            console.error("Error fetching alerts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyData();
    }, []);

    useEffect(() => {
        if (success || error) {
            const t = setTimeout(() => { setSuccess(''); setError('') }, 5000);
            return () => clearTimeout(t);
        }
    }, [success, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) return setError('Please fill all fields');
        
        try {
            setSubmitting(true);
            setError('');
            await axios.post(`${VITE_API_BASE_KEY}/admin/feedback`, formData, { headers: header });
            setSuccess('Your message has been sent to the Admin team.');
            setFormData({ subject: '', message: '', type: 'feedback' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SectionHeader 
                title="Support & Feedback" 
                subtitle="Connect with the JewelTrack admin team and view platform updates"
                className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
                titleClassName="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            />

            {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center font-medium'>{success}</div>}
            {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center font-medium'>{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-400/20 text-amber-400 rounded"><MessageSquare className="w-5 h-5" /></div>
                        <h2 className="text-xl font-bold">Contact Admin</h2>
                    </div>

                    <div className="bg-card/40 border border-border/50 p-6 rounded-[8px] space-y-5">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 ml-1">Message Type</label>
                                <div className="flex gap-2">
                                    {['feedback', 'issue'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({...formData, type: t})}
                                            className={`px-4 py-2 rounded-[8px] text-xs font-bold uppercase transition-all tracking-widest border capitalize ${formData.type === t ? 'bg-amber-400 text-black border-amber-400' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 ml-1">Subject</label>
                                <input 
                                    type="text"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    placeholder="Brief summary..."
                                    className="w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 ml-1">Detailed Message</label>
                                <textarea 
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    placeholder="Explain your situation..."
                                    className="w-full h-32 p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50 text-sm resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full p-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-400/10 disabled:opacity-50"
                            >
                                {submitting ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Alerts / Admin Broadcasts */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-500 rounded"><Bell className="w-5 h-5" /></div>
                        <h2 className="text-xl font-bold">Admin Broadcasts</h2>
                    </div>

                    <div className="space-y-4">
                        {loading ? <div className="text-center py-10 text-muted-foreground italic">Fetching broadcasts...</div> : alerts.length === 0 ? (
                            <div className="text-center py-20 bg-secondary/20 rounded-[8px] border border-dashed border-border/50">
                                <Info className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground text-sm">No alerts from admin yet.</p>
                            </div>
                        ) : (
                            alerts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((alert, i) => (
                                <div key={i} className="bg-card/40 border-l-4 border-l-amber-400 border-border/50 p-5 rounded-r-[8px] space-y-3 hover:border-r-amber-400/20 transition-all">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Official Notice</span>
                                        <span className="text-[xs] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground/90 font-medium font-medium">
                                        {alert.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* FAQ Quick Link Section */}
                    <div className="p-6 rounded-[8px] bg-secondary/30 border border-border/50 mt-8">
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-sm">
                            <HelpCircle className="w-4 h-4 text-amber-500" />
                            Pre-Support Checklist
                        </h4>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p>• Check your internet connection.</p>
                            <p>• Ensure all mandatory fields are filled in forms.</p>
                            <p>• For billing issues, have the Invoice ID ready.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
