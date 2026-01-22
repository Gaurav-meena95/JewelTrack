import { IndianRupee, Package, ShoppingCart, Wallet } from 'lucide-react';
import React, { useState } from 'react'
import { GlassCard } from '../../GlassCard';

import { delay, motion } from 'motion/react';

const Dashboard = () => {
  const [loading,setLoading] = useState(false)

  const {_id} = JSON.parse(localStorage.getItem('user'))

  const fetchingShopkeeperData = ()=>{
    setLoading(true)
    // const response = fetch('http://localhost:3000/api/')

  }
  // fetchingShopkeeperData()

  const stats = [
    {
      title: 'Monthly Revenue',
      value: '₹4,52,000',
      change: '+12.5%',
      trend: 'up',
      icon: IndianRupee,
      highlight: true,
    },
    {
      title: 'Jewelry in Stock',
      value: '248',
      change: '-5',
      trend: 'down',
      icon: Package,
    },
    {
      title: 'Jewelry Sold',
      value: '32',
      change: '+8',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Active Girvi',
      value: '18',
      change: '+3',
      trend: 'up',
      icon: Wallet,
    },
  ];



  return (
    <div className='p-3 space-y-6'>
      {/* header */}
      <div className=''>
        <h1>Welcome Back</h1>
        <p>Here's what's happening with your jewelry business today</p>
      </div>

      {/* overView */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, indx) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={indx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: indx * 0.1 }}
            >
              <div className=' space-y-2 backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl transition-all duration-300 hover:translate-y-1 p-8'>
                  <Icon className="h-8 w-8 bg-accent/60 p-2 rounded" />
                <h3 className="text-muted-foreground text-sm mb-1">
                  {stat.title}
                </h3>

                <p className='text-2xl'>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

export { Dashboard }
