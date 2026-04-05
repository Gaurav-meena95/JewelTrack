import React, { useState, useEffect, useMemo } from 'react';
import { IndianRupee, ShoppingCart, Wallet, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';
import Loading from '../../../utils/Loading';

// Sub-components
import QuickActions from './components/QuickActions';
import StatsGrid from './components/StatsGrid';
import DomainOverviews from './components/DomainOverviews';
import RecentActivity from './components/RecentActivity';
import SectionHeader from '../../../utils/SectionHeader';

const Dashboard = () => {
  const navigate = useNavigate();
  const header = getAuthHeaders();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      const customersRaw = customersRes.status === 'fulfilled' ? (customersRes.value.data.customer || []) : [];
      const customers = Array.isArray(customersRaw) ? customersRaw : [customersRaw];
      const bills = billsRes.status === 'fulfilled' ? (billsRes.value.data.data || billsRes.value.data.bills || []) : [];      
      const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data.data || ordersRes.value.data.orders || []) : [];
      const collaterals = collateralsRes.status === 'fulfilled' ? (collateralsRes.value.data.data || collateralsRes.value.data.collaterals || []) : [];
      const inventory = inventoryRes.status === 'fulfilled' ? (inventoryRes.value.data.allInventorys || []) : [];

      setData({ customers, bills, orders, collaterals, inventory });
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Derived Business Metrics
  const metrics = useMemo(() => {
    const totalRevenue = data.bills.reduce((sum, bill) => sum + (bill.invoice?.grandTotal || 0), 0);
    const pendingOrdersCount = data.orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'completed').length;
    const activeCollaterals = data.collaterals.filter(c => c.status === 'active');
    const totalCollateralValue = activeCollaterals.reduce((sum, c) => sum + (c.price || 0), 0);
    const lowStockCount = data.inventory.filter(item => (item.quantity || 0) <= 5).length;

    return { totalRevenue, pendingOrdersCount, activeCollateralCount: activeCollaterals.length, totalCollateralValue, lowStockCount };
  }, [data]);

  const recentActivities = useMemo(() => {
    let activities = [];
    data.bills.forEach(b => {
      activities.push({
        id: `bill_${b._id}`,
        type: 'bill',
        title: `Bill generated for ₹${(b.invoice?.grandTotal || 0).toLocaleString('en-IN')}`,
        customer: b.customerId?.name || 'Walk-in Customer',
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
    return activities.sort((a, b) => b.date - a.date).slice(0,4);
  }, [data]);

  const topStats = [
    { title: 'Total Customers', value: data.customers.length, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10'},
    { title: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-amber-400', bg: 'bg-amber-500/10'},
    { title: 'Pending Orders', value: metrics.pendingOrdersCount, icon: ShoppingCart, color: 'text-amber-400', bg: 'bg-amber-500/10'},
    { title: 'Active Girvi', value: metrics.activeCollateralCount, icon: Wallet, color: 'text-amber-400', bg: 'bg-amber-500/10'},
    { title: 'Low Stock Items', value: metrics.lowStockCount, icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10'},
  ];

  if (loading) return <Loading />;

  return (
    <div className='p-2 md:p-6 space-y-10 animate-in fade-in duration-500 pb-20'>
      <QuickActions navigate={navigate} />
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-center font-bold tracking-tight">
          {error}
        </div>
      )}

      <StatsGrid topStats={topStats} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <DomainOverviews 
          data={data}
          pendingOrdersCount={metrics.pendingOrdersCount}
          activeCollateralCount={metrics.activeCollateralCount}
          totalCollateralValue={metrics.totalCollateralValue}
          lowStockCount={metrics.lowStockCount}
          navigate={navigate}
        />
        
        <RecentActivity recentActivities={recentActivities} />
      </div>

    </div>
  );
};

export { Dashboard };
