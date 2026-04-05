import React from 'react';
import { X, ShoppingCart, Plus, Camera, Trash2, FileText, Image as ImageIcon } from 'lucide-react';

const NewBillModal = ({
  show,
  onClose,
  customer,
  predefinedItemNames,
  predefinedPurities,
  cartItems,
  currentItem,
  setCurrentItem,
  addItemToCart,
  removeCartItem,
  calcCurrentItemPrice,
  paymentDetails,
  setPaymentDetails,
  images,
  handleImageUpload,
  removeImage,
  cartGrandTotal,
  cartBalanceDue,
  handleGenerateBill,
  loading,
  error
}) => {
  if (!show || !customer) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-card w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl border border-border/50 shadow-2xl overflow-hidden'>
        <div className='flex justify-between items-center p-4 md:p-6 border-b border-border/50 shrink-0 bg-secondary/30'>
          <div>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              <ShoppingCart className='w-5 h-5 text-amber-400' /> New Bill for {customer.name}
            </h2>
            <p className='text-sm text-muted-foreground'>{customer.phone}</p>
          </div>
          <button onClick={onClose} className='bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2 rounded-full'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6'>
          {/* Left Side: Add Item Form */}
          <div className='lg:flex-1 space-y-6'>
            <div className='bg-secondary/20 p-5 rounded-2xl border border-border/50'>
              <h3 className='font-bold mb-4 flex items-center gap-2'>1. Add Jewelry to Cart</h3>
              <div className='grid grid-cols-2 gap-3'>
                <select
                  value={currentItem.itemName}
                  onChange={e => setCurrentItem({ ...currentItem, itemName: e.target.value })}
                  className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400 outline-none transition-all'
                >
                  <option value="">Item Name</option>
                  {predefinedItemNames.map((e) => (
                    <option value={e} key={e}>{e}</option>
                  ))}
                </select>

                <select 
                  value={currentItem.metal} 
                  onChange={e => setCurrentItem({ ...currentItem, metal: e.target.value })} 
                  className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="diamond">Diamond</option>
                </select>

                <select
                  value={currentItem.purity}
                  onChange={e => setCurrentItem({ ...currentItem, purity: e.target.value })}
                  className='p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400 outline-none transition-all'
                >
                  <option value="">Carat</option>
                  {predefinedPurities.map((e) => (
                    <option value={e} key={e}>{e}</option>
                  ))}
                </select>

                <div className='relative'>
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>grams</span>
                  <input 
                    type='number' 
                    placeholder='Weight' 
                    value={currentItem.weight} 
                    onChange={e => setCurrentItem({ ...currentItem, weight: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50' 
                  />
                </div>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>₹</span>
                  <input 
                    type='number' 
                    placeholder='Rate / g' 
                    value={currentItem.ratePerGram} 
                    onChange={e => setCurrentItem({ ...currentItem, ratePerGram: e.target.value })} 
                    className='w-full pl-8 p-3 rounded-[8px] bg-input border border-border/50' 
                  />
                </div>

                <div className='relative'>
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% Making</span>
                  <input 
                    type='number' 
                    placeholder='Making' 
                    value={currentItem.makingChargePercent} 
                    onChange={e => setCurrentItem({ ...currentItem, makingChargePercent: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50' 
                  />
                </div>
                <div className='relative'>
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% GST</span>
                  <input 
                    type='number' 
                    placeholder='GST' 
                    value={currentItem.gstPercent} 
                    onChange={e => setCurrentItem({ ...currentItem, gstPercent: e.target.value })} 
                    className='w-full p-3 rounded-[8px] bg-input border border-border/50' 
                  />
                </div>
                <div className='col-span-2 relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>₹ Discount</span>
                  <input 
                    type='number' 
                    placeholder='Discount / Adjust' 
                    value={currentItem.manualAdjustment} 
                    onChange={e => setCurrentItem({ ...currentItem, manualAdjustment: e.target.value })} 
                    className='w-full pl-20 p-3 rounded-[8px] bg-input border border-border/50' 
                  />
                </div>
              </div>

              <div className='mt-4 flex items-center justify-between p-3 bg-card border border-border/50 rounded-[8px]'>
                <span className='text-sm text-muted-foreground'>Item Final Price:</span>
                <span className='font-bold text-lg text-amber-400'>₹{calcCurrentItemPrice().toFixed(2)}</span>
              </div>

              <button 
                onClick={addItemToCart} 
                className='w-full mt-4 p-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-[8px] border border-border flex items-center justify-center gap-2'
              >
                <Plus className='w-4 h-4' /> Add to Cart
              </button>
            </div>

            {/* Image Upload Area - Keeping logic here for simplicity although we have shared component, let's use it later if possible */}
            <div className='bg-secondary/20 p-4 rounded-2xl border border-border/50'>
              <label className='text-sm font-bold flex items-center gap-2 mb-3'>
                <ImageIcon className='w-4 h-4 text-amber-400' /> 2. Add Photos (Optional)
              </label>
              <div className='flex gap-4 overflow-x-auto pb-2'>
                {images.map((img, idx) => (
                  <div key={idx} className='relative flex-shrink-0 w-20 h-20 rounded-[8px] border border-border/50 overflow-hidden group'>
                    <img src={img} alt='uploaded' className='w-full h-full object-cover' />
                    <button 
                      onClick={() => removeImage(idx)} 
                      className='absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ))}
                <label className='flex-shrink-0 w-20 h-20 rounded-[8px] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground hover:text-amber-400 hover:border-amber-400 cursor-pointer transition-colors'>
                  <Camera className='w-6 h-6 mb-1' />
                  <span className='text-[10px]'>Capture</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Cart Summary & Checkout */}
          <div className='lg:flex-1 flex flex-col bg-card border border-border/50 rounded-2xl shadow-inner lg:overflow-hidden'>
            <div className='bg-secondary/50 p-4 font-bold border-b border-border/50 flex items-center gap-2'>
              <FileText className='w-4 h-4' /> 3. Cart Summary
            </div>

            <div className='flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px]'>
              {cartItems.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-muted-foreground opacity-50'>
                  <ShoppingCart className='w-12 h-12 mb-2' />
                  <p>Cart is currently empty</p>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className='p-3 bg-secondary/20 rounded-[8px] border border-border/50 flex justify-between items-center relative pr-10'>
                    <div>
                      <p className='font-bold text-sm'>{item.itemName} <span className='text-xs text-muted-foreground uppercase'>({item.metal})</span></p>
                      <p className='text-xs text-muted-foreground'>{item.weight}g @ ₹{item.ratePerGram}/g</p>
                    </div>
                    <div className='font-bold text-amber-400'>₹{item.finalPrice?.toFixed(2) || '0.00'}</div>
                    <button 
                      onClick={() => removeCartItem(idx)} 
                      className='absolute right-3 text-red-500/50 hover:text-red-500 transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className='border-t border-border/50 bg-secondary/10 p-5 space-y-4'>
              {error && <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>{error}</div>}
              <div className='flex justify-between items-center font-bold text-xl'>
                <span>Grand Total:</span>
                <span className='text-foreground'>₹{cartGrandTotal.toFixed(2)}</span>
              </div>

              <div className='grid grid-cols-2 gap-3 pt-2 border-t border-border/30'>
                <div className='col-span-2 relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>Paid Now ₹</span>
                  <input 
                    type='number' 
                    value={paymentDetails.amountPaid} 
                    onChange={e => setPaymentDetails({ ...paymentDetails, amountPaid: e.target.value })} 
                    className='w-full pl-24 p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-500 font-bold focus:border-green-500 outline-none placeholder:text-green-500/50' 
                    placeholder='0.00' 
                  />
                </div>
                <select 
                  value={paymentDetails.paymentMethod} 
                  onChange={e => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })} 
                  className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / Wallet</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {cartBalanceDue > 0 && (
                <div className='flex justify-between items-center text-sm font-bold text-red-500 pt-2'>
                  <span>Remaining Due:</span>
                  <span>₹{cartBalanceDue.toFixed(2)}</span>
                </div>
              )}

              <button 
                onClick={handleGenerateBill} 
                disabled={loading || cartItems.length === 0} 
                className='w-full p-4 bg-amber-400 text-black font-bold text-lg rounded-[8px] hover:bg-amber-500 disabled:opacity-50 mt-2 flex justify-center items-center'
              >
                {loading ? 'Processing...' : 'Generate Combined Bill'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBillModal;
