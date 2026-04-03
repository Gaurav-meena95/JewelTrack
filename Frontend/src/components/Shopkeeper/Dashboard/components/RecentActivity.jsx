import React from 'react';
import { Activity, Clock, Users, IndianRupee } from 'lucide-react';

const RecentActivity = ({ recentActivities }) => {
  return (
    <div className='col-span-1 border border-border/50 rounded-3xl bg-card/40 p-6 flex flex-col hover:shadow-xl transition-all h-full'>
      <div className='flex items-center justify-between mb-8 px-1'>
        <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
          <Activity className='w-5 h-5 text-amber-500' /> Live Activity Stream
        </h3>
      </div>

      <div className='flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar'>
        {recentActivities.length === 0 ? (
          <div className='flex flex-col items-center justify-center opacity-30 py-32'>
            <Clock className='w-12 h-12 mb-4 opacity-10' />
            <p className='text-xs font-black uppercase tracking-widest'>No recent pulses detected</p>
          </div>
        ) : (
          recentActivities.map((act) => (
            <div key={act.id} className='relative pl-8 before:absolute before:left-[11px] before:top-3 before:bottom-[-24px] before:w-[2.5px] before:bg-border/30 last:before:hidden group'>
              <div className={`absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full flex items-center justify-center border-4 border-card shadow-lg z-10 
                      ${act.type === 'bill' ? 'bg-amber-400' :
                        act.type === 'order' ? 'bg-blue-400' : 'bg-purple-400'}`}
              ></div>

              <div className='bg-secondary/30 p-4 rounded-2xl border border-border/40 ml-1 hover:bg-secondary/60 hover:border-amber-400/20 transition-all cursor-default shadow-sm'>
                <div className='flex justify-between items-start mb-2'>
                  <h4 className='text-sm font-bold leading-snug group-hover:text-amber-500 transition-colors'>{act.title}</h4>
                  <span className='text-[10px] text-muted-foreground whitespace-nowrap ml-2 uppercase font-black tracking-widest opacity-60'>
                    {act.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <div className='flex justify-between items-center text-[11px] text-muted-foreground'>
                  <p className='flex items-center gap-2 font-black uppercase tracking-tighter'>
                    <Users className='w-3.5 h-3.5 opacity-50' /> {act.customer}
                  </p>
                  <p className='font-black text-foreground bg-card/60 px-2.5 py-1 rounded border border-border/30 flex items-center gap-1 tabular-nums transition-colors group-hover:border-amber-400/20 shadow-sm'>
                    <IndianRupee className='w-3 h-3 text-amber-500 opacity-50' /> {act.amount?.toLocaleString('en-IN') || 0}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className='mt-8 pt-4 border-t border-border/20'>
        <p className='text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] text-center opacity-40'>Auto-syncing every 5 minutes</p>
      </div>
    </div>
  );
};

export default RecentActivity;
