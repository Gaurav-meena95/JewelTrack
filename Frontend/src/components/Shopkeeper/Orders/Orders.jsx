import React, { useState, useEffect, useMemo } from 'react'
import { Package, Clock } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

// Shared Utils
import ImageViewer from '../../../utils/ImageViewer'

// Sub-components
import OrderFormModal from './components/OrderFormModal'
import OrderDetailsModal from './components/OrderDetailsModal'
import CustomerLookupModal from './components/CustomerLookupModal'
import UpdateOrderModal from './components/UpdateOrderModal'
import OrderDashboardView from './components/OrderDashboardView'
import OrderProfileView from './components/OrderProfileView'
import ConfirmModal from '../../../utils/ConfirmModal'

const orderStatusConfig = {
   accept: { label: 'Accepted', color: 'bg-amber-500/10 text-green-400 border-green-500/30', Icon: Package },
   progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-400/30', Icon: Clock },
   complete: { label: 'Complete', color: 'bg-green-500/10 text-green-400 border-green-500/30', Icon: Package },
}

const METAL_OPTIONS = ['gold', 'silver', 'diamond', 'platinum', 'other']

const Orders = () => {
   const header = getAuthHeaders()

   // App State
   const [orders, setOrders] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [success, setSuccess] = useState('')

   // Predefined Settings
   const [predefinedItemNames, setPredefinedItemNames] = useState([])
   const [predefinedPurities, setPredefinedPurities] = useState([])

   // Navigation
   const [viewMode, setViewMode] = useState('dashboard') // 'dashboard' | 'profile'
   const [selectedCustomer, setSelectedCustomer] = useState(null)

   // Dashboard
   const [searchQuery, setSearchQuery] = useState('')

   // Profile Filter
   const [paymentFilter, setPaymentFilter] = useState('all')

   // Modals
   const [showLookupModal, setShowLookupModal] = useState(false)
   const [showNewOrder, setShowNewOrder] = useState(false)
   const [showViewOrder, setShowViewOrder] = useState(false)
   const [showEditPayment, setShowEditPayment] = useState(false)
   const [showConfirmModal, setShowConfirmModal] = useState(false)
   const [activeOrderDetails, setActiveOrderDetails] = useState(null)

   // Customer Lookup
   const [customerPhone, setCustomerPhone] = useState('')
   const [customerFound, setCustomerFound] = useState(null)
   const [customerData, setCustomerData] = useState({ name: '', father_name: '', address: '', email: '' })

   // Cart System
   const [cartItems, setCartItems] = useState([])
   const [currentItem, setCurrentItem] = useState({
      itemName: '', metal: 'gold', purity: '',
      weight: '', size: '', description: '',
      ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: ''
   })
   const [orderDetails, setOrderDetails] = useState({ Total: '', AdvancePayment: '', notes: '', deliveryDate: '', orderStatus: 'accept' })
   const [images, setImages] = useState([])
   const [enlargedImage, setEnlargedImage] = useState(null)

   const calcCurrentItemPrice = () => {
      const w = Number(currentItem.weight) || 0;
      const r = Number(currentItem.ratePerGram) || 0;
      const m = Number(currentItem.makingChargePercent) || 0;
      const g = Number(currentItem.gstPercent) || 0;
      const base = w * r;
      const making = base * (m / 100);
      const subtotal = base + making;
      const gst = subtotal * (g / 100);
      const adj = Number(currentItem.manualAdjustment) || 0;
      return subtotal + gst - adj;
   }

   // Edit Payment
   const [editPaymentData, setEditPaymentData] = useState({ additionalPayment: '', orderStatus: '', notes: '' })

   // API
   const fetchOrders = async () => {
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/customers/orders/me`, { headers: header })
         if (res.data?.data?.data) setOrders(res.data.data.data)
      } catch (err) {
         setError('Failed to fetch orders')
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
      } catch (err) { }
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

   // Derived Data
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

   const currentCustomerOrders = useMemo(() => {
      if (!selectedCustomer) return []
      let list = orders
         .filter(o => o.customerId?.phone === selectedCustomer.phone)
         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      if (paymentFilter !== 'all') list = list.filter(o => o.paymentStatus === paymentFilter)
      return list
   }, [orders, selectedCustomer, paymentFilter])

   // Actions
   const openCustomerProfile = (customer) => {
      setSelectedCustomer(customer)
      setPaymentFilter('all')
      setViewMode('profile')
   }

   const checkCustomer = async () => {
      if (customerPhone.length < 10) return setError('Please enter a valid 10-digit phone number')
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${customerPhone}`, { headers: header })
         if (res.data?.data?.customer) {
            setCustomerFound(true)
            setCustomerData({
               name: res.data.data.customer.name,
               father_name: res.data.data.customer.father_name || '',
               address: res.data.data.customer.address || '',
               phone: customerPhone
            })
         } else {
            setCustomerFound(false)
            setCustomerData({ name: '', father_name: '', address: '', phone: customerPhone })
         }
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to check customer')
         setCustomerFound(false)
         setCustomerData({ name: '', father_name: '', address: '', phone: customerPhone })
      }
      setLoading(false)
   }

   const handleProceedToOrder = async (e) => {
      if (e) e.preventDefault()
      if (customerFound === null) return

      if (customerFound === false) {
         try {
            setLoading(true)
            const res = await axios.post(`${VITE_API_BASE_KEY}/customers/register`, customerData, { headers: header })
            // After registration, update customerData with the newly created customer info if needed,
            // though the existing customerData already has the fields we need.
            setCustomerFound(true)
         } catch (err) {
            setError(err.response?.data?.message || 'Failed to register customer')
            setLoading(false)
            return
         }
      }

      setSelectedCustomer(customerData)
      setShowLookupModal(false)
      openNewOrderModal()
      setLoading(false)
   }

   const openNewOrderModal = () => {
      setCartItems([])
      setCurrentItem({
         itemName: '', metal: 'gold', purity: '',
         weight: '', size: '', description: '',
         ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: ''
      })
      setOrderDetails({ Total: '', discount: '0', AdvancePayment: '', notes: '', deliveryDate: '', orderStatus: 'accept' })
      setImages([])
      setShowNewOrder(true)
   }

   const addItemToCart = () => {
      if (!currentItem.itemName) return setError('Please enter an item name')
      if (!currentItem.weight) return setError('Please enter weight to calculate order correctly.')
      if (!currentItem.ratePerGram) return setError('Please enter a rate per gram.')

      const finalPrice = calcCurrentItemPrice()
      if (finalPrice <= 0) return setError('Item final price must be greater than 0.')

      setCartItems([...cartItems, { ...currentItem, finalPrice }])
      setCurrentItem({
         itemName: '', metal: 'gold', purity: '',
         weight: '', size: '', description: '',
         ratePerGram: '', makingChargePercent: '', gstPercent: '3', manualAdjustment: ''
      })
   }

   const removeCartItem = (idx) => setCartItems(cartItems.filter((_, i) => i !== idx))

   // Derived Total
   const cartGrandTotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.finalPrice || 0), 0), [cartItems])

   useEffect(() => {
     setOrderDetails(prev => {
       const discountValue = Number(prev.discount) || 0;
       const finalTotal = Math.max(0, cartGrandTotal - discountValue);
       if (prev.Total === finalTotal.toString()) return prev;
       return { ...prev, Total: finalTotal.toString() };
     });
   }, [cartGrandTotal, orderDetails.discount])

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

   const handleCreateOrder = async () => {
      if (cartItems.length === 0) return setError('Cart is empty! Add at least one jewelry item.')
      if (images.length === 0) return setError('Please upload at least one reference image.')
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
      if (!editPaymentData.additionalPayment || isNaN(editPaymentData.additionalPayment)) return setError("Invalid payment amount")
      setLoading(true)
      try {
         const amount = Number(editPaymentData.additionalPayment)
         const currentHistory = activeOrderDetails.paymentHistory || []

         const newPayment = {
            amount,
            orderStatus: editPaymentData.orderStatus,
            date: new Date(),
            notes: editPaymentData.notes
         }

         const updatedPayload = {
            ...activeOrderDetails,
            orderStatus: editPaymentData.orderStatus,
            paymentHistory: [...currentHistory, newPayment]
         }

         await axios.patch(
            `${VITE_API_BASE_KEY}/customers/orders/update/?order_id=${activeOrderDetails._id}`,
            updatedPayload,
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

   const formatDate = (dateStr) => {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
   }

   const formatDateTime = (dateStr) => {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
   }

   const hasBlur = showLookupModal || showNewOrder || showViewOrder || showEditPayment

   return (
      <>
         <div className={`min-h-screen ${hasBlur ? 'blur-[2px] pointer-events-none' : ''}`}>

            {viewMode === 'dashboard' ? (
               <OrderDashboardView
                  uniqueCustomers={uniqueCustomers}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  loading={loading}
                  openCustomerProfile={openCustomerProfile}
                  setShowLookupModal={setShowLookupModal}
                  setCustomerPhone={setCustomerPhone}
                  setCustomerFound={setCustomerFound}
                  success={success}
                  error={error}
                  formatDate={formatDate}
               />
            ) : (
               <OrderProfileView
                  selectedCustomer={selectedCustomer}
                  setViewMode={setViewMode}
                  paymentFilter={paymentFilter}
                  setPaymentFilter={setPaymentFilter}
                  currentCustomerOrders={currentCustomerOrders}
                  openNewOrderModal={openNewOrderModal}
                  setActiveOrderDetails={setActiveOrderDetails}
                  setShowViewOrder={setShowViewOrder}
                  openEditPayment={openEditPayment}
                  loading={loading}
                  success={success}
                  error={error}
                  orderStatusConfig={orderStatusConfig}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
               />
            )}
         </div>

         <CustomerLookupModal
            show={showLookupModal}
            onClose={() => setShowLookupModal(false)}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerFound={customerFound}
            setCustomerFound={setCustomerFound}
            checkCustomer={checkCustomer}
            customerData={customerData}
            handleProceedToOrder={handleProceedToOrder}
            setCustomerData={setCustomerData}
            loading={loading}
         />

         <OrderFormModal
            show={showNewOrder}
            onClose={() => setShowNewOrder(false)}
            customer={selectedCustomer}
            cartItems={cartItems}
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            addItemToCart={addItemToCart}
            removeCartItem={removeCartItem}
            calcCurrentItemPrice={calcCurrentItemPrice}
            images={images}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            handleCreateOrder={handleCreateOrder}
            loading={loading}
            error={error}
            METAL_OPTIONS={METAL_OPTIONS}
            predefinedItemNames={predefinedItemNames}
            predefinedPurities={predefinedPurities}
            cartGrandTotal={cartGrandTotal}
         />

         <OrderDetailsModal
            show={showViewOrder}
            onClose={() => setShowViewOrder(false)}
            order={activeOrderDetails}
            orderStatusConfig={orderStatusConfig}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            onEnlargeImage={(img) => setEnlargedImage(img)}
         />

         <UpdateOrderModal
            show={showEditPayment}
            onClose={() => setShowEditPayment(false)}
            order={activeOrderDetails}
            editPaymentData={editPaymentData}
            setEditPaymentData={setEditPaymentData}
            handleRecordPayment={handleRecordPayment}
            loading={loading}
         />

         <ImageViewer
            image={enlargedImage}
            onClose={() => setEnlargedImage(null)}
         />
      </>
   )
}

export { Orders }