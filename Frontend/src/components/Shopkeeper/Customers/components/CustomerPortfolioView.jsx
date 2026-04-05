import React from 'react';
import { ArrowLeft, User, Phone, Mail, Search, Clock, IndianRupee, MapPin } from 'lucide-react';

const CustomerPortfolioView = ({
  selectedCustomerDetail,
  setSelectedCustomerDetail,
  activeTab,
  setActiveTab
}) => {
  if (!selectedCustomerDetail) return null;

  const { customer, bills, orders, collaterals } = selectedCustomerDetail;

  const metrics = [
    {
      title: 'Bill History',
      count: bills.length,
      color: 'amber',
      stats: [
        { label: 'Total Value', value: bills.reduce((sum, b) => sum + (b.invoice?.grandTotal || 0), 0) },
        { label: 'Collected', value: bills.reduce((sum, b) => sum + (b.payment?.amountPaid || 0), 0), text: 'text-green-500' },
        { label: 'Pending', value: bills.reduce((sum, b) => sum + (b.payment?.remainingAmount || 0), 0), text: 'text-red-400' }
      ]
    },
    {
      title: 'Active Orders',
      count: orders.length,
      color: 'blue',
      stats: [
        { label: 'Order Value', value: orders.reduce((sum, o) => sum + (o.Total || 0), 0) },
        { label: 'Advance Paid', value: orders.reduce((sum, o) => sum + (o.AdvancePayment || 0), 0), text: 'text-green-500' },
        { label: 'Pending', value: orders.reduce((sum, o) => sum + (o.RemainingAmount || 0), 0), text: 'text-red-400' }
      ]
    },
    {
      title: 'Collateral / Loan',
      count: collaterals.length,
      color: 'purple',
      stats: [
        { label: 'Total Loan', value: collaterals.reduce((sum, c) => sum + (c.price || 0), 0) },
        { label: 'Recovered', value: collaterals.reduce((sum, c) => sum + (c.totalPaid || 0), 0), text: 'text-green-500' },
        { label: 'Principal Due', value: collaterals.reduce((sum, c) => sum + (c.remainingAmount || 0), 0), text: 'text-red-400' }
      ]
    }
  ];

  const formatCurrency = (val) => val.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20'>
      {/* Header */}
      <div className='flex items-center gap-4 border-b border-border/50 pb-6'>
        <button
          onClick={() => setSelectedCustomerDetail(null)}
          className='p-3 hover:bg-secondary rounded-2xl transition-all border border-border/50 shadow-sm'
        >
          <ArrowLeft className='h-5 w-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold'>Customer Portfolio</h1>
          <p className='text-muted-foreground text-sm flex items-center gap-2'>
             Professional transaction history & profile overview
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className='flex flex-col md:flex-row items-center gap-8 bg-linear-to-br from-amber-400/10 to-transparent p-8 rounded-3xl border border-amber-400/20 shadow-xl shadow-amber-400/5 relative overflow-hidden group'>
        <div className='absolute -right-10 -top-10 h-40 w-40 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-colors'></div>
        
        <div className='h-24 w-24 shadow-2xl shadow-amber-400/30 rounded-3xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 border-4 border-white/10'>
          <User className='h-12 w-12 text-black' />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative z-10'>
          <div className='space-y-1'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Full Name</p>
            <p className='font-bold text-xl'>{customer.name}</p>
            <p className='text-sm text-muted-foreground'>S/O {customer.father_name}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Contact Details</p>
            <div className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-amber-400' />
              <span className='font-bold text-lg'>+91 {customer.phone}</span>
            </div>
            {customer.email && (
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Mail className='h-3 w-3' />
                <span className='text-xs truncate'>{customer.email}</span>
              </div>
            )}
          </div>
          <div className='space-y-1 lg:col-span-1'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Address</p>
            <div className='flex items-start gap-2 max-w-xs'>
                <MapPin className='h-4 w-4 text-amber-400 shrink-0 mt-0.5' />
                <p className='text-sm font-medium leading-relaxed'>{customer.address}</p>
            </div>
          </div>
          <div className='space-y-1'>
            <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Member Since</p>
            <p className='font-bold text-lg'>{new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            <p className='text-xs text-muted-foreground'>ID: {customer._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Summaries */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4'>
        {metrics.map((m, idx) => (
          <div key={idx} className={`bg-secondary/20 border border-border/50 p-6 rounded-3xl hover:border-${m.color}-400/50 transition-all group shadow-sm hover:shadow-lg`}>
            <div className='flex justify-between items-center mb-6'>
              <h3 className={`font-bold text-lg text-${m.color}-400`}>{m.title}</h3>
              <span className={`bg-${m.color}-400/10 text-${m.color}-500 px-3 py-1 rounded-full text-xs font-black ring-1 ring-${m.color}-400/20`}>
                {m.count} RECORDS
              </span>
            </div>
            <div className='space-y-3'>
              {m.stats.map((s, i) => (
                <div key={i} className='flex justify-between items-center bg-card/60 p-3 rounded-2xl border border-border/30'>
                  <span className='text-xs font-bold text-muted-foreground uppercase tracking-tighter'>{s.label}</span>
                  <span className={`font-black text-sm ${s.text || 'text-foreground'}`}>
                    ₹{s.value?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Transaction History */}
      <div className='mt-12 space-y-6'>
        <div className='flex items-center justify-between px-1'>
            <h3 className='text-xl font-black uppercase tracking-tight'>Transaction Ledger</h3>
        </div>

        <div className='flex gap-2 bg-secondary/30 p-1.5 rounded-2xl border border-border/50 w-fit max-w-full overflow-x-auto'>
          {[
            { id: 'bills', label: 'BILLS', color: 'amber' },
            { id: 'orders', label: 'ORDERS', color: 'blue' },
            { id: 'collaterals', label: 'COLLATERALS', color: 'purple' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded text-xs font-black tracking-widest transition-all ${activeTab === tab.id ? `bg-${tab.color}-400 text-black shadow-lg shadow-${tab.color}-400/20` : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
            >
              {tab.label} ({selectedCustomerDetail[tab.id].length})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='bg-card/40 border border-border/50 rounded-3xl p-6 md:p-8 min-h-[400px] shadow-sm'>
          {activeTab === 'bills' && (
            <div className='space-y-4'>
              {bills.length === 0 ? (
                <EmptyState icon={Clock} text="No billing history found" />
              ) : (
                bills.map((bill, i) => (
                  <div key={bill._id} className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-secondary/20 rounded-2xl border border-border/50 hover:border-amber-400/40 transition-all gap-6 group'>
                    <div className='space-y-1 w-full lg:w-1/4'>
                      <p className='text-[10px] font-black text-amber-400 uppercase tracking-widest'>Invoice Reference</p>
                      <p className='font-bold text-lg'>BILL #{bills.length - i}</p>
                      <p className='text-sm text-muted-foreground font-medium'>{new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs w-full lg:w-3/4'>
                      <DetailBox label="Grand Total" value={bill.invoice?.grandTotal} />
                      <DetailBox label="Collected" value={bill.payment?.amountPaid} text="text-green-500" />
                      <DetailBox label="Balance" value={bill.payment?.remainingAmount} text="text-red-400" />
                      <div className='bg-card/40 p-4 rounded-2xl border border-border/30 flex flex-col justify-center'>
                        <p className='text-[9px] text-muted-foreground uppercase font-black mb-1'>Payment Status</p>
                        <p className='capitalize font-bold text-[13px]'>{bill.payment?.paymentStatus?.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className='space-y-4'>
              {orders.length === 0 ? (
                <EmptyState icon={Clock} text="No order history found" />
              ) : (
                orders.map((order, i) => (
                  <div key={order._id} className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-secondary/20 rounded-2xl border border-border/50 hover:border-blue-400/40 transition-all gap-6'>
                    <div className='space-y-1 w-full lg:w-1/4'>
                      <p className='text-[10px] font-black text-blue-400 uppercase tracking-widest'>Order Reference</p>
                      <p className='font-bold text-lg'>ORDER #{orders.length - i}</p>
                      <p className='text-sm text-muted-foreground font-medium'>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs w-full lg:w-3/4'>
                      <DetailBox label="Order Value" value={order.Total} />
                      <DetailBox label="Advance" value={order.AdvancePayment} text="text-green-500" />
                      <DetailBox label="Remaining" value={order.RemainingAmount} text="text-red-400" />
                      <div className='bg-card/40 p-4 rounded-2xl border border-border/30 flex flex-col justify-center'>
                        <p className='text-[9px] text-muted-foreground uppercase font-black mb-1'>Workflow Status</p>
                        <p className='capitalize font-bold text-[13px]'>{order.orderStatus}</p>
                        <p className='text-[10px] opacity-60 font-medium'>P: {order.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'collaterals' && (
            <div className='space-y-4'>
              {collaterals.length === 0 ? (
                <EmptyState icon={Clock} text="No collateral history found" />
              ) : (
                collaterals.map((col, i) => (
                  <div key={col._id} className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-secondary/20 rounded-2xl border border-border/50 hover:border-purple-400/40 transition-all gap-6'>
                    <div className='space-y-1 w-full lg:w-1/4'>
                      <p className='text-[10px] font-black text-purple-400 uppercase tracking-widest'>Loan Reference</p>
                      <p className='font-bold text-lg'>LOAN #{collaterals.length - i}</p>
                      <p className='text-xs font-black truncate bg-purple-400/10 text-purple-400 px-2 py-1 rounded inline-block mt-2'>{col.jewellery} · {col.weight}g</p>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-xs w-full lg:w-3/4'>
                      <div className='bg-card/40 p-4 rounded-2xl border border-border/30 space-y-1'>
                        <p className='text-[9px] text-muted-foreground uppercase font-black'>Principal</p>
                        <p className='font-bold text-[13px]'>₹{col.price?.toLocaleString('en-IN')}</p>
                        <p className='text-[10px] text-purple-400 font-bold'>Rate: {col.interestRate}%</p>
                      </div>
                      <DetailBox label="Settled" value={col.totalPaid} text="text-green-500" />
                      <DetailBox label="Due" value={col.remainingAmount} text="text-red-400" />
                      <div className='bg-card/40 p-4 rounded-2xl border border-border/30 flex flex-col justify-center'>
                        <p className='text-[9px] text-muted-foreground uppercase font-black mb-1'>Account State</p>
                        <div className='flex items-center gap-1.5'>
                          <span className={`w-2 h-2 rounded-full ${col.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                          <p className='capitalize font-bold text-[13px]'>{col.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components for Cleaner Main View
const DetailBox = ({ label, value, text = '' }) => (
  <div className='bg-card/40 p-4 rounded-2xl border border-border/30 flex flex-col justify-center'>
    <p className='text-[9px] text-muted-foreground uppercase font-black mb-1'>{label}</p>
    <p className={`font-black text-[13px] ${text}`}>₹{value?.toLocaleString('en-IN') || 0}</p>
  </div>
);

const EmptyState = ({ icon: Icon, text }) => (
  <div className='flex flex-col items-center justify-center py-20 opacity-40 bg-secondary/10 rounded-3xl border border-dashed border-border/50'>
    <Icon className='h-12 w-12 mb-4 shrink-0' />
    <p className='font-bold text-sm uppercase tracking-widest'>{text}</p>
  </div>
);

export default CustomerPortfolioView;
