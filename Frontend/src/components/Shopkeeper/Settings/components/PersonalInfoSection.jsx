import React from 'react';
import { User, Phone, Mail } from 'lucide-react';

const PersonalInfoSection = ({ profile, handleChange }) => {
  return (
    <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-amber-400/20 transition-all'>
      <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
        <div className='p-2 bg-amber-400/20 text-amber-500 rounded'><User className='w-5 h-5' /></div>
        <h2 className='text-xl font-bold'>Personal Profile</h2>
      </div>
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>Owner Full Name</label>
          <div className='relative'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
            <input 
              type="text" 
              name="name" 
              value={profile.name} 
              onChange={handleChange} 
              required 
              className='w-full pl-12 p-3 bg-input border border-border/50 rounded outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all' 
              placeholder="Your full name" 
            />
          </div>
        </div>
        <div className='space-y-2'>
          <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>Registered Mobile Number</label>
          <div className='relative'>
            <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
            <input 
              type="text" 
              name="phone" 
              value={profile.phone} 
              onChange={handleChange} 
              required 
              pattern="\d{10}" 
              title="Must be exactly 10 digits" 
              className='w-full pl-12 p-3 bg-input/50 border border-border/50 rounded outline-none pointer-events-none opacity-60' 
              placeholder="10-digit mobile number" 
            />
          </div>
        </div>
        <div className='space-y-2 col-span-1 md:col-span-2'>
          <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>Login Email Address <span className='text-amber-500/70 ml-2'>(Non-editable)</span></label>
          <div className='relative'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30' />
            <input 
              type="email" 
              name="email" 
              value={profile.email} 
              onChange={handleChange} 
              required 
              className='w-full pl-12 p-3 bg-input/50 border border-border/50 rounded outline-none pointer-events-none opacity-60' 
              placeholder="shop@example.com" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
