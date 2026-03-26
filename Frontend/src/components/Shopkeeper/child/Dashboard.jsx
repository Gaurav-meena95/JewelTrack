import React, { useState, useEffect } from 'react';
import { IndianRupee, Package, ShoppingCart, Wallet, Users, Activity, Clock, ArrowRight, Plus, Box, ShieldCheck, AlertCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';

const Dashboard = () => {
  const navigate = useNavigate();
  const header = getAuthHeaders();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dashboard State
  const [data, setData] = useState({
    customers: [],
    bills: [],
    orders: [],
    collaterals: [],
    inventory: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoints = [
        axios.get(`${VITE_API_BASE_KEY}/customers/register/get`, { headers: header }),
        axios.get(`${VITE_API_BASE_KEY}/customers/bills/me`, { headers: header }),
        axios.get(`${VITE_API_BASE_KEY}/customers/orders/me`, { headers: header }),
        axios.get(`${VITE_API_BASE_KEY}/customers/collatral/me`, { headers: header }),
        axios.get(`${VITE_API_BASE_KEY}/shops/inventory/me`, { headers: header })
      ];

      const results = await Promise.allSettled(endpoints);

      const [customersRes, billsRes, ordersRes, collateralsRes, inventoryRes] = results;

      // Aggregating results, falling back to empty arrays if failure
      const customersRaw = customersRes.status === 'fulfilled' ? (customersRes.value.data.customer || []) : [];
      const customers = Array.isArray(customersRaw) ? customersRaw : [customersRaw];

      const bills = billsRes.status === 'fulfilled' ? (billsRes.value.data.data || billsRes.value.data.bills || []) : [];      
      const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data.data || ordersRes.value.data.orders || []) : [];
      const collaterals = collateralsRes.status === 'fulfilled' ? (collateralsRes.value.data.data || collateralsRes.value.data.collaterals || []) : [];
      const inventory = inventoryRes.status === 'fulfilled' ? (inventoryRes.value.data.allInventorys || []) : [];

      setData({
        customers,
        bills,
        orders,
        collaterals,
        inventory
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Calculations ---

  // 1. Total Revenue (from bills - Grand Total sum)
  const totalRevenue = data.bills.reduce((sum, bill) => sum + (bill.invoice?.grandTotal || 0), 0);

  // 2. Pending Orders
  const pendingOrdersCount = data.orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'completed').length;

  // 3. Active Collateral
  const activeCollaterals = data.collaterals.filter(c => c.status === 'active');
  const activeCollateralCount = activeCollaterals.length;
  const totalCollateralValue = activeCollaterals.reduce((sum, c) => sum + (c.price || 0), 0);

  // 4. Low Stock Inventory
  const LOW_STOCK_THRESHOLD = 5;
  const lowStockCount = data.inventory.filter(item => (item.quantity || 0) <= LOW_STOCK_THRESHOLD).length;
  const totalInventoryValue = data.inventory.reduce((sum, item) => sum + (item.price || 0), 0);

  // --- Recent Activity Timeline ---
  const extractRecentActivity = () => {
    let activities = [];

    data.bills.forEach(b => {
      console.log('fkjv nfdk',b);
      
      activities.push({
        id: `bill_${b.customerId._id}`,
        type: 'bill',
        title: `Bill generated for ₹${(b.invoice?.grandTotal || 0).toLocaleString('en-IN')}`,
        customer: b.customerId.name || 'Walk-in Customer',
        date: new Date(b.createdAt),
        amount: b.invoice?.grandTotal || 0
      });
    });

    data.orders.forEach(o => {
      activities.push({
        id: `order_${o._id}`,
        type: 'order',
        title: `New order placed`,
        customer: o.customerId?.name || 'Walk-in Customer',
        date: new Date(o.createdAt),
        amount: o.Total || 0
      });
    });

    data.collaterals.forEach(c => {
      activities.push({
        id: `collat_${c._id}`,
        type: 'collateral',
        title: `Collateral loan active`,
        customer: c.customerId?.name || 'Unknown',
        date: new Date(c.createdAt),
        amount: c.price || 0
      });
    });

    return activities.sort((a, b) => b.date - a.date).slice(0, 8);
  };
  const recentActivities = extractRecentActivity();
  console.log('receet',recentActivities);
  

  // Stats Array for Top Cards
  const topStats = [
    { title: 'Total Customers', value: data.customers.length, icon: Users,  color: 'text-amber-500', bg: 'bg-amber-500/10'},
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee,  color: 'text-amber-500', bg: 'bg-amber-500/10'},
    { title: 'Pending Orders', value: pendingOrdersCount, icon: ShoppingCart,  color: 'text-amber-500', bg: 'bg-amber-500/10'},
    { title: 'Active Girvi', value: activeCollateralCount, icon: Wallet,  color: 'text-amber-500', bg: 'bg-amber-500/10'},
    { title: 'Low Stock Items', value: lowStockCount, icon: AlertCircle,  color: 'text-amber-500', bg: 'bg-amber-500/10'},
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading dashboard insights...</p>
      </div>
    );
  }

  return (
    <div className='p-2 md:p-6 space-y-8 animate-in fade-in duration-500'>

      {/* HEADER & QUICK ACTIONS */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent'>Business Overview</h1>
          <p className='text-muted-foreground'>Here's what's happening with your jewelry business today</p>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <button onClick={() => navigate('/dashboard/bills')} className='px-4 py-2 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-medium rounded flex items-center gap-2  shadow-lg shadow-amber-400/20'>
            <Plus className='w-4 h-4' /> Create Bill
          </button>
          <button onClick={() => navigate('/dashboard/orders')} className='px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border/50 rounded flex items-center gap-2 transition-all'>
            <Plus className='w-4 h-4 text-amber-500' /> New Order
          </button>
          <button onClick={() => navigate('/dashboard/colletral')} className='px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border/50 rounded flex items-center gap-2 transition-all'>
            <Plus className='w-4 h-4 text-amber-500' /> Add Girvi
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded text-center">
          {error}
        </div>
      )}

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topStats.map((stat, indx) => {
          const Icon = stat.icon;
          return (
            <div key={indx} className='relative overflow-hidden backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl p-5 shadow-sm '>
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} opacity-20 group-hover:scale-150 transition-transform duration-500 blur-2xl`}></div>
              <div className='flex items-center justify-between mb-4 relative z-10'>
                <div className={`p-2.5 rounded ${stat.bg} ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className='relative z-10'>
                <h3 className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">{stat.title}</h3>
                <p className='text-2xl font-bold truncate' title={String(stat.value)}>{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* DOMAIN OVERVIEWS (Left/Middle - 2 Columns wide) */}
        <div className='col-span-1 lg:col-span-2 space-y-6'>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* ORDERS OVERVIEW */}
            <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='font-semibold flex items-center gap-2'><ShoppingBag className='w-5 h-5 text-amber-500' /> Orders Hub</h3>
                <button onClick={() => navigate('/dashboard/orders')} className='text-xs text-muted-foreground hover:text-amber-400 flex items-center gap-1 transition-colors'>View All <ArrowRight className='w-3 h-3' /></button>
              </div>
              <div className='space-y-4 text-sm'>
                <div className='flex justify-between items-center p-3.5 bg-secondary/30 rounded'>
                  <span className='text-muted-foreground'>Total Orders</span>
                  <span className='font-bold text-lg'>{data.orders.length}</span>
                </div>
                <div className='flex justify-between items-center p-3.5 bg-amber-500/10 border border-amber-500/20 rounded'>
                  <span className='text-amber-400 font-medium'>Pending Deliveries</span>
                  <span className='font-bold text-amber-500 text-lg'>{pendingOrdersCount}</span>
                </div>
                <div className='flex justify-between items-center p-3.5 bg-secondary/30 rounded'>
                  <span className='text-muted-foreground'>Completed</span>
                  <span className='font-bold text-green-500 text-lg'>{data.orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'completed').length}</span>
                </div>
              </div>
            </div>

            {/* COLLATERAL OVERVIEW */}
            <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='font-semibold flex items-center gap-2'><Wallet className='w-5 h-5 text-amber-400' /> Collateral Portfolio</h3>
                <button onClick={() => navigate('/dashboard/colletral')} className='text-xs text-muted-foreground hover:text-amber-400 flex items-center gap-1 transition-colors'>View All <ArrowRight className='w-3 h-3' /></button>
              </div>
              <div className='space-y-4 text-sm'>
                <div className='flex justify-between items-center p-3.5 bg-amber-500/10 border border-amber-500/20 rounded'>
                  <span className='text-amber-500 font-medium'>Active Loans</span>
                  <span className='font-bold text-amber-500 text-lg'>{activeCollateralCount}</span>
                </div>
                <div className='flex justify-between items-center p-3.5 bg-secondary/30 rounded'>
                  <span className='text-muted-foreground'>Total Loan Value</span>
                  <span className='font-bold text-lg'>₹{totalCollateralValue.toLocaleString('en-IN')}</span>
                </div>
                <div className='flex justify-between items-center p-3.5 bg-secondary/30 rounded'>
                  <span className='text-muted-foreground'>Closed Accounts</span>
                  <span className='font-bold text-lg'>{data.collaterals.filter(c => c.status === 'closed').length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* INVENTORY SNAPSHOT */}
          <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='font-semibold flex items-center gap-2'><Box className='w-5 h-5 text-amber-400' /> Inventory Snapshot</h3>
              <button onClick={() => navigate('/dashboard/inventory')} className='text-xs text-muted-foreground hover:text-amber-400 flex items-center gap-1 transition-colors'>Manage Stock <ArrowRight className='w-3 h-3' /></button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <div className='p-4 bg-secondary/30 rounded text-center border border-border/30 hover:border-amber-400/30 transition-colors'>
                <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium'>Varieties</p>
                <h4 className='text-2xl font-bold'>{data.inventory.length}</h4>
              </div>
              {/* <div className='p-4 bg-secondary/30 rounded text-center border border-border/30 hover:border-amber-400/30 transition-colors'>
                <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium'>Stock Value</p>
                <h4 className='text-2xl font-bold text-amber-500'>₹{totalInventoryValue.toLocaleString('en-IN')}</h4>
              </div> */}
              <div className='p-4 bg-secondary/30 rounded text-center border border-border/30 hover:border-amber-400/30 transition-colors'>
                <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium'>Total Qty</p>
                <h4 className='text-2xl font-bold'>{data.inventory.reduce((acc, item) => acc + (item.quantity || 0), 0)}</h4>
              </div>
              <div className='p-4 bg-red-500/10 rounded text-center border border-red-500/20 hover:border-red-500/40 transition-colors'>
                <p className='text-xs text-red-500 mb-1 uppercase tracking-wider font-medium flex items-center justify-center gap-1'><AlertCircle className='w-3 h-3' /> Low Stock</p>
                <h4 className='text-2xl font-bold text-red-500'>{lowStockCount}</h4>
              </div>
            </div>
          </div>

        </div>

        {/* RECENT ACTIVITY (Right side column) */}
        <div className='col-span-1 border border-border/50 rounded-2xl bg-card/40 p-6 flex flex-col hover:shadow-lg transition-all'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='font-semibold flex items-center gap-2'><Activity className='w-5 h-5 text-amber-500' /> Recent Activity</h3>
          </div>

          <div className='flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar'>
            {recentActivities.length === 0 ? (
              <div className='flex flex-col items-center justify-center opacity-50 py-16'>
                <Clock className='w-12 h-12 mb-3 opacity-20' />
                <p className='text-sm text-center'>No recent activities found.</p>
              </div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className='relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-[-20px] before:w-[2px] before:bg-border last:before:hidden'>
                  <div className={`absolute left-0 top-1 w-[24px] h-[24px] rounded-full flex items-center justify-center border-4 border-background
                          ${act.type === 'bill' ? 'bg-amber-400' :
                      act.type === 'order' ? 'bg-amber-400' : 'bg-green-400'}`}
                  ></div>

                  <div className='bg-secondary/40 p-3.5 rounded border border-border/50 ml-2 hover:border-amber-400/30 transition-all hover:-translate-y-0.5 shadow-sm'>
                    <div className='flex justify-between items-start mb-1.5'>
                      <h4 className='text-sm font-medium leading-tight'>{act.title}</h4>
                      <span className='text-[10px] text-muted-foreground whitespace-nowrap ml-2 uppercase tracking-wide font-medium'>
                        {act.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-xs text-muted-foreground'>
                      <p className='flex items-center gap-1.5'><Users className='w-3.5 h-3.5 opacity-70' /> {act.customer}</p>
                      <p className='font-semibold text-foreground bg-secondary px-2 py-0.5 rounded'>₹{act.amount?.toLocaleString('en-IN') || 0}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export { Dashboard }
