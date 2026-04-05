import React from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

const ImageUploadArea = ({ images, onImageUpload, onRemoveImage, label = "Reference Photos", showRequired = false }) => (
  <div className='bg-secondary/20 p-4 rounded-2xl border border-border/50'>
    <label className='text-sm font-bold flex items-center gap-2 mb-3'>
      <ImageIcon className='w-4 h-4 text-amber-400' /> {label} {showRequired && <span className='text-red-500 ml-1'>* Required</span>}
    </label>
    <div className='flex gap-4 overflow-x-auto pb-2'>
      {images.map((img, idx) => (
        <div key={idx} className='relative shrink-0 w-20 h-20 rounded-[8px] border border-border/50 overflow-hidden group'>
          <img src={img} alt='uploaded' className='w-full h-full object-cover' />
          <button 
            onClick={() => onRemoveImage(idx)} 
            className='absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
          >
            <X className='w-3 h-3' />
          </button>
        </div>
      ))}
      <label className='shrink-0 w-20 h-20 rounded-[8px] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground hover:text-amber-400 hover:border-amber-400 cursor-pointer transition-colors'>
        <Camera className='w-6 h-6 mb-1' />
        <span className='text-[10px]'>Capture</span>
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onImageUpload} />
      </label>
    </div>
  </div>
);

export default ImageUploadArea;
