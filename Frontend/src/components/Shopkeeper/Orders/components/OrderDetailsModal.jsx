import React from 'react';
import { X, History, BadgeIndianRupeeIcon, Clock } from 'lucide-react';
import StatusBadge from '../../../../utils/StatusBadge';

const OrderDetailsModal = ({
  show,
  onClose,
  order,
  orderStatusConfig,
  formatDate,
  formatDateTime,
  onEnlargeImage
}) => {
  if (!show || !order) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl relative'>
        <button onClick={onClose} className='absolute top-6 right-6 bg-secondary/50 hover:bg-secondary p-2 rounded-full'>
          <X className='w-5 h-5' />
        </button>

        <div className='text-center border-b border-border/50 pb-6 mb-6'>
          <h2 className='text-2xl font-bold uppercase tracking-widest text-amber-400'>Order Details</h2>
          <p className='text-sm text-muted-foreground mt-1'>Placed: {formatDate(order.createdAt)}</p>
          {order.updatedAt !== order.createdAt && (
            <p className='text-xs text-muted-foreground'>Last Updated: {formatDateTime(order.updatedAt)}</p>
          )}
        </div>

        {/* Customer Info */}
        <div className='mb-5'>
          <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1'>Customer</p>
          <p className='text-lg font-bold'>{order.customerId?.name}</p>
          <p className='text-sm text-muted-foreground'>{order.customerId?.phone}</p>
        </div>

        {/* Status Badges */}
        <div className='flex flex-wrap gap-2 mb-5'>
          {(() => {
            const cfg = orderStatusConfig[order.orderStatus] || orderStatusConfig.accept;
            const Icon = cfg.Icon;
            return (
              <span className={`px-3 py-1 text-xs rounded-full border inline-flex items-center gap-1 ${cfg.color}`}>
                <Icon className='w-3 h-3' /> {cfg.label}
              </span>
            );
          })()}
          <StatusBadge status={order.paymentStatus || 'unpaid'} />
        </div>

        {/* Items */}
        <div className='bg-secondary/20 rounded-[8px] border border-border/50 overflow-hidden mb-6'>
          <div className='bg-secondary/40 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground'>Jewelry Items Ordered</div>
          <div className='divide-y divide-border/50'>
            {order.items?.map((item, idx) => (
              <div key={idx} className='p-4'>
                <p className='font-bold'>{item.itemName} <span className='text-xs text-muted-foreground uppercase'>({item.metal})</span></p>
                <div className='flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground'>
                  {item.purity && <span>Purity: {item.purity}</span>}
                  {item.weight && <span>Weight: {item.weight}g</span>}
                  {item.size && <span>Size: {item.size}</span>}
                </div>
                {item.description && <p className='text-xs text-muted-foreground italic mt-1'>"{item.description}"</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Date if any */}
        {order.deliveryDate && (
          <div className='mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-[8px] flex items-center gap-2'>
            <Clock className='w-5 h-5 text-amber-400' />
            <div>
              <p className='text-xs text-amber-400 font-bold uppercase'>Expected Delivery</p>
              <p className='text-sm font-medium'>{formatDate(order.deliveryDate)}</p>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className='flex flex-col md:flex-row justify-between gap-6 mb-6'>
          <div className='flex-1'>
            <div className='flex gap-1 bg-secondary/50 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b rounded-t'>
              <History className='w-4 h-4' /> Payment History
            </div>
            <div className='bg-secondary/20 border border-border/40 p-4 rounded-b space-y-2 max-h-40 overflow-y-auto'>
              {(!order.paymentHistory || order.paymentHistory.length === 0) ? (
                <p className='text-sm text-muted-foreground text-center py-2'>No payments recorded yet.</p>
              ) : (
                order.paymentHistory.map((pay, i) => (
                  <div key={i} className='flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0'>
                    <div>
                      <span className='text-muted-foreground text-xs'>{new Date(pay.date || pay.data).toLocaleDateString()}</span>
                      {pay.notes && <p className='text-[10px] text-muted-foreground italic'>{pay.notes}</p>}
                    </div>
                    <span className='font-medium text-green-500'>+ ₹{pay.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex gap-1 bg-secondary/50 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b rounded-t'>
              <BadgeIndianRupeeIcon className='w-4 h-4' /> Payment details
            </div>
            <div className='bg-secondary/20 border border-border/40 p-4 rounded-b space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Estimated Total:</span>
                <span className='font-bold'>₹{order.Total?.toFixed(0)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Advance Paid:</span>
                <span className='font-bold text-green-500'>₹{order.AdvancePayment?.toFixed(0)}</span>
              </div>
              <div className='flex justify-between text-sm font-bold pt-2 border-t border-border/30'>
                <span className='text-muted-foreground'>Remaining:</span>
                <span className='text-red-500'>₹{order.RemainingAmount?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        {order.image && order.image.length > 0 && (
          <div className='pt-6 border-t border-border/50'>
            <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3'>Reference Photos</p>
            <div className='flex gap-3 overflow-x-auto'>
              {order.image.map((img, idx) => (
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

export default OrderDetailsModal;
