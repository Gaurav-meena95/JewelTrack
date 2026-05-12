import React from 'react';
import { ArrowLeft, Plus, Phone, WeightIcon, IndianRupee, Trash2, Edit } from 'lucide-react';
import StatusBadge from '../../../../utils/StatusBadge';

const CollateralProfileView = ({
  selectedCustomer,
  setViewMode,
  filter,
  setFilter,
  currentCustomerCollaterals,
  setShowNewGirvi,
  setSelectedAccount,
  setShowAccount,
  setShowRecordPayment,
  setEditPaymentData,
  handleDeleteCollateral,
  calculateLiveInterest,
  success,
  error,
  formatDate
}) => {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/30 p-6 rounded-2xl border border-border/50'>
        <div className='flex items-center gap-4'>
          <button 
            onClick={() => setViewMode('dashboard')} 
            className='p-2 hover:bg-secondary rounded-full transition-colors'
          >
            <ArrowLeft className='w-6 h-6' />
          </button>
          <div>
            <h2 className='text-2xl font-bold text-amber-400'>{selectedCustomer.name}</h2>
            <p className='text-sm text-muted-foreground flex items-center gap-1.5'>
              <Phone className='w-3.5 h-3.5' /> {selectedCustomer.phone}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewGirvi(true)} 
          className='flex items-center gap-2 bg-amber-400 text-black px-5 py-2.5 rounded-[8px] font-bold hover:bg-amber-500 transition-colors'
        >
          <Plus className='w-5 h-5' /> New Girvi
        </button>
      </div>

      {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
      {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

      <div className='flex gap-2 bg-card p-1.5 rounded border border-border/50 w-fit'>
        {['all', 'active', 'closed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded text-sm font-bold capitalize transition-all ${filter === f ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-6'>
        {currentCustomerCollaterals.map((item, index) => {
          const liveInterest = calculateLiveInterest(item)
          const remain = item.remainingAmount !== undefined ? item.remainingAmount : item.price
          const totalPayable = (Number(remain) + Number(liveInterest)).toFixed(2)

          return (
            <div key={item._id || index} className='bg-card/40 border border-border/50 p-6 rounded-2xl relative hover:border-amber-400/30 transition-all group'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 font-extrabold shadow-inner'>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className='text-xl font-bold group-hover:text-amber-400 transition-colors'>{item.jewellery}</h3>
                    <p className='text-sm text-muted-foreground'>Opened: {formatDate(item.createdAt)}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3 w-full md:w-auto justify-end'>
                  <StatusBadge status={item.status} />
                  {item.status === 'closed' && (
                    <div className='flex gap-2 bg-secondary/50 p-1.5 rounded border border-border/50 shadow-sm'>
                      <button onClick={() => handleDeleteCollateral(item._id, item.phone)} className='p-2 hover:bg-red-500/20 rounded transition-colors group/del'>
                        <Trash2 className='h-4 w-4 text-red-500 group-hover/del:scale-110 transition-transform' />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-secondary/20 p-5 rounded-2xl border border-border/30 mb-4'>
                <div className='space-y-1'>
                  <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Weight</p>
                  <h4 className='font-bold flex items-center gap-1'><WeightIcon className='h-3.5 w-3.5 text-amber-400/50' />{item.weight}g</h4>
                </div>
                <div className='space-y-1'>
                  <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Principal</p>
                  <h4 className='font-bold flex items-center gap-1'><IndianRupee className='h-3.5 w-3.5 text-amber-400/50' />{item.price.toLocaleString('en-IN')}</h4>
                </div>
                <div className='space-y-1'>
                  <p className='text-[10px] text-amber-400 uppercase font-bold tracking-widest'>Interest ({item.interestRate}%)</p>
                  <h4 className='font-bold text-amber-400 flex items-center gap-1'>+ <IndianRupee className='h-3.5 w-3.5' />{liveInterest}</h4>
                </div>
                <div className='space-y-1'>
                  <p className='text-[10px] text-green-500 uppercase font-bold tracking-widest'>Total Paid</p>
                  <h4 className='font-bold text-green-500 flex items-center gap-1'><IndianRupee className='h-3.5 w-3.5' />{item.totalPaid || 0}</h4>
                </div>
                <div className='space-y-1'>
                  <p className='text-[10px] text-red-500 uppercase font-bold tracking-widest'>Due Balance</p>
                  <h4 className='font-extrabold text-red-500 flex items-center gap-1'><IndianRupee className='h-3.5 w-3.5' />{Number(totalPayable).toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className='flex justify-end items-center gap-3 pt-3 border-t border-border/30'>
                <button
                  onClick={() => { setSelectedAccount(item); setShowAccount(true); }}
                  className='text-amber-400 text-sm hover:underline'
                >
                  View Account Details
                </button>
                {item.status === 'active' && (
                  <button
                    onClick={() => { 
                      setSelectedAccount(item); 
                      setShowRecordPayment(true); 
                      setEditPaymentData({ additionalPayment: '', paymentMethod: 'cash', note: '' });
                    }}
                    className='flex items-center gap-1 text-sm text-blue-400 hover:underline'
                  >
                    <Edit className='w-3 h-3' /> Record Repayment
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {currentCustomerCollaterals.length === 0 && (
          <div className='text-center py-20 border-2 border-dashed border-border/50 rounded-3xl'>
            <h2 className='text-muted-foreground text-xl font-medium'>No accounts found for this filter</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollateralProfileView;
