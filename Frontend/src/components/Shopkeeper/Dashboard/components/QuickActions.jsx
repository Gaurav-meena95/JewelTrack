import React from 'react';
import { Plus } from 'lucide-react';
import SectionHeader from '../../../../utils/SectionHeader';

const QuickActions = ({ navigate }) => {
  return (
    <SectionHeader 
      title="Business Overview" 
      subtitle="Here's what's happening with your jewelry business today"
      titleClassName="text-3xl font-black bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent tracking-tight"
      className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
    >
      <div className='flex flex-wrap items-center gap-3'>
        <button 
          onClick={() => navigate('/dashboard/bills')} 
          className='px-5 py-2.5 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-black rounded flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all text-xs uppercase tracking-widest'
        >
          <Plus className='w-4 h-4' /> Create Bill
        </button>
        <button 
          onClick={() => navigate('/dashboard/orders')} 
          className='px-5 py-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded flex items-center gap-2 transition-all active:scale-95 text-xs font-bold uppercase tracking-widest'
        >
          <Plus className='w-4 h-4 text-amber-500' /> New Order
        </button>
        <button 
          onClick={() => navigate('/dashboard/colletral')} 
          className='px-5 py-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded flex items-center gap-2 transition-all active:scale-95 text-xs font-bold uppercase tracking-widest'
        >
          <Plus className='w-4 h-4 text-amber-500' /> Add Girvi
        </button>
      </div>
    </SectionHeader>
  );
};

export default QuickActions;
