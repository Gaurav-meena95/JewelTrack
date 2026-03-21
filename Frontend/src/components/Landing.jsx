import React, { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Calculator, Clock, Gem, IndianRupee, Package, Shield, TrendingUp, Users } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { GlassCard } from './GlassCard'
import { Link, useNavigate } from 'react-router-dom'

const Landing = () => {
    const [currentslide, setCurrentslide] = useState(0)

    const navigate = useNavigate()
    
    // Changed to B2B SaaS features instead of jewelry items
    const coreModules = [
        {
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjdXN0b21lcnN8ZW58MXx8fHw&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Customer Directory',
            desc: 'Maintain all your customer details in one secure digital vault.'
        },
        {
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWxsaW5nfGVufDF8fHx8&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Digital Billing',
            desc: 'Generate precise invoices with making charges and GST automatically calculated.'
        },
        {
            image: 'https://i.ytimg.com/vi/yyUDIRchXT0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBV6g1dF0ycw-gjwJkkxUFWnPP-Mw',
            title: 'Girvi Management',
            desc: 'Track collateral loans, calculate interest, and manage payment history seamlessly.'
        },
    ];

    const howItWork = [
        {
            icon: Users,
            title: 'Onboard Customers',
            description: 'Quickly register walk-in customers and maintain their history digitally.',
        },
        {
            icon: Calculator,
            title: 'Digitize Operations',
            description: 'Manage Bills, Custom Orders, and Girvi all from a single streamlined dashboard.',
        },
        {
            icon: BarChart3,
            title: 'Grow Your Shop',
            description: 'Gain insights into your top customers, inventory value, and daily revenue.',
        },
    ]

    const featured = [
        { icon: Calculator, title: 'Girvi Calculator', desc: 'Automated interest calculation' },
        { icon: Package, title: 'Inventory Tracking', desc: 'Real-time stock management' },
        { icon: TrendingUp, title: 'Order Tracking', desc: 'Track custom jewelry orders' },
        { icon: Shield, title: 'Secure Data', desc: 'Your shop data is safely stored' },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentslide((prev) => (prev + 1) % coreModules.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [coreModules.length])

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
                        <Link
                            to='/login'
                            className='hover:text-[#d2a907] hover:bg-[#e6a2046e] px-2 py-1 rounded'
                        >
                            Shopkeeper login
                        </Link>
                        <Link to='/admin' className='hover:text-[#d2a907] hover:bg-[#e6a2046e] px-2 py-1 rounded'>
                            Admin
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero section */}
            <section className='pt-32 pb-20 overflow-hidden relative bg-linear-to-r from-[#070707] to-[#1d1801]'>
                <div className='container mx-auto relative z-10'>
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-10 px-5'>
                        <div className='lg:w-1/2'>
                            <h1 className='text-5xl md:text-6xl mb-6 font-bold text-white'>
                                Smart Management for
                                <br />
                                <span className='text-[#d2a907]'>Modern Jewelry Shops</span>
                            </h1>
                            <p className='text-lg text-gray-300 mb-8'>The complete SaaS solution to digitize your jewelry business. Manage customer relationships, track inventory, handle Girvi (collateral loans), and generate bills with automated calculations.</p>
                            <div className='flex gap-4 flex-wrap'>
                                <button onClick={() => navigate('/login')} className='bg-amber-400 text-black px-6 py-3 cursor-pointer shadow-[0_0_20px_var(--gold-glow)] hover:bg-amber-500 rounded-2xl flex items-center font-medium'>
                                    Start Managing Now
                                    <ArrowRight className='h-5 w-5 ml-2' />
                                </button>
                                <button className='px-6 py-3 bg-[#332c08bd] text-white hover:text-[#d2a907] border border-[#4d370c] rounded-2xl cursor-pointer'>
                                    Explore Features
                                </button>
                            </div>
                        </div>
                        <div className="relative h-[500px] w-full lg:w-1/2 rounded-2xl overflow-hidden bg-cover bg-center transition-all duration-500"
                            style={{
                                backgroundImage: `url(${coreModules[currentslide].image})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-black/50" />
                            <div className='absolute bottom-6 left-6'>
                                <h2 className="relative z-10 text-amber-400 text-3xl font-bold mb-2">
                                    {coreModules[currentslide].title}
                                </h2>
                                <p className="relative z-10 text-white text-lg max-w-md">
                                    {coreModules[currentslide].desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* how it work */}
            <section className='bg-card/20 py-20'>
                <div className='container mx-auto px-6'>
                    <h1 className='text-4xl md:text-5xl text-center mb-12'>How It
                        <span className='text-[#d2a907] pl-4'>Works</span>
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {
                            howItWork.map((step, index) => (
                                <GlassCard key={index} className="p-8 text-center flex flex-col items-center" hover>
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4e4203] mb-6">
                                        <step.icon className="h-10 w-10 text-[#cfb806]" />
                                    </div>
                                    <h3 className="text-xl mb-3 text-foreground">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </GlassCard>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Core Modules Collection */}
            <section className='py-20 px-6'>
                <div className='container mx-auto'>
                    <h1 className='text-4xl md:text-5xl text-center mb-12'>Core
                        <span className='text-[#d2a907] pl-4'>Modules</span>
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                        {
                            coreModules.map((item, index) => (
                                <GlassCard key={index} className='overflow-hidden border border-border/50' hover>
                                    <div className='h-56 overflow-hidden'>
                                        <img className='w-full h-full object-cover transition-transform duration-500 hover:scale-110' src={item.image} alt={item.title} />
                                    </div>
                                    <div className='p-6 text-center'>
                                        <h2 className='text-2xl mb-3 text-foreground'>{item.title}</h2>
                                        <p className='text-muted-foreground mb-6 h-12'>{item.desc}</p>
                                        <button onClick={() => navigate('/login')} className='w-full py-3 rounded bg-amber-400/20 text-[#c8b401] hover:bg-amber-400/30 transition-colors font-medium border border-[#c8b401]/30'>
                                            Explore Module
                                        </button>
                                    </div>
                                </GlassCard>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Features Highlight */}
            <section className='bg-card/20 py-20 bg-linear-to-l from-[#171717] to-[#090700] border-y border-border/30'>
                <div className='container mx-auto px-6'>
                    <h1 className='text-4xl md:text-5xl text-center mb-12'>Powerful
                        <span className='text-[#d2a907] pl-4'>Features</span>
                    </h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
                        {
                            featured.map((feature, index) => (
                                <GlassCard key={index} className="p-8 text-center border border-border/50" hover>
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/10 mx-auto mb-6">
                                        <feature.icon className="h-8 w-8 text-[#d2a907]" />
                                    </div>
                                    <h3 className="text-xl mb-3 text-white">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </GlassCard>
                            ))
                        }
                    </div>
                </div>
            </section>

            <footer className='py-12 px-6 border-t border-border/70 mx-auto'>
                <div className='flex flex-col items-center justify-center gap-6'>
                    <div className='flex items-center gap-2'>
                        <Gem className='text-[#d2a907] h-8 w-8' />
                        <span className='text-[#d2a907] text-2xl font-semibold'>Jewel</span>
                        <span className='text-foreground text-2xl font-semibold'>Track</span>
                    </div>
                    <p className='text-muted-foreground text-lg text-center'>The Ultimate SaaS Platform for Modern Jewelry Shops.</p>
                    <div className='flex gap-8 mt-4'>
                        <Link to='/login' className='text-muted-foreground hover:text-[#d2a907] transition-colors'>Shopkeeper Login</Link>
                        <Link to='/admin' className='text-muted-foreground hover:text-[#d2a907] transition-colors'>Admin Login</Link>
                        <span className='text-muted-foreground hover:text-[#d2a907] cursor-pointer transition-colors'>Contact Support</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export { Landing }
