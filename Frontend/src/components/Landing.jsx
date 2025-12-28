import React, { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Clock, Gem, Package } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { motion, useScroll } from 'motion/react';
import { GlassCard } from './GlassCard';

const Landing = () => {
    const [currentslide, setCurrentslide] = useState(0)
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

    const howItWork = [
        {
            icon: Package,
            title: 'Order Jewelry',
            description: 'Browse our premium collection and place orders directly through the platform',
        },
        {
            icon: Clock,
            title: 'Track & Manage',
            description: 'Monitor payments, girvi accounts, and customer interactions in real-time',
        },
        {
            icon: BarChart3,
            title: 'Smart Analytics',
            description: 'Access comprehensive dashboards with revenue reports and business insights',
        },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentslide((prev) => (prev += 1) % jewelryShowcase.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [])

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
            <section className=' pt-32 pb-20 px-2 overflow-hidden relative bg-linear-to-r from-[#070707] to-[#1d1801]'>
                <div className='container mx-auto relative z-10 '>
                    <div className='flex items-center justify-center p-1'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className='px-5'
                        >

                            <h1 className='text-6xl mb-10'>
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
                            className="relative h-[500px] w-full rounded-2xl overflow-hidden bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${jewelryShowcase[currentslide].image})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40" />
                            <div className='absolute bottom-4'>
                                <h1 className="relative z-10 text-white text-3xl font-bold p-6">
                                    {jewelryShowcase[currentslide].title}
                                </h1>
                            </div>

                        </motion.div>
                    </div>
                </div >
            </section >
            {/* how it work */}
            <section className='flex justify-center items-center bg-card/20 py-20 px-5'>


                <div className='mx-auto '>
                    <h1 className='text-5xl text-center mb-12'>How It
                        <span className='text-[#d2a907]'>Works</span>
                    </h1>
                    <div>
                        {
                        howItWork.map((step, index) => (
                            <GlassCard key={index} className="p-8 text-center" hover>
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gold-glow)] mb-6">
                                    <step.icon className="h-8 w-8 text-[var(--gold)]" />
                                </div>
                                <h3 className="font-['Playfair_Display'] mb-3">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </GlassCard>
                        ))
                    }
                    </div>
                    
                </div>

            </section>
        </div >
    )
}

export { Landing }
