import React from 'react';
import { User, Package } from 'lucide-react';
import SectionHeader from '../../../../utils/SectionHeader';
import SearchBar from '../../../../utils/SearchBar';
import Loading from '../../../../utils/Loading';

const OrderDashboardView = ({
  uniqueCustomers,
  searchQuery,
  setSearchQuery,
  loading,
  openCustomerProfile,
  setShowLookupModal,
  setCustomerPhone,
  setCustomerFound,
  success,
  error,
  formatDate
}) => {
  return (
    <div className='space-y-6'>
      <SectionHeader 
        title="Manage customer jewelry orders & track progress" 
        subtitle="Track live stock, metals, and quantities"
        buttonText="New Order"
        onButtonClick={() => { 
          setCustomerPhone(''); 
          setCustomerFound(null); 
          setShowLookupModal(true); 
        }}
        className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
        titleClassName="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
      />

      {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
      {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

      <SearchBar 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Search customers by name or phone..." 
      />

      {loading ? (
        <div className='text-center py-10 text-muted-foreground'><Loading /></div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {uniqueCustomers.map(customer => (
            <div 
              key={customer._id} 
              onClick={() => openCustomerProfile(customer)} 
              className='bg-card/40 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/50 transition-colors cursor-pointer group flex items-start gap-4'
            >
              <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform'>
                <User className='w-6 h-6' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-bold group-hover:text-amber-400 transition-colors truncate'>{customer.name}</h3>
                <p className='text-sm text-muted-foreground'>{customer.phone}</p>
                <div className='mt-3 flex flex-wrap gap-2 text-xs'>
                  <span className='bg-secondary px-2 py-1 rounded'>{customer.totalOrders} Orders</span>
                  {customer.totalDue > 0 && <span className='bg-red-400/10 text-red-500 border border-red-500/20 px-2 py-1 rounded'>Due: ₹{customer.totalDue.toFixed(0)}</span>}
                </div>
                <p className='text-xs text-muted-foreground mt-2'>Last updated: {formatDate(customer.lastUpdated)}</p>
              </div>
            </div>
          ))}
          {uniqueCustomers.length === 0 && (
            <div className='col-span-full text-center py-20 text-muted-foreground'>
              <Package className='w-12 h-12 mx-auto mb-3 opacity-30' />
              <p>No orders found. Create a new order to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDashboardView;
