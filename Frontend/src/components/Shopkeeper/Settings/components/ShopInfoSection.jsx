import React from 'react';
import { Store } from 'lucide-react';

const ShopInfoSection = ({ shopName, handleChange }) => {
  return (
    <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-amber-400/20 transition-all'>
      <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
        <div className='p-2 bg-amber-400/20 text-amber-400 rounded'><Store className='w-5 h-5' /></div>
        <h2 className='text-xl font-bold'>Shop Information</h2>
      </div>
      <div className='p-6'>
        <div className='space-y-2'>
          <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 font-mono tracking-widest'>Official Shop Name</label>
          <div className='relative'>
            <Store className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
            <input 
              type="text" 
              name="shopName" 
              value={shopName} 
              onChange={handleChange} 
              required 
              className='w-full pl-12 p-3 bg-input border border-border/50 rounded outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all font-bold' 
              placeholder="Enter your shop name" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopInfoSection;
