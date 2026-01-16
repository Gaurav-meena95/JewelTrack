import { BarChart3, FileText, Gem, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Users, Wallet } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { useNavigate ,Outlet} from 'react-router-dom';

const DashboardLayout = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  // const {user,logout} = useAuth
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage , setCurrntpage] = useState('dashboard')
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'colletral', icon: Wallet, label: 'Colletral' },
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

      <aside className={`
      fixed top-16 left-0 bottom-0 z-30 bg-card/40 backdrop-blur-md 
          border-r border-border/50 transition-all duration-300
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0
        `}>
        <nav className='p-4 space-y-2'>
          {
            menuItems.map((ele, ind) => {
              const Icon = ele.icon
              const isActive = ele.id === currentPage;
              return (
                 <button

                key={ele.id}
                onClick={() => {
                  navigate(`/dashboard/${ele.id}`)
                  setMobileSidebarOpen(false)
                  setCurrntpage(ele.id);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 
                  transition-all duration-200 rounded-2xl
                  ${isActive 
                    ? 'bg-[#c7a003a2] text-[#f8cf71] shadow-2xl' 
                    : 'hover:bg-accent/30 text-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">{ele.label}</span>
                )}
              </button>
              )
            })
          }
        </nav>

      </aside>
       <main className="fixed ml-64 mt-16 p-6 w-full">
        <Outlet />
      </main>
    </div>
  )
}

export { DashboardLayout }
