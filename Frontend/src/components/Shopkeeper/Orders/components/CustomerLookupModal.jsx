import React from 'react';
import { UserX, X } from 'lucide-react';

const CustomerLookupModal = ({
  show,
  onClose,
  customerPhone,
  setCustomerPhone,
  customerFound,
  setCustomerFound,
  checkCustomer,
  customerData,
  handleProceedToOrder,
  setCustomerData,
  loading
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>Find Customer</h2>
          <button onClick={onClose} className='hover:bg-secondary p-1 rounded-full'><X /></button>
        </div>
        <form onSubmit={handleProceedToOrder} className='space-y-4'>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='10-digit Phone Number'
              maxLength={10}
              value={customerPhone}
              onChange={(e) => { setCustomerPhone(e.target.value); setCustomerFound(null) }}
              className='flex-1 p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400'
            />
            <button
              type='button'
              onClick={checkCustomer}
              className='bg-secondary px-5 rounded-[8px] hover:bg-secondary/80 font-medium'
            >
              Search
            </button>
          </div>
          {customerFound === true && (
            <div className='p-4 bg-green-500/10 border border-green-500/30 rounded-[8px]'>
              <p className='text-green-500 flex items-center gap-2 font-bold'>Customer Found!</p>
              <p className='text-sm text-muted-foreground mt-1'>{customerData.name} · {customerPhone}</p>
            </div>
          )}
          {customerFound === false && (
            <div className='text-amber-400 text-sm flex items-center gap-1'>
              <UserX className='w-4 h-4' /> New Customer. Please fill details.
            </div>
          )}
          {(customerFound !== null) && (
            <div className='space-y-3 pt-2'>
              <input 
              type="text" 
              placeholder='Full Name'
              required
              value={customerData.name}
              onChange={(e) => setCustomerData({...customerData,name:e.target.value})}
              className='w-full p-3 rounded-[8px] bg-input border border-border/50'
              />
              <input 
              type="text" 
              placeholder="Father's Name"
              required
              value={customerData.father_name}
              onChange={(e) => setCustomerData({...customerData,father_name:e.target.value})}
              className='w-full p-3 rounded-[8px] bg-input border border-border/50'
              />
              <input 
              type="text" 
              placeholder='Address'
              required
              value={customerData.address}
              onChange={(e) => setCustomerData({...customerData,address:e.target.value})}
              className='w-full p-3 rounded-[8px] bg-input border border-border/50'
              />

            </div>
          )}
          <button
            onClick={handleProceedToOrder}
            disabled={customerFound === null} 
            className='w-full p-3 bg-amber-400/90 text-black font-bold rounded-[8px] disabled:opacity-40 hover:bg-amber-400'
          >
            Proceed to Create Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerLookupModal;
