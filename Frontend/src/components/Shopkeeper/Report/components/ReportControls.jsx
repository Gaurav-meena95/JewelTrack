import React from 'react';
import { Download, Calendar } from 'lucide-react';
import SectionHeader from '../../../../utils/SectionHeader';

const ReportControls = ({ 
  dateRange, 
  setDateRange, 
  customStart, 
  setCustomStart, 
  customEnd, 
  setCustomEnd, 
  exportCSV 
}) => {
  return (
    <SectionHeader 
      title="Reports & Analytics" 
      subtitle="Analyze your business performance and fulfillment trends"
      titleClassName="text-3xl font-black bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent tracking-tight"
      className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
    >
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2 bg-card p-2 rounded border border-border/50 shadow-sm'>
          <Calendar className='w-4 h-4 text-amber-400 ml-2' />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className='bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest pr-4 text-foreground focus:ring-0 cursor-pointer'
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {dateRange === 'custom' && (
          <div className='flex items-center gap-3 bg-card p-2 rounded border border-border/50 shadow-sm animate-in fade-in slide-in-from-right-4'>
            <input 
              type='date' 
              value={customStart} 
              onChange={e => setCustomStart(e.target.value)} 
              className='bg-transparent text-[11px] font-bold outline-none cursor-pointer p-0.5' 
            />
            <span className='text-muted-foreground text-[10px] font-black uppercase opacity-50'>to</span>
            <input 
              type='date' 
              value={customEnd} 
              onChange={e => setCustomEnd(e.target.value)} 
              className='bg-transparent text-[11px] font-bold outline-none cursor-pointer p-0.5' 
            />
          </div>
        )}

        <button 
          onClick={exportCSV} 
          className='px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-black font-black rounded flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 shadow-lg shadow-amber-400/20 text-[10px] uppercase tracking-[0.1em]'
        >
          <Download className='w-4 h-4' /> Export CSV Record
        </button>
      </div>
    </SectionHeader>
  );
};

export default ReportControls;
