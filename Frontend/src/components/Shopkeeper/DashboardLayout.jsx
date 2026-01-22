import { BarChart3, FileText, Gem, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingCart, Users, Wallet, X } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { useNavigate, Outlet } from 'react-router-dom';

const DashboardLayout = () => {


  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  // const {user,logout} = useAuth
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrntpage] = useState('dashboard')
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
  //get user details form loacalStorage 
  const {name,shopName} = JSON.parse(localStorage.getItem('user'))

const handelLogout = ()=>{
    navigate('/login')
  }

  return (
    <div>
      <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50'>
        <div className=' flex items-center justify-between py-1  px-6 '>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden"
            >
              {mobileSidebarOpen ? <X /> : <Menu />}
            </button>
            <div className='hidden lg:flex items-center gap-2'>
              <Gem className='text-[#d2a907] h-5 w-6' />
              <span className='text-[#d2a907] text-xl'> Jewel Track</span>
            </div>
            <div className="lg:hidden">
              <h2 className="capitalize">{currentPage}</h2>
            </div>

          </div>
          <div className='flex items-center gap-4 '>
            <div className="text-right hidden md:block">
              <p className="text-sm">{name}</p>
              <p className="text-xs text-muted-foreground">{shopName}</p>
            </div>

            <ThemeToggle />
            <LogOut onClick={handelLogout} className='h-8 w-8 hover:bg-accent/40 cursor-pointer p-1  rounded ' />
          </div>
        </div>
      </header>

      <aside className={`
      fixed top-16 left-0 bottom-0 z-30
          bg-card/40 backdrop-blur-md border-r border-border/50
          transition-all duration-300
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
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
                    <span className="truncate">{ele.label}</span>
                </button>
              )
            })
          }
        </nav>

      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <main className={`
          pt-16 min-h-screen
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}>
        <div className='p-6'>
        <Outlet />
        </div>
      </main>
    </div>
  )
}

export { DashboardLayout }
