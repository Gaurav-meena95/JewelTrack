import React, { useState, useEffect, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'
import { useNotification } from '../../../context/NotificationContext'

// Shared Utils
import SectionHeader from '../../../utils/SectionHeader'
import ImageViewer from '../../../utils/ImageViewer'

// Sub-components
import QuickCalculatorModal from './components/QuickCalculatorModal'
import NewGirviModal from './components/NewGirviModal'
import CollateralDetailsModal from './components/CollateralDetailsModal'
import RecordColletralPaymentModal from './components/RecordColletralPaymentModal'
import CollateralDashboardView from './components/CollateralDashboardView'
import CollateralProfileView from './components/CollateralProfileView'

const Colletral = () => {
  const { confirm, showToast } = useNotification()
  const header = getAuthHeaders()

  const [collaterals, setCollaterals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Navigation
  const [viewMode, setViewMode] = useState('dashboard') // 'dashboard' | 'profile'
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all') // all, active, closed

  // Predefined Settings
  const [predefinedItemNames, setPredefinedItemNames] = useState([])

  // Modals
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNewGirvi, setShowNewGirvi] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showRecordPayment, setShowRecordPayment] = useState(false)
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
  const [editPaymentData, setEditPaymentData] = useState({ additionalPayment: '', paymentMethod: 'cash', note: '' })
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

  // Grouping Logic for Dashboard
  const uniqueCustomers = useMemo(() => {
    const map = {}
    collaterals.forEach(item => {
      if (!item.customerId?._id) return
      const id = item.customerId._id
      if (!map[id]) {
        map[id] = {
          _id: id,
          name: item.customerId.name,
          phone: item.phone,
          totalAccounts: 0,
          totalDue: 0,
          lastUpdated: item.updatedAt,
          items: []
        }
      }
      map[id].totalAccounts += 1
      
      const liveInterest = calculateLiveInterest(item)
      const remain = item.remainingAmount !== undefined ? item.remainingAmount : item.price
      map[id].totalDue += (Number(remain) + Number(liveInterest))

      if (new Date(item.updatedAt) > new Date(map[id].lastUpdated)) {
        map[id].lastUpdated = item.updatedAt
      }
      map[id].items.push(item)
    })

    let list = Object.values(map)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || String(c.phone).includes(q))
    }
    return list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
  }, [collaterals, searchQuery])

  const currentCustomerCollaterals = useMemo(() => {
    if (!selectedCustomer) return []
    let list = collaterals
      .filter(c => c.customerId?._id === selectedCustomer._id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    if (filter !== 'all') list = list.filter(item => item.status === filter)
    return list
  }, [collaterals, selectedCustomer, filter])

  // Actions ---
  const openCustomerProfile = (customer) => {
    setSelectedCustomer(customer)
    setFilter('all')
    setViewMode('profile')
  }

  const handleCalcChange = (e) => setCalcData({ ...calcData, [e.target.name]: e.target.value })

  const calculateInterest = (e) => {
    e.preventDefault()
    if (!calcData.startDate || !calcData.endDate || !calcData.basePrice || !calcData.interest) return
    const days = (new Date(calcData.endDate) - new Date(calcData.startDate)) / (1000 * 60 * 60 * 24)
    if (days < 0) return setCalcResult("Invalid Dates")
    const interest = (Number(calcData.basePrice) * Number(calcData.interest) * days) / 3000
    setCalcResult(interest.toFixed(2))
  }

  function calculateLiveInterest(item) {
    if (item.status === 'closed') return 0
    const days = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const remain = item.remainingAmount !== undefined ? item.remainingAmount : item.price
    const interest = remain * item.interestRate * days / 3000
    return interest.toFixed(2)
  }

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

      showToast("Girvi created successfully!", "success")
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
    const ok = await confirm("Are you sure you want to delete this closed collateral? This action cannot be undone.", "Delete Account", "danger")
    if (!ok) return
    setLoading(true)
    try {
      await axios.delete(`${VITE_API_BASE_KEY}/customers/collatral/delete?phone=${phone}&collatral_id=${id}`, { headers: header })
      showToast("Collateral deleted successfully!", "success")
      fetchCollaterals()
    } catch (err) {
      showToast("Failed to delete collateral", "danger")
    }
    setLoading(false)
  }

  const handleRecordPayment = async () => {
    if (!editPaymentData.additionalPayment || isNaN(editPaymentData.additionalPayment)) return setError("Invalid payment amount")
    if (!selectedAccount) return

    setLoading(true)
    try {
      await axios.patch(
        `${VITE_API_BASE_KEY}/customers/collatral/pay?collatral_id=${selectedAccount._id}`, 
        editPaymentData, 
        { headers: header }
      )

      setSuccess("Payment recorded successfully!")
      setEditPaymentData({ additionalPayment: '', paymentMethod: 'cash', note: '' })
      setShowRecordPayment(false)
      fetchCollaterals()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment")
    }
    setLoading(false)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const hasBlur = showCalculator || showNewGirvi || showAccount || showRecordPayment

  return (
    <>
      <div className={`min-h-screen ${hasBlur ? 'blur-[2px] pointer-events-none' : ''}`}>
        
        {viewMode === 'dashboard' ? (
          <CollateralDashboardView 
            uniqueCustomers={uniqueCustomers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            loading={loading}
            openCustomerProfile={openCustomerProfile}
            setShowNewGirvi={setShowNewGirvi}
            success={success}
            error={error}
            formatDate={formatDate}
          >
            <button
              onClick={() => setShowCalculator(true)}
              className='p-2 px-4 bg-secondary border border-border/50 rounded flex items-center gap-2 hover:bg-secondary/80 transition-all font-medium text-xs md:text-sm'
            >
              <Calculator className='h-4 w-4' /> Quick Interest Calculator
            </button>
          </CollateralDashboardView>
        ) : (
          <CollateralProfileView 
            selectedCustomer={selectedCustomer}
            setViewMode={setViewMode}
            filter={filter}
            setFilter={setFilter}
            currentCustomerCollaterals={currentCustomerCollaterals}
            setShowNewGirvi={setShowNewGirvi}
            setSelectedAccount={setSelectedAccount}
            setShowAccount={setShowAccount}
            setShowRecordPayment={setShowRecordPayment}
            setEditPaymentData={setEditPaymentData}
            handleDeleteCollateral={handleDeleteCollateral}
            calculateLiveInterest={calculateLiveInterest}
            success={success}
            error={error}
            formatDate={formatDate}
          />
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
        onEnlargeImage={(img) => setEnlargedImage(img)}
      />

      <RecordColletralPaymentModal
        show={showRecordPayment}
        onClose={() => setShowRecordPayment(false)}
        item={selectedAccount}
        editPaymentData={editPaymentData}
        setEditPaymentData={setEditPaymentData}
        handleRecordPayment={handleRecordPayment}
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

export { Colletral }