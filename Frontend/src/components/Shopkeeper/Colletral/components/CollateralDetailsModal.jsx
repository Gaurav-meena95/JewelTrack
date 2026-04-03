import React from 'react';
import { X, ChevronUp, ChevronDown, History, IndianRupee, AlertCircle, Phone, Calendar } from 'lucide-react';
import SectionHeader from '../../../../utils/SectionHeader';

const CollateralDetailsModal = ({
  show,
  onClose,
  account,
  calculateLiveInterest,
  showHistory,
  setShowHistory,
  paymentAmount,
  setPaymentAmount,
  isAdjustment,
  setIsAdjustment,
  handlePayment,
  loading,
  onEnlargeImage
}) => {
  if (!show || !account) return null;

  const liveInterest = calculateLiveInterest(account);
  const remain = account.remainingAmount !== undefined ? account.remainingAmount : account.price;
  const totalPayable = (Number(remain) + Number(liveInterest)).toFixed(2);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl m-4 relative'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold flex items-center gap-2'>
            Account Details 
            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${account.status === 'closed' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
              {account.status}
            </span>
          </h2>
          <button onClick={onClose} className='hover:bg-secondary p-1.5 rounded-full transition-colors'>
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>

        {/* Customer & Item Overview */}
        <div className='grid grid-cols-2 gap-6 mb-8 bg-secondary/30 p-5 rounded-2xl border border-border/50'>
          <div className='space-y-1'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Customer Details</p>
            <h3 className='font-bold text-lg'>{account.customerId?.name}</h3>
            <p className='text-sm text-muted-foreground flex items-center gap-1'><Phone className='w-3 h-3' /> +91 {account.phone}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Collateral Info</p>
            <h3 className='font-bold text-lg'>{account.jewellery}</h3>
            <p className='text-sm text-muted-foreground flex items-center gap-1'><Calendar className='w-3 h-3' /> Opened: {new Date(account.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Product Images */}
        {account.image && account.image.length > 0 && (
          <div className='mb-8'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3'>Reference Photos</p>
            <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
              {account.image.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onEnlargeImage(img)} 
                  className='flex-shrink-0 w-24 h-24 rounded border border-border/50 overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-500/50 transition-all'
                >
                  <img src={img} alt='jewelry' className='w-full h-full object-cover' />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-secondary/20 p-4 rounded-2xl border border-border/30 text-center'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest'>Principal</p>
            <h4 className='text-xl font-extrabold'>₹{account.price.toLocaleString('en-IN')}</h4>
          </div>
          <div 
            className='bg-secondary/20 p-4 rounded-2xl border border-border/30 text-center cursor-pointer group hover:bg-green-500/5 hover:border-green-500/30 transition-all'
            onClick={() => setShowHistory(!showHistory)}
          >
            <p className='text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest'>Paid Amount</p>
            <div className='flex items-center justify-center gap-1'>
              <h4 className='text-xl font-extrabold text-green-500'>₹{(account.totalPaid || 0).toLocaleString('en-IN')}</h4>
              {showHistory ? <ChevronUp className='w-4 h-4 text-green-500' /> : <ChevronDown className='w-4 h-4 text-green-500' />}
            </div>
          </div>
          <div className='bg-red-500/5 p-4 rounded-2xl border border-red-500/20 text-center'>
            <p className='text-[10px] text-red-500/70 uppercase font-bold mb-1 tracking-widest'>Balance Due</p>
            <h4 className='text-xl font-extrabold text-red-500'>₹{Number(totalPayable).toLocaleString('en-IN')}</h4>
            <p className='text-[9px] text-red-500/60 mt-1'>(Incl. ₹{liveInterest} interest)</p>
          </div>
        </div>

        {/* Payment History Section */}
        {showHistory && (
          <div className='bg-secondary/10 border border-border/50 p-5 rounded-2xl mb-8 space-y-3 animate-in slide-in-from-top-2 duration-200'>
            <h4 className='text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground'>
              <History className='w-4 h-4' /> Transaction Log
            </h4>
            <div className='space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
              {(!account.paymentHistory || account.paymentHistory.length === 0) ? (
                <p className='text-sm text-muted-foreground text-center py-4'>No transaction history found.</p>
              ) : (
                account.paymentHistory.map((pay, i) => (
                  <div key={i} className='flex justify-between items-center text-sm border-b border-border/20 pb-2 last:border-0'>
                    <div className='space-y-0.5'>
                      <span className='font-medium text-xs text-muted-foreground'>{new Date(pay.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      {pay.type === 'adjustment' && <p className='text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full inline-block font-bold ml-2 uppercase'>Adjustment</p>}
                      {pay.note && <p className='text-[10px] text-muted-foreground italic'>{pay.note}</p>}
                    </div>
                    <span className='font-bold text-green-500'>+ ₹{pay.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Payment Action Section */}
        {account.status === 'active' && (
          <div className='bg-amber-400/5 p-6 rounded-3xl border border-amber-400/10 shadow-inner'>
            <h4 className='text-sm font-bold mb-4 flex items-center gap-2'>
              <IndianRupee className='w-4 h-4 text-amber-500' /> Receive Payment / Settle
            </h4>
            <div className='flex gap-3 mb-4'>
              <div className='relative flex-1'>
                <IndianRupee className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/40' />
                <input
                  type='number'
                  placeholder='Enter amount received'
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className='w-full pl-10 p-4 rounded bg-input border border-amber-400/20 focus:border-amber-400 outline-none placeholder:text-muted-foreground/30 font-bold transition-all'
                />
              </div>
              <button 
                onClick={handlePayment} 
                disabled={loading || !paymentAmount} 
                className='px-8 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg shadow-green-600/20 disabled:opacity-30 transition-all'
              >
                {loading ? '...' : 'Receive'}
              </button>
            </div>

            <div className='flex items-center gap-3 px-1'>
              <div className='relative flex items-center'>
                <input 
                  type='checkbox' 
                  id='adjustment' 
                  checked={isAdjustment} 
                  onChange={(e) => setIsAdjustment(e.target.checked)} 
                  className='appearance-none w-5 h-5 rounded border border-amber-400/40 checked:bg-amber-400 cursor-pointer checked:border-amber-400 transition-all' 
                />
                <X className={`absolute pointer-events-none w-3.5 h-3.5 left-0.5 top-0.5 text-black ${isAdjustment ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <label htmlFor='adjustment' className='text-xs text-muted-foreground cursor-pointer group flex items-center gap-1.5 hover:text-foreground transition-colors font-medium'>
                <AlertCircle className='w-3.5 h-3.5 text-amber-500/80 group-hover:text-amber-500' /> 
                Final Settlement Adjustment? 
                <span className='text-[9px] uppercase tracking-tighter opacity-60'>(Closes account with discount)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollateralDetailsModal;
