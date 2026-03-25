import React, { useState, useEffect } from 'react'
import { User, Store, Phone, Mail, Lock, Save, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

const Settings = () => {
    const header = getAuthHeaders()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [profile, setProfile] = useState({
        shopName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${VITE_API_BASE_KEY}/auth/me`, { headers: header })
            if (res.data && res.data.user) {
                setProfile(prev => ({
                    ...prev,
                    shopName: res.data.user.shopName || '',
                    name: res.data.user.name || '',
                    email: res.data.user.email || '',
                    phone: res.data.user.phone || ''
                }))
            }
        } catch (err) {
            showMessage('error', 'Failed to load profile details')
        }
        setLoading(false)
    }

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value })
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (profile.password && profile.password !== profile.confirmPassword) {
            return showMessage('error', 'Passwords do not match')
        }

        setSaving(true)
        try {
            const payload = {
                shopName: profile.shopName,
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
            }
            if (profile.password) {
                payload.password = profile.password
            }

            const res = await axios.patch(`${VITE_API_BASE_KEY}/auth/shopkeeper/setting`, payload, { headers: header })
            showMessage('success', res.data.message || 'Profile updated successfully')
            setProfile(prev => ({ ...prev, password: '', confirmPassword: '' }))
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to update profile')
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center text-muted-foreground">Loading Settings...</div>
    }

    return (
        <div className='max-w-4xl mx-auto space-y-8 pb-10'>
            <div>
                <h1 className='text-3xl font-bold'>Account Settings</h1>
                <p className='text-muted-foreground mt-1'>Manage your shop details, profile, and security preferences.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-[8px] flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle className='w-5 h-5' /> : <AlertCircle className='w-5 h-5' />}
                    <p className='font-medium'>{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSave} className='space-y-8'>
                {/* Shop Details Section */}
                <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden'>
                    <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
                        <div className='p-2 bg-amber-400/20 text-amber-500 rounded'><Store className='w-5 h-5' /></div>
                        <h2 className='text-xl font-bold'>Shop Information</h2>
                    </div>
                    <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2 col-span-1 md:col-span-2'>
                            <label className='text-sm font-medium text-muted-foreground'>Shop Name</label>
                            <div className='relative'>
                                <Store className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                                <input type="text" name="shopName" value={profile.shopName} onChange={handleChange} required className='w-full pl-12 p-3 bg-input border border-border/50 rounded-[8px] outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all' placeholder="Enter your shop name" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profile Details Section */}
                <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden'>
                    <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
                        <div className='p-2 bg-amber-400/20 text-amber-500 rounded'><User className='w-5 h-5' /></div>
                        <h2 className='text-xl font-bold'>Personal Profile</h2>
                    </div>
                    <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-muted-foreground'>Full Name</label>
                            <div className='relative'>
                                <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                                <input type="text" name="name" value={profile.name} onChange={handleChange} required className='w-full pl-12 p-3 bg-input border border-border/50 rounded-[8px] outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all' placeholder="Your full name" />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-muted-foreground'>Phone Number</label>
                            <div className='relative'>
                                <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                                <input type="text" name="phone" value={profile.phone} onChange={handleChange} required pattern="\d{10}" title="Must be exactly 10 digits" className='w-full pl-12 p-3 bg-input border border-border/50 rounded-[8px] outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all pointer-events-none' placeholder="10-digit mobile number" />
                            </div>
                        </div>
                        <div className='space-y-2 col-span-1 md:col-span-2'>
                            <label className='text-sm font-medium text-muted-foreground'>Email Address <span className='text-xs text-amber-500/70 ml-2'>(Used for Login)</span></label>
                            <div className='relative'>
                                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                                <input  type="email" name="email" value={profile.email} onChange={handleChange} required className='w-full pl-12 p-3 bg-input border border-border/50 rounded-[8px] outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all pointer-events-none' placeholder="shop@example.com" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden'>
                    <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
                        <div className='p-2 bg-red-400/20 text-red-500 rounded'><Shield className='w-5 h-5' /></div>
                        <h2 className='text-xl font-bold'>Security</h2>
                    </div>
                    <div className='p-6'>
                        <p className='text-sm text-muted-foreground mb-6'>Leave these fields blank if you do not want to change your password.</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-muted-foreground'>New Password</label>
                                <div className='relative'>
                                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                                    <input type="password" name="password" value={profile.password} onChange={handleChange} className='w-full pl-12 p-3 bg-input border border-border/50 rounded-[8px] outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 transition-all' placeholder="Enter new password" />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-muted-foreground'>Confirm New Password</label>
                                <div className='relative'>
                                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50' />
                                    <input type="password" name="confirmPassword" value={profile.confirmPassword} onChange={handleChange} className='w-full pl-12 p-3 bg-input border border-border/50 rounded-[8px] outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 transition-all' placeholder="Re-enter new password" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className='flex justify-end pt-4 sticky bottom-6 z-10'>
                    <button type="submit" disabled={saving} className='bg-amber-400 hover:bg-amber-500 text-black font-bold px-8 py-4 rounded-[8px] shadow-lg shadow-amber-400/20 flex items-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.02]'>
                        <Save className='w-5 h-5' />
                        {saving ? 'Saving Changes...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export { Settings }