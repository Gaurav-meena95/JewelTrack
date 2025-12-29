import React, { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Calculator, Clock, Gem, IndianRupee, Package, Shield, TrendingUp } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { motion, useScroll } from 'motion/react';
import { GlassCard } from './GlassCard';

const Landing = () => {
    const [currentslide, setCurrentslide] = useState(0)
    const jewelryShowcase = [
        {
            image: 'https://images.unsplash.com/photo-1758995116142-c626a962a682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY2OTE4MTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Luxury Rings',
            price: 124345
        },
        {
            image: 'https://images.unsplash.com/photo-1741071520895-47d81779c11e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlcyUyMGJyYWNlbGV0c3xlbnwxfHx8fDE3NjY5MTgxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Gold Bangles',
            price: 124345
        },
        {
            image: 'https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY2hhaW4lMjBuZWNrbGFjZXxlbnwxfHx8fDE3NjY5MTgxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Premium Chains',
            price: 124345
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

    const featured = [
        { icon: Calculator, title: 'Girvi Interest Calculator', desc: 'Automated calculations' },
        { icon: TrendingUp, title: 'Order Tracking', desc: 'Real-time status updates' },
        { icon: BarChart3, title: 'Revenue Dashboard', desc: 'Monthly insights' },
        { icon: Shield, title: 'Payment Links', desc: 'Secure customer payments' },
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
                            className='hover:text-[#d2a907] hover:bg-[#e6a2046e] px-2 py-1 rounded'
                        >
                            Shopkeeper login
                        </button>
                        <button className='hover:text-[#d2a907] hover:bg-[#e6a2046e] px-2 py-1 rounded'>
                            Admin
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero section */}
            <section className=' pt-32 pb-20  overflow-hidden relative bg-linear-to-r from-[#070707] to-[#1d1801]'>
                <div className='container mx-auto relative z-10 '>
                    <div className='flex items-center justify-center '>
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
            <section className='bg-card/20 py-20'>

                <div className=' container mx-auto '>
                    <h1 className='text-5xl text-center mb-12'>How It
                        <span className='text-[#d2a907] pl-4'>Works</span>
                    </h1>
                    <div className='flex items-center justify-center'>
                        {
                            howItWork.map((step, index) => (
                                <GlassCard key={index} className=" p-8 text-center items-center m-5" hover>
                                    <div className="inline-flex items-center justify-center  w-16 h-16 rounded-full bg-[#4e4203] mb-6">
                                        <step.icon className="h-8 w-8 text-[#cfb806]" />
                                    </div>
                                    <h3 className="font-['Playfair_Display'] mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </GlassCard>
                            ))
                        }
                    </div>

                </div>

            </section>

            {/* Featured Collection */}
            <section className=' py-20  px-6'>
                <div className='container mx-auto'>
                    <div>
                        <h1 className='text-5xl text-center mb-12'>Featured
                            <span className='text-[#d2a907] pl-4'>Collection</span>
                        </h1>
                    </div>
                    <div className='flex items-center justify-center mx-auto'>
                        {
                            jewelryShowcase.map((items, index) => (
                                <GlassCard className='  m-5' hover>
                                    <div id={index} className='h-60 overflow-hidden'>
                                        <img className='w-full object-cover transition-transform duration-500 hover:scale-110 rounded-2xl' src={items.image} />

                                    </div>
                                    <div className='p-5'>
                                        <div className='pb-3'>
                                            <h2 className='text-xl py-3'>{items.title}</h2>
                                            <div className='flex items-center'>
                                                < IndianRupee className='text-[#dcbc21] h-4 w-4' /><p className='text-[#dcbc21]  '>{items.price}</p>
                                            </div>
                                        </div>
                                        <button className=' w-full p-1 rounded bg-[#c8b401]'>Order now</button>
                                    </div>
                                </GlassCard>

                            ))

                        }
                    </div>


                </div>
            </section>

            {/* Features Highlight */}
            <section className='bg-card/20 py-20 bg-linear-to-l from-[#171717] to-[#090700]'>
                <div className='container mx-auto '>
                    <h1 className='text-5xl text-center mb-12'>Powerful
                        <span className='text-[#d2a907] pl-4'>Features</span>
                    </h1>
                    <div className='flex items-center justify-center'>
                        {
                            featured.map((features, index) => (
                                <GlassCard key={index} className="p-6 w-full m-2" hover>
                                    <div className="flex items-center justify-center  w-16 h-16  mb-6">
                                        <features.icon className="h-8 w-8 text-[#cfb806]" />
                                    </div>
                                    <h3 className="mb-3">{features.title}</h3>
                                    <p className="text-muted-foreground text-sm">{features.desc}</p>
                                </GlassCard>
                            ))
                        }
                    </div>

                </div>
            </section>

            <footer className='py-12 px-6 border-t border-border/70 mx-auto'>
                <div className='flex items-center  justify-center gap-2'>
                    <Gem className='text-[#d2a907] h-7 w-8' />
                    <span className='text-[#d2a907] text-2xl'>Jewel Track</span>
                </div>
                <div className='text-center my-3'>
                    <p>Premium Jewelry Management SaaS</p>
                </div>
                <div className='flex justify-center items-center gap-5 cursor-pointer '>
                    <button className='hover:text-[#edd104]'>Shopkeeper Login</button>
                    <button className='hover:text-[#edd104]'>Admin Login</button>
                    <button className='hover:text-[#edd104]'>Contact</button>

                </div>
            </footer>
        </div >
    )
}

export { Landing }
