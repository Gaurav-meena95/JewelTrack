import React, { useEffect, useState } from 'react'
import { ArrowLeft, ClockFading, Eye, EyeOff, Gem } from 'lucide-react'
import { motion } from 'motion/react'
import ThemeToggle from '../ThemeToggle'
import {Link, useNavigate} from 'react-router-dom'

const Signup = () => {
    const negivate = useNavigate()
    const [role,setRole] = useState('shopkeeper')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setshowPassword] = useState(false)
    const [confiemshowPassword, setconfiemshowPassword] = useState(false)

    // const backend = 'http://localhost:3000/api'
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
        if (formdata.phone.length != 10) {
            setError('Phone number must be exactly 10 digits')
            console.log('Phone number must be exactly 10 digits')
            return
        }
        if (formdata.password != formdata.confirmPassword) {
            setError('Passwords do not match')
            console.log('Passwords do not match')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:3000/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formdata ,role}),
                credentials: 'include'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Signup Failed')
            
            if(data.token) localStorage.setItem('accessToken' ,data.token)
            if(data.refreshToken) localStorage.setItem('refreshToken' ,data.refreshToken)
            if(data.user) localStorage.setItem('user' ,JSON.stringify(data.user))

            console.log(data)
            setLoading(false)
            if(data.user.role === "shopkeeper"){
                negivate('/dashboard')
            }
 
        } catch (error) {
            console.log(error)
            setError(error.message)
        }finally{
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
                className='backdrop-blur-md bg-card/80   border border-border/50 rounded-[2%] p-10'

            >
                <div className='flex items-center  justify-center gap-2'>
                    <Gem className='text-[#d2a907] h-7 w-8' />
                    <span className='text-[#d2a907] text-2xl'>Jewel Track</span>
                </div>
                <div className='text-center mb-2'>
                    <h1 className='text-2xl mb-2'>Create Shop Account</h1>
                    <p className='text-muted-foreground'>Join our premium jewelry management platform</p>
                </div>
                <form onSubmit={handelSubmit} className='mt-5'>
                    <div className='space-y2 my-3'>
                        <label htmlFor="ShopName">Shop Name</label>
                        <input type="text"
                            name='shopName'
                            onChange={handelChange}
                            value={formdata.shopName}
                            id='ShopName'
                            placeholder="Luxury Jewels"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="yourName">Your Name</label>
                        <input type="text"
                            onChange={handelChange}
                            name='name'
                            value={formdata.name}
                            id='yourName'
                            placeholder="Gaurav Meena"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text"
                            onChange={handelChange}
                            name='phone'
                            value={formdata.phone}
                            id='phoneNumber'
                            placeholder="+91 9849408389"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            onChange={handelChange}
                            name='email'
                            value={formdata.email}
                            id='email'
                            placeholder="jhon@email.com"
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
                    <div className="space-y-2 my-3">
                        <label htmlFor="confirmPassword">Confirm Password</label>

                        <div className="relative">
                            <input
                                type={confiemshowPassword ? "text" : "password"}
                                onChange={handelChange}
                                name="confirmPassword"
                                value={formdata.confirmPassword}
                                id="confirmPassword"
                                placeholder="•••••••••"
                                className="p-2 pr-10 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm 
                                border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all"
                            />

                            <button
                                type="button"
                                onClick={() => setconfiemshowPassword(!confiemshowPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                            >
                                {confiemshowPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className='space-y2 my-5 text-center'>
                        <button className='w-full p-2 rounded-[8px] bg-[#eab71eec] cursor-pointer'>Create Shop Account</button>
                    </div>
                    <div className='text-red-700'>
                        {error}
                    </div>
                </form>
                <div className='mt-5 text-center'>
                    <span className='text-muted-foreground'>Already have an account? </span>
                    <Link to='/login' className='text-[#e7ba35] cursor-pointer hover:underline'>Sign In</Link>
                </div>


            </motion.div>


        </div>
    )
}

export default Signup
