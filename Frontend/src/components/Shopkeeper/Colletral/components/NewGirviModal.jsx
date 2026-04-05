import React from 'react';
import { X, Search, UserCheck, UserX, IndianRupee, ImageIcon, Camera } from 'lucide-react';
import ImageUploadArea from '../../../../utils/ImageUploadArea';

const NewGirviModal = ({
  show,
  onClose,
  customerPhone,
  setCustomerPhone,
  customerFound,
  setCustomerFound,
  checkCustomer,
  customerData,
  setCustomerData,
  girviData,
  setGirviData,
  images,
  handleImageUpload,
  removeImage,
  handleCreateGirvi,
  loading,
  predefinedItemNames
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl border border-border/50 shadow-2xl m-4 relative'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>Register New Girvi / Collateral</h2>
          <button onClick={onClose} className='hover:bg-secondary p-1.5 rounded-full transition-colors'>
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>

        <form onSubmit={handleCreateGirvi} className='space-y-6'>
          {/* Step 1: Customer Lookup */}
          <div className='bg-secondary/40 p-5 rounded-2xl border border-border/50 space-y-4'>
            <h3 className='text-sm font-bold flex items-center gap-2'>
              <Search className='w-4 h-4 text-amber-400' /> 1. Customer Verification
            </h3>
            <div className='flex gap-3'>
              <input
                type='text'
                placeholder='10-digit Phone Number'
                maxLength={10}
                required
                value={customerPhone}
                onChange={(e) => { setCustomerPhone(e.target.value); setCustomerFound(null); }}
                className='flex-1 p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50'
              />
              <button 
                type='button' 
                onClick={checkCustomer} 
                className='bg-secondary px-5 rounded-[8px] hover:bg-secondary/80 border border-border font-medium transition-colors'
              >
                Search
              </button>
            </div>

            {customerFound === true && (
              <div className='text-green-500 text-sm flex items-center gap-2 bg-green-500/10 p-3 rounded border border-green-500/20'>
                <UserCheck className='w-4 h-4 shrink-0' />
                <span>Existing customer identified. Details auto-filled below.</span>
              </div>
            )}
            {customerFound === false && (
              <div className='text-amber-400 text-sm flex items-center gap-2 bg-amber-500/10 p-3 rounded border border-amber-500/20'>
                <UserX className='w-4 h-4 shrink-0' />
                <span>New customer! Please enter their registration details.</span>
              </div>
            )}

            {customerFound !== null && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300'>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Customer Name</label>
                  <input 
                    type='text' 
                    placeholder='Full Name' 
                    required 
                    value={customerData.name} 
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Father's Name</label>
                  <input 
                    type='text' 
                    placeholder="Father's Name" 
                    value={customerData.father_name} 
                    onChange={(e) => setCustomerData({ ...customerData, father_name: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Address</label>
                  <input 
                    type='text' 
                    placeholder='Complete Address' 
                    required 
                    value={customerData.address} 
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Email (Optional)</label>
                  <input 
                    type='email' 
                    placeholder='Email address' 
                    value={customerData.email} 
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Collateral Details */}
          {customerFound !== null && (
            <div className='bg-secondary/40 p-5 rounded-2xl border border-border/50 space-y-4 animate-in slide-in-from-top-4 duration-300'>
              <h3 className='text-sm font-bold'>2. Loan & Jewelry Details</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Jewelry Item</label>
                  <input 
                    type='text' 
                    list='predefined-items' 
                    placeholder='e.g. Gold Necklace, Silver Coin' 
                    required 
                    value={girviData.jewellery} 
                    onChange={(e) => setGirviData({ ...girviData, jewellery: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Weight (Grams)</label>
                  <input 
                    type='number' 
                    step='0.01'
                    placeholder='0.00g' 
                    value={girviData.weight} 
                    onChange={(e) => setGirviData({ ...girviData, weight: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Principal Amount (₹)</label>
                  <div className='relative'>
                    <IndianRupee className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input 
                      type='number' 
                      placeholder='Loan Amount Given' 
                      required 
                      value={girviData.price} 
                      onChange={(e) => setGirviData({ ...girviData, price: e.target.value })} 
                      className='w-full pl-10 p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                    />
                  </div>
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1'>Monthly Interest (%)</label>
                  <div className='relative'>
                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold'>% / Mo</span>
                    <input 
                      type='number' 
                      step='0.1' 
                      placeholder='e.g. 2.0' 
                      required 
                      value={girviData.interestRate} 
                      onChange={(e) => setGirviData({ ...girviData, interestRate: e.target.value })} 
                      className='w-full p-3 pr-16 rounded-[8px] bg-input border border-border/50 focus:border-amber-400/50 outline-none' 
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload Area using shared component */}
              <div className='pt-4 border-t border-border/30'>
                <ImageUploadArea 
                  images={images} 
                  onImageUpload={handleImageUpload} 
                  onRemoveImage={removeImage} 
                  label="Photos of Jewelry" 
                />
              </div>
            </div>
          )}

          <div className='flex gap-4 pt-4'>
            <button 
              type='button' 
              onClick={onClose} 
              className='flex-1 p-4 rounded bg-secondary hover:bg-secondary/80 font-bold border border-border transitions-all'
            >
              Cancel
            </button>
            <button 
              type='submit' 
              disabled={customerFound === null || loading} 
              className='flex-1 p-4 rounded bg-amber-400 text-black font-bold disabled:opacity-50 hover:bg-amber-500 shadow-lg shadow-amber-400/20 transition-all'
            >
              {loading ? 'Processing...' : 'Create Girvi Account'}
            </button>
          </div>
        </form>
      </div>

      <datalist id="predefined-items">
        {predefinedItemNames.map((name, idx) => <option key={idx} value={name} />)}
      </datalist>
    </div>
  );
};

export default NewGirviModal;
