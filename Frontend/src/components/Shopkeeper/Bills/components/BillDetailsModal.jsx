import React from 'react';
import { X, History, BadgeIndianRupeeIcon } from 'lucide-react';

const BillDetailsModal = ({
  show,
  onClose,
  bill,
  onEnlargeImage
}) => {
  if (!show || !bill) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl relative'>
        <button onClick={onClose} className='absolute top-6 right-6 bg-secondary/50 hover:bg-secondary p-2 rounded-full'>
          <X className='w-5 h-5' />
        </button>

        <div className='text-center border-b border-border/50 pb-6 mb-6'>
          <h2 className='text-2xl font-bold uppercase tracking-widest text-amber-400'>Invoice</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Date: {new Date(bill.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className='mb-6'>
          <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1'>Billed To:</p>
          <p className='text-lg font-bold'>{bill.customerId?.name}</p>
          <p className='text-sm text-muted-foreground'>{bill.customerId?.phone}</p>
        </div>

        <div className='bg-secondary/20 rounded-[8px] border border-border/50 overflow-hidden mb-6'>
          <div className='bg-secondary/40 p-3 grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
            <div className='col-span-6'>Item / Details</div>
            <div className='col-span-3 text-right'>Qty/Wt</div>
            <div className='col-span-3 text-right'>Total</div>
          </div>
          
          {/* New Items Section */}
          <div className='divide-y divide-border/50'>
            {(bill.invoice?.items || (bill.invoice?.itemName ? [bill.invoice] : [])).map((item, idx) => (
              <div key={idx} className='p-3 grid grid-cols-12 text-sm items-center'>
                <div className='col-span-6'>
                  <p className='font-bold'>{item.itemName}</p>
                  <p className='text-xs text-muted-foreground'>
                    {[item.purity, item.metal].filter(Boolean).join(' ')}
                  </p>
                </div>
                <div className='col-span-3 text-right text-muted-foreground'>{item.weight}g</div>
                <div className='col-span-3 text-right font-bold'>₹{item.finalPrice?.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Old Items Section */}
          {bill.invoice?.oldItems && bill.invoice.oldItems.length > 0 && (
            <div className='border-t border-border/50 bg-blue-500/5'>
              <div className='px-3 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest'>Old Exchange</div>
              <div className='divide-y divide-border/50'>
                {bill.invoice.oldItems.map((item, idx) => (
                  <div key={idx} className='p-3 grid grid-cols-12 text-sm items-center'>
                    <div className='col-span-6'>
                      <p className='font-bold text-blue-400'>{item.itemName}</p>
                      <p className='text-xs text-muted-foreground'>
                        {[item.purity, item.metal].filter(Boolean).join(' ')}
                      </p>
                    </div>
                    <div className='col-span-3 text-right text-muted-foreground'>{item.weight}g</div>
                    <div className='col-span-3 text-right font-bold text-blue-400'>- ₹{item.totalValue?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col items-end space-y-2 mb-8'>
          <div className='flex justify-between w-64 text-sm'>
            <span className='text-muted-foreground'>New Total:</span>
            <span className='font-bold'>₹{((bill.invoice?.items || []).reduce((acc, i) => acc + (i.finalPrice || 0), 0) || bill.invoice?.finalPrice || 0).toFixed(2)}</span>
          </div>
          {bill.invoice?.oldItemsTotal > 0 && (
            <div className='flex justify-between w-64 text-sm text-blue-400'>
              <span>Exchange Credit:</span>
              <span className='font-bold'>- ₹{bill.invoice.oldItemsTotal.toFixed(2)}</span>
            </div>
          )}
          <div className='flex justify-between w-64 text-sm pt-2 border-t border-border/30'>
            <span className='text-muted-foreground font-bold'>Grand Total:</span>
            <span className='font-bold text-lg'>₹{bill.invoice?.grandTotal?.toFixed(2)}</span>
          </div>
          <div className='flex justify-between w-64 text-sm'>
            <span className='text-muted-foreground'>Amount Paid:</span>
            <span className='font-bold text-green-500'>₹{bill.payment?.amountPaid?.toFixed(2)}</span>
          </div>
          <div className='flex justify-between w-64 text-sm font-bold border-t border-dashed border-border/50 pt-2'>
            <span className='text-muted-foreground'>Balance Due:</span>
            <span className='text-red-500'>₹{bill.payment?.remainingAmount?.toFixed(2)}</span>
          </div>
        </div>

        {bill.image && bill.image.length > 0 && (
          <div className='pt-6 border-t border-border/50'>
            <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3'>Attached Photos</p>
            <div className='flex gap-3 overflow-x-auto'>
              {bill.image.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt='Attachment' 
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
