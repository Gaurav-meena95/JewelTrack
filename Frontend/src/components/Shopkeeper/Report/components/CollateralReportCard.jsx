import React from 'react';
import { Wallet, Activity, CheckCircle2 } from 'lucide-react';

const CollateralReportCard = ({ collaterals, activeCollaterals, closedCollaterals, activeLoanValue }) => {
  return (
    <div className='bg-card/40 border border-border/50 rounded-3xl p-6 hover:border-green-400/30 transition-all shadow-sm group'>
      <div className='flex items-center justify-between mb-8 px-1'>
        <h3 className='font-black flex items-center gap-2 text-lg uppercase tracking-tight'>
          <div className='p-2 bg-green-400/10 rounded group-hover:scale-110 transition-transform'>
            <Wallet className='w-5 h-5 text-green-500' />
          </div>
          Collateral Portfolio
        </h3>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-8'>
        <div className='p-5 bg-green-400/5 border border-green-500/20 rounded-2xl hover:bg-green-400/10 transition-colors shadow-sm'>
          <p className='text-[10px] text-green-500 uppercase tracking-widest font-black mb-2 opacity-70'>Active Principal</p>
          <p className='text-2xl font-black text-green-500 tabular-nums'>₹{activeLoanValue.toLocaleString('en-IN')}</p>
        </div>
        <div className='p-5 bg-secondary/30 rounded-2xl border border-border/30 hover:bg-secondary/50 transition-colors'>
          <p className='text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60'>Total Loans Issued</p>
          <p className='text-2xl font-black tabular-nums'>{collaterals.length}</p>
        </div>
      </div>

      <div className='space-y-4 text-sm'>
        <ReportSummaryItem 
          label="Active Accounts" 
          value={activeCollaterals.length} 
          icon={Activity} 
          color="amber" 
          animate="animate-pulse"
        />
        <ReportSummaryItem 
          label="Closed / Settled Ledger" 
          value={closedCollaterals.length} 
          icon={CheckCircle2} 
          color="green" 
        />
      </div>
    </div>
  );
};

const ReportSummaryItem = ({ label, value, icon: Icon, color, animate = '' }) => (
  <div className='flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border/30 hover:border-amber-400/20 transition-all group/item shadow-sm'>
    <div className='flex items-center gap-3'>
      <div className={`p-2 bg-${color}-400/10 rounded group-hover/item:scale-110 transition-transform`}>
        <Icon className={`w-4 h-4 text-${color}-500 ${animate}`} />
      </div>
      <span className='text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 group-hover/item:opacity-100 transition-opacity'>{label}</span>
    </div>
    <span className='font-black text-lg text-foreground tabular-nums'>{value}</span>
  </div>
);

export default CollateralReportCard;
