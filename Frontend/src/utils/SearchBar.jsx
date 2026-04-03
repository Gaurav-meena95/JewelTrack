import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className='relative w-full max-w-md bg-secondary/50 p-2 rounded-[8px] border border-border/50 flex items-center'>
    <Search className='absolute left-5 text-muted-foreground w-5 h-5' />
    <input 
      className="w-full bg-transparent border-none pl-10 pr-4 outline-none" 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
    />
  </div>
);

export default SearchBar;
