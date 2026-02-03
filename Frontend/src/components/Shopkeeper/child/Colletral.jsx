import { Search } from 'lucide-react'
import React from 'react'

const Colletral = () => {
  return (
    <div className='space-y-10'>
      <div className='flex justify-between items-center'>
        <div className='space-y-1'>
          <h1>Girvi / Collateral</h1>
          <p className='text-gray-600'>Manage collateral loans with automatic interest calculation</p>
        </div>
        <button className='p-2 bg-amber-400 rounded-[5px]'>+ New Girvi</button>
      </div>
      <div className='relative bg-gray-500/10 p-5 rounded-2xl '>
        <Search className=' absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5'/> 
        <input 
        className="w-full border pl-10 rounded-2xl bg-gray-400/10 p-2" 
        type="text"  
        placeholder='Search by phone number..' />
      </div>
    </div>
  )
}

export  {Colletral}