import React from 'react';
import { X, Package, Plus, Camera, ShoppingCart, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageUploadArea from '../../../../utils/ImageUploadArea';

const OrderFormModal = ({
  show,
  onClose,
  customer,
  cartItems,
  currentItem,
  setCurrentItem,
  addItemToCart,
  removeCartItem,
  images,
  handleImageUpload,
  removeImage,
  orderDetails,
  setOrderDetails,
  handleCreateOrder,
  loading,
  error,
  METAL_OPTIONS
}) => {
  if (!show || !customer) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl border border-border/50 shadow-2xl overflow-hidden'>
        
        {/* Header */}
        <div className='flex justify-between items-center p-4 md:p-6 border-b border-border/50 shrink-0 bg-secondary/30'>
          <div>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              <Package className='w-5 h-5 text-amber-500' /> New Order — {customer.name}
            </h2>
            <p className='text-sm text-muted-foreground'>{customer.phone}</p>
          </div>
          <button onClick={onClose} className='bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2 rounded-full'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6'>
          
          {/* LEFT: Form */}
          <div className='lg:flex-1 space-y-5'>
            
            {/* 1. Add Items */}
            <div className='bg-secondary/20 p-5 rounded-2xl border border-border/50'>
              <h3 className='font-bold mb-4'>1. Add Jewelry Items</h3>
              <div className='grid grid-cols-2 gap-3'>
                <input 
                  type='text' 
                  placeholder='Item Name (e.g. Ring, Necklace)' 
                  value={currentItem.itemName} 
                  onChange={e => setCurrentItem({ ...currentItem, itemName: e.target.value })} 
                  className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
                <select 
                  value={currentItem.metal} 
                  onChange={e => setCurrentItem({ ...currentItem, metal: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                >
                  {METAL_OPTIONS.map(m => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
                <input 
                  type='text' 
                  placeholder='Purity (e.g. 22K, 92.5)' 
                  value={currentItem.purity} 
                  onChange={e => setCurrentItem({ ...currentItem, purity: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
                <input 
                  type='text' 
                  placeholder='Weight (grams)' 
                  value={currentItem.weight} 
                  onChange={e => setCurrentItem({ ...currentItem, weight: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
                <input 
                  type='text' 
                  placeholder='Size (e.g. 7, M, 52mm)' 
                  value={currentItem.size} 
                  onChange={e => setCurrentItem({ ...currentItem, size: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
                <input 
                  type='text' 
                  placeholder='Description / Special instructions' 
                  value={currentItem.description} 
                  onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} 
                  className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
              </div>
              <button 
                onClick={addItemToCart} 
                className='w-full mt-4 p-3 bg-secondary hover:bg-secondary/80 font-bold rounded-[8px] border border-border flex items-center justify-center gap-2'
              >
                <Plus className='w-4 h-4' /> Add to Cart
              </button>
            </div>

            {/* 2. Image Upload Area - Using Shared Utility */}
            <ImageUploadArea 
              images={images} 
              onImageUpload={handleImageUpload} 
              onRemoveImage={removeImage} 
              label="2. Reference Photos" 
              showRequired={true} 
            />

            {/* 3. Order Details */}
            <div className='bg-secondary/20 p-5 rounded-2xl border border-border/50'>
              <h3 className='font-bold mb-4'>3. Order Details</h3>
              <div className='grid grid-cols-2 gap-3'>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>₹ Total Est.</span>
                  <input 
                    type='number' 
                    placeholder='0' 
                    value={orderDetails.Total} 
                    onChange={e => setOrderDetails({ ...orderDetails, Total: e.target.value })} 
                    className='w-full pl-24 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                  />
                </div>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>₹ Advance</span>
                  <input 
                    type='number' 
                    placeholder='0' 
                    value={orderDetails.AdvancePayment} 
                    onChange={e => setOrderDetails({ ...orderDetails, AdvancePayment: e.target.value })} 
                    className='w-full pl-20 p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 outline-none' 
                  />
                </div>
                <select 
                  value={orderDetails.orderStatus} 
                  onChange={e => setOrderDetails({ ...orderDetails, orderStatus: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                >
                  <option value='accept'>Status: Accepted</option>
                  <option value='progress'>Status: In Progress</option>
                  <option value='complete'>Status: Complete</option>
                </select>
                <input 
                  type='date' 
                  value={orderDetails.deliveryDate} 
                  onChange={e => setOrderDetails({ ...orderDetails, deliveryDate: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none text-muted-foreground' 
                />
                <input 
                  type='text' 
                  placeholder='Notes / remarks (optional)' 
                  value={orderDetails.notes} 
                  onChange={e => setOrderDetails({ ...orderDetails, notes: e.target.value })} 
                  className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Cart Summary */}
          <div className='lg:flex-1 flex flex-col bg-card border border-border/50 rounded-2xl shadow-inner lg:overflow-hidden'>
            <div className='bg-secondary/50 p-4 font-bold border-b border-border/50 flex items-center gap-2'>
              <ShoppingCart className='w-4 h-4' /> Order Cart
            </div>

            <div className='flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px]'>
              {cartItems.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-muted-foreground opacity-50'>
                  <Package className='w-12 h-12 mb-2' />
                  <p>Cart is empty</p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className='p-3 bg-secondary/20 rounded-[8px] border border-border/50 flex justify-between items-start relative pr-10'>
                    <div>
                      <p className='font-bold text-sm'>{item.itemName} <span className='text-xs text-muted-foreground uppercase'>({item.metal})</span></p>
                      {item.purity && <p className='text-xs text-muted-foreground'>Purity: {item.purity}</p>}
                      {item.weight && <p className='text-xs text-muted-foreground'>Weight: {item.weight}g</p>}
                      {item.size && <p className='text-xs text-muted-foreground'>Size: {item.size}</p>}
                      {item.description && <p className='text-xs text-muted-foreground italic'>"{item.description}"</p>}
                    </div>
                    <button 
                      onClick={() => removeCartItem(idx)} 
                      className='absolute right-3 top-3 text-red-500/50 hover:text-red-500'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className='border-t border-border/50 bg-secondary/10 p-5 space-y-3'>
              {orderDetails.Total && (
                <>
                  <div className='flex justify-between text-sm'>
                    <span>Estimated Total:</span>
                    <span className='font-bold'>₹{Number(orderDetails.Total).toFixed(0)}</span>
                  </div>
                  <div className='flex justify-between text-sm text-green-500'>
                    <span>Advance Paid:</span>
                    <span className='font-bold'>₹{Number(orderDetails.AdvancePayment || 0).toFixed(0)}</span>
                  </div>
                  {Number(orderDetails.Total) - Number(orderDetails.AdvancePayment || 0) > 0 && (
                    <div className='flex justify-between text-sm text-red-500 font-bold'>
                      <span>Remaining Due:</span>
                      <span>₹{(Number(orderDetails.Total) - Number(orderDetails.AdvancePayment || 0)).toFixed(0)}</span>
                    </div>
                  )}
                </>
              )}
              {error && <div className='text-red-500 text-xs text-center'>{error}</div>}
              <button 
                onClick={handleCreateOrder} 
                disabled={loading || cartItems.length === 0} 
                className='w-full p-4 bg-amber-400 text-black font-bold text-lg rounded-[8px] hover:bg-amber-500 disabled:opacity-50 flex justify-center items-center gap-2'
              >
                {loading ? 'Creating Order...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
