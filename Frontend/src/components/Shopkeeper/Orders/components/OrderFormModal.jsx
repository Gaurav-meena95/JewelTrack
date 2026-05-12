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
  calcCurrentItemPrice,
  images,
  handleImageUpload,
  removeImage,
  orderDetails,
  setOrderDetails,
  handleCreateOrder,
  loading,
  error,
  METAL_OPTIONS,
  predefinedItemNames,
  predefinedPurities,
  cartGrandTotal
}) => {
  if (!show || !customer) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl border border-border/50 shadow-2xl overflow-hidden'>
        
        {/* Header */}
        <div className='flex justify-between items-center p-3 md:p-4 border-b border-border/50 shrink-0 bg-secondary/30'>
          <div>
            <h2 className='text-lg font-bold flex items-center gap-2'>
              <Package className='w-4 h-4 text-amber-400' /> New Order — {customer.name}
            </h2>
            <p className='text-[10px] text-muted-foreground'>{customer.phone}</p>
          </div>
          <button onClick={onClose} className='bg-red-500/20 hover:bg-red-500/30 text-red-500 p-1.5 rounded-full'>
            <X className='w-4 h-4' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 md:p-5 flex flex-col lg:flex-row gap-5'>
          
          {/* LEFT: Form */}
          <div className='lg:flex-1 space-y-4'>
            
            {/* 1. Add Items */}
            <div className='bg-secondary/20 p-4 rounded-2xl border border-border/50'>
              <h3 className='font-bold mb-4'>1. Add Jewelry Items</h3>
              <div className='grid grid-cols-2 gap-3'>
                <div className='col-span-2 relative'>
                  <select 
                    value={currentItem.itemName} 
                    onChange={e => setCurrentItem({ ...currentItem, itemName: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50 appearance-none' 
                  >
                    <option value="">Item Name (Select an item) *</option>
                    {predefinedItemNames?.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <select 
                  value={currentItem.metal} 
                  onChange={e => setCurrentItem({ ...currentItem, metal: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                >
                  {METAL_OPTIONS.map(m => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
                <select 
                  value={currentItem.purity} 
                  onChange={e => setCurrentItem({ ...currentItem, purity: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50 appearance-none' 
                >
                  <option value="">Purity (e.g. 22K)</option>
                  {predefinedPurities?.map(purity => (
                    <option key={purity} value={purity}>{purity}</option>
                  ))}
                </select>
                <div className='relative'>
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>grams</span>
                  <input 
                    type='number' 
                    placeholder='Weight *' 
                    value={currentItem.weight} 
                    onChange={e => setCurrentItem({ ...currentItem, weight: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                  />
                </div>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>₹</span>
                  <input 
                    type='number' 
                    placeholder='Rate / g *' 
                    value={currentItem.ratePerGram} 
                    onChange={e => setCurrentItem({ ...currentItem, ratePerGram: e.target.value })} 
                    className='w-full pl-8 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                  />
                </div>
                <div className='relative'>
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% Making</span>
                  <input 
                    type='number' 
                    placeholder='Making Charge' 
                    value={currentItem.makingChargePercent} 
                    onChange={e => setCurrentItem({ ...currentItem, makingChargePercent: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                  />
                </div>
                <div className='relative'>
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% GST</span>
                  <input 
                    type='number' 
                    placeholder='GST' 
                    value={currentItem.gstPercent} 
                    onChange={e => setCurrentItem({ ...currentItem, gstPercent: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                  />
                </div>
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
                  className='col-span-1 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' 
                />
              </div>

              <div className='mt-4 flex items-center justify-between p-3 bg-card border border-border/50 rounded-[8px]'>
                <span className='text-sm text-muted-foreground'>Item Final Price:</span>
                <span className='font-bold text-lg text-amber-400'>₹{calcCurrentItemPrice().toFixed(2)}</span>
              </div>

              {/* Image Upload Area - Required for adding to cart */}
              <div className="mt-6">
                <ImageUploadArea 
                  images={images} 
                  onImageUpload={handleImageUpload} 
                  onRemoveImage={removeImage} 
                  label="Reference Photos" 
                  showRequired={true} 
                />
              </div>

              <button 
                onClick={addItemToCart} 
                disabled={!currentItem.itemName || !currentItem.weight || !currentItem.ratePerGram || calcCurrentItemPrice() <= 0 || images.length === 0}
                className='w-full mt-4 p-3 bg-secondary hover:bg-secondary/80 disabled:opacity-50 font-bold rounded-[8px] border border-border flex items-center justify-center gap-2'
              >
                <Plus className='w-4 h-4' /> Add to Cart
              </button>
            </div>
          </div>

          {/* RIGHT: Cart Summary */}
          <div className='lg:flex-1 flex flex-col bg-card border border-border/50 rounded-2xl shadow-inner lg:overflow-hidden'>
            <div className='bg-secondary/50 p-4 font-bold border-b border-border/50 flex items-center gap-2'>
              <ShoppingCart className='w-4 h-4' /> Order Cart
            </div>

            <div className='flex-1 p-3 overflow-y-auto space-y-2 min-h-[120px]'>
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
                      
                      <div className='text-xs text-muted-foreground mt-1 space-y-0.5'>
                        {item.purity && <span>Purity: {item.purity} • </span>}
                        {item.weight && <span>{item.weight}g </span>}
                        {item.ratePerGram && <span>@ ₹{item.ratePerGram}/g</span>}
                      </div>

                      {item.size && <p className='text-xs text-muted-foreground'>Size: {item.size}</p>}
                      {item.description && <p className='text-xs text-muted-foreground italic mt-1'>"{item.description}"</p>}
                    </div>
                    
                    <div className='text-right'>
                       <div className='font-bold text-amber-400'>₹{item.finalPrice?.toFixed(2) || '0.00'}</div>
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

            <div className='border-t border-border/50 bg-card p-3 space-y-2'>
              
              {/* Order Summary Calculation */}
              <div className='space-y-1 bg-secondary/10 p-2.5 rounded-xl border border-border/30'>
                <div className='flex justify-between items-center text-sm text-muted-foreground uppercase tracking-widest'>
                  <span>Cart Items Total</span>
                  <span className='font-bold text-foreground'>₹{cartGrandTotal.toFixed(0)}</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-muted-foreground uppercase tracking-widest'>(-) Adjustment</span>
                  <div className='w-32 relative'>
                     <span className='absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>₹</span>
                     <input 
                       type="number"
                       value={orderDetails.discount}
                       onChange={e => setOrderDetails({...orderDetails, discount: e.target.value})}
                       className='w-full pl-6 p-2 rounded-lg bg-input border border-border outline-none focus:border-amber-400 text-right font-bold'
                       placeholder='0'
                     />
                  </div>
                </div>

                <div className='flex justify-between items-center text-lg pt-2 border-t border-border/30'>
                  <span className='font-black'>Total Amount:</span>
                  <span className='font-black text-amber-400 text-2xl'>₹{Number(orderDetails.Total || 0).toFixed(0)}</span>
                </div>
              </div>

              {/* Checkout Details */}
              <div className='grid grid-cols-2 gap-2 pt-2'>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>₹ Advance</span>
                  <input
                    type='number'
                    placeholder='0'
                    value={orderDetails.AdvancePayment}
                    onChange={e => setOrderDetails({ ...orderDetails, AdvancePayment: e.target.value })}
                    className='w-full pl-20 p-2.5 rounded-[8px] bg-green-500/10 border border-green-500/30 outline-none text-green-500 font-bold focus:border-green-500 placeholder:text-green-500/50'
                  />
                </div>

                <select
                  value={orderDetails.orderStatus}
                  onChange={e => setOrderDetails({ ...orderDetails, orderStatus: e.target.value })}
                  className='p-2.5 rounded-[8px] bg-input border border-border/50 outline-none text-sm'
                >
                  <option value='accept'>Status: Accepted</option>
                  <option value='progress'>Status: In Progress</option>
                  <option value='complete'>Status: Complete</option>
                </select>

                <div className='relative col-span-2 md:col-span-1'>
                  <span className='block text-[10px] text-muted-foreground absolute top-1 left-3 uppercase font-bold'>Delivery Expectation</span>
                  <input
                    type='date'
                    value={orderDetails.deliveryDate}
                    onChange={e => setOrderDetails({ ...orderDetails, deliveryDate: e.target.value })}
                    className='w-full p-2 p-2.5 pt-5 rounded-[8px] bg-input border border-border/50 outline-none text-sm'
                  />
                </div>

                <div className='relative col-span-2 md:col-span-1 p-1 bg-red-500/5 border border-red-500/20 rounded-[8px] flex flex-col justify-center'>
                  <span className='text-[8px] text-red-500 uppercase font-black tracking-widest'>Balance Due</span>
                  <span className='text-lg font-black text-red-500'>
                    ₹{(Number(orderDetails.Total || 0) - Number(orderDetails.AdvancePayment || 0)).toFixed(0)}
                  </span>
                </div>

                <input
                  type='text'
                  placeholder='Order Notes / remarks (optional)'
                  value={orderDetails.notes}
                  onChange={e => setOrderDetails({ ...orderDetails, notes: e.target.value })}
                  className='col-span-2 p-2.5 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50 text-[11px]'
                />
              </div>

              {error && <div className='text-red-500 text-xs text-center font-bold bg-red-500/10 p-2 rounded'>{error}</div>}

              <div className='pt-2'>
                <button
                  onClick={handleCreateOrder}
                  disabled={loading || cartItems.length === 0}
                  className='w-full p-3 bg-amber-400 text-black font-black text-base uppercase tracking-widest rounded-xl hover:bg-amber-500 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-transform'
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
