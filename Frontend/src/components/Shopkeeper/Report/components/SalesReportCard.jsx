import React from 'react';
import { IndianRupee, TrendingUp } from 'lucide-react';

const SalesReportCard = ({ totalRevenue, avgBillValue, bills }) => {
  return (
    <div className='bg-card/40 border border-border/50 rounded-3xl p-6 hover:border-amber-400/30 transition-all shadow-sm group'>
      <div className='flex items-center justify-between mb-8 px-1'>
        <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
          <div className='p-2 bg-amber-400/10 rounded group-hover:scale-110 transition-transform'>
            <IndianRupee className='w-5 h-5 text-amber-500' />
          </div>
          Sales Analytics
        </h3>
      </div>
      
      <div className='grid grid-cols-2 gap-4 mb-8'>
        <div className='p-5 bg-secondary/30 rounded-2xl border border-border/30 hover:bg-secondary/50 transition-colors'>
          <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60'>Total Net Revenue</p>
          <p className='text-2xl font-black text-amber-500 tabular-nums'>₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className='p-5 bg-secondary/30 rounded-2xl border border-border/30 hover:bg-secondary/50 transition-colors'>
          <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60'>Avg Ticket Size</p>
          <p className='text-2xl font-black tabular-nums'>₹{avgBillValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='flex items-center justify-between text-xs p-4 bg-amber-400/5 rounded-2xl border border-amber-400/20'>
          <span className='font-black uppercase tracking-widest text-muted-foreground opacity-60'>Invoices Generated</span>
          <span className='font-black text-lg text-amber-500'>{bills.length}</span>
        </div>
        
        {/* Activity Heatmap (CSS-only Bar Chart) */}
        {bills.length > 0 && (
          <div className='mt-4 p-6 border border-border/30 rounded-2xl bg-secondary/10'>
            <p className='text-[10px] text-muted-foreground mb-6 uppercase font-black tracking-widest flex items-center gap-2 opacity-60'>
              <TrendingUp className='w-3 h-3 text-amber-500'/> Activity Heatmap (Last 10 Records)
            </p>
            <div className='flex items-end gap-1.5 h-24'>
              {Object.entries(bills.reduce((acc, b) => {
                  const d = new Date(b.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'});
                  acc[d] = (acc[d] || 0) + 1;
                  return acc;
              }, {})).slice(-10).map(([d, count], idx, arr) => {
                  const max = Math.max(...arr.map(a => a[1])) || 1;
                  const height = `${(count / max) * 100}%`;
                  return (
                      <div key={idx} className='flex-1 flex flex-col items-center justify-end gap-2 group/bar relative'>
                          <div className='w-full bg-amber-400/20 group-hover/bar:bg-amber-400 rounded-t-lg transition-all duration-300' style={{ height }}>
                             <span className='absolute -top-8 text-black left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-all bg-amber-400 py-1 px-2 rounded shadow-xl shadow-amber-400/20 z-10'>
                                {count}
                             </span>
                          </div>
                          <span className='text-[8px] font-black text-muted-foreground uppercase tracking-tighter w-full text-center opacity-40 group-hover/bar:opacity-100 transition-opacity'>{d}</span>
                      </div>
                  )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportCard;
