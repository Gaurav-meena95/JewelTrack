import { Cross, Eye, Search } from 'lucide-react'
import React, { useState } from 'react'

const Colletral = () => {

  const [showAccount, setShowAccount] = useState(false)
  console.log(showAccount)


  return (

    // header
    <>

      <div className={` min-h-screen ${showAccount ? 'blur-[2px] pointer-events-none scroll-none' : ''} `} >

        <div className='space-y-5'>
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
            <Eye onClick={() => setShowAccount((prev) => !prev)} />
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
          <div className='flex gap-10'>
            <span className='text-gray-500 '>Created: <p className='text-white'>2024-10-01 </p> </span>
            <span className='text-gray-500 '>Due: <p className='text-white'>2024-10-01</p> </span>
          </div>
        </div>


      </div>
      {/* update girvi */}

      {
        showAccount && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className={`bg-gray-300/10 w-1/2 h-1/2 space-y-3 p-5 rounded-2xl`}>
              <div className='flex justify-between '>
                <h1>Girvi Account - G001</h1>
                <button onClick={() => setShowAccount((prev) => !prev)}>x</button>
              </div>
              <div className='flex justify-between'>
                <div>
                  <p className='text-gray-500'>Customer</p>
                  <h2>Priya Sharma</h2>
                  <p>+91 98765 43210</p>
                </div>
                <div>
                  <p className='text-gray-500'>status</p>
                  <button className='bg-amber-400/30 px-3 text-sm rounded-2xl'>
                    <select name="" id="">
                      <option value="active">Active</option>
                      <option value="active">Due</option>
                      <option value="active">Complete</option>
                    </select>

                  </button>
                </div>
              </div>
              <div className='w-full border rounded-2xl bg-gray-400/10 p-2'>
                <p className='text-gray-500'>Jewelry Description</p>
                <h3 className='text-xl'>22K Gold Bangles (Set of 4)</h3>
              </div>

              <div className='flex justify-between gap-10  flex-wrap p-3 my-2'>
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
              <div className='space-y-2'>
                <p className='text-gray-500 '>Payment History</p>
                <div className='flex justify-between p-3 bg-gray-400/10 rounded-2xl'>
                  <div>
                    <span className='text-gray-500'>Traction Date : </span> <span>12/10/2025</span>
                  </div>
                  <h4 className='text-green-700'>₹45904</h4>
                </div>
              </div>
              <div className='flex justify-between'>
                <button className=" bg-amber-400/50  p-2 px-3 rounded-2xl">
                  Record Payment
                </button>
                <button variant="outline" className="bg-gray-400/50 p-2 px-3 rounded-2xl">
                  Send Payment Link
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>


  )
}

export { Colletral }