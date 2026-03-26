import React, { useState, useEffect, useMemo } from 'react'
import { Calculator, Edit, Search, Plus, X, Phone, IndianRupee, UserCheck, UserX, ShoppingCart, User, Calendar, FileText, ArrowLeft, Trash2, Camera, Image as ImageIcon, History } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

const Bills = () => {
   const header = getAuthHeaders()

   // App State
   const [bills, setBills] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [success, setSuccess] = useState('')

   // Predefined Settings
   const [predefinedItemNames, setPredefinedItemNames] = useState([])
   const [predefinedPurities, setPredefinedPurities] = useState([])

   // Navigation State
   const [viewMode, setViewMode] = useState('dashboard') // 'dashboard' or 'profile'
   const [selectedCustomer, setSelectedCustomer] = useState(null) // Active customer object

   // Dashboard Search
   const [searchQuery, setSearchQuery] = useState('')

   // Profile Payment Filter
   const [paymentFilter, setPaymentFilter] = useState('all') // 'all' | 'paid' | 'partially_paid' | 'unpaid'

   // Modals
   const [showLookupModal, setShowLookupModal] = useState(false)
   const [showNewBill, setShowNewBill] = useState(false)
   const [showViewBill, setShowViewBill] = useState(false)
   const [showEditPayment, setShowEditPayment] = useState(false)
   const [activeBillDetails, setActiveBillDetails] = useState(null)
   const [editPaymentData, setEditPaymentData] = useState({ additionalPayment: '', paymentMethod: 'cash' })


   // Lookup / Create Customer Form
   const [customerPhone, setCustomerPhone] = useState('')
   const [customerFound, setCustomerFound] = useState(null)
   const [customerData, setCustomerData] = useState({ name: '', father_name: '', address: '', email: '' })

   // Cart System for New Bill
   const [cartItems, setCartItems] = useState([])
   const [currentItem, setCurrentItem] = useState({ itemName: '', metal: 'gold', purity: '', weight: '', ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: '0' })
   const [paymentDetails, setPaymentDetails] = useState({ amountPaid: '', paymentMethod: 'cash' })
   const [images, setImages] = useState([])
   const [enlargedImage, setEnlargedImage] = useState(null)



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

   const fetchProfileSettings = async () => {
      try {
         const res = await axios.get(`${VITE_API_BASE_KEY}/auth/me`, { headers: header })
         if (res.data && res.data.user) {
            setPredefinedItemNames(res.data.user.itemNames || [])
            setPredefinedPurities(res.data.user.purities || [])
         }
      } catch (err) {
         console.error('Failed to load settings', err)
      }
   }

   useEffect(() => {
      fetchBills()
      fetchProfileSettings()
   }, [])

   useEffect(() => {
      if (success || error) {
         const timer = setTimeout(() => { setSuccess(''); setError('') }, 5000)
         return () => clearTimeout(timer)
      }
   }, [success, error])

   // --- Grouping Bills by Customer (Dashboard Data) ---
   const uniqueCustomers = useMemo(() => {
      const customerMap = {}
      bills.forEach(bill => {
         if (!bill.customerId || !bill.customerId._id) return
         const custId = bill.customerId._id
         if (!customerMap[custId]) {
            customerMap[custId] = {
               _id: custId,
               name: bill.customerId.name,
               phone: bill.customerId.phone,
               totalBills: 0,
               totalPaid: 0,
               totalDue: 0,
               lastPurchase: bill.createdAt,
               bills: []
            }
         }
         const c = customerMap[custId]
         c.totalBills += 1
         c.totalPaid += bill.payment?.amountPaid || 0
         c.totalDue += bill.payment?.remainingAmount || 0
         if (new Date(bill.createdAt) > new Date(c.lastPurchase)) {
            c.lastPurchase = bill.createdAt
         }
         c.bills.push(bill)
      })

      let list = Object.values(customerMap)
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase()
         list = list.filter(c => c.name.toLowerCase().includes(q) || String(c.phone).includes(q))
      }
      return list.sort((a, b) => new Date(b.lastPurchase) - new Date(a.lastPurchase))
   }, [bills, searchQuery])

   // Customer Profile Bills (with filter)
   const currentCustomerBills = useMemo(() => {
      if (!selectedCustomer) return []
      let list = bills.filter(b => b.customerId?.phone === selectedCustomer.phone).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      if (paymentFilter !== 'all') list = list.filter(b => b.payment?.paymentStatus === paymentFilter)
      return list
   }, [bills, selectedCustomer, paymentFilter])

   // --- Dashboard Actions ---
   const openCustomerProfile = (customer) => {
      setSelectedCustomer(customer)
      setPaymentFilter('all')
      setViewMode('profile')
   }

   // --- Lookup/Create Customer Logic ---
   const checkCustomer = async () => {
      if (customerPhone.length < 10) return
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
         if (res.data && res.data.customer) {
            setCustomerFound(true)
            const c = res.data.customer
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

   const handleStartBillWithCustomer = async (e) => {
      e.preventDefault()
      try {
         const custPayload = { phone: customerPhone, ...customerData }
         if (customerFound) {
            await axios.patch(`${VITE_API_BASE_KEY}/customers/register/update`, custPayload, { headers: header })
         } else {
            await axios.post(`${VITE_API_BASE_KEY}/customers/register`, custPayload, { headers: header })
         }
         // Shift to Profile View and Open Cart
         setSelectedCustomer(custPayload)
         setShowLookupModal(false)
         setViewMode('profile')
         openCartModal()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to save customer')
      }
   }

   // --- Cart System Logic ---
   const openCartModal = () => {
      setCartItems([])
      setCurrentItem({ itemName: '', metal: 'gold', purity: '', weight: '', ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: '0' })
      setPaymentDetails({ amountPaid: '', paymentMethod: 'cash' })
      setImages([])
      setShowNewBill(true)
   }

   const calcCurrentItemPrice = () => {
      const w = Number(currentItem.weight || 0)
      const r = Number(currentItem.ratePerGram || 0)
      const base = w * r
      const mc = base * (Number(currentItem.makingChargePercent || 0) / 100)
      const gst = base * (Number(currentItem.gstPercent || 0) / 100)
      return base + mc + gst - Number(currentItem.manualAdjustment || 0)
   }

   const addItemToCart = () => {
      if (!currentItem.itemName || !currentItem.weight || !currentItem.ratePerGram) {
         return setError("Please fill Item Name, Weight, and Rate to add to cart.")
      }
      const itemToSave = {
         ...currentItem,
         weight: Number(currentItem.weight),
         ratePerGram: Number(currentItem.ratePerGram),
         makingChargePercent: Number(currentItem.makingChargePercent || 0),
         gstPercent: Number(currentItem.gstPercent || 0),
         manualAdjustment: Number(currentItem.manualAdjustment || 0),
      }
      setCartItems([...cartItems, itemToSave])
      setCurrentItem({ itemName: '', metal: 'gold', purity: '', weight: '', ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: '0' })
   }

   const removeCartItem = (idx) => {
      setCartItems(cartItems.filter((_, i) => i !== idx))
   }

   const cartGrandTotal = cartItems.reduce((acc, item) => {
      const base = item.weight * item.ratePerGram
      const mc = base * (item.makingChargePercent / 100)
      const gst = base * (item.gstPercent / 100)
      return acc + (base + mc + gst - item.manualAdjustment)
   }, 0)

   const cartBalanceDue = Math.max(0, cartGrandTotal - Number(paymentDetails.amountPaid || 0))

   // --- Image Handling ---
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
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, w, h)
            setImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.6)])
         }
         img.src = event.target.result
      }
      reader.readAsDataURL(file)
   }

   const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx))

   // --- Submit Final Bill ---
   const handleGenerateBill = async () => {
      if (cartItems.length === 0) return setError("Cart is empty! Add at least one item.")
      setLoading(true)
      try {
         const billPayload = {
            items: cartItems,
            amountPaid: Number(paymentDetails.amountPaid || 0),
            paymentMethod: paymentDetails.paymentMethod,
            image: images
         }
         await axios.post(`${VITE_API_BASE_KEY}/customers/bills/create?phone=${selectedCustomer.phone}`, billPayload, { headers: header })
         setSuccess("Bill successfully generated!")
         setShowNewBill(false)
         fetchBills()
      } catch (err) {
         console.log('skjfnkjdsn', err.response.data.message)
         setError(err.response?.data?.message || 'Failed to generate Bill')
      }
      setLoading(false)
   }

   const statusColors = {
      'paid': 'bg-green-500/10 text-green-500 border-green-500/30',
      'partially_paid': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      'unpaid': 'bg-red-500/10 text-red-500 border-red-500/30'
   }

   const canEditBill = (bill) => bill.payment?.paymentStatus !== 'paid'

   const openEditBillPayment = (bill) => {
      setActiveBillDetails(bill)
      setEditPaymentData({ additionalPayment: '', paymentMethod: bill.payment?.paymentMethod || 'cash' })
      setShowEditPayment(true)
   }

   const handleRecordBillPayment = async () => {
      if (!activeBillDetails) return
      setLoading(true)
      try {
         await axios.patch(
            `${VITE_API_BASE_KEY}/customers/bills/pay?bill_id=${activeBillDetails._id}`,
            editPaymentData,
            { headers: header }
         )
         setSuccess('Payment recorded successfully!')
         setShowEditPayment(false)
         fetchBills()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to record payment')
      }
      setLoading(false)
   }

   const remainingAfterBillEdit = activeBillDetails
      ? Math.max(0, (activeBillDetails.payment?.remainingAmount || 0) - (Number(editPaymentData.additionalPayment) || 0))
      : 0

   const formatDateTime = (d) => {
      if (!d) return ''
      return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
   }

   return (
      <>
         <div className={`min-h-screen ${showLookupModal || showNewBill || showViewBill || showEditPayment ? 'blur-[2px] pointer-events-none' : ''}`}>

            {/* --- VIEW 1: DASHBOARD --- */}
            {viewMode === 'dashboard' && (
               <div className='space-y-6'>
                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                     <div>
                        <h1>Customers & Billing</h1>
                        <p className='text-muted-foreground'>Manage your customers and their complete billing history</p>
                     </div>
                     <button onClick={() => { setCustomerPhone(''); setCustomerFound(null); setCustomerData({ name: '', father_name: '', address: '', email: '' }); setShowLookupModal(true); }} className='p-2 px-4 bg-amber-400/80 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-400 font-medium'>
                        <Plus className='h-4 w-4' /> New Customer & Bill
                     </button>
                  </div>

                  {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

                  <div className='relative w-full max-w-md bg-secondary/50 p-2 rounded-[8px] border border-border/50 flex items-center'>
                     <Search className='absolute left-5 text-muted-foreground w-5 h-5' />
                     <input className="w-full bg-transparent border-none pl-10 pr-4 outline-none" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search customers by name or phone...' />
                  </div>

                  {loading ? <div className='text-center py-10 text-muted-foreground'>Loading Customers...</div> : (
                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {uniqueCustomers.map(customer => (
                           <div key={customer._id} onClick={() => openCustomerProfile(customer)} className='bg-card/40 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/50 transition-colors cursor-pointer group flex items-start gap-4'>
                              <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform'>
                                 <User className='w-6 h-6' />
                              </div>
                              <div className='flex-1'>
                                 <h3 className='text-lg font-bold group-hover:text-amber-500 transition-colors'>{customer.name}</h3>
                                 <p className='text-sm text-muted-foreground'>{customer.phone}</p>
                                 <div className='mt-3 flex gap-2 text-xs'>
                                    <span className='bg-secondary px-2 py-1 rounded'>{customer.totalBills} Bills</span>
                                    {customer.totalDue > 0 && <span className='bg-red-400/10 text-red-500 border border-red-500/20 px-2 py-1 rounded'>Due: ₹{customer.totalDue}</span>}
                                 </div>
                              </div>
                           </div>
                        ))}
                        {uniqueCustomers.length === 0 && <div className='col-span-full text-center py-20 text-muted-foreground'>No customers found.</div>}
                     </div>
                  )}
               </div>
            )}

            {/* --- VIEW 2: CUSTOMER PROFILE --- */}
            {viewMode === 'profile' && selectedCustomer && (
               <div className='space-y-6'>
                  <button onClick={() => setViewMode('dashboard')} className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2'>
                     <ArrowLeft className='w-4 h-4' /> Back to Customers
                  </button>

                  {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

                  <div className='bg-secondary/30 border border-border/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                     <div className='flex items-center gap-4'>
                        <div className='h-16 w-16 bg-amber-400/20 text-amber-500 rounded-full flex items-center justify-center text-2xl font-bold'>
                           {selectedCustomer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <h2 className='text-2xl font-bold'>{selectedCustomer.name}</h2>
                           <p className='text-muted-foreground flex items-center gap-2'><Phone className='w-4 h-4' /> {selectedCustomer.phone}</p>
                        </div>
                     </div>
                     <button onClick={openCartModal} className='p-3 px-6 bg-amber-400 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-500 font-bold shadow-lg shadow-amber-400/20'>
                        <Plus className='h-5 w-5' /> Create New Bill
                     </button>
                  </div>

                  {/* Filter Tabs */}
                  <div className='flex flex-wrap gap-2'>
                     {['all', 'paid', 'partially_paid', 'unpaid'].map(f => (
                        <button
                           key={f}
                           onClick={() => setPaymentFilter(f)}
                           className={`px-4 py-2 rounded-[8px] text-sm font-medium border transition-all ${paymentFilter === f ? 'bg-amber-400 text-black border-amber-400' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground'}`}
                        >
                           {f === 'all' ? 'All Bills' : f === 'paid' ? 'Paid' : f === 'partially_paid' ? 'Partially Paid' : 'Unpaid'}
                        </button>
                     ))}
                  </div>

                  <div className='space-y-4'>
                     <h3 className='text-lg font-bold flex items-center gap-2'><History className='w-5 h-5 text-amber-500' /> Purchase History</h3>

                     {loading ? <div className='py-10 text-center'>Loading History...</div> : currentCustomerBills.length === 0 ? (
                        <div className='text-center py-10 bg-secondary/20 rounded-[8px] border border-border/30'>
                           <ShoppingCart className='w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50' />
                           <p className='text-muted-foreground'>No bills found for {selectedCustomer.name} yet.</p>
                        </div>
                     ) : (
                        currentCustomerBills.map(bill => (
                           <div key={bill._id} className='bg-card/60 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/50 transition-colors'>
                              <div className='flex flex-wrap justify-between items-start mb-4 gap-4'>
                                 <div className='space-y-1'>
                                    <p className='text-sm text-muted-foreground flex items-center gap-2'><Calendar className='w-4 h-4' /> {new Date(bill.createdAt).toLocaleDateString()}</p>
                                    {bill.updatedAt && bill.updatedAt !== bill.createdAt && (
                                       <p className='text-xs text-muted-foreground/60'>Updated: {formatDateTime(bill.updatedAt)}</p>
                                    )}
                                    <p className='font-bold flex items-center gap-1 text-lg'>Invoice Total: <IndianRupee className='w-4 h-4' />{bill.invoice?.grandTotal || bill.invoice?.finalPrice}</p>
                                    <p className='text-sm text-muted-foreground'>Items: {bill.invoice?.items ? bill.invoice.items.map(i => i.itemName).join(', ') : bill.invoice?.itemName}</p>
                                 </div>
                                 <div className='text-right space-y-2'>
                                    <span className={`px-3 py-1 text-xs rounded-full border uppercase inline-block ${statusColors[bill.payment?.paymentStatus || 'unpaid']}`}>
                                       {(bill.payment?.paymentStatus || 'unpaid').replace('_', ' ')}
                                    </span>
                                    <div className='text-xs text-muted-foreground'>
                                       <p>Paid: <span className='text-green-500 font-medium'>₹{bill.payment?.amountPaid}</span></p>
                                       {bill.payment?.remainingAmount > 0 && <p>Due: <span className='text-red-500 font-medium'>₹{bill.payment?.remainingAmount}</span></p>}
                                    </div>
                                    <div className='flex gap-3 justify-end flex-wrap mt-2'>
                                       <button onClick={() => { setActiveBillDetails(bill); setShowViewBill(true); }} className='text-amber-500 text-sm hover:underline'>View Invoice</button>
                                       {canEditBill(bill) && (
                                          <button onClick={() => openEditBillPayment(bill)} className='text-blue-400 text-sm hover:underline flex items-center gap-1'>
                                             <Edit className='w-3 h-3' /> Record Payment
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* --- DASHBOARD LOOKUP MODAL --- */}
         {showLookupModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
                  <div className='flex justify-between items-center mb-6'>
                     <h2 className='text-xl font-bold'>Customer Lookup</h2>
                     <button onClick={() => setShowLookupModal(false)} className='hover:bg-secondary p-1 rounded-full'><X /></button>
                  </div>
                  <form onSubmit={handleStartBillWithCustomer} className='space-y-4'>
                     <div className='flex gap-2'>
                        <input type='text' placeholder='10-digit Phone' maxLength={10} required value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value); setCustomerFound(null) }} className='flex-1 p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400' />
                        <button type='button' onClick={checkCustomer} className='bg-secondary px-5 rounded-[8px] hover:bg-secondary/80 font-medium'>Check</button>
                     </div>

                     {customerFound === true && <div className='text-green-500 text-sm flex items-center gap-1'><UserCheck className='w-4 h-4' /> Found! Starting new bill...</div>}
                     {customerFound === false && <div className='text-amber-500 text-sm flex items-center gap-1'><UserX className='w-4 h-4' /> New Customer. Please fill details.</div>}

                     {(customerFound !== null) && (
                        <div className='space-y-3 pt-2'>
                           <input type='text' placeholder='Full Name' required value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className='w-full p-3 rounded-[8px] bg-input border border-border/50' />
                           <input type='text' placeholder="Father's Name" value={customerData.father_name} onChange={(e) => setCustomerData({ ...customerData, father_name: e.target.value })} className='w-full p-3 rounded-[8px] bg-input border border-border/50' />
                           <input type='text' placeholder='Address' required value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} className='w-full p-3 rounded-[8px] bg-input border border-border/50' />
                        </div>
                     )}

                     <button type='submit' disabled={customerFound === null} className='w-full p-3 bg-amber-400 text-black font-bold rounded-[8px] mt-4 disabled:opacity-50 hover:bg-amber-500'>
                        Continue to Billing
                     </button>
                  </form>
               </div>
            </div>
         )}

         {/* --- CART SYSTEM MODAL (NEW BILL) --- */}
         {showNewBill && selectedCustomer && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl border border-border/50 shadow-2xl overflow-hidden'>

                  <div className='flex justify-between items-center p-4 md:p-6 border-b border-border/50 shrink-0 bg-secondary/30'>
                     <div>
                        <h2 className='text-xl font-bold flex items-center gap-2'><ShoppingCart className='w-5 h-5 text-amber-500' /> New Bill for {selectedCustomer.name}</h2>
                        <p className='text-sm text-muted-foreground'>{selectedCustomer.phone}</p>
                     </div>
                     <button onClick={() => setShowNewBill(false)} className='bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2 rounded-full'><X className='w-5 h-5' /></button>
                  </div>

                  <div className='flex-1 overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6'>
                     {/* Left Side: Add Item Form */}
                     <div className='lg:flex-1 space-y-6 '>
                        <div className='bg-secondary/20 p-5 rounded-2xl border border-border/50'>
                           <h3 className='font-bold mb-4 flex items-center gap-2'>1. Add Jewelry to Cart</h3>
                           <div className='grid grid-cols-2 gap-3'>
                              <select
                                 value={currentItem.itemName}
                                 onChange={e => setCurrentItem({ ...currentItem, itemName: e.target.value })}
                                 className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400 outline-none transition-all'
                              >
                                 <option>Item Name</option>
                                 {predefinedItemNames.map((e) => (
                                    <option value={e} key={e} >{e}</option>
                                 ))}
                              </select>

                              <select value={currentItem.metal} onChange={e => setCurrentItem({ ...currentItem, metal: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'>
                                 <option value="gold">Gold</option><option value="silver">Silver</option><option value="diamond">Diamond</option>
                              </select>

                              <select
                                 value={currentItem.purity}
                                 onChange={e => setCurrentItem({ ...currentItem, purity: e.target.value })}
                                 className='p-3 rounded-[8px] bg-input border border-border/50 focus:border-amber-400 outline-none transition-all'
                              >
                                 <option>Carat</option>
                                 {predefinedPurities.map((e) => (
                                    <option value={e} key={e} >{e}</option>
                                 ))}
                              </select>


                              <div className='relative'>
                                 <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>grams</span>
                                 <input type='number' placeholder='Weight' value={currentItem.weight} onChange={e => setCurrentItem({ ...currentItem, weight: e.target.value })} className='w-full p-3 rounded-[8px] bg-input border border-border/50' />
                              </div>
                              <div className='relative'>
                                 <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>₹</span>
                                 <input type='number' placeholder='Rate / g' value={currentItem.ratePerGram} onChange={e => setCurrentItem({ ...currentItem, ratePerGram: e.target.value })} className='w-full pl-8 p-3 rounded-[8px] bg-input border border-border/50' />
                              </div>

                              <div className='relative'>
                                 <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% Making</span>
                                 <input type='number' placeholder='Making' value={currentItem.makingChargePercent} onChange={e => setCurrentItem({ ...currentItem, makingChargePercent: e.target.value })} className='w-full p-3 rounded-[8px] bg-input border border-border/50' />
                              </div>
                              <div className='relative'>
                                 <span className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>% GST</span>
                                 <input type='number' placeholder='GST' value={currentItem.gstPercent} onChange={e => setCurrentItem({ ...currentItem, gstPercent: e.target.value })} className='w-full p-3 rounded-[8px] bg-input border border-border/50' />
                              </div>
                              <div className='col-span-2 relative'>
                                 <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs'>₹ Discount</span>
                                 <input type='number' placeholder='Discount / Adjust' value={currentItem.manualAdjustment} onChange={e => setCurrentItem({ ...currentItem, manualAdjustment: e.target.value })} className='w-full pl-20 p-3 rounded-[8px] bg-input border border-border/50' />
                              </div>
                           </div>

                           <div className='mt-4 flex items-center justify-between p-3 bg-card border border-border/50 rounded-[8px]'>
                              <span className='text-sm text-muted-foreground'>Item Final Price:</span>
                              <span className='font-bold text-lg text-amber-500'>₹{calcCurrentItemPrice().toFixed(2)}</span>
                           </div>

                           <button onClick={addItemToCart} className='w-full mt-4 p-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-[8px] border border-border flex items-center justify-center gap-2'>
                              <Plus className='w-4 h-4' /> Add to Cart
                           </button>
                        </div>

                        {/* Image Upload Area */}
                        <div className='bg-secondary/20 p-4 rounded-2xl border border-border/50'>
                           <label className='text-sm font-bold flex items-center gap-2 mb-3'><ImageIcon className='w-4 h-4 text-amber-500' /> 2. Add Photos (Optional)</label>
                           <div className='flex gap-4 overflow-x-auto pb-2'>
                              {images.map((img, idx) => (
                                 <div key={idx} className='relative flex-shrink-0 w-20 h-20 rounded-[8px] border border-border/50 overflow-hidden group'>
                                    <img src={img} alt='uploaded' className='w-full h-full object-cover' />
                                    <button onClick={() => removeImage(idx)} className='absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'><X className='w-3 h-3' /></button>
                                 </div>
                              ))}
                              <label className='flex-shrink-0 w-20 h-20 rounded-[8px] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-400 cursor-pointer transition-colors'>
                                 <Camera className='w-6 h-6 mb-1' />
                                 <span className='text-[10px]'>Capture</span>
                                 <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                              </label>
                           </div>
                        </div>
                     </div>

                     {/* Right Side: Cart Summary & Checkout */}
                     <div className='lg:flex-1 flex flex-col bg-card border border-border/50 rounded-2xl shadow-inner lg:overflow-hidden'>
                        <div className='bg-secondary/50 p-4 font-bold border-b border-border/50 flex items-center gap-2'>
                           <FileText className='w-4 h-4' /> 3. Cart Summary
                        </div>

                        <div className='flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px]'>
                           {cartItems.length === 0 ? (
                              <div className='h-full flex flex-col items-center justify-center text-muted-foreground opacity-50'>
                                 <ShoppingCart className='w-12 h-12 mb-2' />
                                 <p>Cart is currently empty</p>
                              </div>
                           ) : (
                              cartItems.map((item, idx) => (
                                 <div key={idx} className='p-3 bg-secondary/20 rounded-[8px] border border-border/50 flex justify-between items-center relative pr-10'>
                                    <div>
                                       <p className='font-bold text-sm'>{item.itemName} <span className='text-xs text-muted-foreground uppercase'>({item.metal})</span></p>
                                       <p className='text-xs text-muted-foreground'>{item.weight}g @ ₹{item.ratePerGram}/g</p>
                                    </div>
                                    <div className='font-bold text-amber-500'>₹{item.finalPrice?.toFixed(2) || '0.00'}</div>
                                    <button onClick={() => removeCartItem(idx)} className='absolute right-3 text-red-500/50 hover:text-red-500 transition-colors'><Trash2 className='w-4 h-4' /></button>
                                 </div>
                              ))
                           )}
                        </div>


                        <div className='border-t border-border/50 bg-secondary/10 p-5 space-y-4'>
                           {error && <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>{error}</div>}
                           <div className='flex justify-between items-center font-bold text-xl'>
                              <span>Grand Total:</span>
                              <span className='text-foreground'>₹{cartGrandTotal.toFixed(2)}</span>
                           </div>

                           <div className='grid grid-cols-2 gap-3 pt-2 border-t border-border/30'>
                              <div className='col-span-2 relative'>
                                 <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>Paid Now ₹</span>
                                 <input type='number' value={paymentDetails.amountPaid} onChange={e => setPaymentDetails({ ...paymentDetails, amountPaid: e.target.value })} className='w-full pl-24 p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-500 font-bold focus:border-green-500 outline-none placeholder:text-green-500/50' placeholder='0.00' />
                              </div>
                              <select value={paymentDetails.paymentMethod} onChange={e => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })} className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none'>
                                 <option value="cash">Cash</option><option value="upi">UPI / Wallet</option><option value="card">Card</option><option value="bank_transfer">Bank Transfer</option>
                              </select>
                           </div>

                           {cartBalanceDue > 0 && (
                              <div className='flex justify-between items-center text-sm font-bold text-red-500 pt-2'>
                                 <span>Remaining Due:</span>
                                 <span>₹{cartBalanceDue.toFixed(2)}</span>
                              </div>
                           )}

                           <button onClick={handleGenerateBill} disabled={loading || cartItems.length === 0} className='w-full p-4 bg-amber-400 text-black font-bold text-lg rounded-[8px] hover:bg-amber-500 disabled:opacity-50 mt-2 flex justify-center items-center'>
                              {loading ? 'Processing...' : 'Generate Combined Bill'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- VIEW BILL MODAL (INVOICE VIEWER) --- */}
         {showViewBill && activeBillDetails && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl relative'>
                  <button onClick={() => setShowViewBill(false)} className='absolute top-6 right-6 bg-secondary/50 hover:bg-secondary p-2 rounded-full'><X className='w-5 h-5' /></button>

                  <div className='text-center border-b border-border/50 pb-6 mb-6'>
                     <h2 className='text-2xl font-bold uppercase tracking-widest text-amber-500'>Invoice</h2>
                     <p className='text-sm text-muted-foreground mt-1'>Date: {new Date(activeBillDetails.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className='mb-6'>
                     <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1'>Billed To:</p>
                     <p className='text-lg font-bold'>{activeBillDetails.customerId?.name}</p>
                     <p className='text-sm text-muted-foreground'>{activeBillDetails.customerId?.phone}</p>
                  </div>

                  <div className='bg-secondary/20 rounded-[8px] border border-border/50 overflow-hidden mb-6'>
                     <div className='bg-secondary/40 p-3 grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                        <div className='col-span-6'>Item / Details</div>
                        <div className='col-span-3 text-right'>Qty/Wt</div>
                        <div className='col-span-3 text-right'>Total</div>
                     </div>
                     <div className='divide-y divide-border/50'>


                        <div className='p-3 grid grid-cols-12 text-sm items-center'>
                           <div className='col-span-6'>
                              <p className='font-bold'>{activeBillDetails.invoice?.itemName}</p>
                              <p className='text-xs text-muted-foreground'>{[activeBillDetails.invoice?.purity, activeBillDetails.invoice?.metal].filter(Boolean).join(' ')}</p>
                           </div>
                           <div className='col-span-3 text-right text-muted-foreground'>{activeBillDetails.invoice?.weight}g</div>
                           <div className='col-span-3 text-right font-bold'>₹{activeBillDetails.invoice?.finalPrice?.toFixed(2)}</div>
                        </div>

                     </div>
                  </div>

                  <div className='flex flex-col items-end space-y-2 mb-8'>
                     <div className='flex justify-between w-64 text-sm'>
                        <span className='text-muted-foreground'>Grand Total:</span>
                        <span className='font-bold text-lg'>₹{(activeBillDetails.invoice?.grandTotal || activeBillDetails.invoice?.finalPrice)?.toFixed(2)}</span>
                     </div>
                     <div className='flex justify-between w-64 text-sm pb-2 border-b border-border/30'>
                        <span className='text-muted-foreground'>Amount Paid:</span>
                        <span className='font-bold text-green-500'>₹{activeBillDetails.payment?.amountPaid?.toFixed(2)}</span>
                     </div>
                     <div className='flex justify-between w-64 text-sm font-bold'>
                        <span className='text-muted-foreground'>Balance Due:</span>
                        <span className='text-red-500'>₹{activeBillDetails.payment?.remainingAmount?.toFixed(2)}</span>
                     </div>
                  </div>

                  {activeBillDetails.image && activeBillDetails.image.length > 0 && (
                     <div className='pt-6 border-t border-border/50'>
                        <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3'>Attached Photos</p>
                        <div className='flex gap-3 overflow-x-auto'>
                           {activeBillDetails.image.map((img, idx) => (
                              <img key={idx} src={img} alt='Attachment' onClick={() => setEnlargedImage(img)} className='w-20 h-20 rounded-[8px] object-cover border border-border/50 cursor-pointer hover:opacity-80 transition-opacity' />
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* --- EDIT PAYMENT MODAL --- */}
         {showEditPayment && activeBillDetails && (
            <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
                  <div className='flex justify-between items-center mb-5'>
                     <h2 className='text-xl font-bold'>Record Payment</h2>
                     <button onClick={() => setShowEditPayment(false)} className='hover:bg-secondary p-1 rounded-full'><X /></button>
                  </div>

                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>{error}</div>}

                  {/* Current State */}
                  <div className='bg-secondary/30 rounded-[8px] p-4 mb-5 space-y-1'>
                     <p className='text-sm font-bold'>{activeBillDetails.customerId?.name}</p>
                     <p className='text-xs text-muted-foreground'>Items: {activeBillDetails.invoice?.items?.map(i => i.itemName).join(', ') || activeBillDetails.invoice?.itemName}</p>
                     <div className='flex justify-between text-sm mt-2'>
                        <span className='text-muted-foreground'>Invoice Total:</span>
                        <span className='font-bold'>₹{(activeBillDetails.invoice?.grandTotal || activeBillDetails.invoice?.finalPrice)?.toFixed(0)}</span>
                     </div>
                     <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Already Paid:</span>
                        <span className='text-green-500 font-bold'>₹{activeBillDetails.payment?.amountPaid?.toFixed(0)}</span>
                     </div>
                     <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Currently Due:</span>
                        <span className='text-red-500 font-bold'>₹{activeBillDetails.payment?.remainingAmount?.toFixed(0)}</span>
                     </div>
                  </div>

                  <div className='space-y-4'>
                     {/* Additional Payment */}
                     <div>
                        <label className='text-sm font-medium text-muted-foreground mb-1 block'>Additional Payment Now (₹)</label>
                        <input
                           type='number'
                           placeholder='Enter amount customer is paying now...'
                           value={editPaymentData.additionalPayment}
                           onChange={e => setEditPaymentData({ ...editPaymentData, additionalPayment: e.target.value })}
                           className='w-full p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 text-green-400 font-bold outline-none focus:border-green-500'
                        />
                     </div>

                     {/* New Remaining Preview */}
                     {editPaymentData.additionalPayment && (
                        <div className={`p-3 rounded-[8px] border text-sm font-bold flex justify-between ${remainingAfterBillEdit === 0 ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                           <span>Remaining After Payment:</span>
                           <span>₹{remainingAfterBillEdit.toFixed(0)}</span>
                        </div>
                     )}

                     {/* Payment Method */}
                     <div>
                        <label className='text-sm font-medium text-muted-foreground mb-1 block'>Payment Method</label>
                        <select
                           value={editPaymentData.paymentMethod}
                           onChange={e => setEditPaymentData({ ...editPaymentData, paymentMethod: e.target.value })}
                           className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                        >
                           <option value='cash'>Cash</option>
                           <option value='upi'>UPI / Wallet</option>
                           <option value='card'>Card</option>
                           <option value='bank_transfer'>Bank Transfer</option>
                        </select>
                     </div>

                     <button
                        onClick={handleRecordBillPayment}
                        disabled={loading || !editPaymentData.additionalPayment}
                        className='w-full p-3 bg-amber-400 text-black font-bold rounded-[8px] hover:bg-amber-500 disabled:opacity-50'
                     >
                        {loading ? 'Saving...' : 'Save Payment'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- ENLARGED IMAGE VIEWER MODAL --- */}
         {enlargedImage && (
            <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-md p-4' onClick={() => setEnlargedImage(null)}>
               <button className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full text-white transition-colors'><X className='w-6 h-6' /></button>
               <img src={enlargedImage} alt="Enlarged" className='max-w-full max-h-[90vh] object-contain rounded-[8px] shadow-2xl' onClick={(e) => e.stopPropagation()} />
            </div>
         )}
         {/* Datalists for custom settings */}
         <select id="predefined-items">
            {predefinedItemNames.map((name, idx) => <option key={idx} value={name} />)}
         </select>
         <select id="predefined-purities">
            {predefinedPurities.map((purity, idx) => <option key={idx} value={purity} />)}
         </select>
      </>
   )
}

export { Bills }
