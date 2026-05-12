import React from 'react';
import { X, History, BadgeIndianRupeeIcon, Calendar } from 'lucide-react';
import StatusBadge from '../../../../utils/StatusBadge';

const BillDetailsModal = ({
  show,
  onClose,
  bill,
  onEnlargeImage
}) => {
  if (!show || !bill) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl relative'>
        <button onClick={onClose} className='absolute top-6 right-6 bg-secondary/50 hover:bg-secondary p-2 rounded-full'>
          <X className='w-5 h-5' />
        </button>

        <div className='text-center border-b border-border/50 pb-6 mb-6'>
          <h2 className='text-2xl font-bold uppercase tracking-widest text-amber-400'>Bill Details</h2>
          <p className='text-sm text-muted-foreground mt-1'>Invoice Date: {formatDate(bill.createdAt)}</p>
          {bill.updatedAt !== bill.createdAt && (
            <p className='text-xs text-muted-foreground'>Last Updated: {formatDateTime(bill.updatedAt)}</p>
          )}
        </div>

        {/* Customer Info */}
        <div className='mb-5'>
          <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1'>Customer</p>
          <p className='text-lg font-bold'>{bill.customerId?.name}</p>
          <p className='text-sm text-muted-foreground'>{bill.customerId?.phone}</p>
        </div>

        {/* Status Badge */}
        <div className='mb-5'>
          <StatusBadge status={bill.payment?.paymentStatus || 'unpaid'} />
        </div>

        {/* Items Section */}
        <div className='bg-secondary/20 rounded-[8px] border border-border/50 overflow-hidden mb-6'>
          <div className='bg-secondary/40 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground'>Purchased Jewelry Items</div>
          <div className='divide-y divide-border/50'>
            {(bill.invoice?.items || (bill.invoice?.itemName ? [bill.invoice] : [])).map((item, idx) => (
              <div key={idx} className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                <div>
                  <p className='font-bold text-sm sm:text-base'>{item.itemName} <span className='text-[10px] sm:text-xs text-muted-foreground uppercase font-normal'>({item.metal})</span></p>
                  <div className='flex flex-wrap gap-2 sm:gap-4 mt-1 text-[10px] sm:text-xs text-muted-foreground'>
                    {item.purity && <span>Purity: {item.purity}</span>}
                    {item.weight && <span>Weight: {item.weight}g</span>}
                    {item.size && <span>Size: {item.size}</span>}
                  </div>
                  {item.description && <p className='text-[10px] sm:text-xs text-muted-foreground italic mt-1'>"{item.description}"</p>}
                </div>
                <div className='text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-border/20 pt-2 sm:pt-0'>
                  <p className='font-bold text-amber-400'>₹{item.finalPrice?.toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Old Jewelry Exchange */}
          {bill.invoice?.oldItems && bill.invoice.oldItems.length > 0 && (
            <div className='border-t border-border/50 bg-blue-500/5'>
              <div className='bg-blue-500/10 p-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest'>Old Jewelry Credit</div>
              <div className='divide-y divide-border/50'>
                {bill.invoice.oldItems.map((item, idx) => (
                  <div key={idx} className='p-3 flex justify-between items-center'>
                    <div>
                      <p className='font-bold text-blue-400'>{item.itemName}</p>
                      <p className='text-[10px] text-muted-foreground'>
                        {item.weight}g | {item.metal} {item.purity}
                      </p>
                    </div>
                    <p className='font-bold text-blue-400'>- ₹{item.totalValue?.toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className='flex flex-col md:flex-row justify-between gap-6 mb-6'>
          <div className='flex-1'>
            <div className='flex gap-1 bg-secondary/50 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b rounded-t'>
              <History className='w-4 h-4' /> Payment History
            </div>
            <div className='bg-secondary/20 border border-border/40 p-4 rounded-b space-y-2 max-h-40 overflow-y-auto'>
              {(!bill.payment?.paymentHistory || bill.payment.paymentHistory.length === 0) ? (
                <div className='text-sm text-muted-foreground text-center py-2'>
                  <div className='flex justify-between items-center mb-1'>
                    <span>Initial Payment</span>
                    <span className='font-bold text-green-500'>+ ₹{bill.payment?.amountPaid || 0}</span>
                  </div>
                  <p className='text-[10px] opacity-60 italic'>Recorded at creation</p>
                </div>
              ) : (
                bill.payment.paymentHistory.map((pay, i) => (
                  <div key={i} className='flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0'>
                    <div>
                      <span className='text-muted-foreground text-xs'>{formatDate(pay.date)}</span>
                      {pay.note && <p className='text-[10px] text-muted-foreground italic'>{pay.note}</p>}
                      {pay.method && <p className='text-[8px] text-muted-foreground uppercase font-bold'>{pay.method}</p>}
                    </div>
                    <span className='font-medium text-green-500'>+ ₹{pay.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex gap-1 bg-secondary/50 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b rounded-t'>
              <BadgeIndianRupeeIcon className='w-4 h-4' /> Bill Summary
            </div>
            <div className='bg-secondary/20 border border-border/40 p-3 sm:p-4 rounded-b space-y-2'>
              <div className='flex justify-between text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Grand Total:</span>
                <span className='font-bold'>₹{bill.invoice?.grandTotal?.toFixed(0)}</span>
              </div>
              <div className='flex justify-between text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Total Paid:</span>
                <span className='font-bold text-green-500'>₹{bill.payment?.amountPaid?.toFixed(0)}</span>
              </div>
              <div className='flex justify-between text-xs sm:text-sm font-bold pt-2 border-t border-border/30'>
                <span className='text-muted-foreground'>Balance Due:</span>
                <span className='text-red-500'>₹{bill.payment?.remainingAmount?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        {bill.image && bill.image.length > 0 && (
          <div className='pt-6 border-t border-border/50'>
            <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3'>Reference Photos</p>
            <div className='flex gap-3 overflow-x-auto'>
              {bill.image.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt='Reference' 
                  onClick={() => onEnlargeImage(img)} 
                  className='w-20 h-20 rounded-[8px] object-cover border border-border/50 cursor-pointer hover:opacity-80 transition-opacity' 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillDetailsModal;
