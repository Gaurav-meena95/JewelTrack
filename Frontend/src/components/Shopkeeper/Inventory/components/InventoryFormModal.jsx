import React from 'react';
import { X, Package } from 'lucide-react';

const InventoryFormModal = ({
  show,
  onClose,
  isEditing,
  formData,
  setFormData,
  predefinedItemNames,
  METAL_OPTIONS,
  handleSave,
  loading
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
      <div className='bg-card w-full max-w-lg p-6 rounded-2xl border border-border/50 shadow-2xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold flex items-center gap-2'>
            <Package className='w-5 h-5 text-amber-500' />
            {isEditing ? 'Edit Inventory Item' : 'Add New Item'}
          </h2>
          <button 
            onClick={onClose} 
            className='hover:bg-secondary p-1.5 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>

        <form onSubmit={handleSave} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Item Name <span className='text-red-500'>*</span></label>
            <select
              value={formData.jewelleryType}
              onChange={e => setFormData({ ...formData, jewelleryType: e.target.value })}
              className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50 appearance-none'
              required
            >
              <option value="" disabled>Select an item</option>
              {predefinedItemNames.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Category / Metal <span className='text-red-500'>*</span></label>
            <select
              value={formData.metalType}
              onChange={e => setFormData({ ...formData, metalType: e.target.value })}
              className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50 capitalize'
              required
            >
              {METAL_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Quantity <span className='text-red-500'>*</span></label>
              <input
                type='number'
                min="1"
                required
                placeholder='0'
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Total Weight (g) <span className='text-red-500'>*</span></label>
              <input
                type='number'
                step="0.01"
                min="0"
                required
                placeholder='0.00'
                value={formData.totalWeight}
                onChange={e => setFormData({ ...formData, totalWeight: e.target.value })}
                className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50'
              />
            </div>
          </div>

          <div className='pt-4 flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 p-3 bg-secondary hover:bg-secondary/80 font-bold rounded-[8px] transition-colors border border-border/50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 p-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-[8px] disabled:opacity-50 transition-colors shadow-lg shadow-amber-400/20'
            >
              {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryFormModal;
