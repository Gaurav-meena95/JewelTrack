import React from 'react';
import { ArrowLeft, Phone, Plus, History, Calendar, IndianRupee, Clock, Package, Edit } from 'lucide-react';
import Loading from '../../../../utils/Loading';
import StatusBadge from '../../../../utils/StatusBadge';

const OrderProfileView = ({
  selectedCustomer,
  setViewMode,
  paymentFilter,
  setPaymentFilter,
  currentCustomerOrders,
  openNewOrderModal,
  setActiveOrderDetails,
  setShowViewOrder,
  openEditPayment,
  loading,
  success,
  error,
  orderStatusConfig,
  formatDate,
  formatDateTime
}) => {
  return (
    <div className='space-y-6'>
      <button 
        onClick={() => setViewMode('dashboard')} 
        className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft className='w-4 h-4' /> Back to Orders
      </button>

      {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
      {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

      {/* Customer Header */}
      <div className='bg-secondary/30 border border-border/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='flex items-center gap-4'>
          <div className='h-16 w-16 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center text-2xl font-bold'>
            {selectedCustomer.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className='text-2xl font-bold'>{selectedCustomer.name}</h2>
            <p className='text-muted-foreground flex items-center gap-2'><Phone className='w-4 h-4' /> {selectedCustomer.phone}</p>
          </div>
        </div>
        <button
          onClick={() => openNewOrderModal()}
          className='p-3 px-6 bg-amber-400/80 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-400 font-bold shadow-lg shadow-amber-400/20'
        >
          <Plus className='h-5 w-5' /> New Order
        </button>
      </div>

      <div className='flex flex-wrap gap-2'>
        {['all', 'paid', 'partially_paid', 'unpaid'].map(f => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-4 py-2 rounded-[8px] text-sm font-medium border transition-all ${paymentFilter === f ? 'bg-amber-400 text-black border-amber-400' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground'}`}
          >
            {f === 'all' ? 'All Orders' : f === 'paid' ? 'Paid' : f === 'partially_paid' ? 'Partially Paid' : 'Unpaid'}
          </button>
        ))}
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-bold flex items-center gap-2'><History className='w-5 h-5 text-amber-400' /> Order History</h3>

        {loading ? (
          <div className='py-10 text-center'><Loading /></div>
        ) : currentCustomerOrders.length === 0 ? (
          <div className='text-center py-10 bg-secondary/20 rounded-[8px] border border-border/30'>
            <Package className='w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50' />
            <p className='text-muted-foreground'>No orders found for this filter.</p>
          </div>
        ) : (
          currentCustomerOrders.map(order => {
            const osCfg = orderStatusConfig[order.orderStatus] || orderStatusConfig.accept
            const OsIcon = osCfg.Icon

            return (
              <div key={order._id} className='bg-card/60 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/30 transition-colors'>
                <div className='flex flex-wrap justify-between items-start gap-4 mb-4'>
                  <div className='space-y-1 flex-1 min-w-0'>
                    <div className='flex flex-wrap gap-2 items-center'>
                      <span className={`px-3 py-1 text-xs rounded-full border uppercase inline-flex items-center gap-1 ${osCfg.color}`}>
                        <OsIcon className='w-3 h-3' /> {osCfg.label}
                      </span>
                      <StatusBadge status={order.paymentStatus || 'unpaid'} />
                    </div>
                    <p className='text-sm text-muted-foreground flex items-center gap-2 mt-2'>
                      <Calendar className='w-4 h-4 shrink-0' />
                      Created: {formatDate(order.createdAt)}
                      {order.updatedAt !== order.createdAt && (
                        <span className='text-xs text-muted-foreground/70'>· Updated: {formatDateTime(order.updatedAt)}</span>
                      )}
                    </p>
                    <p className='text-sm font-medium mt-1'>
                      Items: {order.items?.map(i => i.itemName).join(', ')}
                    </p>
                  </div>

                  <div className='text-right space-y-1 shrink-0'>
                    <p className='font-bold text-lg flex items-center justify-end gap'>
                      <span className='text-xs text-muted-foreground font-normal'>Total:</span>
                      <IndianRupee className='w-4 h-4' />{order.Total?.toFixed(0)}
                    </p>
                    <p className='text-sm text-green-500'>Advance: ₹{order.AdvancePayment?.toFixed(0)}</p>
                    {order.RemainingAmount > 0 && <p className='text-sm text-red-500'>Due: ₹{order.RemainingAmount?.toFixed(0)}</p>}
                  </div>
                </div>

                <div className='flex justify-end items-center gap-3 pt-3 border-t border-border/30'>
                  <button
                    onClick={() => { setActiveOrderDetails(order); setShowViewOrder(true) }}
                    className='text-amber-400 text-sm hover:underline'
                  >
                    View Details
                  </button>
                  {order.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => openEditPayment(order)}
                      className='flex items-center gap-1 text-sm text-blue-400 hover:underline'
                    >
                      <Edit className='w-3 h-3' /> Record Payment
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default OrderProfileView;
