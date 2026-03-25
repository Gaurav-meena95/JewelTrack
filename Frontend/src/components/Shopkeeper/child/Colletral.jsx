import React, { useState, useEffect } from 'react'
import { Calculator, Edit, Search, Plus, X, Phone, History, IndianRupee, ChevronDown, ChevronUp, UserCheck, UserX, AlertCircle, Trash2, WeightIcon, Upload, Image as ImageIcon, Camera } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'
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
  const [customerFound, setCustomerFound] = useState(null) // null = unchecked, false = not found, true = found
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

  // --- API Calls ---
  const fetchCollaterals = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/collatral/me`, { headers: header })
      if (response.data) {
        setCollaterals(response.data.data)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch collaterals')
    }
    setLoading(false)
  }

  const fetchProfileSettings = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_KEY}/auth/me`, { headers: header })
      if (res.data && res.data.user) {
         setPredefinedItemNames(res.data.user.itemNames || [])
      }
    } catch (err) {
      console.error('Failed to load settings', err)
    }
  }

  useEffect(() => {
    fetchCollaterals()
    fetchProfileSettings()
  }, [])

  // Auto-clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError('') }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  // --- Calculator Logic ---
  const handleCalcChange = (e) => {
    setCalcData({ ...calcData, [e.target.name]: e.target.value })
  }
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
    const balance = item.remainingAmount * item.interestRate * days / 3000
    return (balance).toFixed(2)
  }

  // --- Customer Lookup ---
  const checkCustomer = async () => {
    if (customerPhone.length < 10) return
    try {
      setLoading(true)

      const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
      if (res.data) {
        setCustomerFound(true)
        const c = res.data.customer
        setCustomerData({ name: c.name, father_name: c.father_name, address: c.address, email: c.email })
      } else {
        setCustomerFound(false)
      }
    } catch (err) {
      console.log(err.message)
      setError(err.response?.data?.message || "Failed to check customer")
      setCustomerFound(false)
    }
    setLoading(false)
  }

  // --- Image Handling ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const base64String = canvas.toDataURL('image/jpeg', 0.6)
        setImages(prev => [...prev, base64String])
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // --- Create New Girvi ---
  const handleCreateGirvi = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // 1. Create or Update Customer
      const custPayload = { phone: customerPhone, ...customerData }
      if (customerFound) {
        await axios.patch(`${VITE_API_BASE_KEY}/customers/register/update`, custPayload, { headers: header })
      } else {
        await axios.post(`${VITE_API_BASE_KEY}/customers/register`, custPayload, { headers: header })
      }

      // 2. Create Collateral
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
    setCustomerPhone('')
    setCustomerFound(null)
    setCustomerData({ name: '', father_name: '', address: '', email: '' })
    setGirviData({ weight: '', jewellery: '', price: '', interestRate: '' })
    setImages([])
  }

  // --- Delete Closed Collateral ---
  const handleDeleteCollateral = async (id, phone) => {
    if (!window.confirm("Are you sure you want to delete this closed collateral?")) return
    setLoading(true)
    try {
      await axios.delete(`${VITE_API_BASE_KEY}/customers/collatral/delete?phone=${phone}&collatral_id=${id}`, { headers: header })
      setSuccess("Collateral deleted successfully!")
      fetchCollaterals()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to delete collateral")
      setLoading(false)
    }
  }

  // --- Record Payment / Adjustment ---
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
      setPaymentAmount('')
      setIsAdjustment(false)
      fetchCollaterals()
      setShowAccount(false)
    } catch (err) {
      setError("Failed to record payment")
    }
    setLoading(false)
  }

  // Quick Filters
  const displayedCollaterals = collaterals.filter(item => {
    if (filter === 'active') return item.status === 'active'
    if (filter === 'closed') return item.status === 'closed'
    return true
  }).filter(item => {
    if (!searchPhone.trim()) return true
    return String(item.phone).includes(searchPhone.trim())
  })

  return (
    <>
      <div className={`min-h-screen ${showCalculator || showNewGirvi || showAccount ? 'blur-[2px] pointer-events-none' : ''}`}>

        {/* Header Area */}
        <div className='space-y-5'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div className='space-y-1'>
              <h1>Girvi / Collateral</h1>
              <p className='text-muted-foreground'>Manage collateral loans with payments and automatic interest</p>
            </div>
            <div className='flex items-center gap-3'>
              <button onClick={() => setShowCalculator(true)} className='p-2 px-4 bg-secondary border border-border/50 rounded-[8px] flex items-center gap-2 hover:bg-secondary/80'>
                <Calculator className='h-4 w-4' /> Calculator
              </button>
              <button onClick={() => setShowNewGirvi(true)} className='p-2 px-4 bg-amber-400/80 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-400'>
                <Plus className='h-4 w-4' /> New Girvi
              </button>
            </div>
          </div>

          {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
          {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

          {/* Search & Filters */}
          <div className='flex flex-col md:flex-row gap-4 items-center bg-secondary/50 p-5 rounded-2xl'>
            <div className='relative flex-1 w-full'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5' />
              <input
                className="w-full border border-border/50 pl-12 rounded-[8px] bg-input/90 p-2"
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder='Live search by phone number...'
              />
            </div>
            <div className='flex gap-2 w-full md:w-auto bg-input/90 p-1 rounded-[8px] border border-border/50'>
              <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-[5px] text-sm ${filter === 'all' ? 'bg-amber-400/20 text-amber-500' : 'text-muted-foreground'}`}>All</button>
              <button onClick={() => setFilter('active')} className={`px-4 py-1.5 rounded-[5px] text-sm ${filter === 'active' ? 'bg-amber-400/20 text-amber-500' : 'text-muted-foreground'}`}>Active</button>
              <button onClick={() => setFilter('closed')} className={`px-4 py-1.5 rounded-[5px] text-sm ${filter === 'closed' ? 'bg-amber-400/20 text-amber-500' : 'text-muted-foreground'}`}>Closed</button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && !showNewGirvi && !showAccount && <div className='text-center py-10'><p className='text-muted-foreground'>Loading...</p></div>}

        {/* Collateral Cards */}
        {!loading && displayedCollaterals.length > 0 && (
          <div className='grid grid-cols-1 gap-6 mt-6'>
            {displayedCollaterals.map((item, index) => {
              const liveInterest = calculateLiveInterest(item)

              const remain = item.remainingAmount
              const totalPayable = (Number(remain) + Number(liveInterest)).toFixed(2)

              return (
                <div key={item._id || index} className='backdrop-blur-md bg-card/40 border border-border/50 p-6 rounded-2xl relative'>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 flex items-center justify-center rounded-full bg-amber-400/10 text-amber-500 font-bold'>
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h3 className='text-lg font-medium'>{item.customerId?.name || 'Unknown'}</h3>
                        <p className='text-sm text-muted-foreground flex items-center gap-1'><Phone className='h-3 w-3' /> +91 {item.phone}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className={`px-3 py-1 text-xs rounded-full border ${item.status === 'closed' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                        {item.status.toUpperCase()}
                      </span>
                      {item.status === 'closed' && (
                        <button onClick={() => handleDeleteCollateral(item._id, item.phone)} className='p-2 hover:bg-red-500/20 rounded-[8px] transition-colors hover:text-red-500'>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </button>
                      )}
                      <button onClick={() => { setSelectedAccount(item); setShowAccount(true); setShowHistory(false) }} className='p-2 hover:bg-secondary rounded-[8px] transition-colors'>
                        <Edit className='h-4 w-4 text-amber-400' />
                      </button>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 md:grid-cols-6 gap-4 bg-secondary/30 p-4 rounded-[8px] mb-4'>
                    <div>
                      <p className='text-xs text-muted-foreground'>Jewelry Item</p>
                      <h4 className='font-medium'>{item.jewellery}</h4>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>Principal (Base)</p>
                      <h4 className='font-medium text-foreground flex items-center'><IndianRupee className='h-3 w-3' /> {item.price}</h4>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>weight</p>
                      <h4 className='font-medium text-foreground flex items-center'><WeightIcon className='h-3 w-3' />{item.weight}g</h4>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>Interest ({item.interestRate}%/m)</p>
                      <h4 className='font-medium text-amber-400 flex items-center'>+ <IndianRupee className='h-3 w-3' /> {liveInterest}</h4>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>Paid So Far</p>
                      <h4 className='font-medium text-green-500 flex items-center'><IndianRupee className='h-3 w-3' /> {item.totalPaid || 0}</h4>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>Balance Due</p>
                      <h4 className='font-medium text-red-500 flex items-center'><IndianRupee className='h-3 w-3' /> {totalPayable}</h4>
                    </div>
                  </div>

                  <div className='flex gap-6 text-xs text-muted-foreground'>
                    <span>Started: {new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.updatedAt !== item.createdAt && <span>Last Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && displayedCollaterals.length === 0 && (
          <div className='text-center py-20'>
            <h2 className='text-muted-foreground text-xl'>No Girvi accounts found</h2>
          </div>
        )}
      </div>

      {/* --- ADD NEW GIRVI MODAL --- */}
      {showNewGirvi && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-border/50 shadow-2xl m-4'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold'>Register New Girvi</h2>
              <button onClick={() => { setShowNewGirvi(false); resetGirviForm() }} className='hover:bg-secondary p-1 rounded-full'><X /></button>
            </div>

            <form onSubmit={handleCreateGirvi} className='space-y-6'>

              {/* Step 1: Customer Lookup */}
              <div className='bg-secondary/40 p-4 rounded border border-border/50 space-y-4'>
                <h3 className='text-sm font-semibold flex items-center gap-2'><Search className='w-4 h-4 text-amber-400' /> Find or Add Customer</h3>
                <div className='flex gap-3'>
                  <input
                    type='text' placeholder='10-digit Phone Number' maxLength={10} required
                    value={customerPhone}
                    onChange={(e) => { setCustomerPhone(e.target.value); setCustomerFound(null) }}
                    className='flex-1 p-2 rounded-[8px] bg-input border border-border focus:border-amber-400/50 outline-none'
                  />
                  <button type='button' onClick={checkCustomer} className='bg-secondary px-4 rounded-[8px] hover:bg-secondary/80 border border-border'>Check</button>
                </div>

                {customerFound === true && <div className='text-green-500 text-sm flex items-center gap-1'><UserCheck className='w-4 h-4' /> Existing customer details auto-filled (You can edit them if needed).</div>}
                {customerFound === false && <div className='text-amber-500 text-sm flex items-center gap-1'><UserX className='w-4 h-4' /> New customer! Please fill out their details to register them instantly.</div>}

                {/* Customer Details Form (Shown if phone entered) */}
                {(customerFound !== null) && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <input type='text' placeholder='Full Name' required value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <input type='text' placeholder="Father's Name" value={customerData.father_name} onChange={(e) => setCustomerData({ ...customerData, father_name: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <input type='email' placeholder='Email (Optional)' value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <input type='text' placeholder='Address' required value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                  </div>
                )}
              </div>

              {/* Step 2: Collateral Details (Only shown if customer step is active) */}
              {(customerFound !== null) && (
                <div className='bg-secondary/40 p-4 rounded-[8px] border border-border/50 space-y-4'>
                  <h3 className='text-sm font-semibold'>Jewelry & Loan Details</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type='text' list='predefined-items' placeholder='Jewelry Name (e.g. 24K Gold Ring)' required value={girviData.jewellery} onChange={(e) => setGirviData({ ...girviData, jewellery: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                    <input type='number' placeholder='weight (e.g. 12g)' value={girviData.weight} onChange={(e) => setGirviData({ ...girviData, weight: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <div className='relative'>
                      <IndianRupee className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                      <input type='number' placeholder='Principal Amount Given' required value={girviData.price} onChange={(e) => setGirviData({ ...girviData, price: e.target.value })} className='w-full pl-9 p-2 rounded-[8px] bg-input border border-border/50' />
                    </div>
                    <div className='relative'>
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm'>% / month</span>
                      <input type='number' step='0.1' placeholder='Monthly Interest Rate' required value={girviData.interestRate} onChange={(e) => setGirviData({ ...girviData, interestRate: e.target.value })} className='w-full p-2 pr-20 rounded-[8px] bg-input border border-border/50' />
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className='mt-4 pt-4 border-t border-border/50'>
                    <label className='text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2'><ImageIcon className='w-4 h-4 text-amber-500' /> Upload Jewelry Photos</label>
                    <div className='flex gap-4 overflow-x-auto pb-2'>
                      {images.map((img, idx) => (
                        <div key={idx} className='relative flex-shrink-0 w-24 h-24 rounded-[8px] border border-border/50 overflow-hidden group'>
                          <img src={img} alt='uploaded' className='w-full h-full object-cover' />
                          <button type='button' onClick={() => removeImage(idx)} className='absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'><X className='w-3 h-3' /></button>
                        </div>
                      ))}
                      <div className='flex-shrink-0 w-24 h-24 rounded-[8px] border-2 border-dashed border-border/50 relative hover:border-amber-400 hover:bg-amber-400/5 transition-colors group cursor-pointer'>
                        <label className='w-full h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-amber-500 cursor-pointer'>
                          <Camera className='w-6 h-6 mb-1' />
                          <span className='text-[10px] font-medium'>Add Photo</span>
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              <div className='flex gap-3 pt-4'>
                <button type='button' onClick={() => { setShowNewGirvi(false); resetGirviForm() }} className='flex-1 p-3 rounded-[8px] bg-secondary hover:bg-secondary/80'>Cancel</button>
                <button type='submit' disabled={customerFound === null || loading} className='flex-1 p-3 rounded-[8px] bg-amber-400 text-black font-medium disabled:opacity-50 hover:bg-amber-500'>
                  {loading ? 'Saving...' : 'Create Girvi Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ACCOUNT DETAILS & PAYMENT MODAL --- */}
      {showAccount && selectedAccount && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-border/50 shadow-2xl m-4'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold flex items-center gap-2'>
                Account Details <span className={`text-xs px-2 py-1 rounded-full border ${selectedAccount.status === 'closed' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>{selectedAccount.status.toUpperCase()}</span>
              </h2>
              <button onClick={() => setShowAccount(false)} className='hover:bg-secondary p-1 rounded-full'><X /></button>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-6 bg-secondary/50 p-4 rounded-[8px]'>
              <div>
                <p className='text-xs text-muted-foreground'>Customer</p>
                <h3 className='font-medium'>{selectedAccount.customerId?.name}</h3>
                <p className='text-sm text-muted-foreground'>+91 {selectedAccount.phone}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Account Opened</p>
                <h3 className='font-medium'>{new Date(selectedAccount.createdAt).toLocaleDateString()}</h3>
                <p className='text-sm text-muted-foreground'>Item: {selectedAccount.jewellery}</p>
              </div>
            </div>

            {/* Jewelry Images */}
            {selectedAccount.image && selectedAccount.image.length > 0 && (
              <div className='mb-6 bg-secondary/10 p-4 rounded border border-border/50'>
                <p className='text-xs text-muted-foreground mb-3 flex items-center gap-2'><ImageIcon className='w-4 h-4' /> Product Images</p>
                <div className='flex gap-3 overflow-x-auto pb-2'>
                  {selectedAccount.image.map((img, idx) => (
                    <div key={idx} onClick={() => setEnlargedImage(img)} className='flex-shrink-0 w-20 h-20 rounded-[8px] border border-border/50 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'>
                      <img src={img} alt='jewelry' className='w-full h-full object-cover' />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className='grid grid-cols-3 gap-4 mb-6'>
              <div className='bg-input/50 p-3 rounded-[8px] border border-border/30 text-center'>
                <p className='text-xs text-muted-foreground mb-1'>Principal</p>
                <h4 className='text-lg font-bold'>₹{selectedAccount.price}</h4>
              </div>
              <div className='bg-input/50 p-3 rounded-[8px] border border-border/30 text-center'>
                <p className='text-xs text-muted-foreground mb-1'>Paid Amount</p>
                <h4 className='text-lg font-bold text-green-500 cursor-pointer flex items-center justify-center gap-1 hover:text-green-400' onClick={() => setShowHistory(!showHistory)}>
                  ₹{selectedAccount.totalPaid || 0} {showHistory ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
                </h4>
              </div>
              <div className='bg-red-400/10 p-3 rounded-[8px] border border-red-500/30 text-center'>
                <p className='text-xs text-red-400 mb-1'>Current Balance Due</p>
                <h4 className='text-lg font-bold text-red-500'>₹{(Number(selectedAccount.remainingAmount !== undefined ? selectedAccount.remainingAmount : selectedAccount.price) + Number(calculateLiveInterest(selectedAccount))).toFixed(2)}</h4>
                <p className='text-[10px] text-red-400/80'>Includes ₹{calculateLiveInterest(selectedAccount)} interest</p>
              </div>
            </div>

            {/* Payment History Dropdown */}
            {showHistory && (
              <div className='bg-secondary/20 border border-border/40 p-4 rounded mb-6 space-y-2 max-h-40 overflow-y-auto'>
                <h4 className='text-sm font-semibold mb-3 flex items-center gap-2'><History className='w-4 h-4' /> Transaction History</h4>
                {(!selectedAccount.paymentHistory || selectedAccount.paymentHistory.length === 0) ? (
                  <p className='text-sm text-muted-foreground text-center py-2'>No payments recorded yet.</p>
                ) : (
                  selectedAccount.paymentHistory.map((pay, i) => (
                    <div key={i} className='flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0'>
                      <div>
                        <span className='text-muted-foreground'>{new Date(pay.date).toLocaleDateString()}</span>
                        {pay.type === 'adjustment' && <span className='ml-2 text-xs bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded'>Adjustment/Discount</span>}
                      </div>
                      <span className='font-medium text-green-500'>+ ₹{pay.amount}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Add Payment / Settle Account Section */}
            {selectedAccount.status === 'active' && (
              <div className='bg-amber-400/5 p-4 rounded border border-amber-400/10'>
                <h4 className='text-sm font-semibold mb-3'>Record New Payment or Settle Account</h4>
                <div className='flex gap-3 mb-3'>
                  <div className='relative flex-1'>
                    <IndianRupee className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50' />
                    <input
                      type='number'
                      placeholder='Amount received from customer'
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className='w-full pl-9 p-2.5 rounded-[8px] bg-input border border-amber-400/30 focus:border-amber-400 outline-none placeholder:text-muted-foreground/50'
                    />
                  </div>
                  <button onClick={handlePayment} disabled={loading} className='px-6 bg-green-600 hover:bg-green-500 text-white rounded-[8px] font-medium disabled:opacity-50'>
                    Receive
                  </button>
                </div>

                <div className='flex items-center gap-2'>
                  <input type='checkbox' id='adjustment' checked={isAdjustment} onChange={(e) => setIsAdjustment(e.target.checked)} className='accent-amber-500' />
                  <label htmlFor='adjustment' className='text-sm text-muted-foreground cursor-pointer flex items-center gap-1'>
                    <AlertCircle className='w-3 h-3 text-amber-500' /> Final Settlement Discount? (Closes account immediately)
                  </label>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- STANDALONE CALCULATOR MODAL --- */}
      {showCalculator && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl m-4'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold flex items-center gap-2'><Calculator className='w-5 h-5 text-amber-400' /> Quick Calculator</h2>
              <button onClick={() => setShowCalculator(false)} className='hover:bg-secondary p-1 rounded-full'><X /></button>
            </div>

            <form onSubmit={calculateInterest} className='space-y-4'>
              <input type='number' name='basePrice' placeholder='Principal Amount (₹)' onChange={handleCalcChange} className='w-full p-2.5 rounded-[8px] bg-input border border-border/50' />
              <input type='number' step='0.1' name='interest' placeholder='Interest Rate (% per month)' onChange={handleCalcChange} className='w-full p-2.5 rounded-[8px] bg-input border border-border/50' />
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs text-muted-foreground block mb-1'>Start Date</label>
                  <input type='date' name='startDate' onChange={handleCalcChange} className='w-full p-2.5 rounded-[8px] bg-input border border-border/50 text-sm' />
                </div>
                <div>
                  <label className='text-xs text-muted-foreground block mb-1'>End Date</label>
                  <input type='date' name='endDate' onChange={handleCalcChange} className='w-full p-2.5 rounded-[8px] bg-input border border-border/50 text-sm' />
                </div>
              </div>
              <button type='submit' className='w-full p-3 bg-secondary border border-border/50 rounded-[8px] hover:bg-secondary/80 font-medium'>Compute Interest</button>
            </form>

            {calcResult !== 0 && (
              <div className='mt-6 p-4 bg-amber-400/10 border border-amber-400/30 rounded-[8px] text-center'>
                <p className='text-sm text-amber-500/80 mb-1'>Calculated Interest</p>
                <h3 className='text-3xl font-bold text-amber-400'>
                  {calcResult === "Invalid Dates" ? "Error" : `₹${calcResult}`}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- ENLARGED IMAGE VIEWER MODAL --- */}
      {enlargedImage && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4' onClick={() => setEnlargedImage(null)}>
          <button className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full text-white transition-colors'><X className='w-6 h-6' /></button>
          <img src={enlargedImage} alt="Enlarged" className='max-w-full max-h-[90vh] object-contain rounded-[8px] shadow-2xl' onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Datalist for custom settings */}
      <datalist id="predefined-items">
         {predefinedItemNames.map((name, idx) => <option key={idx} value={name} />)}
      </datalist>

    </>
  )
}

export { Colletral }