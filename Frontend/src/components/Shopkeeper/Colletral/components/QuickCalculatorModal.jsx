import React from 'react';
import { X, Calculator } from 'lucide-react';

const QuickCalculatorModal = ({ show, onClose, calcData, handleCalcChange, calculateInterest, calcResult }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 h-full'>
      <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl m-4 relative'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold flex items-center gap-2'>
            <Calculator className='w-5 h-5 text-amber-400' /> Quick Calculator
          </h2>
          <button 
            onClick={onClose} 
            className='hover:bg-secondary p-1 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>

        <form onSubmit={calculateInterest} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Principal Amount (₹)</label>
            <input 
              type='number' 
              name='basePrice' 
              placeholder='0.00' 
              value={calcData.basePrice}
              onChange={handleCalcChange} 
              className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
              required
            />
          </div>
          
          <div className='space-y-1'>
            <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Interest Rate (% per month)</label>
            <input 
              type='number' 
              step='0.1' 
              name='interest' 
              placeholder='e.g. 2.0' 
              value={calcData.interest}
              onChange={handleCalcChange} 
              className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>Start Date</label>
              <input 
                type='date' 
                name='startDate' 
                value={calcData.startDate}
                onChange={handleCalcChange} 
                className='w-full p-3 rounded-[8px] bg-input border border-border/50 text-sm outline-none focus:border-amber-400/50' 
                required
              />
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>End Date</label>
              <input 
                type='date' 
                name='endDate' 
                value={calcData.endDate}
                onChange={handleCalcChange} 
                className='w-full p-3 rounded-[8px] bg-input border border-border/50 text-sm outline-none focus:border-amber-400/50' 
                required
              />
            </div>
          </div>
          
          <button 
            type='submit' 
            className='w-full p-4 bg-secondary border border-border/50 rounded-[8px] hover:bg-secondary/80 font-bold transition-all mt-2'
          >
            Compute Interest
          </button>
        </form>

        {calcResult !== 0 && (
          <div className='mt-6 p-5 bg-amber-400/10 border border-amber-400/30 rounded text-center animate-in zoom-in-95 duration-200'>
            <p className='text-xs font-bold text-amber-500 uppercase tracking-widest mb-1'>Calculated Interest</p>
            <h3 className='text-3xl font-extrabold text-amber-400'>
              {calcResult === "Invalid Dates" ? "Error" : `₹${calcResult}`}
            </h3>
            {calcResult !== "Invalid Dates" && (
                <p className='text-[10px] text-amber-500/60 mt-1 uppercase'>Based on 3.33% interest / ₹100 / Month logic</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickCalculatorModal;
