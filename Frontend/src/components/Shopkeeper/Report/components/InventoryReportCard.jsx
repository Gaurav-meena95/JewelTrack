import React from 'react';
import { Box, AlertCircle } from 'lucide-react';

const InventoryReportCard = ({ inventory, lowStockItems, totalInventoryValue }) => {
  return (
    <div className='bg-card/40 border border-border/50 rounded-3xl p-6 hover:border-blue-400/30 transition-all shadow-sm group'>
      <div className='flex items-center justify-between mb-8 px-1'>
        <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
          <div className='p-2 bg-blue-400/10 rounded group-hover:scale-110 transition-transform'>
            <Box className='w-5 h-5 text-blue-500' />
          </div>
          Inventory Analytics
        </h3>
        <span className='text-[10px] text-muted-foreground px-2 py-1 bg-secondary rounded uppercase font-black tracking-widest opacity-60'>Live Snapshot</span>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-8'>
        <div className='p-5 bg-secondary/30 rounded-2xl border border-border/30 hover:bg-secondary/50 transition-colors'>
          <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60'>Estimated Stock Value</p>
          <p className='text-2xl font-black text-blue-400 tabular-nums'>₹{totalInventoryValue.toLocaleString('en-IN')}</p>
        </div>
        <div className='p-5 bg-red-500/5 border border-red-500/20 rounded-2xl hover:bg-red-500/10 transition-colors shadow-sm animate-in zoom-in-95'>
          <p className='text-[10px] text-red-500 uppercase tracking-widest font-black mb-2 opacity-70'>Low Stock Alerts</p>
          <p className='text-2xl font-black text-red-500 flex items-center gap-2 tabular-nums'>
             {lowStockItems.length} <AlertCircle className='w-5 h-5 animate-bounce' />
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        <h4 className='text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60'>Metal Distribution</h4>
        
        <div className='space-y-5 px-1'>
          {Object.entries(inventory.reduce((acc, i) => {
              const type = i.metalType || 'Other';
              acc[type] = (acc[type] || 0) + (i.quantity || 1);
              return acc;
          }, {}))
          .sort((a,b) => b[1] - a[1]).slice(0,3).map(([type, qty], idx) => {
              const total = inventory.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1;
              const pct = Math.round((qty/total)*100);
              return (
                  <div key={idx} className='space-y-2 group/bar'>
                      <div className='flex justify-between text-[11px] font-black uppercase tracking-tighter'>
                          <span className='text-muted-foreground group-hover/bar:text-foreground transition-colors'>{type}</span>
                          <span className='text-foreground'>{qty} units <span className='opacity-40 font-medium ml-1'>({pct}%)</span></span>
                      </div>
                      <div className='w-full h-2 bg-secondary/50 rounded-full overflow-hidden border border-border/20 shadow-inner'>
                          <div 
                            className='h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                            style={{width: `${pct}%`}}
                          ></div>
                      </div>
                  </div>
              )
          })}
          {inventory.length === 0 && <p className='text-xs italic text-muted-foreground opacity-40 text-center py-4'>No inventory records found</p>}
        </div>
      </div>
    </div>
  );
};

export default InventoryReportCard;
