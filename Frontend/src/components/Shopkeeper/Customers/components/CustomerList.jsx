import React from 'react';
import { User, Phone, Mail, MapPin, Eye, Edit, Trash2, Calendar, Users, Plus } from 'lucide-react';
import SearchBar from '../../../../utils/SearchBar';

const CustomerList = ({
  loading,
  customers,
  searchPhone,
  setSearchPhone,
  fetchCustomerDetail,
  openEditModal,
  openDeleteConfirm,
  setShowRegisterModal,
  resetForm,
  setFormData,
  error
}) => {
  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Search & Stats Header */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
        <div className='md:col-span-2'>
           <SearchBar 
             value={searchPhone} 
             onChange={(e) => setSearchPhone(e.target.value)} 
             placeholder="Search by name or phone number..." 
           />
        </div>
        <div className='bg-card/40 border border-border/50 rounded-2xl p-4 flex items-center justify-between shadow-sm px-6 h-full'>
            <div className='flex items-center gap-3'>
                <div className='p-2 bg-amber-400/10 rounded'>
                    <Users className='h-5 w-5 text-amber-400' />
                </div>
                <p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>Total Customers</p>
            </div>
            <h3 className='text-3xl font-black text-amber-400'>{customers.length}</h3>
        </div>
      </div>

      {/* Loading & Errors */}
      {loading && <div className='text-center py-10 opacity-50'><p className='animate-pulse font-bold tracking-widest uppercase text-xs'>Updating customer records...</p></div>}
      {error && <div className='bg-red-500/10 text-red-500 p-4 rounded text-center text-sm border border-red-500/20'>{error}</div>}

      {/* Customer Grid */}
      {!loading && customers.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {customers.map((customer, index) => (
            <div 
              key={customer._id || index} 
              className='bg-card/40 border border-border/50 p-6 rounded-3xl space-y-6 hover:border-amber-400/30 hover:shadow-xl hover:shadow-amber-400/5 transition-all group relative overflow-hidden'
            >
              <div className='absolute -right-4 -top-4 font-black text-6xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none select-none'>
                {index + 1}
              </div>

              <div className='flex justify-between items-start relative z-10'>
                <div className='flex items-center gap-4'>
                  <div className='h-12 w-12 rounded-2xl bg-linear-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center border border-amber-400/20 group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-300'>
                    <User className='h-6 w-6 text-amber-400 group-hover:text-black transition-colors' />
                  </div>
                  <div>
                    <h3 className='font-bold text-lg group-hover:text-amber-400 transition-colors'>{customer.name}</h3>
                    <p className='text-muted-foreground text-xs font-bold uppercase tracking-tighter opacity-70'>S/O {customer.father_name}</p>
                  </div>
                </div>
              </div>

              <div className='space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/30 group-hover:bg-secondary/40 transition-colors'>
                <div className='flex items-center gap-3 text-sm'>
                  <Phone className='h-4 w-4 text-amber-400/70' />
                  <span className='font-bold tabular-nums'>+91 {customer.phone}</span>
                </div>
                {customer.email && (
                    <div className='flex items-center gap-3 text-sm truncate'>
                        <Mail className='h-4 w-4 text-amber-400/70' />
                        <span className='opacity-70 font-medium truncate'>{customer.email}</span>
                    </div>
                )}
                <div className='flex items-center gap-3 text-sm'>
                  <MapPin className='h-4 w-4 text-amber-400/70 shrink-0' />
                  <span className='opacity-70 font-medium line-clamp-1'>{customer.address}</span>
                </div>
              </div>

              <div className='flex items-center justify-between pt-2'>
                <div className='flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase opacity-50'>
                  <Calendar className='h-3 w-3' /> Join: {new Date(customer.createdAt).toLocaleDateString()}
                </div>
                
                <div className='flex gap-2 relative z-10'>
                  <ActionButton 
                    onClick={() => fetchCustomerDetail(customer._id)} 
                    icon={Eye} 
                    color="blue" 
                    title="Portfolio" 
                  />
                  <ActionButton 
                    onClick={() => openEditModal(customer)} 
                    icon={Edit} 
                    color="amber" 
                    title="Edit" 
                  />
                  <ActionButton 
                    onClick={() => openDeleteConfirm(customer)} 
                    icon={Trash2} 
                    color="red" 
                    title="Delete" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Fallback */}
      {!loading && customers.length === 0 && (
        <div className='text-center py-24 bg-card/20 border-2 border-dashed border-border/50 rounded-[40px]'>
          <Users className='h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-20' />
          <h2 className='text-muted-foreground text-2xl font-black uppercase tracking-tight'>
            {searchPhone ? 'Target Not Found' : 'Clean Slate'}
          </h2>
          <p className='text-muted-foreground text-sm font-medium mt-2 max-w-xs mx-auto opacity-60'>
            {searchPhone ? `We couldn't find any records matching "${searchPhone}". Check the spelling or register a new one.` : 'No customers are registered in your database yet. Start by expanding your reach.'}
          </p>
          {searchPhone && (
            <button
              onClick={() => {
                resetForm();
                setFormData(prev => ({ ...prev, phone: searchPhone }));
                setShowRegisterModal(true);
              }}
              className='mt-8 px-8 py-3 bg-amber-400 text-black rounded font-black shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto'
            >
              <Plus className='h-4 w-4' /> REGISTER "{searchPhone}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Internal Helper for Action Buttons
const ActionButton = ({ onClick, icon: Icon, color, title }) => (
  <button
    onClick={onClick}
    className={`p-2.5 bg-card/80 hover:bg-${color}-400/20 hover:border-${color}-400/40 border border-border/50 rounded transition-all group/btn shadow-sm`}
    title={title}
  >
    <Icon className={`h-4 w-4 text-${color}-400 group-hover/btn:scale-110 transition-transform`} />
  </button>
);

export default CustomerList;
