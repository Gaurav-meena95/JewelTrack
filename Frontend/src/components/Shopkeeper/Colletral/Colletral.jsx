import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Phone, IndianRupee, Trash2, WeightIcon, Edit, Calculator } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

// Shared Utils
import SectionHeader from '../../../utils/SectionHeader'
import SearchBar from '../../../utils/SearchBar'
import StatusBadge from '../../../utils/StatusBadge'
import ImageViewer from '../../../utils/ImageViewer'

// Sub-components
import QuickCalculatorModal from './components/QuickCalculatorModal'
import NewGirviModal from './components/NewGirviModal'
import CollateralDetailsModal from './components/CollateralDetailsModal'

const Colletral = () => {
  const header = getAuthHeaders()

  const [collaterals, setCollaterals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [filter, setFilter] = useState('all') // all, active, closed

  // Predefined Settings
  const [predefinedItemNames, setPredefinedItemNames] = useState([])

  // Modals
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNewGirvi, setShowNewGirvi] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  // New Girvi / Customer Lookup State
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerFound, setCustomerFound] = useState(null)
  const [customerData, setCustomerData] = useState({ name: '', father_name: '', address: '', email: '' })
  const [girviData, setGirviData] = useState({ weight: '', jewellery: '', price: '', interestRate: '' })
  const [images, setImages] = useState([])
  const [enlargedImage, setEnlargedImage] = useState(null)

  // Calculator State
  const [calcData, setCalcData] = useState({ basePrice: '', interest: '', startDate: '', endDate: '' })
  const [calcResult, setCalcResult] = useState(0)

  // Payment State
  const [paymentAmount, setPaymentAmount] = useState('')
  const [isAdjustment, setIsAdjustment] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // API Calls ---
  const fetchCollaterals = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/collatral/me`, { headers: header })
      if (response.data?.data?.data) setCollaterals(response.data.data.data)
    } catch (err) {
      setError('Failed to fetch collaterals')
    }
    setLoading(false)
  }

  const fetchProfileSettings = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_KEY}/auth/me`, { headers: header })
      if (res.data?.data && res.data.data.user) {
         setPredefinedItemNames(res.data.data.user.itemNames || [])
      }
    } catch (err) { }
  }

  useEffect(() => {
    fetchCollaterals()
    fetchProfileSettings()
  }, [])

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError('') }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  // Interest Logic ---
  const handleCalcChange = (e) => setCalcData({ ...calcData, [e.target.name]: e.target.value })
  
  const calculateInterest = (e) => {
    e.preventDefault()
    if (!calcData.startDate || !calcData.endDate || !calcData.basePrice || !calcData.interest) return
    const days = (new Date(calcData.endDate) - new Date(calcData.startDate)) / (1000 * 60 * 60 * 24)
    if (days < 0) return setCalcResult("Invalid Dates")
    const interest = (Number(calcData.basePrice) * Number(calcData.interest) * days) / 3000
    setCalcResult(interest.toFixed(2))
  }

  const calculateLiveInterest = (item) => {
    if (item.status === 'closed') return 0
    const days = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const remain = item.remainingAmount !== undefined ? item.remainingAmount : item.price
    const interest = remain * item.interestRate * days / 3000
    return interest.toFixed(2)
  }

  // Customer Management ---
  const checkCustomer = async () => {
    if (customerPhone.length < 10) return
    try {
      setLoading(true)
      const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
      if (res.data?.data?.customer) {
        setCustomerFound(true)
        const c = res.data.data.customer
        setCustomerData({ name: c.name, father_name: c.father_name, address: c.address, email: c.email })
      } else {
        setCustomerFound(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check customer")
      setCustomerFound(false)
    }
    setLoading(false)
  }

  const handleCreateGirvi = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const custPayload = { phone: customerPhone, ...customerData }
      if (customerFound) {
        await axios.patch(`${VITE_API_BASE_KEY}/customers/register/update`, custPayload, { headers: header })
      } else {
        await axios.post(`${VITE_API_BASE_KEY}/customers/register`, custPayload, { headers: header })
      }

      const collatPayload = {
        weight: girviData.weight,
        jewellery: girviData.jewellery,
        price: Number(girviData.price),
        interestRate: Number(girviData.interestRate),
        image: images,
        status: 'active'
      }
      await axios.post(`${VITE_API_BASE_KEY}/customers/collatral/create?phone=${customerPhone}`, collatPayload, { headers: header })

      setSuccess("Girvi created successfully!")
      setShowNewGirvi(false)
      resetGirviForm()
      fetchCollaterals()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Girvi')
    }
    setLoading(false)
  }

  const resetGirviForm = () => {
    setCustomerPhone(''); setCustomerFound(null); setImages([])
    setCustomerData({ name: '', father_name: '', address: '', email: '' })
    setGirviData({ weight: '', jewellery: '', price: '', interestRate: '' })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 800
        let w = img.width, h = img.height
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX } } else { if (h > MAX) { w *= MAX / h; h = MAX } }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        setImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.6)])
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx))

  const handleDeleteCollateral = async (id, phone) => {
    if (!window.confirm("Are you sure you want to delete this closed collateral?")) return
    setLoading(true)
    try {
      await axios.delete(`${VITE_API_BASE_KEY}/customers/collatral/delete?phone=${phone}&collatral_id=${id}`, { headers: header })
      setSuccess("Collateral deleted successfully!")
      fetchCollaterals()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete collateral")
    }
    setLoading(false)
  }

  const handlePayment = async () => {
    if (!paymentAmount || isNaN(paymentAmount)) return setError("Invalid payment amount")
    if (!selectedAccount) return

    setLoading(true)
    try {
      const amount = Number(paymentAmount)
      const currentHistory = selectedAccount.paymentHistory || []
      const currentPaid = selectedAccount.totalPaid || 0
      const remain = selectedAccount.remainingAmount !== undefined ? selectedAccount.remainingAmount : selectedAccount.price

      const newPayment = {
        amount,
        type: isAdjustment ? 'adjustment' : 'payment',
        date: new Date(),
        note: isAdjustment ? 'Negotiation/Discount Closure' : 'Regular Payment'
      }

      const updatedPayload = {
        ...selectedAccount,
        paymentHistory: [...currentHistory, newPayment],
        totalPaid: currentPaid + amount,
        remainingAmount: Math.max(0, remain - amount),
        status: isAdjustment ? 'closed' : (remain - amount <= 0 ? 'closed' : 'active')
      }

      await axios.patch(`${VITE_API_BASE_KEY}/customers/collatral/update?phone=${selectedAccount.phone}&collatral_id=${selectedAccount._id}`, updatedPayload, { headers: header })

      setSuccess(isAdjustment ? "Account closed with adjustment!" : "Payment recorded successfully!")
      setPaymentAmount(''); setIsAdjustment(false); setShowAccount(false)
      fetchCollaterals()
    } catch (err) {
      setError("Failed to record payment")
    }
    setLoading(false)
  }

  // Filtering Logic ---
  const displayedCollaterals = useMemo(() => {
    return collaterals
      .filter(item => {
        if (filter === 'active') return item.status === 'active'
        if (filter === 'closed') return item.status === 'closed'
        return true
      })
      .filter(item => {
        if (!searchPhone.trim()) return true
        return String(item.phone).includes(searchPhone.trim()) || item.customerId?.name?.toLowerCase().includes(searchPhone.toLowerCase())
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [collaterals, filter, searchPhone])

  const hasBlur = showCalculator || showNewGirvi || showAccount

  return (
    <>
      <div className={`min-h-screen ${hasBlur ? 'blur-[2px] pointer-events-none' : ''}`}>

        <SectionHeader 
          title="Girvi / Collateral" 
          subtitle="Manage collateral loans with payments and automatic interest tracking"
          buttonText="New Girvi"
          onButtonClick={() => setShowNewGirvi(true)}
          titleClassName="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
        >
          <button 
            onClick={() => setShowCalculator(true)} 
            className='p-2 px-4 bg-secondary border border-border/50 rounded flex items-center gap-2 hover:bg-secondary/80 transition-all font-medium'
          >
            <Calculator className='h-4 w-4' /> Quick Calculator
          </button>
        </SectionHeader>

        {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center my-4'>{success}</div>}
        {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center my-4'>{error}</div>}

        {/* Search & Filters */}
        <div className='flex flex-col md:flex-row gap-4 items-center bg-secondary/30 p-5 rounded-2xl border border-border/50 my-6'>
          <div className='flex-1 w-full'>
            <SearchBar 
              value={searchPhone} 
              onChange={(e) => setSearchPhone(e.target.value)} 
              placeholder="Search by name or phone number..." 
            />
          </div>
          <div className='flex gap-2 w-full md:w-auto bg-card p-1.5 rounded border border-border/50'>
            {['all', 'active', 'closed'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)} 
                 className={`px-6 py-2 rounded text-sm font-bold capitalize transition-all ${filter === f ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 {f}
               </button>
            ))}
          </div>
        </div>

        {/* Collateral Cards List */}
        {loading && !showNewGirvi && !showAccount ? (
           <div className='text-center py-20 opacity-50'><p>Loading collaterals...</p></div>
        ) : displayedCollaterals.length === 0 ? (
           <div className='text-center py-20 border-2 border-dashed border-border/50 rounded-3xl'>
              <h2 className='text-muted-foreground text-xl font-medium'>No Girvi accounts found</h2>
           </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {displayedCollaterals.map((item, index) => {
              const liveInterest = calculateLiveInterest(item)
              const remain = item.remainingAmount !== undefined ? item.remainingAmount : item.price
              const totalPayable = (Number(remain) + Number(liveInterest)).toFixed(2)

              return (
                <div key={item._id || index} className='bg-card/40 border border-border/50 p-6 rounded-2xl relative hover:border-amber-400/30 transition-all group'>
                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
                    <div className='flex items-center gap-4'>
                      <div className='h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 font-extrabold shadow-inner'>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className='text-xl font-bold group-hover:text-amber-400 transition-colors'>{item.customerId?.name || 'New Customer'}</h3>
                        <p className='text-sm text-muted-foreground flex items-center gap-1.5'><Phone className='h-3.5 w-3.5 text-amber-400/70' /> +91 {item.phone}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 w-full md:w-auto justify-end'>
                      <StatusBadge status={item.status} />
                      <div className='flex gap-2 bg-secondary/50 p-1.5 rounded border border-border/50 shadow-sm'>
                        {item.status === 'closed' && (
                          <button onClick={() => handleDeleteCollateral(item._id, item.phone)} className='p-2 hover:bg-red-500/20 rounded transition-colors group/del'>
                            <Trash2 className='h-4 w-4 text-red-500 group-hover/del:scale-110 transition-transform' />
                          </button>
                        )}
                        <button onClick={() => { setSelectedAccount(item); setShowAccount(true); setShowHistory(false) }} className='p-2 hover:bg-amber-400/20 rounded transition-colors group/edit'>
                          <Edit className='h-4 w-4 text-amber-400 group-hover/edit:scale-110 transition-transform' />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-secondary/20 p-5 rounded-2xl border border-border/30 mb-4'>
                    <div className='space-y-1'>
                      <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Jewelry Item</p>
                      <h4 className='font-bold truncate'>{item.jewellery}</h4>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Weight</p>
                      <h4 className='font-bold flex items-center gap-1'><WeightIcon className='h-3.5 w-3.5 text-amber-400/50' />{item.weight}g</h4>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>Principal</p>
                      <h4 className='font-bold flex items-center gap-1'><IndianRupee className='h-3.5 w-3.5 text-amber-400/50' />{item.price.toLocaleString('en-IN')}</h4>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] text-amber-400 uppercase font-bold tracking-widest'>Interest ({item.interestRate}%)</p>
                      <h4 className='font-bold text-amber-400 flex items-center gap-1'>+ <IndianRupee className='h-3.5 w-3.5' />{liveInterest}</h4>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] text-green-500 uppercase font-bold tracking-widest'>Total Paid</p>
                      <h4 className='font-bold text-green-500 flex items-center gap-1'><IndianRupee className='h-3.5 w-3.5' />{item.totalPaid || 0}</h4>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] text-red-500 uppercase font-bold tracking-widest'>Due Balance</p>
                      <h4 className='font-extrabold text-red-500 flex items-center gap-1'><IndianRupee className='h-3.5 w-3.5' />{Number(totalPayable).toLocaleString('en-IN')}</h4>
                    </div>
                  </div>

                  <div className='flex justify-between items-center px-1'>
                     <div className='flex gap-6 text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>
                        <span>Opening: {new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.updatedAt !== item.createdAt && <span>Last Activity: {new Date(item.updatedAt).toLocaleDateString()}</span>}
                     </div>
                     <button 
                        onClick={() => { setSelectedAccount(item); setShowAccount(true); }}
                        className='text-xs font-bold text-amber-400 hover:underline flex items-center gap-1'
                     >
                       Manage Account & Details
                     </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <QuickCalculatorModal 
        show={showCalculator}
        onClose={() => setShowCalculator(false)}
        calcData={calcData}
        handleCalcChange={handleCalcChange}
        calculateInterest={calculateInterest}
        calcResult={calcResult}
      />

      <NewGirviModal 
        show={showNewGirvi}
        onClose={() => setShowNewGirvi(false)}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        customerFound={customerFound}
        setCustomerFound={setCustomerFound}
        checkCustomer={checkCustomer}
        customerData={customerData}
        setCustomerData={setCustomerData}
        girviData={girviData}
        setGirviData={setGirviData}
        images={images}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        handleCreateGirvi={handleCreateGirvi}
        loading={loading}
        predefinedItemNames={predefinedItemNames}
      />

      <CollateralDetailsModal 
        show={showAccount}
        onClose={() => setShowAccount(false)}
        account={selectedAccount}
        calculateLiveInterest={calculateLiveInterest}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        isAdjustment={isAdjustment}
        setIsAdjustment={setIsAdjustment}
        handlePayment={handlePayment}
        loading={loading}
        onEnlargeImage={(img) => setEnlargedImage(img)}
      />

      <ImageViewer 
        image={enlargedImage} 
        onClose={() => setEnlargedImage(null)} 
      />
    </>
  )
}

export { Colletral }