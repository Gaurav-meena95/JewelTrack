import React from 'react';
import { X } from 'lucide-react';

const RecordPaymentModal = ({
  show,
  onClose,
  bill,
  editPaymentData,
  setEditPaymentData,
  remainingAfterBillEdit,
  handleRecordBillPayment,
  loading,
  error
}) => {
  if (!show || !bill) return null;

  return (
    <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-xl font-bold'>Record Payment</h2>
          <button onClick={onClose} className='hover:bg-secondary p-1 rounded-full'><X /></button>
        </div>

        {error && (
          <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>
            {error}
          </div>
        )}

        <div className='bg-secondary/30 rounded-[8px] p-4 mb-5 space-y-1'>
          <p className='text-sm font-bold'>{bill.customerId?.name}</p>
          <p className='text-xs text-muted-foreground'>
            Items: {bill.invoice?.items?.map(i => i.itemName).join(', ') || bill.invoice?.itemName}
          </p>
          <div className='flex justify-between text-sm mt-2'>
            <span className='text-muted-foreground'>Invoice Total:</span>
            <span className='font-bold'>
              ₹{(bill.invoice?.grandTotal || bill.invoice?.finalPrice)?.toFixed(0)}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Already Paid:</span>
            <span className='text-green-500 font-bold'>₹{bill.payment?.amountPaid?.toFixed(0)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Currently Due:</span>
            <span className='text-red-500 font-bold'>₹{bill.payment?.remainingAmount?.toFixed(0)}</span>
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-muted-foreground mb-1 block'>
              Additional Payment Now (₹)
            </label>
            <input
              type='number'
              placeholder='Enter amount customer is paying now...'
              value={editPaymentData.additionalPayment}
              onChange={e => setEditPaymentData({ ...editPaymentData, additionalPayment: e.target.value })}
              className='w-full p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-400 font-bold outline-none focus:border-green-500'
            />
          </div>

          {editPaymentData.additionalPayment && (
            <div className={`p-3 rounded-[8px] border text-sm font-bold flex justify-between ${remainingAfterBillEdit === 0 ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
              <span>Remaining After Payment:</span>
              <span>₹{remainingAfterBillEdit.toFixed(0)}</span>
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

          <button
            onClick={handleRecordBillPayment}
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

export default RecordPaymentModal;
