import React from 'react';
import { Shield, Lock } from 'lucide-react';

const SecuritySection = ({ password, confirmPassword, handleChange }) => {
  return (
    <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-red-500/20 transition-all'>
      <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
        <div className='p-2 bg-red-400/20 text-red-500 rounded'><Shield className='w-5 h-5' /></div>
        <h2 className='text-xl font-bold'>Security & Authentication</h2>
      </div>
      <div className='p-6'>
        <p className='text-xs text-muted-foreground mb-6 font-medium'>
          Protect your account. Leave these fields empty if you do not wish to update your current password.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>New Secure Password</label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
              <input 
                type="password" 
                name="password" 
                value={password} 
                onChange={handleChange} 
                className='w-full pl-12 p-3 bg-input border border-border/50 rounded outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 transition-all' 
                placeholder="••••••••" 
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>Verify New Password</label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
              <input 
                type="password" 
                name="confirmPassword" 
                value={confirmPassword} 
                onChange={handleChange} 
                className='w-full pl-12 p-3 bg-input border border-border/50 rounded outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 transition-all' 
                placeholder="••••••••" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
