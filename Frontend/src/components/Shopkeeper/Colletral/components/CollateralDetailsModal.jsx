import React from 'react';
import { X, History, BadgeIndianRupeeIcon, Calendar, WeightIcon, Percent, Clock } from 'lucide-react';
import StatusBadge from '../../../../utils/StatusBadge';

const CollateralDetailsModal = ({
  show,
  onClose,
  account,
  calculateLiveInterest,
  onEnlargeImage
}) => {
  if (!show || !account) return null;

  const liveInterest = calculateLiveInterest(account);
  const remain = account.remainingAmount !== undefined ? account.remainingAmount : account.price;
  const totalPayable = (Number(remain) + Number(liveInterest)).toFixed(2);

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
          <h2 className='text-2xl font-bold uppercase tracking-widest text-amber-400'>Account Details</h2>
          <p className='text-sm text-muted-foreground mt-1'>Opened: {formatDate(account.createdAt)}</p>
          {account.updatedAt !== account.createdAt && (
            <p className='text-xs text-muted-foreground'>Last Updated: {formatDateTime(account.updatedAt)}</p>
          )}
        </div>

        {/* Customer Info */}
        <div className='mb-5'>
          <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1'>Customer</p>
          <p className='text-lg font-bold'>{account.customerId?.name}</p>
          <p className='text-sm text-muted-foreground'>{account.customerId?.phone}</p>
        </div>

        {/* Status Badge */}
        <div className='mb-5'>
          <StatusBadge status={account.status || 'active'} />
        </div>

        {/* Girvi Item Details */}
        <div className='bg-secondary/20 rounded-[8px] border border-border/50 overflow-hidden mb-6'>
          <div className='bg-secondary/40 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground'>Collateral Item</div>
          <div className='p-4'>
            <p className='font-bold text-lg'>{account.jewellery}</p>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-3'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <WeightIcon className='w-4 h-4 text-amber-400' />
                <span>Weight: {account.weight}g</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Percent className='w-4 h-4 text-amber-400' />
                <span>Interest: {account.interestRate}%/mo</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='w-4 h-4 text-amber-400' />
                <span>Tenure: {Math.floor((Date.now() - new Date(account.createdAt)) / (1000 * 60 * 60 * 24))} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interest Summary if Active */}
        {account.status === 'active' && (
          <div className='mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-[8px] flex items-center gap-2'>
            <Clock className='w-5 h-5 text-red-500' />
            <div>
              <p className='text-xs text-red-500 font-bold uppercase'>Accumulated Interest</p>
              <p className='text-sm font-bold text-red-500'>+ ₹{liveInterest} <span className='text-[10px] text-muted-foreground font-normal'>(Auto-calculated)</span></p>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className='flex flex-col md:flex-row justify-between gap-6 mb-6'>
          <div className='flex-1'>
            <div className='flex gap-1 bg-secondary/50 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b rounded-t'>
              <History className='w-4 h-4' /> Repayment History
            </div>
            <div className='bg-secondary/20 border border-border/40 p-4 rounded-b space-y-2 max-h-40 overflow-y-auto'>
              {(!account.paymentHistory || account.paymentHistory.length === 0) ? (
                <p className='text-sm text-muted-foreground text-center py-2'>No repayments recorded yet.</p>
              ) : (
                account.paymentHistory.map((pay, i) => (
                  <div key={i} className='flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0'>
                    <div>
                      <span className='text-muted-foreground text-xs'>{formatDate(pay.date)}</span>
                      {pay.note && <p className='text-[10px] text-muted-foreground italic'>{pay.note}</p>}
                    </div>
                    <span className='font-medium text-green-500'>+ ₹{pay.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex gap-1 bg-secondary/50 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b rounded-t'>
              <BadgeIndianRupeeIcon className='w-4 h-4' /> Account Balance
            </div>
            <div className='bg-secondary/20 border border-border/40 p-3 sm:p-4 rounded-b space-y-2'>
              <div className='flex justify-between text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Principal Loan:</span>
                <span className='font-bold'>₹{account.price?.toLocaleString('en-IN')}</span>
              </div>
              <div className='flex justify-between text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Live Interest:</span>
                <span className='font-bold text-red-400'>+ ₹{liveInterest}</span>
              </div>
              <div className='flex justify-between text-xs sm:text-sm'>
                <span className='text-muted-foreground'>Total Paid:</span>
                <span className='font-bold text-green-500'>₹{account.totalPaid || 0}</span>
              </div>
              <div className='flex justify-between text-xs sm:text-sm font-bold pt-2 border-t border-border/30'>
                <span className='text-muted-foreground font-bold'>Total Payable:</span>
                <span className='text-red-500 text-base sm:text-lg'>₹{Number(totalPayable).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        {account.image && account.image.length > 0 && (
          <div className='pt-6 border-t border-border/50'>
            <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3'>Reference Photos</p>
            <div className='flex gap-3 overflow-x-auto'>
              {account.image.map((img, idx) => (
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

export default CollateralDetailsModal;
