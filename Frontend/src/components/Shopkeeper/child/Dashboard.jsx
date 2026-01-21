import { IndianRupee, Package, ShoppingCart, Wallet } from 'lucide-react';
import React from 'react'
import { GlassCard } from '../../GlassCard';

import { delay, motion } from 'motion/react';

const Dashboard = () => {

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
              <div className=' p-5 backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl transition-all duration-300 hover:translate-y-1'>

                  <Icon className={`h-6 w-6 text-foreground bg-accent/50 p-3 rounded-lg`} />


                <h3 className="text-muted-foreground text-sm mb-1">
                  {stat.title}
                </h3>

                <p>
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
