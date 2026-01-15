import { BarChart3, FileText, Gem, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Users, Wallet } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  // const {user,logout} = useAuth
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'girvi', icon: Wallet, label: 'Girvi' },
    { id: 'bills', icon: FileText, label: 'Bills' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const fetchShopkeeperDetails = async () => {
    try {
      const response = await fetch('')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50'>
        <div className=' flex items-center justify-between py-4  px-6 '>
          <div className=''>
            <div className='flex items-center gap-2'>
              <Gem className='text-[#d2a907] h-7 w-8' />
              <span className='text-[#d2a907] text-2xl'>Jewel Track</span>
            </div>

          </div>
          <div className='flex items-center gap-4 '>

            <div>
              <Link
                to='/login'
                className='hover:text-[#d2a907] hover:bg-[#e6a2046e] px-2 py-1 rounded'
              >
                Shopkeeper
              </Link>
              <p className='text-muted-foreground'></p>
            </div>

            <ThemeToggle />
            <LogOut />
          </div>
        </div>
      </header>

      <aside className={`fixed top-16 bg-card/50 p-5`}>
        <nav className='p-4 space-y-2'>
          {
            menuItems.map((ele, ind) => {
              const Icon = ele.icon
              const label = ele.label
              // const isactive = current == ele.id 
              return (
                <div key={ind} className=''>
                  <div className='flex items-center gap-2 px-2 py-3 hover:bg-accent/50'>
                    <Icon className='h-5 w-5' />
                    <div>
                      {label}
                    </div>
                  </div>

                </div>
              )
            })
          }
        </nav>

      </aside>
    </div>
  )
}

export { Dashboard }
