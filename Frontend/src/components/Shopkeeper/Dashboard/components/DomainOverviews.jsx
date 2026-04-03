import React from 'react';
import { ShoppingBag, ArrowRight, Wallet, Box, AlertCircle } from 'lucide-react';

const DomainOverviews = ({ data, pendingOrdersCount, activeCollateralCount, totalCollateralValue, lowStockCount, navigate }) => {
  return (
    <div className='col-span-1 lg:col-span-2 space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* ORDERS HUB */}
        <div className='bg-card/40 border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:border-amber-400/20 transition-all group'>
          <div className='flex items-center justify-between mb-8 px-1'>
            <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
              <div className='p-2 bg-amber-400/10 rounded group-hover:scale-110 transition-transform'>
                <ShoppingBag className='w-5 h-5 text-amber-500' />
              </div>
              Orders Hub
            </h3>
            <button onClick={() => navigate('/dashboard/orders')} className='text-[10px] font-black text-muted-foreground hover:text-amber-400 flex items-center gap-2 transition-colors uppercase tracking-widest'>View All <ArrowRight className='w-3 h-3' /></button>
          </div>
          <div className='space-y-4 text-sm'>
            <OverviewItem label="Total Volume" value={data.orders.length} />
            <OverviewItem label="Pending Fulfillment" value={pendingOrdersCount} color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" />
            <OverviewItem label="Completed Orders" value={data.orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'completed').length} />
          </div>
        </div>

        {/* COLLATERAL PORTFOLIO */}
        <div className='bg-card/40 border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:border-amber-400/20 transition-all group'>
          <div className='flex items-center justify-between mb-8 px-1'>
            <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
               <div className='p-2 bg-amber-400/10 rounded group-hover:scale-110 transition-transform'>
                <Wallet className='w-5 h-5 text-amber-400' />
              </div>
              Collateral Loans
            </h3>
            <button onClick={() => navigate('/dashboard/colletral')} className='text-[10px] font-black text-muted-foreground hover:text-amber-400 flex items-center gap-2 transition-colors uppercase tracking-widest'>View All <ArrowRight className='w-3 h-3' /></button>
          </div>
          <div className='space-y-4 text-sm'>
            <OverviewItem label="Active Loans" value={activeCollateralCount} color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" />
            <OverviewItem label="Total Exposure" value={`₹${totalCollateralValue.toLocaleString('en-IN')}`} />
            <OverviewItem label="Closed Accounts" value={data.collaterals.filter(c => c.status === 'closed').length} />
          </div>
        </div>
      </div>

      {/* INVENTORY SNAPSHOT */}
      <div className='bg-card/40 border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:border-amber-400/20 transition-all group'>
        <div className='flex items-center justify-between mb-8 px-1'>
          <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
            <div className='p-2 bg-amber-400/10 rounded group-hover:scale-110 transition-transform'>
                <Box className='w-5 h-5 text-amber-500' />
            </div>
            Inventory Snapshot
          </h3>
          <button onClick={() => navigate('/dashboard/inventory')} className='text-[10px] font-black text-muted-foreground hover:text-amber-400 flex items-center gap-2 transition-colors uppercase tracking-widest'>Manage Stock <ArrowRight className='w-3 h-3' /></button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          <SnapshotStat label="Varieties" value={data.inventory.length} />
          <SnapshotStat label="Stock Quantity" value={data.inventory.reduce((acc, item) => acc + (item.quantity || 0), 0)} />
          <SnapshotStat label="Low Stock" value={lowStockCount} color="text-red-500" bg="bg-red-500/10" border="border-red-500/20" icon={AlertCircle} />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const OverviewItem = ({ label, value, color = '', bg = 'bg-secondary/30', border = 'border-border/30' }) => (
  <div className={`flex justify-between items-center p-4 rounded-2xl border ${border} ${bg} transition-colors`}>
    <span className={`text-xs font-black uppercase tracking-widest opacity-60 ${color}`}>{label}</span>
    <span className={`font-black text-lg ${color}`}>{value}</span>
  </div>
);

const SnapshotStat = ({ label, value, color = '', bg = 'bg-secondary/30', border = 'border-border/30', icon: Icon }) => (
  <div className={`p-6 rounded-2xl text-center border ${border} ${bg} hover:border-amber-400/30 transition-all group/stat`}>
    <p className={`text-[10px] uppercase tracking-widest font-black mb-2 flex items-center justify-center gap-1.5 ${color || 'text-muted-foreground'}`}>
      {Icon && <Icon className='w-3 h-3' />} {label}
    </p>
    <h4 className={`text-3xl font-black tabular-nums ${color || 'text-foreground'}`}>{value}</h4>
  </div>
);

export default DomainOverviews;
