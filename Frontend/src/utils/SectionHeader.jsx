import React from 'react';
import { Plus } from 'lucide-react';

const SectionHeader = ({ title, subtitle, buttonText, onButtonClick, className, titleClassName ,children}) => (
  <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${className || ''}`}>
    <div className="space-y-1">
      <h1 className={titleClassName || ''}>{title}</h1>
      <p className='text-muted-foreground'>{subtitle}</p>
    </div>
    {buttonText && (
      <button 
        onClick={onButtonClick} 
        className='ActionButton'
      >
        <Plus className='h-4 w-4' /> {buttonText}
      </button>
    )}
    {children}
  </div>
);

export default SectionHeader;
