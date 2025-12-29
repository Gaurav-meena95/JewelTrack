import React, { useEffect, useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Gem } from 'lucide-react'
import { motion } from 'motion/react'
import ThemeToggle from '../ThemeToggle'

const Signup = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setshowPassword] = useState(false)
    const [confiemshowPassword, setconfiemshowPassword] = useState(false)

    const backend = 'http://localhost:3000/api'
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
            const res = await fetch(`${backend}/auth/signup`, {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: { ...formdata }
            })
            const data = await res.json()
            console.log(data)
            setLoading(false)

        } catch (error) {

        }
    }



    return (

        <div className='min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden'>

            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <button
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-[#c8b11c] transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
                Back to Login
            </button>
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
                </form>
                <div className='mt-5 text-center'>
                    <span className='text-muted-foreground'>Already have an account? </span>
                    <button className='text-[#e7ba35] cursor-pointer hover:underline'>Sign In</button>
                </div>


            </motion.div>


        </div>
    )
}

export default Signup
