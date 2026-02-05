import { Eye, Search } from 'lucide-react'
import React from 'react'

const Colletral = () => {
  return (

    // header
    <div>


      <div className='space-y-10'>
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            <h1>Girvi / Collateral</h1>
            <p className='text-gray-500'>Manage collateral loans with automatic interest calculation</p>
          </div>
          <button className='p-2 bg-amber-400/80 rounded-[5px]'>+ New Girvi</button>
        </div>
        <div className='relative bg-gray-500/10 p-5 rounded-2xl '>
          <Search className=' absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            className="w-full border pl-10 rounded-2xl bg-gray-400/10 p-2"
            type="text"
            placeholder='Search by phone number..' />
        </div>
      </div>

      {/* colletral card */}
      <div className='bg-gray-500/10 my-10 p-5 rounded-2xl space-y-4'>
        <div className='flex  justify-between'>
          <div className=' flex gap-2'>
            <h1 className='text-amber-400/80'>G001</h1>
            <button className='bg-amber-400/30 px-3 text-sm rounded-2xl'> Active</button>
          </div>
          <Eye />
        </div>


        <div>
          <h1>Gaurav Meena</h1>
          <p className='text-gray-500'>+91 7724024993</p>
        </div>

        <div className='w-full border rounded-2xl bg-gray-400/10 p-2'>
          <p className='text-gray-500'>Collateral Jewelry</p>
          <h3 className='text-xl'>22K Gold Bangles (Set of 4)</h3>
        </div>


        <div className='flex justify-between  p-3 my-2'>

          <div>
            <p className='text-gray-500'>Base Price</p>
            <h3>₹100,000</h3>
          </div>
          <div>
            <p className='text-gray-500'>Interest</p>
            <h4 className='text-amber-300/80'>2% × 3m</h4>
            <h3>₹100,000</h3>
          </div>
          <div>
            <p className='text-gray-500'>Total Payable</p>
            <h3>₹100,000</h3>
          </div>
          <div>
            <p className='text-gray-500'>paid</p>
            <h3 className='text-green-600'>₹100,000</h3>
          </div>
          <div>
            <p className='text-gray-500 '>Balance</p>
            <h3 className='text-red-700'>₹100,000</h3>
          </div>

        </div>
        <div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
          <span></span>
        </div>
      </div>
    </div>



  )
}

export { Colletral }