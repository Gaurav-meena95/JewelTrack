import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Download, Calendar, IndianRupee, ShoppingBag, Wallet, Box, TrendingUp, AlertCircle, Activity, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';

const Report = () => {
    const header = getAuthHeaders();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState('30days'); // today, 7days, 30days, all, custom
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const [rawData, setRawData] = useState({
        bills: [],
        orders: [],
        collaterals: [],
        inventory: []
    });

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const endpoints = [
                axios.get(`${VITE_API_BASE_KEY}/shops/billing/allbills`, { headers: header }),
                axios.get(`${VITE_API_BASE_KEY}/shops/orders/allorders`, { headers: header }),
                axios.get(`${VITE_API_BASE_KEY}/customers/collatral/me`, { headers: header }),
                axios.get(`${VITE_API_BASE_KEY}/shops/inventory/`, { headers: header })
            ];
            const results = await Promise.allSettled(endpoints);
            const [billsRes, ordersRes, collateralsRes, inventoryRes] = results;

            setRawData({
                bills: billsRes.status === 'fulfilled' ? (billsRes.value.data.data || billsRes.value.data.bills || []) : [],
                orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data.data || ordersRes.value.data.orders || []) : [],
                collaterals: collateralsRes.status === 'fulfilled' ? (collateralsRes.value.data.data || collateralsRes.value.data.collaterals || []) : [],
                inventory: inventoryRes.status === 'fulfilled' ? (inventoryRes.value.data.allInventorys || []) : []
            });
        } catch (err) {
            setError('Failed to fetch report data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // filtering logic
    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = new Date(0);
        let endDate = new Date();

        if (dateRange === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (dateRange === '7days') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (dateRange === '30days') {
            startDate = new Date(now.setDate(now.getDate() - 30));
        } else if (dateRange === 'custom' && customStart && customEnd) {
            startDate = new Date(customStart);
            endDate = new Date(customEnd);
            endDate.setHours(23, 59, 59, 999);
        }

        const filterByDate = (arr) => arr.filter(item => {
            if (!item.createdAt) return true;
            const itemDate = new Date(item.createdAt);
            return itemDate >= startDate && itemDate <= endDate;
        });

        // Inventory usually doesn't need date filtering for 'live' stock, but we pass it anyway.
        return {
            bills: filterByDate(rawData.bills),
            orders: filterByDate(rawData.orders),
            collaterals: filterByDate(rawData.collaterals),
            inventory: rawData.inventory // Inventory is absolute snapshot
        };
    }, [rawData, dateRange, customStart, customEnd]);

    // calculate metrics
    const bills = filteredData.bills;
    const orders = filteredData.orders;
    const collaterals = filteredData.collaterals;
    const inventory = filteredData.inventory;

    // Sales Metrics
    const totalRevenue = bills.reduce((sum, b) => sum + (b.invoice?.grandTotal || 0), 0);
    const avgBillValue = bills.length > 0 ? (totalRevenue / bills.length) : 0;
    
    // Order Metrics
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'completed');
    const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'completed');
    const totalAdvance = orders.reduce((sum, o) => sum + (o.advance || 0), 0);
    
    // Collateral Metrics
    const activeCollaterals = collaterals.filter(c => c.status === 'active');
    const closedCollaterals = collaterals.filter(c => c.status === 'closed');
    const activeLoanValue = activeCollaterals.reduce((sum, c) => sum + (c.price || 0), 0);
    
    // Inventory Metrics
    const lowStockItems = inventory.filter(i => (i.quantity || 0) <= 5);
    const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.price || 0), 0);

    const exportCSV = () => {
        const rows = [
            ["JewelTrack Business Report"],
            ["Generated on", new Date().toLocaleString()],
            ["Date Range", dateRange],
            [],
            ["Sales Analytics"],
            ["Total Revenue", totalRevenue],
            ["Total Bills", bills.length],
            ["Avg Bill Value", avgBillValue.toFixed(2)],
            [],
            ["Orders Analytics"],
            ["Total Orders", orders.length],
            ["Completed Orders", completedOrders.length],
            ["Pending Orders", pendingOrders.length],
            ["Advance Collected", totalAdvance],
            [],
            ["Collateral Analytics"],
            ["Active Loans", activeCollaterals.length],
            ["Closed Loans", closedCollaterals.length],
            ["Active Loan Value", activeLoanValue],
            [],
            ["Inventory Analytics"],
            ["Total Varieties", inventory.length],
            ["Low Stock Items", lowStockItems.length],
            ["Total Inventory Value", totalInventoryValue]
        ];

        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `jeweltrack_report_${dateRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
               <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
               <p className="text-muted-foreground animate-pulse">Generating comprehensive reports...</p>
            </div>
         );
    }

    return (
        <div className='p-2 md:p-6 space-y-8 animate-in fade-in duration-500'>
            {/* Header & Controls */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-secondary/50 to-transparent p-6 rounded border border-border/50'>
                <div className='space-y-1'>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent'>Reports & Analytics</h1>
                    <p className='text-muted-foreground'>Analyze your business performance and trends</p>
                </div>
                
                <div className='flex flex-wrap items-center gap-4'>
                    <div className='flex items-center gap-2 bg-card p-2 rounded border border-border/50'>
                        <Calendar className='w-4 h-4 text-muted-foreground ml-2' />
                        <select 
                            value={dateRange} 
                            onChange={(e) => setDateRange(e.target.value)}
                            className='bg-transparent border-none outline-none text-sm font-medium pr-2 text-foreground focus:ring-0 cursor-pointer'
                        >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="all">All Time</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {dateRange === 'custom' && (
                        <div className='flex items-center gap-2 bg-card p-2 rounded border border-border/50 animate-in fade-in'>
                            <input type='date' value={customStart} onChange={e => setCustomStart(e.target.value)} className='bg-transparent text-sm outline-none cursor-pointer' />
                            <span className='text-muted-foreground text-sm'>to</span>
                            <input type='date' value={customEnd} onChange={e => setCustomEnd(e.target.value)} className='bg-transparent text-sm outline-none cursor-pointer' />
                        </div>
                    )}

                    <button onClick={exportCSV} className='px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded flex items-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-amber-400/20'>
                        <Download className='w-4 h-4' /> Export CSV
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 text-red-500 rounded text-center border border-red-500/20 mb-6">{error}</div>}

            {/* If empty data in filtered range */}
            {bills.length === 0 && orders.length === 0 && collaterals.length === 0 && (
                <div className='flex flex-col items-center justify-center p-12 bg-card/40 border border-border/50 rounded-2xl'>
                    <Activity className='w-12 h-12 text-muted-foreground opacity-30 mb-4' />
                    <h3 className='text-xl font-medium'>No Data Found</h3>
                    <p className='text-muted-foreground'>Try adjusting your date range filter above.</p>
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* 1. SALES REPORT */}
                <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:border-amber-400/30 transition-colors shadow-sm'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='font-semibold flex items-center gap-2 text-lg'><IndianRupee className='w-5 h-5 text-amber-500' /> Sales Report</h3>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div className='p-4 bg-secondary/30 rounded'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Total Revenue</p>
                            <p className='text-2xl font-bold text-amber-500'>₹{totalRevenue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className='p-4 bg-secondary/30 rounded'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Avg Bill Value</p>
                            <p className='text-2xl font-bold'>₹{avgBillValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h4 className='text-sm font-medium text-muted-foreground'>Billing Distribution</h4>
                        <div className='flex items-center justify-between text-sm p-3 bg-secondary/20 rounded border border-border/30'>
                            <span>Total Invoices Generated</span>
                            <span className='font-bold text-base'>{bills.length}</span>
                        </div>
                        
                        {/* CSS Bar Chart for Top Dates (mock trend) */}
                        {bills.length > 0 && (
                            <div className='mt-4 p-4 border border-border/30 rounded bg-background/50'>
                                <p className='text-xs text-muted-foreground mb-3 flex items-center gap-1'><TrendingUp className='w-3 h-3'/> Activity Heatmap (by Count)</p>
                                <div className='flex items-end gap-1 h-24'>
                                    {/* Compute frequency map implicitly */}
                                    {Object.entries(bills.reduce((acc, b) => {
                                        const d = new Date(b.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'});
                                        acc[d] = (acc[d] || 0) + 1;
                                        return acc;
                                    }, {})).slice(-10).map(([d, count], idx, arr) => {
                                        const max = Math.max(...arr.map(a => a[1]));
                                        const height = `${(count / max) * 100}%`;
                                        return (
                                            <div key={idx} className='flex-1 flex flex-col items-center justify-end gap-1 group'>
                                                <div className='w-full bg-amber-400/20 group-hover:bg-amber-400/80 rounded-t-sm transition-colors relative' style={{ height }}>
                                                   <span className='absolute -top-6 text-foreground left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-secondary py-0.5 px-1.5 rounded'>
                                                      {count}
                                                   </span>
                                                </div>
                                                <span className='text-[9px] text-muted-foreground truncate w-full text-center'>{d}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. ORDERS REPORT */}
                <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:border-purple-400/30 transition-colors shadow-sm'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='font-semibold flex items-center gap-2 text-lg'><ShoppingBag className='w-5 h-5 text-purple-500' /> Orders Report</h3>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div className='p-4 bg-secondary/30 rounded'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Total Volume</p>
                            <p className='text-2xl font-bold'>{orders.length}</p>
                        </div>
                        <div className='p-4 bg-secondary/30 rounded border border-purple-500/20'>
                            <p className='text-xs text-purple-400 uppercase tracking-wider mb-1'>Advance Captured</p>
                            <p className='text-2xl font-bold text-purple-400'>₹{totalAdvance.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h4 className='text-sm font-medium text-muted-foreground'>Fulfillment Status</h4>
                        
                        {/* Progress Bar Chart */}
                        {orders.length > 0 && (
                            <div className='space-y-3 mt-2'>
                                <div className='w-full h-3 bg-secondary rounded-full overflow-hidden flex'>
                                    <div style={{width: `${(completedOrders.length / orders.length) * 100}%`}} className='bg-green-500 h-full'></div>
                                    <div style={{width: `${(pendingOrders.length / orders.length) * 100}%`}} className='bg-amber-500 h-full'></div>
                                </div>
                                <div className='flex justify-between text-sm'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-3 h-3 rounded-full bg-green-500'></div>
                                        <span>Delivered ({completedOrders.length})</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                                        <span>Pending ({pendingOrders.length})</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='mt-4 p-4 bg-secondary/20 rounded border border-border/30'>
                            <p className='text-sm flex items-center gap-2'><Clock className='w-4 h-4 text-muted-foreground'/> Completion Rate: <span className='font-bold text-foreground'>{orders.length ? Math.round((completedOrders.length/orders.length)*100) : 0}%</span></p>
                        </div>
                    </div>
                </div>

                {/* 3. COLLATERAL REPORT */}
                <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:border-green-400/30 transition-colors shadow-sm'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='font-semibold flex items-center gap-2 text-lg'><Wallet className='w-5 h-5 text-green-500' /> Collateral Loans</h3>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div className='p-4 bg-green-500/10 border border-green-500/20 rounded'>
                            <p className='text-xs text-green-500 uppercase tracking-wider mb-1'>Active Liabilities</p>
                            <p className='text-2xl font-bold text-green-500'>₹{activeLoanValue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className='p-4 bg-secondary/30 rounded'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Total Loans Issued</p>
                            <p className='text-2xl font-bold'>{collaterals.length}</p>
                        </div>
                    </div>

                    <div className='space-y-4 text-sm'>
                        <div className='flex items-center justify-between p-3.5 bg-secondary/30 rounded border border-border/30'>
                            <div className='flex items-center gap-2'>
                                <Activity className='w-4 h-4 text-amber-500' /> Active Accounts
                            </div>
                            <span className='font-bold text-base'>{activeCollaterals.length}</span>
                        </div>
                        <div className='flex items-center justify-between p-3.5 bg-secondary/30 rounded border border-border/30'>
                            <div className='flex items-center gap-2'>
                                <CheckCircle2 className='w-4 h-4 text-green-500' /> Closed/Settled Actions
                            </div>
                            <span className='font-bold text-base'>{closedCollaterals.length}</span>
                        </div>
                    </div>
                </div>

                {/* 4. INVENTORY REPORT */}
                <div className='bg-card/40 border border-border/50 rounded-2xl p-6 hover:border-blue-400/30 transition-colors shadow-sm'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='font-semibold flex items-center gap-2 text-lg'><Box className='w-5 h-5 text-blue-500' /> Inventory Analytics</h3>
                        <span className='text-[10px] text-muted-foreground px-2 py-1 bg-secondary rounded uppercase font-medium tracking-wide'>Absolute Snapshot</span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div className='p-4 bg-secondary/30 rounded'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Stock Value</p>
                            <p className='text-2xl font-bold text-blue-500'>₹{totalInventoryValue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className='p-4 bg-red-500/10 border border-red-500/20 rounded'>
                            <p className='text-xs text-red-500 uppercase tracking-wider mb-1'>Low Stock Flags</p>
                            <p className='text-2xl font-bold text-red-500 flex items-center gap-2'>
                                {lowStockItems.length} <AlertCircle className='w-4 h-4' />
                            </p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h4 className='text-sm font-medium text-muted-foreground'>Stock Distribution</h4>
                        
                        <div className='space-y-4 mt-4'>
                            {/* Compute top 3 categories by volume implicitly */}
                            {Object.entries(inventory.reduce((acc, i) => {
                                const type = i.metalType || 'Other';
                                acc[type] = (acc[type] || 0) + (i.quantity || 1);
                                return acc;
                            }, {}))
                            .sort((a,b) => b[1] - a[1]).slice(0,3).map(([type, qty], idx) => {
                                const total = inventory.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1;
                                const pct = Math.round((qty/total)*100);
                                return (
                                    <div key={idx} className='space-y-2'>
                                        <div className='flex justify-between text-xs font-medium'>
                                            <span className='capitalize'>{type}</span>
                                            <span className='text-muted-foreground'>{qty} units ({pct}%)</span>
                                        </div>
                                        <div className='w-full h-2 bg-secondary rounded-full overflow-hidden'>
                                            <div className='h-full bg-blue-500 rounded-full' style={{width: `${pct}%`}}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export { Report };