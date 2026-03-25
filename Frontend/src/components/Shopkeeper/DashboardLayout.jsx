import { BarChart3, FileText, Gem, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingCart, Users, Wallet, X } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import ThemeToggle  from '../ThemeToggle';

const DashboardLayout = () => {


  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  // const {user,logout} = useAuth
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const pathSegment = location.pathname.split('/').filter(Boolean).pop();
  const currentPage = pathSegment || 'dashboard';
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
  const userData = localStorage.getItem('user')
  if (!userData) {
    navigate('/login')
    return null
  }
  const {name,shopName} = JSON.parse(userData)

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
        fixed top-16 left-0 bottom-0 z-30 flex flex-col
        bg-card/60 backdrop-blur-xl border-r border-border/50
        transition-all duration-300 shadow-2xl lg:shadow-none
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className='flex-1 overflow-y-auto py-6 px-4 custom-scrollbar'>
          <nav className='space-y-1.5'>
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
                    }}
                    className={`
                      relative w-full flex items-center gap-3 px-4 py-3 
                      transition-all duration-300 rounded group overflow-hidden tracking-wide
                      ${isActive
                          ? 'bg-gradient-to-r from-amber-400/10 to-transparent text-amber-500 font-semibold border border-amber-400/20 shadow-sm'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1'
                        }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-md"></div>
                    )}
                    <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110 group-hover:text-amber-400'}`} />
                    <span className="truncate">{ele.label}</span>
                  </button>
                )
              })
            }
          </nav>
        </div>
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
