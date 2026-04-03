import React from 'react';

const StatsGrid = ({ topStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {topStats.map((stat, indx) => {
        const Icon = stat.icon;
        return (
          <div key={indx} className='relative overflow-hidden backdrop-blur-md bg-card/40 border border-border/50 rounded-3xl p-6 shadow-sm hover:bg-secondary/50 hover:border-amber-400/30 transition-all group'>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700 blur-2xl`}></div>
            <div className='flex items-center justify-between mb-5 relative z-10'>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className='relative z-10 space-y-1'>
              <h3 className="text-muted-foreground text-[10px] uppercase tracking-widest font-black opacity-70 group-hover:opacity-100 transition-opacity">{stat.title}</h3>
              <p className='text-2xl font-black truncate tracking-tight group-hover:text-amber-500 transition-colors' title={String(stat.value)}>{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default StatsGrid;
