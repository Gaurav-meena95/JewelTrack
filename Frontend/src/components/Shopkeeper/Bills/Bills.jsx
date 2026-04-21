import React, { useState, useEffect, useMemo } from 'react'
import { Edit, User, Calendar, ArrowLeft, History, IndianRupee, Phone, Plus } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

// Shared Utils
import SearchBar from '../../../utils/SearchBar'
import SectionHeader from '../../../utils/SectionHeader'
import StatusBadge from '../../../utils/StatusBadge'
import ImageViewer from '../../../utils/ImageViewer'

// Sub-components
import CustomerLookupModal from './components/CustomerLookupModal'
import NewBillModal from './components/NewBillModal'
import BillDetailsModal from './components/BillDetailsModal'
import RecordPaymentModal from './components/RecordPaymentModal'

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
   const [selectedCustomer, setSelectedCustomer] = useState(null)

   // Dashboard Search
   const [searchQuery, setSearchQuery] = useState('')

   // Profile Payment Filter
   const [paymentFilter, setPaymentFilter] = useState('all')

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
         if (response.data?.data?.data) {
            setBills(response.data.data.data)
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
         if (res.data?.data && res.data.data.user) {
            setPredefinedItemNames(res.data.data.user.itemNames || [])
            setPredefinedPurities(res.data.data.user.purities || [])
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

   // --- Derived Data ---
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

   const currentCustomerBills = useMemo(() => {
      if (!selectedCustomer) return []
      let list = bills.filter(b => b.customerId?.phone === selectedCustomer.phone).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      if (paymentFilter !== 'all') list = list.filter(b => b.payment?.paymentStatus === paymentFilter)
      return list
   }, [bills, selectedCustomer, paymentFilter])

   // --- Actions ---
   const openCustomerProfile = (customer) => {
      setSelectedCustomer(customer)
      setPaymentFilter('all')
      setViewMode('profile')
   }

   const checkCustomer = async () => {
      if (customerPhone.length < 10) return
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
         if (res.data?.data && res.data.data.customer) {
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

   const handleStartBillWithCustomer = async (e) => {
      e.preventDefault()
      try {
         const custPayload = { phone: customerPhone, ...customerData }
         if (customerFound) {
            await axios.patch(`${VITE_API_BASE_KEY}/customers/register/update`, custPayload, { headers: header })
         } else {
            await axios.post(`${VITE_API_BASE_KEY}/customers/register`, custPayload, { headers: header })
         }
         setSelectedCustomer(custPayload)
         setShowLookupModal(false)
         setViewMode('profile')
         openCartModal()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to save customer')
      }
   }

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
         finalPrice: calcCurrentItemPrice()
      }
      setCartItems([...cartItems, itemToSave])
      setCurrentItem({ itemName: '', metal: 'gold', purity: '', weight: '', ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: '0' })
   }

   const removeCartItem = (idx) => setCartItems(cartItems.filter((_, i) => i !== idx))

   const cartGrandTotal = cartItems.reduce((acc, item) => acc + item.finalPrice, 0)
   const cartBalanceDue = Math.max(0, cartGrandTotal - Number(paymentDetails.amountPaid || 0))

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
         setError(err.response?.data?.message || 'Failed to generate Bill')
      }
      setLoading(false)
   }

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

   const hasBlur = showLookupModal || showNewBill || showViewBill || showEditPayment

   return (
      <>
         <div className={`min-h-screen ${hasBlur ? 'blur-[2px] pointer-events-none' : ''}`}>

            {/* --- DASHBOARD VIEW --- */}
            {viewMode === 'dashboard' && (
               <div className='space-y-6'>
                  <SectionHeader
                     title="Customers & Billing"
                     subtitle="Manage your customers and their complete billing history"
                     buttonText="New Customer & Bill"
                     onButtonClick={() => {
                        setCustomerPhone('');
                        setCustomerFound(null);
                        setCustomerData({ name: '', father_name: '', address: '', email: '' });
                        setShowLookupModal(true);
                     }}

                     className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
                     titleClassName="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
                  />

                  {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

                  <SearchBar
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search customers by name or phone..."
                  />

                  {loading ? <div className='text-center py-10 text-muted-foreground'>Loading Customers...</div> : (
                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {uniqueCustomers.map(customer => (
                           <div key={customer._id} onClick={() => openCustomerProfile(customer)} className='bg-card/40 border border-border/50 p-5 rounded-[8px] hover:border-amber-400/50 transition-colors cursor-pointer group flex items-start gap-4'>
                              <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform'>
                                 <User className='w-6 h-6' />
                              </div>
                              <div className='flex-1'>
                                 <h3 className='text-lg font-bold group-hover:text-amber-400 transition-colors'>{customer.name}</h3>
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

            {/* --- CUSTOMER PROFILE VIEW --- */}
            {viewMode === 'profile' && selectedCustomer && (
               <div className='space-y-6'>
                  <button onClick={() => setViewMode('dashboard')} className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2'>
                     <ArrowLeft className='w-4 h-4' /> Back to Customers
                  </button>

                  {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
                  {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

                  <div className='bg-secondary/30 border border-border/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                     <div className='flex items-center gap-4'>
                        <div className='h-16 w-16 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center text-2xl font-bold'>
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
                     <h3 className='text-lg font-bold flex items-center gap-2'><History className='w-5 h-5 text-amber-400' /> Purchase History</h3>

                     {loading ? <div className='py-10 text-center'>Loading History...</div> : currentCustomerBills.length === 0 ? (
                        <div className='text-center py-10 bg-secondary/20 rounded-[8px] border border-border/30'>
                           <History className='w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50' />
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
                                    <StatusBadge status={bill.payment?.paymentStatus} />
                                    <div className='text-xs text-muted-foreground'>
                                       <p>Paid: <span className='text-green-500 font-medium'>₹{bill.payment?.amountPaid}</span></p>
                                       {bill.payment?.remainingAmount > 0 && <p>Due: <span className='text-red-500 font-medium'>₹{bill.payment?.remainingAmount}</span></p>}
                                    </div>
                                    <div className='flex gap-3 justify-end flex-wrap mt-2'>
                                       <button onClick={() => { setActiveBillDetails(bill); setShowViewBill(true); }} className='text-amber-400 text-sm hover:underline'>View Invoice</button>
                                       {bill.payment?.paymentStatus !== 'paid' && (
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

         {/* --- MODALS --- */}
         <CustomerLookupModal
            show={showLookupModal}
            onClose={() => setShowLookupModal(false)}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerFound={customerFound}
            setCustomerFound={setCustomerFound}
            checkCustomer={checkCustomer}
            customerData={customerData}
            setCustomerData={setCustomerData}
            onSubmit={handleStartBillWithCustomer}
         />

         <NewBillModal
            show={showNewBill}
            onClose={() => setShowNewBill(false)}
            customer={selectedCustomer}
            predefinedItemNames={predefinedItemNames}
            predefinedPurities={predefinedPurities}
            cartItems={cartItems}
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            addItemToCart={addItemToCart}
            removeCartItem={removeCartItem}
            calcCurrentItemPrice={calcCurrentItemPrice}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            images={images}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            cartGrandTotal={cartGrandTotal}
            cartBalanceDue={cartBalanceDue}
            handleGenerateBill={handleGenerateBill}
            loading={loading}
            error={error}
         />

         <BillDetailsModal
            show={showViewBill}
            onClose={() => setShowViewBill(false)}
            bill={activeBillDetails}
            onEnlargeImage={(img) => setEnlargedImage(img)}
         />

         <RecordPaymentModal
            show={showEditPayment}
            onClose={() => setShowEditPayment(false)}
            bill={activeBillDetails}
            editPaymentData={editPaymentData}
            setEditPaymentData={setEditPaymentData}
            remainingAfterBillEdit={remainingAfterBillEdit}
            handleRecordBillPayment={handleRecordBillPayment}
            loading={loading}
            error={error}
         />

         <ImageViewer
            image={enlargedImage}
            onClose={() => setEnlargedImage(null)}
         />

      </>
   )
}

export { Bills }
