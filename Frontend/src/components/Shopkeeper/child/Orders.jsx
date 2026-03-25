import React, { useState, useEffect, useMemo } from 'react'
import {
   Search, Plus, X, Phone, IndianRupee, UserCheck, UserX,
   ShoppingCart, User, Calendar, ArrowLeft, Trash2, Camera,
   Image as ImageIcon, History, Package, CheckCircle2, Clock,
   Wrench, AlertCircle, Edit, Filter, ChevronDown
} from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

// ─── Status Config ──────────────────────────────────────────────────────────
const paymentStatusColors = {
   paid: 'bg-green-500/10 text-green-500 border-green-500/30',
   partially_paid: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
   unpaid: 'bg-red-500/10 text-red-500 border-red-500/30',
}

const orderStatusConfig = {
   request: { label: 'Requested', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', Icon: Clock },
   accept: { label: 'Accepted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', Icon: CheckCircle2 },
   progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', Icon: Wrench },
   complete: { label: 'Complete', color: 'bg-green-500/10 text-green-400 border-green-500/30', Icon: CheckCircle2 },
}

const METAL_OPTIONS = ['gold', 'silver', 'diamond', 'platinum', 'other']

const Orders = () => {
   const header = getAuthHeaders()

   // ─── App State ────────────────────────────────────────────────────────────
   const [orders, setOrders] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [success, setSuccess] = useState('')

   // ─── Predefined Settings ──────────────────────────────────────────────────
   const [predefinedItemNames, setPredefinedItemNames] = useState([])
   const [predefinedPurities, setPredefinedPurities] = useState([])

   // ─── Navigation ───────────────────────────────────────────────────────────
   const [viewMode, setViewMode] = useState('dashboard') // 'dashboard' | 'profile'
   const [selectedCustomer, setSelectedCustomer] = useState(null)

   // ─── Dashboard ────────────────────────────────────────────────────────────
   const [searchQuery, setSearchQuery] = useState('')

   // ─── Profile Filter ───────────────────────────────────────────────────────
   const [paymentFilter, setPaymentFilter] = useState('all') // 'all' | 'paid' | 'partially_paid' | 'unpaid'

   // ─── Modals ───────────────────────────────────────────────────────────────
   const [showLookupModal, setShowLookupModal] = useState(false)
   const [showNewOrder, setShowNewOrder] = useState(false)
   const [showViewOrder, setShowViewOrder] = useState(false)
   const [showEditPayment, setShowEditPayment] = useState(false)
   const [activeOrderDetails, setActiveOrderDetails] = useState(null)

   // ─── Customer Lookup ──────────────────────────────────────────────────────
   const [customerPhone, setCustomerPhone] = useState('')
   const [customerFound, setCustomerFound] = useState(null)
   const [customerData, setCustomerData] = useState({ name: '', phone: '' })

   // ─── Cart System ──────────────────────────────────────────────────────────
   const [cartItems, setCartItems] = useState([])
   const [currentItem, setCurrentItem] = useState({ itemName: '', metal: 'gold', purity: '', weight: '', size: '', description: '' })
   const [orderDetails, setOrderDetails] = useState({ Total: '', AdvancePayment: '', notes: '', deliveryDate: '', orderStatus: 'request' })
   const [images, setImages] = useState([])
   const [enlargedImage, setEnlargedImage] = useState(null)

   // ─── Edit Payment ─────────────────────────────────────────────────────────
   const [editPaymentData, setEditPaymentData] = useState({ additionalPayment: '', orderStatus: '', notes: '' })

   // ─── API ──────────────────────────────────────────────────────────────────
   const fetchOrders = async () => {
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/customers/orders/me`, { headers: header })
         if (res.data?.data) setOrders(res.data.data)
      } catch (err) {
         console.error(err)
         setError('Failed to fetch orders')
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
      fetchOrders(); 
      fetchProfileSettings();
   }, [])

   useEffect(() => {
      if (success || error) {
         const t = setTimeout(() => { setSuccess(''); setError('') }, 5000)
         return () => clearTimeout(t)
      }
   }, [success, error])

   // ─── Derived: Unique Customers (Dashboard) ────────────────────────────────
   const uniqueCustomers = useMemo(() => {
      const map = {}
      orders.forEach(order => {
         if (!order.customerId?._id) return
         const id = order.customerId._id
         if (!map[id]) {
            map[id] = {
               _id: id,
               name: order.customerId.name,
               phone: order.customerId.phone,
               totalOrders: 0,
               totalDue: 0,
               lastUpdated: order.updatedAt,
               orders: []
            }
         }
         map[id].totalOrders += 1
         map[id].totalDue += order.RemainingAmount || 0
         if (new Date(order.updatedAt) > new Date(map[id].lastUpdated)) {
            map[id].lastUpdated = order.updatedAt
         }
         map[id].orders.push(order)
      })

      let list = Object.values(map)
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase()
         list = list.filter(c => c.name.toLowerCase().includes(q) || String(c.phone).includes(q))
      }
      return list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
   }, [orders, searchQuery])

   // ─── Derived: Customer Profile Orders ─────────────────────────────────────
   const currentCustomerOrders = useMemo(() => {
      if (!selectedCustomer) return []
      let list = orders
         .filter(o => o.customerId?.phone === selectedCustomer.phone)
         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      if (paymentFilter !== 'all') list = list.filter(o => o.paymentStatus === paymentFilter)
      return list
   }, [orders, selectedCustomer, paymentFilter])

   // ─── Dashboard Actions ────────────────────────────────────────────────────
   const openCustomerProfile = (customer) => {
      setSelectedCustomer(customer)
      setPaymentFilter('all')
      setViewMode('profile')
   }

   // ─── Lookup Logic (Orders require existing customer only) ─────────────────
   const checkCustomer = async () => {
      if (customerPhone.length < 10) return setError('Please enter a valid 10-digit phone number')
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
         if (res.data?.customer) {
            setCustomerFound(true)
            setCustomerData({ name: res.data.customer.name, phone: customerPhone })
         } else {
            setCustomerFound(false)
         }
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to check customer')
         setCustomerFound(false)
      }
      setLoading(false)
   }

   const handleProceedToOrder = () => {
      if (!customerFound) return
      setSelectedCustomer(customerData)
      setShowLookupModal(false)
      openNewOrderModal()
   }

   // ─── Cart Logic ───────────────────────────────────────────────────────────
   const openNewOrderModal = () => {
      setCartItems([])
      setCurrentItem({ itemName: '', metal: 'gold', purity: '', weight: '', size: '', description: '' })
      setOrderDetails({ Total: '', AdvancePayment: '', notes: '', deliveryDate: '', orderStatus: 'request' })
      setImages([])
      setShowNewOrder(true)
   }

   const addItemToCart = () => {
      if (!currentItem.itemName) return setError('Please enter an item name')
      setCartItems([...cartItems, { ...currentItem }])
      setCurrentItem({ itemName: '', metal: 'gold', purity: '', weight: '', size: '', description: '' })
   }

   const removeCartItem = (idx) => setCartItems(cartItems.filter((_, i) => i !== idx))

   // ─── Image Upload ─────────────────────────────────────────────────────────
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

   // ─── Submit Order ─────────────────────────────────────────────────────────
   const handleCreateOrder = async () => {
      if (cartItems.length === 0) return setError('Cart is empty! Add at least one jewelry item.')
      if (images.length === 0) return setError('Please upload at least one reference image of the jewelry.')
      if (!orderDetails.Total) return setError('Please enter the total estimated price.')
      setLoading(true)
      try {
         const advance = Number(orderDetails.AdvancePayment) || 0
         const total = Number(orderDetails.Total)
         if (advance > total) {
            setLoading(false)
            return setError('Advance payment cannot exceed total amount.')
         }
         await axios.post(
            `${VITE_API_BASE_KEY}/customers/orders/create?phone=${selectedCustomer.phone}`,
            {
               items: cartItems,
               image: images,
               Total: total,
               AdvancePayment: advance,
               orderStatus: orderDetails.orderStatus,
               notes: orderDetails.notes,
               deliveryDate: orderDetails.deliveryDate || undefined
            },
            { headers: header }
         )
         setSuccess('Order created successfully!')
         setShowNewOrder(false)
         fetchOrders()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to create order')
      }
      setLoading(false)
   }

   // ─── Record Payment ───────────────────────────────────────────────────────
   const openEditPayment = (order) => {
      setActiveOrderDetails(order)
      setEditPaymentData({
         additionalPayment: '',
         orderStatus: order.orderStatus,
         notes: order.notes || ''
      })
      setShowEditPayment(true)
   }

   const handleRecordPayment = async () => {
      if (!activeOrderDetails) return
      setLoading(true)
      try {
         await axios.patch(
            `${VITE_API_BASE_KEY}/customers/orders/pay?order_id=${activeOrderDetails._id}`,
            editPaymentData,
            { headers: header }
         )
         setSuccess('Payment recorded successfully!')
         setShowEditPayment(false)
         fetchOrders()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to record payment')
      }
      setLoading(false)
   }

   const remainingAfterEdit = activeOrderDetails
      ? Math.max(0, activeOrderDetails.RemainingAmount - (Number(editPaymentData.additionalPayment) || 0))
      : 0

   // ─── Helpers ──────────────────────────────────────────────────────────────
   const formatDate = (dateStr) => {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
   }

   const formatDateTime = (dateStr) => {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
   }

   const canEdit = (order) => order.paymentStatus !== 'paid'
   const hasBlur = showLookupModal || showNewOrder || showViewOrder || showEditPayment


   return (
      <>

         <div className={`min-h-screen ${hasBlur ? 'blur-[2px] pointer-events-none' : ''}`}>


            {viewMode === 'dashboard' && (
               <div className='space-y-6'>
                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                     <div>
                        <h1>Custom Orders</h1>
                        <p className='text-muted-foreground'>Manage customer jewelry orders & track progress</p>
                     </div>
                     <button
                        onClick={() => { setCustomerPhone(''); setCustomerFound(null); setShowLookupModal(true) }}
                        className='p-2 px-4 bg-amber-400/80 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-400 font-medium'
                     >
                        <Plus className='h-4 w-4' /> New Order
                     </button>
                  </div>

                  {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

                  <div className='relative w-full max-w-md bg-secondary/50 p-2 rounded-[8px] border border-border/50 flex items-center'>
                     <Search className='absolute left-5 text-muted-foreground w-5 h-5' />
                     <input className='w-full bg-transparent border-none pl-10 pr-4 outline-none' type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search customers by name or phone...' />
                  </div>

                  {loading ? (
                     <div className='text-center py-10 text-muted-foreground'>Loading Orders...</div>
                  ) : (
                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {uniqueCustomers.map(customer => (
                           <div key={customer._id} onClick={() => openCustomerProfile(customer)} className='bg-card/40 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/50 transition-colors cursor-pointer group flex items-start gap-4'>
                              <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform'>
                                 <User className='w-6 h-6' />
                              </div>
                              <div className='flex-1 min-w-0'>
                                 <h3 className='text-lg font-bold group-hover:text-amber-500 transition-colors truncate'>{customer.name}</h3>
                                 <p className='text-sm text-muted-foreground'>{customer.phone}</p>
                                 <div className='mt-3 flex flex-wrap gap-2 text-xs'>
                                    <span className='bg-secondary px-2 py-1 rounded'>{customer.totalOrders} Orders</span>
                                    {customer.totalDue > 0 && <span className='bg-red-400/10 text-red-500 border border-red-500/20 px-2 py-1 rounded'>Due: ₹{customer.totalDue.toFixed(0)}</span>}
                                 </div>
                                 <p className='text-xs text-muted-foreground mt-2'>Last updated: {formatDate(customer.lastUpdated)}</p>
                              </div>
                           </div>
                        ))}
                        {uniqueCustomers.length === 0 && (
                           <div className='col-span-full text-center py-20 text-muted-foreground'>
                              <Package className='w-12 h-12 mx-auto mb-3 opacity-30' />
                              <p>No orders found. Create a new order to get started.</p>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            )}

            {/* ── PROFILE VIEW ───────────────────────────────────────────── */}
            {viewMode === 'profile' && selectedCustomer && (
               <div className='space-y-6'>
                  <button onClick={() => setViewMode('dashboard')} className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
                     <ArrowLeft className='w-4 h-4' /> Back to Orders
                  </button>

                  {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

                  {/* Customer Header */}
                  <div className='bg-secondary/30 border border-border/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                     <div className='flex items-center gap-4'>
                        <div className='h-16 w-16 bg-amber-400/20 text-amber-500 rounded-full flex items-center justify-center text-2xl font-bold'>
                           {selectedCustomer.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                           <h2 className='text-2xl font-bold'>{selectedCustomer.name}</h2>
                           <p className='text-muted-foreground flex items-center gap-2'><Phone className='w-4 h-4' /> {selectedCustomer.phone}</p>
                        </div>
                     </div>
                     <button
                        onClick={() => { setSelectedCustomer(selectedCustomer); openNewOrderModal() }}
                        className='p-3 px-6 bg-amber-400 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-500 font-bold shadow-lg shadow-amber-400/20'
                     >
                        <Plus className='h-5 w-5' /> New Order
                     </button>
                  </div>

                  {/* Payment Filter Tabs */}
                  <div className='flex flex-wrap gap-2'>
                     {['all', 'paid', 'partially_paid', 'unpaid'].map(f => (
                        <button
                           key={f}
                           onClick={() => setPaymentFilter(f)}
                           className={`px-4 py-2 rounded-[8px] text-sm font-medium border transition-all ${paymentFilter === f ? 'bg-amber-400 text-black border-amber-400' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:text-foreground'}`}
                        >
                           {f === 'all' ? 'All Orders' : f === 'paid' ? 'Paid' : f === 'partially_paid' ? 'Partially Paid' : 'Unpaid'}
                        </button>
                     ))}
                  </div>

                  {/* Orders List */}
                  <div className='space-y-4'>
                     <h3 className='text-lg font-bold flex items-center gap-2'><History className='w-5 h-5 text-amber-500' /> Order History</h3>

                     {loading ? <div className='py-10 text-center'>Loading...</div> : currentCustomerOrders.length === 0 ? (
                        <div className='text-center py-10 bg-secondary/20 rounded-[8px] border border-border/30'>
                           <Package className='w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50' />
                           <p className='text-muted-foreground'>No orders found for this filter.</p>
                        </div>
                     ) : (
                        currentCustomerOrders.map(order => {
                           const osCfg = orderStatusConfig[order.orderStatus] || orderStatusConfig.request
                           const OsIcon = osCfg.Icon
                           return (
                              <div key={order._id} className='bg-card/60 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/30 transition-colors'>
                                 <div className='flex flex-wrap justify-between items-start gap-4 mb-4'>
                                    {/* Left: info */}
                                    <div className='space-y-1 flex-1 min-w-0'>
                                       <div className='flex flex-wrap gap-2 items-center'>
                                          <span className={`px-3 py-1 text-xs rounded-full border uppercase inline-flex items-center gap-1 ${osCfg.color}`}>
                                             <OsIcon className='w-3 h-3' /> {osCfg.label}
                                          </span>
                                          <span className={`px-3 py-1 text-xs rounded-full border uppercase inline-block ${paymentStatusColors[order.paymentStatus || 'unpaid']}`}>
                                             {(order.paymentStatus || 'unpaid').replace('_', ' ')}
                                          </span>
                                       </div>
                                       <p className='text-sm text-muted-foreground flex items-center gap-2 mt-2'>
                                          <Calendar className='w-4 h-4 shrink-0' />
                                          Created: {formatDate(order.createdAt)}
                                          {order.updatedAt !== order.createdAt && (
                                             <span className='text-xs text-muted-foreground/70'>· Updated: {formatDateTime(order.updatedAt)}</span>
                                          )}
                                       </p>
                                       <p className='text-sm font-medium mt-1'>
                                          Items: {order.items?.map(i => i.itemName).join(', ')}
                                       </p>
                                       {order.deliveryDate && (
                                          <p className='text-xs text-amber-500 flex items-center gap-1'>
                                             <Clock className='w-3 h-3' /> Delivery: {formatDate(order.deliveryDate)}
                                          </p>
                                       )}
                                       {order.notes && <p className='text-xs text-muted-foreground italic'>"{order.notes}"</p>}
                                    </div>

                                    {/* Right: payment */}
                                    <div className='text-right space-y-1 shrink-0'>
                                       <p className='font-bold text-lg flex items-center justify-end gap-1'>
                                          <IndianRupee className='w-4 h-4' />{order.Total?.toFixed(0)}
                                          <span className='text-xs text-muted-foreground font-normal'>total</span>
                                       </p>
                                       <p className='text-sm text-green-500'>Advance: ₹{order.AdvancePayment?.toFixed(0)}</p>
                                       {order.RemainingAmount > 0 && <p className='text-sm text-red-500'>Due: ₹{order.RemainingAmount?.toFixed(0)}</p>}
                                    </div>
                                 </div>

                                 {/* Images Preview */}
                                 {order.image?.length > 0 && (
                                    <div className='flex gap-2 overflow-x-auto pb-1 mb-4'>
                                       {order.image.map((img, idx) => (
                                          <img key={idx} src={img} alt='Order ref' onClick={() => setEnlargedImage(img)} className='w-16 h-16 rounded-[6px] object-cover border border-border/50 cursor-pointer hover:opacity-80 shrink-0' />
                                       ))}
                                    </div>
                                 )}

                                 {/* Actions */}
                                 <div className='flex items-center gap-3 pt-3 border-t border-border/30'>
                                    <button
                                       onClick={() => { setActiveOrderDetails(order); setShowViewOrder(true) }}
                                       className='text-amber-500 text-sm hover:underline'
                                    >
                                       View Details
                                    </button>
                                    {canEdit(order) && (
                                       <button
                                          onClick={() => openEditPayment(order)}
                                          className='flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 hover:underline'
                                       >
                                          <Edit className='w-3 h-3' /> Record Payment / Update
                                       </button>
                                    )}
                                 </div>
                              </div>
                           )
                        })
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* ─── LOOKUP MODAL ─────────────────────────────────────────────── */}
         {showLookupModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
                  <div className='flex justify-between items-center mb-6'>
                     <h2 className='text-xl font-bold'>Find Customer</h2>
                     <button onClick={() => setShowLookupModal(false)} className='hover:bg-secondary p-1 rounded-full'><X /></button>
                  </div>

                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>{error}</div>}

                  <div className='space-y-4'>
                     <div className='flex gap-2'>
                        <input
                           type='text' placeholder='10-digit Phone Number' maxLength={10}
                           value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value); setCustomerFound(null) }}
                           className='flex-1 p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400'
                        />
                        <button type='button' onClick={checkCustomer} className='bg-secondary px-5 rounded-[8px] hover:bg-secondary/80 font-medium'>Search</button>
                     </div>

                     {customerFound === true && (
                        <div className='p-4 bg-green-500/10 border border-green-500/30 rounded-[8px]'>
                           <p className='text-green-500 flex items-center gap-2 font-bold'><UserCheck className='w-5 h-5' /> Customer Found!</p>
                           <p className='text-sm text-muted-foreground mt-1'>{customerData.name} · {customerPhone}</p>
                        </div>
                     )}
                     {customerFound === false && (
                        <div className='p-4 bg-red-500/10 border border-red-500/30 rounded-[8px]'>
                           <p className='text-red-500 flex items-center gap-2'><UserX className='w-5 h-5' /> Customer not found.</p>
                           <p className='text-xs text-muted-foreground mt-1'>Please register this customer in Bills section first before creating an order.</p>
                        </div>
                     )}

                     <button
                        onClick={handleProceedToOrder}
                        disabled={!customerFound || loading}
                        className='w-full p-3 bg-amber-400 text-black font-bold rounded-[8px] disabled:opacity-40 hover:bg-amber-500'
                     >
                        Proceed to Create Order
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* ─── NEW ORDER MODAL (CART) ────────────────────────────────────── */}
         {showNewOrder && selectedCustomer && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl border border-border/50 shadow-2xl overflow-hidden'>

                  {/* Header */}
                  <div className='flex justify-between items-center p-4 md:p-6 border-b border-border/50 shrink-0 bg-secondary/30'>
                     <div>
                        <h2 className='text-xl font-bold flex items-center gap-2'><Package className='w-5 h-5 text-amber-500' /> New Order — {selectedCustomer.name}</h2>
                        <p className='text-sm text-muted-foreground'>{selectedCustomer.phone}</p>
                     </div>
                     <button onClick={() => setShowNewOrder(false)} className='bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2 rounded-full'><X className='w-5 h-5' /></button>
                  </div>

                  <div className='flex-1 overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6'>

                     {/* ── LEFT: Add Items + Images + Order Info ─────────── */}
                     <div className='lg:flex-1 space-y-5'>

                        {/* 1. Add Items */}
                        <div className='bg-secondary/20 p-5 rounded-2xl border border-border/50'>
                           <h3 className='font-bold mb-4'>1. Add Jewelry Items</h3>
                           <div className='grid grid-cols-2 gap-3'>
                              <input type='text' list='predefined-items' placeholder='Item Name (e.g. Ring, Necklace)' value={currentItem.itemName} onChange={e => setCurrentItem({ ...currentItem, itemName: e.target.value })} className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                              <select value={currentItem.metal} onChange={e => setCurrentItem({ ...currentItem, metal: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'>
                                 {METAL_OPTIONS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                              </select>
                              <input type='text' list='predefined-purities' placeholder='Purity (e.g. 22K, 92.5)' value={currentItem.purity} onChange={e => setCurrentItem({ ...currentItem, purity: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                              <input type='text' placeholder='Weight (grams)' value={currentItem.weight} onChange={e => setCurrentItem({ ...currentItem, weight: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                              <input type='text' placeholder='Size (e.g. 7, M, 52mm)' value={currentItem.size} onChange={e => setCurrentItem({ ...currentItem, size: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                              <input type='text' placeholder='Description / Special instructions' value={currentItem.description} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                           </div>
                           <button onClick={addItemToCart} className='w-full mt-4 p-3 bg-secondary hover:bg-secondary/80 font-bold rounded-[8px] border border-border flex items-center justify-center gap-2'>
                              <Plus className='w-4 h-4' /> Add to Cart
                           </button>
                        </div>

                        {/* 2. MANDATORY Image Upload */}
                        <div className='bg-secondary/20 p-4 rounded-2xl border border-amber-500/20'>
                           <label className='text-sm font-bold flex items-center gap-2 mb-1'>
                              <ImageIcon className='w-4 h-4 text-amber-500' /> 2. Reference Photos <span className='text-red-500 ml-1'>* Required</span>
                           </label>
                           <p className='text-xs text-muted-foreground mb-3'>Upload photos of the jewelry the customer wants made.</p>
                           <div className='flex gap-3 flex-wrap'>
                              {images.map((img, idx) => (
                                 <div key={idx} className='relative w-20 h-20 rounded-[8px] border border-border/50 overflow-hidden group shrink-0'>
                                    <img src={img} alt='ref' className='w-full h-full object-cover' />
                                    <button onClick={() => removeImage(idx)} className='absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'><X className='w-3 h-3' /></button>
                                 </div>
                              ))}
                              <label className='w-20 h-20 rounded-[8px] border-2 border-dashed border-amber-500/40 flex flex-col items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-400 cursor-pointer transition-colors shrink-0'>
                                 <Camera className='w-6 h-6 mb-1' />
                                 <span className='text-[10px]'>Add Photo</span>
                                 <input type='file' accept='image/*' capture='environment' className='hidden' onChange={handleImageUpload} />
                              </label>
                           </div>
                        </div>

                        {/* 3. Order Details */}
                        <div className='bg-secondary/20 p-5 rounded-2xl border border-border/50'>
                           <h3 className='font-bold mb-4'>3. Order Details</h3>
                           <div className='grid grid-cols-2 gap-3'>
                              <div className='relative'>
                                 <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>₹ Total Est.</span>
                                 <input type='number' placeholder='0' value={orderDetails.Total} onChange={e => setOrderDetails({ ...orderDetails, Total: e.target.value })} className='w-full pl-24 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                              </div>
                              <div className='relative'>
                                 <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>₹ Advance</span>
                                 <input type='number' placeholder='0' value={orderDetails.AdvancePayment} onChange={e => setOrderDetails({ ...orderDetails, AdvancePayment: e.target.value })} className='w-full pl-20 p-3 rounded-[8px] bg-green-500/10 border border-green-500/30 outline-none' />
                              </div>
                              <select value={orderDetails.orderStatus} onChange={e => setOrderDetails({ ...orderDetails, orderStatus: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none'>
                                 <option value='request'>Status: Requested</option>
                                 <option value='accept'>Status: Accepted</option>
                                 <option value='progress'>Status: In Progress</option>
                                 <option value='complete'>Status: Complete</option>
                              </select>
                              <input type='date' value={orderDetails.deliveryDate} onChange={e => setOrderDetails({ ...orderDetails, deliveryDate: e.target.value })} className='p-3 rounded-[8px] bg-input border border-border/50 outline-none text-muted-foreground' />
                              <input type='text' placeholder='Notes / remarks (optional)' value={orderDetails.notes} onChange={e => setOrderDetails({ ...orderDetails, notes: e.target.value })} className='col-span-2 p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50' />
                           </div>
                        </div>
                     </div>

                     {/* ── RIGHT: Cart Summary ───────────────────────────── */}
                     <div className='lg:flex-1 flex flex-col bg-card border border-border/50 rounded-2xl shadow-inner lg:overflow-hidden'>
                        <div className='bg-secondary/50 p-4 font-bold border-b border-border/50 flex items-center gap-2'>
                           <ShoppingCart className='w-4 h-4' /> Order Cart
                        </div>

                        <div className='flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px]'>
                           {cartItems.length === 0 ? (
                              <div className='h-full flex flex-col items-center justify-center text-muted-foreground opacity-50'>
                                 <Package className='w-12 h-12 mb-2' />
                                 <p>Cart is empty</p>
                              </div>
                           ) : cartItems.map((item, idx) => (
                              <div key={idx} className='p-3 bg-secondary/20 rounded-[8px] border border-border/50 flex justify-between items-start relative pr-10'>
                                 <div>
                                    <p className='font-bold text-sm'>{item.itemName} <span className='text-xs text-muted-foreground uppercase'>({item.metal})</span></p>
                                    {item.purity && <p className='text-xs text-muted-foreground'>Purity: {item.purity}</p>}
                                    {item.weight && <p className='text-xs text-muted-foreground'>Weight: {item.weight}g</p>}
                                    {item.size && <p className='text-xs text-muted-foreground'>Size: {item.size}</p>}
                                    {item.description && <p className='text-xs text-muted-foreground italic'>"{item.description}"</p>}
                                 </div>
                                 <button onClick={() => removeCartItem(idx)} className='absolute right-3 top-3 text-red-500/50 hover:text-red-500'><Trash2 className='w-4 h-4' /></button>
                              </div>
                           ))}
                        </div>

                        <div className='border-t border-border/50 bg-secondary/10 p-5 space-y-3'>
                           {orderDetails.Total && (
                              <>
                                 <div className='flex justify-between text-sm'>
                                    <span>Estimated Total:</span>
                                    <span className='font-bold'>₹{Number(orderDetails.Total).toFixed(0)}</span>
                                 </div>
                                 <div className='flex justify-between text-sm text-green-500'>
                                    <span>Advance Paid:</span>
                                    <span className='font-bold'>₹{Number(orderDetails.AdvancePayment || 0).toFixed(0)}</span>
                                 </div>
                                 {Number(orderDetails.Total) - Number(orderDetails.AdvancePayment || 0) > 0 && (
                                    <div className='flex justify-between text-sm text-red-500 font-bold'>
                                       <span>Remaining Due:</span>
                                       <span>₹{(Number(orderDetails.Total) - Number(orderDetails.AdvancePayment || 0)).toFixed(0)}</span>
                                    </div>
                                 )}
                              </>
                           )}
                           {error && <div className='text-red-500 text-xs text-center'>{error}</div>}
                           <button
                              onClick={handleCreateOrder}
                              disabled={loading || cartItems.length === 0}
                              className='w-full p-4 bg-amber-400 text-black font-bold text-lg rounded-[8px] hover:bg-amber-500 disabled:opacity-50 flex justify-center items-center gap-2'
                           >
                              {loading ? 'Creating Order...' : 'Create Order'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* ─── VIEW ORDER DETAILS MODAL ──────────────────────────────────── */}
         {showViewOrder && activeOrderDetails && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-border/50 shadow-2xl relative'>
                  <button onClick={() => setShowViewOrder(false)} className='absolute top-6 right-6 bg-secondary/50 hover:bg-secondary p-2 rounded-full'><X className='w-5 h-5' /></button>

                  <div className='text-center border-b border-border/50 pb-6 mb-6'>
                     <h2 className='text-2xl font-bold uppercase tracking-widest text-amber-500'>Order Details</h2>
                     <p className='text-sm text-muted-foreground mt-1'>Placed: {formatDate(activeOrderDetails.createdAt)}</p>
                     {activeOrderDetails.updatedAt !== activeOrderDetails.createdAt && (
                        <p className='text-xs text-muted-foreground'>Last Updated: {formatDateTime(activeOrderDetails.updatedAt)}</p>
                     )}
                  </div>

                  {/* Customer Info */}
                  <div className='mb-5'>
                     <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1'>Customer</p>
                     <p className='text-lg font-bold'>{activeOrderDetails.customerId?.name}</p>
                     <p className='text-sm text-muted-foreground'>{activeOrderDetails.customerId?.phone}</p>
                  </div>

                  {/* Status Badges */}
                  <div className='flex flex-wrap gap-2 mb-5'>
                     {(() => {
                        const cfg = orderStatusConfig[activeOrderDetails.orderStatus] || orderStatusConfig.request
                        const Icon = cfg.Icon
                        return (
                           <span className={`px-3 py-1 text-xs rounded-full border inline-flex items-center gap-1 ${cfg.color}`}>
                              <Icon className='w-3 h-3' /> {cfg.label}
                           </span>
                        )
                     })()}
                     <span className={`px-3 py-1 text-xs rounded-full border uppercase ${paymentStatusColors[activeOrderDetails.paymentStatus || 'unpaid']}`}>
                        {(activeOrderDetails.paymentStatus || 'unpaid').replace('_', ' ')}
                     </span>
                  </div>

                  {/* Items */}
                  <div className='bg-secondary/20 rounded-[8px] border border-border/50 overflow-hidden mb-6'>
                     <div className='bg-secondary/40 p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground'>Jewelry Items Ordered</div>
                     <div className='divide-y divide-border/50'>
                        {activeOrderDetails.items?.map((item, idx) => (
                           <div key={idx} className='p-4'>
                              <p className='font-bold'>{item.itemName} <span className='text-xs text-muted-foreground uppercase'>({item.metal})</span></p>
                              <div className='flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground'>
                                 {item.purity && <span>Purity: {item.purity}</span>}
                                 {item.weight && <span>Weight: {item.weight}g</span>}
                                 {item.size && <span>Size: {item.size}</span>}
                              </div>
                              {item.description && <p className='text-xs text-muted-foreground italic mt-1'>"{item.description}"</p>}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Payment Summary */}
                  <div className='flex flex-col items-end space-y-2 mb-6'>
                     <div className='flex justify-between w-64 text-sm'>
                        <span className='text-muted-foreground'>Estimated Total:</span>
                        <span className='font-bold text-lg'>₹{activeOrderDetails.Total?.toFixed(0)}</span>
                     </div>
                     <div className='flex justify-between w-64 text-sm pb-2 border-b border-border/30'>
                        <span className='text-muted-foreground'>Advance Paid:</span>
                        <span className='font-bold text-green-500'>₹{activeOrderDetails.AdvancePayment?.toFixed(0)}</span>
                     </div>
                     <div className='flex justify-between w-64 text-sm font-bold'>
                        <span className='text-muted-foreground'>Balance Due:</span>
                        <span className='text-red-500'>₹{activeOrderDetails.RemainingAmount?.toFixed(0)}</span>
                     </div>
                     {activeOrderDetails.deliveryDate && (
                        <div className='flex justify-between w-64 text-sm'>
                           <span className='text-muted-foreground'>Delivery Date:</span>
                           <span className='text-amber-500'>{formatDate(activeOrderDetails.deliveryDate)}</span>
                        </div>
                     )}
                  </div>

                  {/* Notes */}
                  {activeOrderDetails.notes && (
                     <div className='mb-5 p-3 bg-secondary/30 rounded-[8px] border border-border/30'>
                        <p className='text-xs font-bold text-muted-foreground uppercase mb-1'>Notes</p>
                        <p className='text-sm italic'>"{activeOrderDetails.notes}"</p>
                     </div>
                  )}

                  {/* Images */}
                  {activeOrderDetails.image?.length > 0 && (
                     <div className='pt-5 border-t border-border/50'>
                        <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3'>Reference Photos</p>
                        <div className='flex gap-3 flex-wrap'>
                           {activeOrderDetails.image.map((img, idx) => (
                              <img key={idx} src={img} alt='ref' onClick={() => setEnlargedImage(img)} className='w-20 h-20 rounded-[8px] object-cover border border-border/50 cursor-pointer hover:opacity-80' />
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Edit button in detail modal */}
                  {canEdit(activeOrderDetails) && (
                     <button
                        onClick={() => { setShowViewOrder(false); openEditPayment(activeOrderDetails) }}
                        className='mt-6 w-full p-3 border border-amber-400/50 text-amber-500 rounded-[8px] hover:bg-amber-400/10 font-medium flex items-center justify-center gap-2'
                     >
                        <Edit className='w-4 h-4' /> Record Payment / Update Status
                     </button>
                  )}
               </div>
            </div>
         )}

         {/* ─── EDIT PAYMENT MODAL ────────────────────────────────────────── */}
         {showEditPayment && activeOrderDetails && (
            <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
               <div className='bg-card w-full max-w-md p-6 rounded-2xl border border-border/50 shadow-2xl'>
                  <div className='flex justify-between items-center mb-5'>
                     <h2 className='text-xl font-bold'>Record Payment</h2>
                     <button onClick={() => setShowEditPayment(false)} className='hover:bg-secondary p-1 rounded-full'><X /></button>
                  </div>

                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-2 rounded-[8px] mb-4 text-center'>{error}</div>}

                  {/* Current State */}
                  <div className='bg-secondary/30 rounded-[8px] p-4 mb-5 space-y-1'>
                     <p className='text-sm font-bold'>{activeOrderDetails.customerId?.name || selectedCustomer?.name}</p>
                     <p className='text-xs text-muted-foreground'>Items: {activeOrderDetails.items?.map(i => i.itemName).join(', ')}</p>
                     <div className='flex justify-between text-sm mt-2'>
                        <span className='text-muted-foreground'>Order Total:</span>
                        <span className='font-bold'>₹{activeOrderDetails.Total?.toFixed(0)}</span>
                     </div>
                     <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Already Paid:</span>
                        <span className='text-green-500 font-bold'>₹{activeOrderDetails.AdvancePayment?.toFixed(0)}</span>
                     </div>
                     <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Currently Due:</span>
                        <span className='text-red-500 font-bold'>₹{activeOrderDetails.RemainingAmount?.toFixed(0)}</span>
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
                        <div className={`p-3 rounded-[8px] border text-sm font-bold flex justify-between ${remainingAfterEdit === 0 ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                           <span>Remaining After Payment:</span>
                           <span>₹{remainingAfterEdit.toFixed(0)}</span>
                        </div>
                     )}

                     {/* Update Order Status */}
                     <div>
                        <label className='text-sm font-medium text-muted-foreground mb-1 block'>Update Order Status</label>
                        <select
                           value={editPaymentData.orderStatus}
                           onChange={e => setEditPaymentData({ ...editPaymentData, orderStatus: e.target.value })}
                           className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none'
                        >
                           <option value='request'>Requested</option>
                           <option value='accept'>Accepted</option>
                           <option value='progress'>In Progress</option>
                           <option value='complete'>Complete</option>
                        </select>
                     </div>

                     {/* Notes */}
                     <div>
                        <label className='text-sm font-medium text-muted-foreground mb-1 block'>Notes (optional)</label>
                        <input
                           type='text'
                           placeholder='Any remarks...'
                           value={editPaymentData.notes}
                           onChange={e => setEditPaymentData({ ...editPaymentData, notes: e.target.value })}
                           className='w-full p-3 rounded-[8px] bg-input border border-border/50 outline-none focus:border-amber-400/50'
                        />
                     </div>

                     <button
                        onClick={handleRecordPayment}
                        disabled={loading}
                        className='w-full p-3 bg-amber-400 text-black font-bold rounded-[8px] hover:bg-amber-500 disabled:opacity-50'
                     >
                        {loading ? 'Saving...' : 'Save Payment & Status'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* ─── ENLARGED IMAGE ────────────────────────────────────────────── */}
         {enlargedImage && (
            <div className='fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-md p-4' onClick={() => setEnlargedImage(null)}>
               <button className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full text-white transition-colors'><X className='w-6 h-6' /></button>
               <img src={enlargedImage} alt='Enlarged' className='max-w-full max-h-[90vh] object-contain rounded-[8px] shadow-2xl' onClick={e => e.stopPropagation()} />
            </div>
         )}
         {/* Datalists for custom settings */}
         <datalist id="predefined-items">
            {predefinedItemNames.map((name, idx) => <option key={idx} value={name} />)}
         </datalist>
         <datalist id="predefined-purities">
            {predefinedPurities.map((purity, idx) => <option key={idx} value={purity} />)}
         </datalist>
      </>
   )
}

export { Orders }