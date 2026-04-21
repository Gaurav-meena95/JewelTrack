import React, { useEffect, useState } from 'react'
import { ArrowLeft, ClockFading, Eye, EyeOff, Gem } from 'lucide-react'
import { motion } from 'motion/react'
import ThemeToggle from '../ThemeToggle'
import { Link, useNavigate } from 'react-router-dom'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../utils/apiConfig'
import axios from 'axios'

const Signup = () => {
    const header = getAuthHeaders()
    const navigate = useNavigate()
    const [role, setRole] = useState('shopkeeper')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setshowPassword] = useState(false)
    const [confiemshowPassword, setconfiemshowPassword] = useState(false)

    const [formdata, setFormdata] = useState({
        shopName: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handelChange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value })
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formdata.phone.length !== 10) {
            return setError('Phone number must be exactly 10 digits')
        }
        if (formdata.password !== formdata.confirmPassword) {
            return setError('Passwords do not match')
        }

        setLoading(true)
        try {
            const res = await axios.post(`${VITE_API_BASE_KEY}/auth/signup`, { ...formdata, role }, { headers: header })
            const user = res.data.data.user

            if (res.data.success) {
                // For signup, we usually redirect to login or auto-login
                // If the backend returns tokens, we set them
                if (res.data.data.token) {
                    localStorage.setItem('x-access-token', res.data.data.token)
                    localStorage.setItem('user', JSON.stringify(user))

                    if (user.role === 'admin') navigate('/admin-dashboard')
                    else navigate('/dashboard')
                } else {
                    navigate('/login')
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden'>
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <Link
                to='/login'
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-[#c8b11c] transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
                Back to Login
            </Link>

            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className='backdrop-blur-md bg-card/80 border border-border/50 rounded-3xl p-10 max-w-md w-full shadow-2xl'
            >
                <div className='flex items-center justify-center gap-2 mb-6'>
                    <Gem className='text-[#d2a907] h-8 w-8' />
                    <span className='text-[#d2a907] text-3xl font-bold'>Jewel Track</span>
                </div>

                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-bold mb-2'>Create Account</h1>
                    <p className='text-muted-foreground text-sm'>Join our premium jewelry management platform</p>
                </div>

                {/* Role Selection Toggle */}
                <div className="flex bg-secondary/50 p-1 rounded mb-8 border border-border/50">
                    <button
                        type="button"
                        onClick={() => setRole('shopkeeper')}
                        className={`flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${role === 'shopkeeper' ? 'bg-amber-400 text-black shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Shopkeeper
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`flex-1 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-amber-400 text-black shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Administrator
                    </button>
                </div>

                <form onSubmit={handelSubmit} className='space-y-4'>
                    {role === 'shopkeeper' && (
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold uppercase text-muted-foreground ml-1'>Shop Name</label>
                            <input
                                type="text"
                                name='shopName'
                                required
                                onChange={handelChange}
                                value={formdata.shopName}
                                placeholder="Luxury Jewels"
                                className='w-full p-3 rounded bg-input border border-border focus:border-amber-400/50 outline-none transition-all text-sm'
                            />
                        </div>
                    )}

                    <div className='space-y-1.5'>
                        <label className='text-xs font-bold uppercase text-muted-foreground ml-1'>Full Name</label>
                        <input
                            type="text"
                            name='name'
                            required
                            onChange={handelChange}
                            value={formdata.name}
                            placeholder="John Doe"
                            className='w-full p-3 rounded bg-input border border-border focus:border-amber-400/50 outline-none transition-all text-sm'
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold uppercase text-muted-foreground ml-1'>Phone</label>
                            <input
                                type="text"
                                name='phone'
                                required
                                maxLength={10}
                                onChange={handelChange}
                                value={formdata.phone}
                                placeholder="9876543210"
                                className='w-full p-3 rounded bg-input border border-border focus:border-amber-400/50 outline-none transition-all text-sm'
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold uppercase text-muted-foreground ml-1'>Email</label>
                            <input
                                type="email"
                                name='email'
                                required
                                onChange={handelChange}
                                value={formdata.email}
                                placeholder="john@example.com"
                                className='w-full p-3 rounded bg-input border border-border focus:border-amber-400/50 outline-none transition-all text-sm'
                            />
                        </div>
                    </div>

                    <div className='space-y-1.5'>
                        <label className='text-xs font-bold uppercase text-muted-foreground ml-1'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : 'password'}
                                name='password'
                                required
                                onChange={handelChange}
                                value={formdata.password}
                                placeholder="•••••••••"
                                className='w-full p-3 rounded bg-input border border-border focus:border-amber-400/50 outline-none transition-all text-sm pr-10'
                            />
                            <button
                                type="button"
                                onClick={() => setshowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-400 transition-colors'
                            >
                                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className='space-y-1.5'>
                        <label className='text-xs font-bold uppercase text-muted-foreground ml-1'>Confirm Password</label>
                        <div className='relative'>
                            <input
                                type={confiemshowPassword ? "text" : 'password'}
                                name='confirmPassword'
                                required
                                onChange={handelChange}
                                value={formdata.confirmPassword}
                                placeholder="•••••••••"
                                className='w-full p-3 rounded bg-input border border-border focus:border-amber-400/50 outline-none transition-all text-sm pr-10'
                            />
                            <button
                                type="button"
                                onClick={() => setconfiemshowPassword(!confiemshowPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-400 transition-colors'
                            >
                                {confiemshowPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className='text-rose-500 text-xs font-bold bg-rose-500/10 p-3 rounded border border-rose-500/20'>{error}</div>}

                    <button
                        disabled={loading}
                        className='w-full p-4 bg-amber-400 hover:bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 mt-6'
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div className='mt-8 text-center'>
                    <span className='text-muted-foreground text-sm'>Already have an account? </span>
                    <Link to='/login' className='text-amber-400 font-bold hover:underline ml-1'>Sign In</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup
