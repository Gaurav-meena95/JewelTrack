import React from 'react';
import { Package, Layers, AlertTriangle } from 'lucide-react';

const InventoryMetrics = ({ totalItems, totalQuantity, uniqueCategories, lowStockItemsCount }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div className='bg-card/40 border border-border/50 p-5 rounded-[8px] flex items-center gap-4 hover:border-amber-400/30 transition-colors'>
        <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500 shrink-0'>
          <Package className='w-6 h-6' />
        </div>
        <div>
          <h3 className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>Total Items</h3>
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-bold'>{totalItems}</span>
            <span className='text-xs text-muted-foreground'>({totalQuantity} total qty)</span>
          </div>
        </div>
      </div>

      <div className='bg-card/40 border border-border/50 p-5 rounded-[8px] flex items-center gap-4 hover:border-amber-400/30 transition-colors'>
        <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500 shrink-0'>
          <Layers className='w-6 h-6' />
        </div>
        <div>
          <h3 className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>Metals / Categories</h3>
          <p className='text-2xl font-bold'>{uniqueCategories}</p>
        </div>
      </div>

      <div className={`bg-card/40 border border-border/50 p-5 rounded-[8px] flex items-center gap-4 transition-colors ${lowStockItemsCount > 0 ? 'border-red-500/30 bg-red-500/5' : 'hover:border-amber-400/30'}`}>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${lowStockItemsCount > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          <AlertTriangle className='w-6 h-6' />
        </div>
        <div>
          <h3 className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>Low Stock Alerts</h3>
          <div className='flex items-baseline gap-2'>
            <span className={`text-2xl font-bold ${lowStockItemsCount > 0 ? 'text-red-500' : ''}`}>{lowStockItemsCount}</span>
            <span className='text-xs text-muted-foreground'>items &lt; 5 qty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMetrics;
