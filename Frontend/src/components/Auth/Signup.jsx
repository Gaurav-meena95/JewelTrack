import React from 'react'
import { ArrowLeft, Gem } from 'lucide-react'
import { motion } from 'motion/react'
import ThemeToggle from '../ThemeToggle'

const Signup = () => {
    return (

        <div className='min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden'>
            {/* <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, var(--gold-glow) 0%, transparent 70%)',
                }}
            /> */}

            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <button
                onClick={() => onNavigate('shopkeeper-login')}
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-[var(--gold)] transition-colors"
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
                <form className='mt-10'>
                    <div className='space-y2 my-3'>
                        <label htmlFor="ShopName">Shop Name</label>
                        <input type="text"
                            id='ShopName'
                            placeholder="Luxury Jewels"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="yourName">Your Name</label>
                        <input type="text"
                            id='yourName'
                            placeholder="Gaurav Meena"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text"
                            id='phoneNumber'
                            placeholder="+91 9849408389"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="email">Email</label>
                        <input type="text"
                            id='email'
                            placeholder="jhon@email.com"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="Password">Password</label>
                        <input type="text"
                            id='Password'
                            placeholder="•••••••••"
                            className='p-2 rounded-[5px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />

                    </div>
                    <div className='space-y2 my-3'>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="text"
                            id='confirmPassword'
                            placeholder="•••••••••"
                            className='p-2 rounded-[8px] w-full bg-input/90 mt-1 backdrop-blur-sm border border-border/80 focus:border-[#513b01] focus:ring-amber-500 transition-all'
                        />
                    </div>
                    <div className='space-y2 my-5 text-center'>
                        <button className='w-full p-2 rounded-[8px] bg-[#eab71eec]'>Create Shop Account</button>
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
