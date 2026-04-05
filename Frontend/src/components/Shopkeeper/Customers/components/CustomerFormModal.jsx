import React from 'react';
import { X, User, Phone, MapPin, Mail, AtSign } from 'lucide-react';

const CustomerFormModal = ({
  show,
  onClose,
  isEditing,
  formData,
  handelChange,
  handelSubmit,
  loading,
  error
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
      <div className='bg-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl relative'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold flex items-center gap-3'>
            <div className='p-2 bg-amber-400/20 rounded'>
              <User className='h-6 w-6 text-amber-400' />
            </div>
            {isEditing ? 'Update Customer' : 'Register New Customer'}
          </h2>
          <button 
            onClick={onClose} 
            className='hover:bg-secondary p-1.5 rounded-full transition-colors'
          >
            <X className='h-5 w-5 text-muted-foreground' />
          </button>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-sm mb-6 flex items-center gap-2'>
            <X className='h-4 w-4' /> {error}
          </div>
        )}

        <form onSubmit={handelSubmit} className='space-y-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1'>Customer Full Name <span className='text-red-500'>*</span></label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handelChange}
                  placeholder='e.g. Rahul Sharma'
                  className='p-3 pl-10 rounded w-full bg-input/50 border border-border/80 focus:border-amber-400/50 transition-all outline-none'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1'>Father's Name <span className='text-red-500'>*</span></label>
              <input
                type='text'
                name='father_name'
                value={formData.father_name}
                onChange={handelChange}
                placeholder="Father's name"
                className='p-3 rounded w-full bg-input/50 border border-border/80 focus:border-amber-400/50 transition-all outline-none'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1'>Phone Number <span className='text-red-500'>*</span></label>
              <div className='relative'>
                <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  type='text'
                  name='phone'
                  value={formData.phone}
                  onChange={handelChange}
                  placeholder='10-digit number'
                  maxLength={10}
                  className='p-3 pl-10 rounded w-full bg-input/50 border border-border/80 focus:border-amber-400/50 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                  required
                  disabled={isEditing}
                />
              </div>
              {isEditing && <p className='text-[10px] text-muted-foreground ml-1'>※ Phone number cannot be modified</p>}
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1'>Email Address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handelChange}
                  placeholder='name@email.com'
                  className='p-3 pl-10 rounded w-full bg-input/50 border border-border/80 focus:border-amber-400/50 transition-all outline-none'
                />
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1'>Complete Residential Address <span className='text-red-500'>*</span></label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-3 w-4 h-4 text-muted-foreground' />
              <textarea
                name='address'
                value={formData.address}
                onChange={handelChange}
                placeholder='House no., Area, City, Pin'
                className='p-3 pl-10 h-24 rounded w-full bg-input/50 border border-border/80 focus:border-amber-400/50 transition-all outline-none resize-none'
                required
              />
            </div>
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 p-4 rounded bg-secondary hover:bg-secondary/80 font-bold transition-all border border-border/50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 p-4 rounded bg-amber-400 text-black font-bold hover:bg-amber-500 disabled:opacity-50 transition-all shadow-lg shadow-amber-400/20'
            >
              {loading ? (isEditing ? 'Updating...' : 'Registering...') : (isEditing ? 'Update Profile' : 'Complete Registration')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
