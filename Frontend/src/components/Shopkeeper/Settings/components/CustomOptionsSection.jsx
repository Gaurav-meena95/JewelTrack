import React from 'react';
import { Tag, Plus, X } from 'lucide-react';

const CustomOptionsSection = ({ 
  itemNames, 
  newItemName, 
  setNewItemName, 
  handleAddItemName, 
  handleRemoveItemName,
  purities,
  newPurity,
  setNewPurity,
  handleAddPurity,
  handleRemovePurity
}) => {
  return (
    <section className='bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-amber-400/20 transition-all'>
      <div className='bg-secondary/30 px-6 py-4 border-b border-border/50 flex items-center gap-3'>
        <div className='p-2 bg-amber-400/20 text-amber-500 rounded'><Tag className='w-5 h-5' /></div>
        <h2 className='text-xl font-bold'>Dynamic Form Options</h2>
      </div>
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
        
        {/* Item Names Management */}
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>Predefined Item Categories</label>
            <p className='text-xs text-muted-foreground/60 mb-4'>Items like "Ring", "Chain", or "Bangle" for quick selection.</p>
            <div className='flex gap-2 bg-input p-1 rounded border border-border/50 focus-within:border-amber-400/50 transition-all shadow-inner'>
              <input 
                type="text" 
                value={newItemName} 
                onChange={e => setNewItemName(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItemName(e))} 
                className='flex-1 p-2 bg-transparent outline-none text-sm placeholder:opacity-50' 
                placeholder="e.g. Gold Jhumka" 
              />
              <button 
                type="button" 
                onClick={handleAddItemName} 
                className='p-2 bg-amber-400 text-black rounded hover:bg-amber-500 transition-all shadow-sm'
              >
                <Plus className='w-5 h-5' />
              </button>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            {itemNames.map((item, idx) => (
              <TagBadge key={idx} text={item} onRemove={() => handleRemoveItemName(item)} />
            ))}
            {itemNames.length === 0 && <p className='text-[10px] text-muted-foreground italic font-medium uppercase tracking-tighter opacity-40 py-2'>No custom categories configured</p>}
          </div>
        </div>

        {/* Purities Management */}
        <div className='space-y-6 border-t md:border-t-0 md:border-l border-border/20 pt-6 md:pt-0 md:pl-10'>
          <div className='space-y-2'>
            <label className='text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest'>Predefined Purities</label>
            <p className='text-xs text-muted-foreground/60 mb-4'>Purities like "24K", "22K/916", or "18K" for valuation.</p>
            <div className='flex gap-2 bg-input p-1 rounded border border-border/50 focus-within:border-amber-400/50 transition-all shadow-inner'>
              <input 
                type="text" 
                value={newPurity} 
                onChange={e => setNewPurity(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddPurity(e))} 
                className='flex-1 p-2 bg-transparent outline-none text-sm placeholder:opacity-50' 
                placeholder="e.g. 21K" 
              />
              <button 
                type="button" 
                onClick={handleAddPurity} 
                className='p-2 bg-amber-400 text-black rounded hover:bg-amber-500 transition-all shadow-sm'
              >
                <Plus className='w-5 h-5' />
              </button>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            {purities.map((purity, idx) => (
              <TagBadge key={idx} text={purity} onRemove={() => handleRemovePurity(purity)} color="amber" />
            ))}
            {purities.length === 0 && <p className='text-[10px] text-muted-foreground italic font-medium uppercase tracking-tighter opacity-40 py-2'>No custom purities configured</p>}
          </div>
        </div>

      </div>
    </section>
  );
};

const TagBadge = ({ text, onRemove }) => (
  <div className='group flex items-center gap-2 bg-secondary/80 text-foreground px-3 py-1.5 rounded border border-border/50 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all shadow-sm'>
    <span className='text-xs font-bold'>{text}</span>
    <button type="button" onClick={onRemove} className='text-muted-foreground hover:text-red-500 transition-colors p-0.5'>
      <X className='w-3.5 h-3.5' />
    </button>
  </div>
);

export default CustomOptionsSection;
