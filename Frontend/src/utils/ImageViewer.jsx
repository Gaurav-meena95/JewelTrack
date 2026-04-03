import React from 'react';
import { X } from 'lucide-react';

const ImageViewer = ({ image, onClose }) => {
  if (!image) return null;
  
  return (
    <div 
      className='fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-md p-4' 
      onClick={onClose}
    >
      <button className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full text-white transition-colors'>
        <X className='w-6 h-6' />
      </button>
      <img 
        src={image} 
        alt="Enlarged" 
        className='max-w-full max-h-[90vh] object-contain rounded-[8px] shadow-2xl' 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};

export default ImageViewer;
