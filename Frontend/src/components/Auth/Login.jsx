import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'
import { ArrowLeft, Eye, EyeOff, Gem } from 'lucide-react'
import { motion } from 'motion/react'

const Login = () => {
    const negivate = useNavigate()
    const [role, setRole] = useState('shopkeeper')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setshowPassword] = useState(false)


    // const backend = 'http://localhost:3000/api'
    const [formdata, setFormdata] = useState({
        email: '',
        password: ''
    })

    const handelChange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value })
    }
    const handelSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:3000/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formdata, role }),
                credentials: 'include'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Signup Failed')

            if (data.token) localStorage.setItem('x-access-token', data.token)
            if (data.refreshToken) localStorage.setItem('x-refresh-token', data.refreshToken)
            if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
            setLoading(false)
            if (data.user.role === 'shopkeeper') negivate('/dashboard')




        } catch (error) {
            console.log(error)
            setError(error.message)
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
                to='/'
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-[#c8b11c] transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
            </Link>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className='backdrop-blur-md bg-card/80   border border-border/50 rounded-[2%] p-10'

            >
                <div className='flex items-center  justify-center gap-2 mb-5'>
                    <Gem className='text-[#d2a907] h-7 w-8' />
                    <span className='text-[#d2a907] text-3xl'>Jewel Track</span>
                </div>
                <div className='text-center mb-2'>
                    <h1 className='text-2xl mb-2'>Shopkeeper Login</h1>
                    <p className='text-muted-foreground'>Welcome back! Please enter your credentials</p>
                </div>
                <form onSubmit={handelSubmit} className='mt-5'>
                    <div className='space-y2 my-3'>
                        <label htmlFor="phoneNumber">Phone or Email</label>
                        <input type="text"
                            onChange={handelChange}
                            name='identifier'
                            value={formdata.phone}
                            id='phoneNumber'
                            placeholder="Email or Phone"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="Password">Password</label>
                        <div className='relative'>
                            <input type={showPassword ? "text" : 'password'}

                                onChange={handelChange}
                                name='password'
                                value={formdata.password}
                                id='Password'
                                placeholder="•••••••••"
                                className='p-2 pr-10 rounded-[5px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                            />
                            <button
                                onClick={() => setshowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer'>
                                {showPassword ?
                                    <Eye size={18} /> :
                                    <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className='space-y2 my-5 text-center'>
                        <button onClick={() => setRole('shopkeeper')} className='w-full p-2 rounded-[8px] bg-[#eab71eec] cursor-pointer'>{loading ? 'Signing in... ':" Sign In"}</button>
                    </div>
                    <div className='text-red-800'>
                        {error}
                    </div>
                </form>
                <div className='mt-5 text-center'>
                    <span className='text-muted-foreground'>Don't have an account? </span>
                    <Link to='/signup' className='text-[#e7ba35] cursor-pointer hover:underline'>Create Shop Account</Link>
                </div>


            </motion.div>


        </div>
    )
}

export { Login }
