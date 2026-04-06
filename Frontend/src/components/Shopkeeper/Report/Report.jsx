import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig';

// Sub-components
import ReportControls from './components/ReportControls';
import SalesReportCard from './components/SalesReportCard';
import OrdersReportCard from './components/OrdersReportCard';
import CollateralReportCard from './components/CollateralReportCard';
import InventoryReportCard from './components/InventoryReportCard';

const Report = () => {
    const header = getAuthHeaders();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState('30days');
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
                axios.get(`${VITE_API_BASE_KEY}/shops/inventory/me`, { headers: header })
            ];
            const results = await Promise.allSettled(endpoints);
            const [billsRes, ordersRes, collateralsRes, inventoryRes] = results;

            setRawData({
                bills: billsRes.status === 'fulfilled' ? (billsRes.value.data?.data?.data || billsRes.value.data?.data?.bills || []) : [],
                orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.data?.data || ordersRes.value.data?.data?.orders || []) : [],
                collaterals: collateralsRes.status === 'fulfilled' ? (collateralsRes.value.data?.data?.data || collateralsRes.value.data?.data?.collaterals || []) : [],
                inventory: inventoryRes.status === 'fulfilled' ? (inventoryRes.value.data?.data?.allInventorys || []) : []
            });
        } catch (err) {
            setError('System failed to aggregate ledger data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

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

        return {
            bills: filterByDate(rawData.bills),
            orders: filterByDate(rawData.orders),
            collaterals: filterByDate(rawData.collaterals),
            inventory: rawData.inventory 
        };
    }, [rawData, dateRange, customStart, customEnd]);

    const metrics = useMemo(() => {
        const bills = filteredData.bills;
        const orders = filteredData.orders;
        const collaterals = filteredData.collaterals;
        const inventory = filteredData.inventory;

        return {
            totalRevenue: bills.reduce((sum, b) => sum + (b.invoice?.grandTotal || 0), 0),
            avgBillValue: bills.length > 0 ? (bills.reduce((sum, b) => sum + (b.invoice?.grandTotal || 0), 0) / bills.length) : 0,
            completedOrders: orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'completed'),
            pendingOrders: orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'completed'),
            totalAdvance: orders.reduce((sum, o) => sum + (o.AdvancePayment || o.advance || 0), 0),
            activeCollaterals: collaterals.filter(c => c.status === 'active'),
            closedCollaterals: collaterals.filter(c => c.status === 'closed'),
            activeLoanValue: collaterals.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.price || 0), 0),
            lowStockItems: inventory.filter(i => (i.quantity || 0) <= 5),
            totalInventoryValue: inventory.reduce((sum, i) => sum + (i.price || 0), 0)
        };
    }, [filteredData]);

    const exportCSV = () => {
        const rows = [
            ["JewelTrack Business System Report"],
            ["Generated on", new Date().toLocaleString()],
            ["Period", dateRange],
            [],
            ["Sales Metrics"],
            ["Gross Revenue", metrics.totalRevenue],
            ["Invoice Count", filteredData.bills.length],
            ["Avg Transaction", metrics.avgBillValue.toFixed(2)],
            [],
            ["Fulfillment Operations"],
            ["Total Workloads", filteredData.orders.length],
            ["Successfully Delivered", metrics.completedOrders.length],
            ["Active Pipeline", metrics.pendingOrders.length],
            ["Advance Collected", metrics.totalAdvance],
            [],
            ["Loan Ledger"],
            ["Active Exposures", metrics.activeCollaterals.length],
            ["Settled Claims", metrics.closedCollaterals.length],
            ["Principal Outstanding", metrics.activeLoanValue],
            [],
            ["Inventory Analytics"],
            ["SKU Varieties", filteredData.inventory.length],
            ["Critical Stock Alerts", metrics.lowStockItems.length],
            ["Valuation Estimate", metrics.totalInventoryValue]
        ];

        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `jeweltrack_intelligence_${dateRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
               <div className="w-16 h-16 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin shadow-2xl"></div>
               <div className='text-center space-y-2'>
                   <p className="text-xs uppercase font-black tracking-widest text-amber-400">Generating Intelligence Report</p>
                   <p className='text-[10px] uppercase font-bold text-muted-foreground opacity-40'>Aggregating cross-module ledger data...</p>
               </div>
            </div>
         );
    }

    return (
        <div className='p-2 md:p-6 space-y-10 animate-in fade-in duration-500 pb-32'>
            <ReportControls 
                dateRange={dateRange}
                setDateRange={setDateRange}
                customStart={customStart}
                setCustomStart={setCustomStart}
                customEnd={customEnd}
                setCustomEnd={setCustomEnd}
                exportCSV={exportCSV}
            />

            {error && (
                <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl text-center border mr-2 border-red-500/20 font-bold uppercase tracking-widest text-xs">
                    {error}
                </div>
            )}

            {filteredData.bills.length === 0 && filteredData.orders.length === 0 && filteredData.collaterals.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-40 bg-card/20 border-2 border-dashed border-border/50 rounded-[40px] opacity-40 space-y-6'>
                    <Activity className='w-20 h-20 text-muted-foreground mb-4' />
                    <div className='text-center space-y-2'>
                        <h3 className='text-2xl font-black uppercase tracking-tight'>No Ledger Activity</h3>
                        <p className='text-sm font-medium'>No transactions found during this timeframe. Adjust filters to broaden your view.</p>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <SalesReportCard 
                        totalRevenue={metrics.totalRevenue} 
                        avgBillValue={metrics.avgBillValue} 
                        bills={filteredData.bills} 
                    />
                    
                    <OrdersReportCard 
                        orders={filteredData.orders}
                        completedOrders={metrics.completedOrders}
                        pendingOrders={metrics.pendingOrders}
                        totalAdvance={metrics.totalAdvance}
                    />

                    <CollateralReportCard 
                        collaterals={filteredData.collaterals}
                        activeCollaterals={metrics.activeCollaterals}
                        closedCollaterals={metrics.closedCollaterals}
                        activeLoanValue={metrics.activeLoanValue}
                    />

                    <InventoryReportCard 
                        inventory={filteredData.inventory}
                        lowStockItems={metrics.lowStockItems}
                        totalInventoryValue={metrics.totalInventoryValue}
                    />
                </div>
            )}
        </div>
    );
};

export { Report };