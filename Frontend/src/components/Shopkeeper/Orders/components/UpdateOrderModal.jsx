import React from 'react';
import { X } from 'lucide-react';

const UpdateOrderModal = ({
  show,
  onClose,
  order,
  editPaymentData,
  setEditPaymentData,
  handleRecordPayment,
  loading
}) => {
  if (!show || !order) return null;

  return (
    <div className='fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-xl font-bold'>Update Order / Payment</h2>
          <button onClick={onClose} className='hover:bg-secondary p-1 rounded-full'><X /></button>
        </div>
        <div className='space-y-4'>
          <select 
            value={editPaymentData.orderStatus} 
            onChange={e => setEditPaymentData({ ...editPaymentData, orderStatus: e.target.value })} 
            className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none'
          >
            <option value='accept'>Status: Accepted</option>
            <option value='progress'>Status: In Progress</option>
            <option value='complete'>Status: Complete</option>
          </select>
          <input
            type='number'
            placeholder='Additional Payment (₹)'
            value={editPaymentData.additionalPayment}
            onChange={e => setEditPaymentData({ ...editPaymentData, additionalPayment: e.target.value })}
            className='w-full p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-400 font-bold outline-none'
          />
          <textarea
            placeholder='Notes'
            value={editPaymentData.notes}
            onChange={e => setEditPaymentData({ ...editPaymentData, notes: e.target.value })}
            className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none h-20'
          />
          <button 
            onClick={handleRecordPayment} 
            disabled={loading} 
            className='w-full p-3 bg-amber-400 text-black font-bold rounded-[8px] hover:bg-amber-500 disabled:opacity-50'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
