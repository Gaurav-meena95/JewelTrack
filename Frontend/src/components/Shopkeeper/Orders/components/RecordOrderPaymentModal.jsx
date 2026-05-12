import React from 'react';
import { X } from 'lucide-react';

const RecordOrderPaymentModal = ({
  show,
  onClose,
  order,
  editPaymentData,
  setEditPaymentData,
  handleRecordPayment,
  loading,
  error
}) => {
  if (!show || !order) return null;

  const total = Number(order.Total) || 0;
  const advance = Number(order.AdvancePayment) || 0;
  const historyTotal = (order.paymentHistory || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaid = advance + historyTotal;
  const remaining = order.RemainingAmount || 0;
  
  const additional = Number(editPaymentData.additionalPayment) || 0;
  const remainingAfterPayment = Math.max(0, remaining - additional);

  return (
    <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-xl font-bold'>Record Order Payment</h2>
          <button onClick={onClose} className='hover:bg-secondary p-1 rounded-full'><X /></button>
        </div>

        {error && (
          <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>
            {error}
          </div>
        )}

        <div className='bg-secondary/30 rounded-[8px] p-4 mb-5 space-y-1'>
          <p className='text-sm font-bold'>{order.customerId?.name}</p>
          <p className='text-xs text-muted-foreground'>
            Order: {order.items?.map(i => i.itemName).join(', ')}
          </p>
          <div className='flex justify-between text-sm mt-2'>
            <span className='text-muted-foreground'>Order Total:</span>
            <span className='font-bold'>₹{total.toFixed(0)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Already Paid:</span>
            <span className='text-green-500 font-bold'>₹{totalPaid.toFixed(0)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Balance Due:</span>
            <span className='text-red-500 font-bold'>₹{remaining.toFixed(0)}</span>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 block'>
              Additional Payment Now (₹)
            </label>
            <input
              type='number'
              placeholder='Enter amount paying now...'
              value={editPaymentData.additionalPayment}
              onChange={e => setEditPaymentData({ ...editPaymentData, additionalPayment: e.target.value })}
              className='w-full p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-400 font-bold outline-none focus:border-green-500'
            />
          </div>

          {editPaymentData.additionalPayment && (
            <div className={`p-3 rounded-[8px] border text-sm font-bold flex justify-between ${remainingAfterPayment === 0 ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
              <span>Remaining After Payment:</span>
              <span>₹{remainingAfterPayment.toFixed(0)}</span>
            </div>
          )}

          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 block'>Payment Method</label>
            <select
              value={editPaymentData.paymentMethod}
              onChange={e => setEditPaymentData({ ...editPaymentData, paymentMethod: e.target.value })}
              className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none'
            >
              <option value='cash'>Cash</option>
              <option value='upi'>UPI / Wallet</option>
              <option value='card'>Card</option>
              <option value='bank_transfer'>Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 block'>Update Order Status</label>
            <select 
              value={editPaymentData.orderStatus} 
              onChange={e => setEditPaymentData({ ...editPaymentData, orderStatus: e.target.value })} 
              className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none'
            >
              <option value='accept'>Accepted</option>
              <option value='progress'>In Progress</option>
              <option value='complete'>Complete</option>
            </select>
          </div>

          <button
            onClick={handleRecordPayment}
            disabled={loading || !editPaymentData.additionalPayment}
            className='w-full p-3 bg-amber-400 text-black font-bold rounded-[8px] hover:bg-amber-500 disabled:opacity-50'
          >
            {loading ? 'Saving...' : 'Save Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordOrderPaymentModal;
