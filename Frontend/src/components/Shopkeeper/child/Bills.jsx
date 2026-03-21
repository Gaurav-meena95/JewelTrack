import React, { useState, useEffect } from 'react'
import { Calculator, Edit, Search, Plus, X, Phone, History, IndianRupee, ChevronDown, ChevronUp, UserCheck, UserX, AlertCircle, FileText, Upload, Image as ImageIcon, Camera } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

const Bills = () => {
  const header = getAuthHeaders()

  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Dashboard Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, paid, partially_paid, unpaid
  const [filterMethod, setFilterMethod] = useState('all') // all, cash, upi, card, bank_transfer

  // Navigation / Modal States
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNewBill, setShowNewBill] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Form States
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerFound, setCustomerFound] = useState(null)
  const [customerData, setCustomerData] = useState({ name: '', father_name: '', address: '', email: '' })
  
  const [billData, setBillData] = useState({
    itemName: '', metal: 'gold', purity: '', weight: '', ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: '0', amountPaid: '', paymentMethod: 'cash'
  })
  
  // Image Upload / Viewer States
  const [images, setImages] = useState([])
  const [enlargedImage, setEnlargedImage] = useState(null)

  // Calculator State (Standalone)
  const [calcData, setCalcData] = useState({ basePrice: '', interest: '', startDate: '', endDate: '' })
  const [calcResult, setCalcResult] = useState(0)

  // --- API Calls ---
  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/bills/me`, { headers: header })
      if (response.data && response.data.data) {
        setBills(response.data.data)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch bills')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBills()
  }, [])

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError('') }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  // --- Calculator Logic ---
  const handleCalcChange = (e) => setCalcData({ ...calcData, [e.target.name]: e.target.value })
  const calculateInterest = (e) => {
    e.preventDefault()
    if (!calcData.startDate || !calcData.endDate || !calcData.basePrice || !calcData.interest) return
    const days = (new Date(calcData.endDate) - new Date(calcData.startDate)) / (1000 * 60 * 60 * 24)
    if (days < 0) return setCalcResult("Invalid Dates")
    const interest = (Number(calcData.basePrice) * Number(calcData.interest) * days) / 3000
    setCalcResult(interest.toFixed(2))
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

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index))

  // --- Customer Lookup ---
  const checkCustomer = async () => {
    if (customerPhone.length < 10) return
    try {
      setLoading(true)
      const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
      if (res.data && res.data.customer) {
        setCustomerFound(true)
        const c = res.data.customer
        setCustomerData({ name: c.name, father_name: c.father_name, address: c.address, email: c.email })
        if (res.data.message && !isEditing) setSuccess(res.data.message)
      } else {
        setCustomerFound(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check customer")
      setCustomerFound(false)
    }
    setLoading(false)
  }

  // --- Create/Update Bill ---
  const handleSaveBill = async (e) => {
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

      // 2. Create or Update Bill
      const billPayload = {
        itemName: billData.itemName,
        metal: billData.metal,
        purity: billData.purity,
        weight: Number(billData.weight),
        ratePerGram: Number(billData.ratePerGram),
        makingChargePercent: Number(billData.makingChargePercent || 0),
        gstPercent: Number(billData.gstPercent || 0),
        manualAdjustment: Number(billData.manualAdjustment || 0),
        amountPaid: Number(billData.amountPaid || 0),
        paymentMethod: billData.paymentMethod,
        image: images
      }
      
      if (isEditing && selectedAccount) {
         await axios.patch(`${VITE_API_BASE_KEY}/customers/bills/update?phone=${customerPhone}&bill_id=${selectedAccount._id}`, billPayload, { headers: header })
         setSuccess("Bill updated successfully!")
      } else {
         await axios.post(`${VITE_API_BASE_KEY}/customers/bills/create?phone=${customerPhone}`, billPayload, { headers: header })
         setSuccess("Bill created successfully!")
      }

      setShowNewBill(false)
      setIsEditing(false)
      resetBillForm()
      fetchBills()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save Bill')
    }
    setLoading(false)
  }

  const openEditModal = (bill) => {
    setSelectedAccount(bill)
    setCustomerPhone(bill.customerId?.phone || '')
    setCustomerData({
       name: bill.customerId?.name || '',
       father_name: bill.customerId?.father_name || '',
       address: bill.customerId?.address || '',
       email: bill.customerId?.email || ''
    })
    setCustomerFound(true)
    
    setBillData({
       itemName: bill.invoice?.itemName || '',
       metal: bill.invoice?.metal || 'gold',
       purity: bill.invoice?.purity || '',
       weight: bill.invoice?.weight || '',
       ratePerGram: bill.invoice?.ratePerGram || '',
       makingChargePercent: bill.invoice?.makingChargePercent || '',
       gstPercent: bill.invoice?.gstPercent || '3',
       manualAdjustment: bill.invoice?.manualAdjustment || '0',
       amountPaid: bill.payment?.amountPaid || '',
       paymentMethod: bill.payment?.paymentMethod || 'cash'
    })
    setImages(bill.image || [])
    setIsEditing(true)
    setShowNewBill(true)
  }

  const confirmAndCreateNew = () => {
    if (isEditing || showNewBill) {
        if (!window.confirm("Any unsaved changes will be lost. Open a truly new bill?")) return;
    }
    resetBillForm()
    setIsEditing(false)
    setShowNewBill(true)
  }

  const resetBillForm = () => {
    setCustomerPhone('')
    setCustomerFound(null)
    setCustomerData({ name: '', father_name: '', address: '', email: '' })
    setBillData({ itemName: '', metal: 'gold', purity: '', weight: '', ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: '0', amountPaid: '', paymentMethod: 'cash' })
    setImages([])
    setSelectedAccount(null)
  }

  // --- Real-time Price Calculation ---
  const calBasePrice = Number(billData.weight || 0) * Number(billData.ratePerGram || 0)
  const calMakingCharges = calBasePrice * (Number(billData.makingChargePercent || 0) / 100)
  const calGst = calBasePrice * (Number(billData.gstPercent || 0) / 100)
  const calFinalPrice = calBasePrice + calMakingCharges + calGst - Number(billData.manualAdjustment || 0)
  const calRemaining = Math.max(0, calFinalPrice - Number(billData.amountPaid || 0))

  // --- Filter Logic ---
  const displayedBills = bills.filter(item => {
    if (filterStatus !== 'all' && item.payment?.paymentStatus !== filterStatus) return false
    if (filterMethod !== 'all' && item.payment?.paymentMethod !== filterMethod) return false
    if (searchQuery.trim()) {
       const q = searchQuery.toLowerCase()
       const phoneStr = String(item.customerId?.phone || '')
       const nameStr = String(item.customerId?.name || '').toLowerCase()
       if (!phoneStr.includes(q) && !nameStr.includes(q)) return false
    }
    return true
  })

  // Theme configuration for statuses
  const statusColors = {
      'paid': 'bg-green-500/10 text-green-500 border-green-500/30',
      'partially_paid': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      'unpaid': 'bg-red-500/10 text-red-500 border-red-500/30'
  }

  return (
    <>
      <div className={`min-h-screen ${showCalculator || showNewBill ? 'blur-[2px] pointer-events-none' : ''}`}>
        
        {/* Header Area */}
        <div className='space-y-5'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div className='space-y-1'>
              <h1>Billing / Invoices</h1>
              <p className='text-muted-foreground'>Create and track jewelry sales and payments</p>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <button onClick={() => setShowCalculator(true)} className='p-2 px-4 bg-secondary border border-border/50 rounded-[8px] flex items-center gap-2 hover:bg-secondary/80'>
                <Calculator className='h-4 w-4' /> Calculator
              </button>
              <button onClick={confirmAndCreateNew} className='p-2 px-4 bg-amber-400/80 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-400'>
                <Plus className='h-4 w-4' /> New Bill
              </button>
            </div>
          </div>

          {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
          {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

          {/* Search & Filters */}
          <div className='flex flex-col md:flex-row gap-4 items-center bg-secondary/50 p-5 rounded-[8px] border border-border/50'>
            <div className='relative w-full md:flex-1'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5' />
              <input
                className="w-full border border-border/50 pl-12 rounded-[8px] bg-input/90 p-2"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by customer name or phone...'
              />
            </div>
            <div className='flex flex-wrap gap-2 w-full md:w-auto bg-input/90 p-1 rounded-[8px] border border-border/50'>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className='px-4 py-1.5 rounded-[5px] text-sm bg-transparent border-none outline-none cursor-pointer'>
                  <option value='all'>All Status</option>
                  <option value='paid'>Fully Paid</option>
                  <option value='partially_paid'>Partially Paid</option>
                  <option value='unpaid'>Unpaid</option>
              </select>
              <div className='w-px h-6 bg-border mx-1 self-center hidden sm:block'></div>
              <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className='px-4 py-1.5 rounded-[5px] text-sm bg-transparent border-none outline-none cursor-pointer'>
                  <option value='all'>All Payments</option>
                  <option value='cash'>Cash</option>
                  <option value='upi'>UPI</option>
                  <option value='card'>Card</option>
                  <option value='bank_transfer'>Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && !showNewBill && <div className='text-center py-10'><p className='text-muted-foreground'>Loading...</p></div>}

        {/* Bill Cards */}
        {!loading && displayedBills.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6'>
            {displayedBills.map((item, index) => {
              const status = item.payment?.paymentStatus || 'unpaid'
              return (
                <div key={item._id || index} className='backdrop-blur-md bg-card/40 border border-border/50 p-6 rounded-[8px] relative hover:border-amber-400/50 transition-colors cursor-pointer' onClick={() => openEditModal(item)}>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 flex items-center justify-center rounded-full bg-amber-400/10 text-amber-500'>
                        <FileText className='w-5 h-5'/> 
                      </div>
                      <div>
                        <h3 className='text-lg font-medium'>{item.customerId?.name || 'Unknown'}</h3>
                        <p className='text-sm text-muted-foreground flex items-center gap-1'><Phone className='h-3 w-3' /> {item.customerId?.phone}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full border uppercase ${statusColors[status]}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className='bg-secondary/30 p-4 rounded-[8px] mb-4'>
                    <div className='flex justify-between items-center mb-2'>
                       <p className='text-sm font-medium'>{item.invoice?.itemName} <span className="text-xs text-muted-foreground uppercase ml-1">({item.invoice?.metal})</span></p>
                       <p className='font-bold flex items-center'><IndianRupee className='w-3 h-3'/>{item.invoice?.finalPrice}</p>
                    </div>
                    <div className='flex justify-between items-center text-xs text-muted-foreground'>
                       <p>Paid: <span className='text-green-500'>₹{item.payment?.amountPaid}</span></p>
                       <p>Due: <span className='text-red-500'>₹{item.payment?.remainingAmount}</span></p>
                    </div>
                  </div>

                  <div className='flex justify-between items-center text-xs text-muted-foreground'>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <button className='text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors'>
                        <Edit className='w-3 h-3'/> Edit / View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && displayedBills.length === 0 && (
          <div className='text-center py-20'>
            <h2 className='text-muted-foreground text-xl'>No bills match your criteria</h2>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT BILL MODAL --- */}
      {showNewBill && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-border/50 shadow-2xl m-4'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold flex items-center gap-2'>
                {isEditing ? <Edit className='w-5 h-5 text-amber-500'/> : <Plus className='w-5 h-5 text-amber-500'/>} 
                {isEditing ? 'View / Update Bill' : 'Create New Bill'}
              </h2>
              <button type="button" onClick={() => { setShowNewBill(false); resetBillForm(); setIsEditing(false) }} className='hover:bg-secondary p-1 rounded-full'><X /></button>
            </div>

            <form onSubmit={handleSaveBill} className='space-y-6'>
              
              {/* Step 1: Customer Lookup */}
              <div className='bg-secondary/40 p-4 rounded border border-border/50 space-y-4'>
                <h3 className='text-sm font-semibold flex items-center gap-2'><Search className='w-4 h-4 text-amber-400' /> {isEditing ? 'Customer Details' : 'Find or Add Customer'}</h3>
                
                <div className='flex gap-3'>
                  <input
                    type='text' placeholder='10-digit Phone Number' maxLength={10} required disabled={isEditing}
                    value={customerPhone}
                    onChange={(e) => { setCustomerPhone(e.target.value); setCustomerFound(null) }}
                    className='flex-1 p-2 rounded-[8px] bg-input border border-border focus:border-amber-400/50 outline-none disabled:opacity-50'
                  />
                  {!isEditing && <button type='button' onClick={checkCustomer} className='bg-secondary px-4 rounded-[8px] hover:bg-secondary/80 border border-border'>Check</button>}
                </div>

                {!isEditing && customerFound === true && <div className='text-green-500 text-sm flex items-center gap-1'><UserCheck className='w-4 h-4' /> Existing customer auto-filled.</div>}
                {!isEditing && customerFound === false && <div className='text-amber-500 text-sm flex items-center gap-1'><UserX className='w-4 h-4' /> New customer! Please fill out details.</div>}

                {/* Customer Details Form */}
                {(customerFound !== null || isEditing) && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <input type='text' placeholder='Full Name' required value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <input type='text' placeholder="Father's Name" value={customerData.father_name} onChange={(e) => setCustomerData({ ...customerData, father_name: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <input type='email' placeholder='Email (Optional)' value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                    <input type='text' placeholder='Address' required value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                  </div>
                )}
              </div>

              {/* Step 2: Bill Details */}
              {(customerFound !== null || isEditing) && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Invoice Info */}
                    <div className='bg-secondary/40 p-4 rounded-xl border border-border/50 space-y-4 flex flex-col'>
                      <h3 className='text-sm font-semibold'>Invoice Details</h3>
                      
                      <div className='grid grid-cols-2 gap-3'>
                          <div className='col-span-2 relative'>
                            <input type='text' placeholder='Item Name (e.g. Ring)' required value={billData.itemName} onChange={(e) => setBillData({ ...billData, itemName: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                          </div>
                          
                          <select value={billData.metal} onChange={(e) => setBillData({ ...billData, metal: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50 outline-none'>
                              <option value="gold">Gold</option>
                              <option value="silver">Silver</option>
                              <option value="diamond">Diamond</option>
                          </select>
                          
                          <input type='text' placeholder='Purity (e.g. 22K)' value={billData.purity} onChange={(e) => setBillData({ ...billData, purity: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                          
                          <div className='relative'>
                             <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>grams</span>
                             <input type='number' placeholder='Weight' required value={billData.weight} onChange={(e) => setBillData({ ...billData, weight: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                          </div>
                          
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>₹</span>
                            <input type='number' placeholder='Rate / g' required value={billData.ratePerGram} onChange={(e) => setBillData({ ...billData, ratePerGram: e.target.value })} className='w-full pl-8 p-2 rounded-[8px] bg-input border border-border/50' />
                          </div>

                          <div className='relative'>
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>%</span>
                            <input type='number' placeholder='Making Chrg' value={billData.makingChargePercent} onChange={(e) => setBillData({ ...billData, makingChargePercent: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                          </div>

                          <div className='relative'>
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% GST</span>
                            <input type='number' placeholder='GST' value={billData.gstPercent} onChange={(e) => setBillData({ ...billData, gstPercent: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50' />
                          </div>
                      </div>
                    </div>

                    {/* Payment Info & Live Calculation */}
                    <div className='bg-secondary/40 p-4 rounded-xl border border-border/50 space-y-4 flex flex-col justify-between'>
                       <div>
                          <h3 className='text-sm font-semibold mb-3'>Payment & Pricing</h3>
                          <div className='grid grid-cols-2 gap-3 mb-4'>
                              <div className='col-span-2 relative'>
                                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm uppercase'>Discount / Adjustment</span>
                                  <input type='number' value={billData.manualAdjustment} onChange={(e) => setBillData({ ...billData, manualAdjustment: e.target.value })} className='w-full text-right pl-32 p-2 rounded-[8px] bg-input border border-border/50 font-medium' />
                              </div>
                              <div className='col-span-2 relative'>
                                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm uppercase'>Amount Paid Now</span>
                                  <input type='number' value={billData.amountPaid} onChange={(e) => setBillData({ ...billData, amountPaid: e.target.value })} className='w-full text-right pl-36 p-2 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-500 font-bold focus:border-green-500 outline-none' />
                              </div>
                              <div className='col-span-2'>
                                  <select value={billData.paymentMethod} onChange={(e) => setBillData({ ...billData, paymentMethod: e.target.value })} className='w-full p-2 rounded-[8px] bg-input border border-border/50 outline-none text-sm'>
                                      <option value="cash">Paid via Cash</option>
                                      <option value="upi">Paid via UPI / Wallet</option>
                                      <option value="card">Paid via Credit / Debit Card</option>
                                      <option value="bank_transfer">Paid via Bank Transfer</option>
                                  </select>
                              </div>
                          </div>
                       </div>
                       
                       <div className='bg-primary/5 p-3 rounded-[8px] border border-primary/20 space-y-2 mt-auto'>
                          <div className='flex justify-between text-xs text-muted-foreground'>
                             <span>Base (w*r):</span> <span>₹{calBasePrice.toFixed(2)}</span>
                          </div>
                          <div className='flex justify-between text-xs text-muted-foreground'>
                             <span>Making + GST:</span> <span>₹{(calMakingCharges + calGst).toFixed(2)}</span>
                          </div>
                          <div className='flex justify-between font-bold text-lg pt-2 border-t border-border/30'>
                             <span>Final Price:</span> <span className='text-foreground'>₹{calFinalPrice.toFixed(2)}</span>
                          </div>
                          <div className='flex justify-between font-medium text-sm text-red-400'>
                             <span>Balance Due:</span> <span>₹{calRemaining.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className='col-span-1 md:col-span-2 mt-2 pt-4 border-t border-border/50'>
                      <label className='text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2'><ImageIcon className='w-4 h-4 text-amber-500'/> Upload Jewelry Photos</label>
                      <div className='flex gap-4 overflow-x-auto pb-2'>
                        {images.map((img, idx) => (
                          <div key={idx} onClick={() => setEnlargedImage(img)} className='relative flex-shrink-0 w-24 h-24 rounded-xl border border-border/50 overflow-hidden group cursor-pointer'>
                            <img src={img} alt='uploaded' className='w-full h-full object-cover' />
                            <button type='button' onClick={(e) => { e.stopPropagation(); removeImage(idx) }} className='absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'><X className='w-3 h-3'/></button>
                          </div>
                        ))}
                        <div className='flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-border/50 relative hover:border-amber-400 hover:bg-amber-400/5 transition-colors group cursor-pointer'>
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

              <div className='flex gap-3 pt-4 border-t border-border/30'>
                <button type='button' onClick={() => { setShowNewBill(false); resetBillForm(); setIsEditing(false) }} className='flex-1 p-3 rounded-[8px] bg-secondary hover:bg-secondary/80'>Cancel</button>
                <button type='submit' disabled={customerFound === null || loading} className='flex-1 p-3 rounded-[8px] bg-amber-400 text-black font-medium disabled:opacity-50 hover:bg-amber-500'>
                  {loading ? 'Saving...' : (isEditing ? 'Save & Update Bill' : 'Generate Bill')}
                </button>
              </div>
            </form>
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
              <button type='submit' className='w-full p-3 bg-secondary border border-border/50 rounded-[8px] hover:bg-secondary/80 font-medium'>Compute</button>
            </form>

            {calcResult !== 0 && (
              <div className='mt-6 p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl text-center'>
                <p className='text-sm text-amber-500/80 mb-1'>Calculated Output</p>
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
          <button className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full text-white transition-colors'><X className='w-6 h-6'/></button>
          <img src={enlargedImage} alt="Enlarged" className='max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl' onClick={(e) => e.stopPropagation()} />
        </div>
      )}

    </>
  )
}

export { Bills }
