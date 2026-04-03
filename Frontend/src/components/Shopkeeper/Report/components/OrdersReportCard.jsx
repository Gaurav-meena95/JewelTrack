import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';

const OrdersReportCard = ({ orders, completedOrders, pendingOrders, totalAdvance }) => {
  const completionRate = orders.length ? Math.round((completedOrders.length / orders.length) * 100) : 0;

  return (
    <div className='bg-card/40 border border-border/50 rounded-3xl p-6 hover:border-blue-400/30 transition-all shadow-sm group'>
      <div className='flex items-center justify-between mb-8 px-1'>
        <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
          <div className='p-2 bg-blue-400/10 rounded group-hover:scale-110 transition-transform'>
            <ShoppingBag className='w-5 h-5 text-blue-500' />
          </div>
          Orders Hub
        </h3>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-8'>
        <div className='p-5 bg-secondary/30 rounded-2xl border border-border/30 hover:bg-secondary/50 transition-colors'>
          <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60'>Incoming Volume</p>
          <p className='text-2xl font-black tabular-nums'>{orders.length}</p>
        </div>
        <div className='p-5 bg-blue-400/5 rounded-2xl border border-blue-400/20 hover:bg-blue-400/10 transition-colors'>
          <p className='text-[10px] text-blue-400 uppercase tracking-widest font-black mb-2 opacity-70'>Advance Captured</p>
          <p className='text-2xl font-black text-blue-400 tabular-nums'>₹{totalAdvance.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className='space-y-6'>
        <h4 className='text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60'>Fulfillment Efficiency</h4>
        
        {/* Progress Bar Visualization */}
        {orders.length > 0 && (
          <div className='space-y-4 px-1'>
            <div className='w-full h-4 bg-secondary/50 rounded-full overflow-hidden flex shadow-inner border border-border/20'>
              <div 
                style={{width: `${(completedOrders.length / orders.length) * 100}%` || '0%'}} 
                className='bg-green-500 h-full shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-1000'
              ></div>
              <div 
                style={{width: `${(pendingOrders.length / orders.length) * 100}%` || '0%'}} 
                className='bg-amber-500 h-full shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-1000'
              ></div>
            </div>
            <div className='flex justify-between text-[11px] font-black uppercase tracking-widest'>
              <div className='flex items-center gap-2 text-green-500'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                Delivered ({completedOrders.length})
              </div>
              <div className='flex items-center gap-2 text-amber-500'>
                <div className='w-2 h-2 rounded-full bg-amber-500 animate-pulse'></div>
                Pipeline ({pendingOrders.length})
              </div>
            </div>
          </div>
        )}

        <div className='mt-8 p-6 bg-secondary/20 rounded-2xl border border-border/30 group-hover:border-blue-400/20 transition-all flex items-center justify-between'>
          <div className='flex items-center gap-3'>
             <div className='p-2 bg-blue-400/10 rounded'>
                <Clock className='w-4 h-4 text-blue-400'/>
             </div>
             <span className='text-xs font-black uppercase tracking-tighter text-muted-foreground'>Turnaround Rate</span>
          </div>
          <span className='text-xl font-black text-foreground tabular-nums'>{completionRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default OrdersReportCard;
