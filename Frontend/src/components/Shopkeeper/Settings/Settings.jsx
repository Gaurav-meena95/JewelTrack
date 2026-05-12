import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'
import { useNotification } from '../../../context/NotificationContext'

// Shared Utils
import SectionHeader from '../../../utils/SectionHeader'

// Sub-components
import ShopInfoSection from './components/ShopInfoSection'
import PersonalInfoSection from './components/PersonalInfoSection'
import SecuritySection from './components/SecuritySection'
import CustomOptionsSection from './components/CustomOptionsSection'

const Settings = () => {
    const { showToast } = useNotification()
    const header = getAuthHeaders()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [profile, setProfile] = useState({
        shopName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        itemNames: [],
        purities: []
    })

    const [newItemName, setNewItemName] = useState('')
    const [newPurity, setNewPurity] = useState('')

    const handleAddItemName = (e) => {
        if (e) e.preventDefault()
        if (newItemName.trim() && !profile.itemNames.includes(newItemName.trim())) {
            setProfile(prev => ({ ...prev, itemNames: [...prev.itemNames, newItemName.trim()] }))
            setNewItemName('')
        } else {
            return showMessage('error', 'Items Already in list')
        }
    }

    const handleRemoveItemName = (item) => {
        setProfile(prev => ({ ...prev, itemNames: prev.itemNames.filter(i => i !== item) }))
    }

    const handleAddPurity = (e) => {
        if (e) e.preventDefault()
        if (newPurity.trim() && !profile.purities.includes(newPurity.trim())) {
            setProfile(prev => ({ ...prev, purities: [...prev.purities, newPurity.trim()] }))
            setNewPurity('')
        }
    }

    const handleRemovePurity = (purity) => {
        setProfile(prev => ({ ...prev, purities: prev.purities.filter(p => p !== purity) }))
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${VITE_API_BASE_KEY}/auth/me`, { headers: header })
            if (res.data && res.data.data.user) {
                setProfile(prev => ({
                    ...prev,
                    shopName: res.data.data.user.shopName || '',
                    name: res.data.data.user.name || '',
                    email: res.data.data.user.email || '',
                    phone: res.data.data.user.phone || '',
                    itemNames: res.data.data.user.itemNames || [],
                    purities: res.data.data.user.purities || []
                }))
            }
        } catch (err) {
            showMessage('error', 'Failed to load profile details')
        }
        setLoading(false)
    }

    const showMessage = (type, text) => {
        showToast(text, type === 'success' ? 'success' : 'danger')
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
                itemNames: profile.itemNames,
                purities: profile.purities,
            }
            if (profile.password) {
                payload.password = profile.password
            }

            const res = await axios.patch(`${VITE_API_BASE_KEY}/auth/shopkeeper/setting`, payload, { headers: header })
            showMessage('success', res.data.message || 'Profile successfully calibrated')
            setProfile(prev => ({ ...prev, password: '', confirmPassword: '' }))
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to update preferences')
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex flex-col h-[70vh] items-center justify-center space-y-4 opacity-50">
                <div className='w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin'></div>
                <p className="text-xs uppercase font-black tracking-widest">Accessing Settings...</p>
            </div>
        )
    }

    return (
        <div className='max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-500'>

            <SectionHeader
                title="Account Settings"
                subtitle="Calibrate your business identity, personal profile, and secure credentials"
                titleClassName="text-3xl font-black bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent tracking-tight"
            />


            <form onSubmit={handleSave} className='space-y-10'>
                <ShopInfoSection
                    shopName={profile.shopName}
                    handleChange={handleChange}
                />

                <PersonalInfoSection
                    profile={profile}
                    handleChange={handleChange}
                />

                <SecuritySection
                    password={profile.password}
                    confirmPassword={profile.confirmPassword}
                    handleChange={handleChange}
                />

                <CustomOptionsSection
                    itemNames={profile.itemNames}
                    newItemName={newItemName}
                    setNewItemName={setNewItemName}
                    handleAddItemName={handleAddItemName}
                    handleRemoveItemName={handleRemoveItemName}
                    purities={profile.purities}
                    newPurity={newPurity}
                    setNewPurity={setNewPurity}
                    handleAddPurity={handleAddPurity}
                    handleRemovePurity={handleRemovePurity}
                />

                <div className='flex justify-end pt-4 sticky bottom-8 z-20'>
                    <button
                        type="submit"
                        disabled={saving}
                        className='bg-amber-400 hover:bg-amber-500 text-black font-black px-10 py-4 rounded-2xl shadow-2xl shadow-amber-400/30 flex items-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.05] active:scale-95 uppercase tracking-widest text-xs'
                    >
                        <Save className='w-4 h-4' />
                        {saving ? 'Saving System Preferences...' : 'Apply All Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export { Settings }