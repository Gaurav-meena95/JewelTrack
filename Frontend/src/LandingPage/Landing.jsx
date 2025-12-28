import React, { useState } from 'react'
import { ArrowRight, Gem } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { motion, useScroll } from 'motion/react';

const Landing = () => {

    const [currentslide, setcurrent] = useState(0)
    const jewelryShowcase = [
        {
            image: 'https://images.unsplash.com/photo-1758995116142-c626a962a682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY2OTE4MTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Luxury Rings',
        },
        {
            image: 'https://images.unsplash.com/photo-1741071520895-47d81779c11e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlcyUyMGJyYWNlbGV0c3xlbnwxfHx8fDE3NjY5MTgxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Gold Bangles',
        },
        {
            image: 'https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY2hhaW4lMjBuZWNrbGFjZXxlbnwxfHx8fDE3NjY5MTgxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Premium Chains',
        },
    ];
    return (
        <div className='min-h-screen bg-background'>

            {/* header */}
            <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50'>
                <div className='container px-6 py-4 mx-auto flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Gem className='text-[#d2a907] h-7 w-8' />
                        <span className='text-[#d2a907] text-2xl'>Jewel</span> <span className='ml-0 text-2xl text-foreground'>Track</span>
                    </div>
                    <div className='flex items-center gap-4'>
                        <ThemeToggle />
                        <button
                            className='hover:text-[#d2a907]'
                        >
                            login
                        </button>
                        <button className='hover:text-[#d2a907]'>
                            Admin
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero section */}
            <section className=' pt-32 pb-20 px-6 overflow-hidden relative bg-linear-to-r from-[#191818] to-[#2c2601]'>
                <div className='container mx-auto relative z-10 p-5'>
                    <div className='flex items-center justify-center p-5'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >

                            <h1 className='text-6xl mb-6'>
                                Luxury Jewelry meets
                                <br />
                                <span className='text-[#d2a907]'>Smart Management</span>
                            </h1>
                            <p className='text-lg text-muted-foreground mb-8'>Complete SaaS solution for jewelry shops. Manage inventory, track orders, handle girvi (collateral loans) with automated interest calculation, and grow your business.</p>
                            <div className='flex gap-4 flex-wrap'>
                                <button className='bg-amber-400 px-4 py-2 cursor-pointer  shadow-[0_0_20px_var(--gold-glow) hover:bg-amber-500 rounded-2xl flex items-center'>
                                    Browse Jewelry
                                    <ArrowRight className='h-5 w-5 ml-3' />
                                </button>
                                <button className='px-5 bg-[#332c08bd] hover:text-[#d2a907] border border-[#4d370c] rounded-2xl cursor-pointer' >Get Started</button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[500px] rounded-2xl overflow-hidden"
                        >
                            {
                                jewelryShowcase.map((item, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8 }}
                                        key={index} className='flex'>
                                        <img src={item.image} alt="" />

                                        <h1 className='bg-amber-700'>{item.title}</h1>
                                    </motion.div>
                                ))
                            }
                        </motion.div>
                    </div>
                </div >
            </section >
        </div >
    )
}

export { Landing }
