import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

// Shared Utils
import SectionHeader from '../../../utils/SectionHeader'

// Sub-components
import CustomerFormModal from './components/CustomerFormModal'
import CustomerPortfolioView from './components/CustomerPortfolioView'
import CustomerList from './components/CustomerList'

const Customers = () => {
  const header = getAuthHeaders()

  const [customers, setCustomers] = useState([])
  const [allCustomers, setAllCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchPhone, setSearchPhone] = useState('')

  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('bills')

  const initialFormState = {
    name: '',
    father_name: '',
    phone: '',
    email: '',
    address: ''
  }
  const [formData, setFormData] = useState(initialFormState)

  // API Actions ---
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get`, { headers: header })
      if (response.data?.data?.customer) {
        const data = response.data.data.customer
        const customersArray = Array.isArray(data) ? data : [data]
        setCustomers(customersArray)
        setAllCustomers(customersArray)
      }
    } catch (err) {
      setError('Failed to fetch customers')
    }
    setLoading(false)
  }

  const fetchCustomerDetail = async (id) => {
    try {
      setDetailsLoading(true)
      setSelectedCustomerDetail(null)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/register/detail?id=${id}`, { headers: header })
      if (response.data?.data) {
        setSelectedCustomerDetail(response.data.data)
        setActiveTab('bills')
      }
    } catch (err) {
      setError('Failed to load portfolio')
    }
    setDetailsLoading(false)
  }

  const handelRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${VITE_API_BASE_KEY}/customers/register`, formData, { headers: header })
      setSuccess('Customer registered successfully!')
      setShowRegisterModal(false)
      setFormData(initialFormState)
      fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const handelUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.patch(`${VITE_API_BASE_KEY}/customers/register/update`, formData, { headers: header })
      setSuccess('Customer updated successfully!')
      setShowEditModal(false)
      setFormData(initialFormState)
      fetchCustomers()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    }
    setLoading(false)
  }

  const handelDelete = async () => {
    if (!selectedCustomer) return
    setLoading(true)
    try {
      await axios.delete(`${VITE_API_BASE_KEY}/customers/register/delete?phone=${selectedCustomer.phone}`, { headers: header })
      setSuccess('Customer deleted successfully!')
      setShowDeleteConfirm(false)
      setSelectedCustomer(null)
      fetchCustomers()
    } catch (err) {
      setError('Delete failed')
    }
    setLoading(false)
  }

  // Filtering Logic ---
  useEffect(() => {
    if (!searchPhone.trim()) {
      setCustomers(allCustomers)
    } else {
      const q = searchPhone.trim().toLowerCase()
      const filtered = allCustomers.filter(c =>
        String(c.phone).includes(q) ||
        c.name?.toLowerCase().includes(q)
      )
      setCustomers(filtered)
    }
  }, [searchPhone, allCustomers])

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError('') }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  // Helpers ---
  const openEditModal = (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      name: customer.name,
      father_name: customer.father_name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address
    })
    setShowEditModal(true)
  }

  const hasBlur = showRegisterModal || showEditModal || showDeleteConfirm

  return (
    <>
      <div className={`min-h-screen ${hasBlur ? 'blur-[4px] pointer-events-none scale-95 opacity-50' : ''} transition-all duration-300`}>

        {detailsLoading ? (
          <div className='flex flex-col items-center justify-center py-52 space-y-6'>
            <div className='w-14 h-14 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin shadow-2xl'></div>
            <div className='space-y-1 text-center'>
              <h3 className='font-black uppercase tracking-widest text-xs'>Accessing Secure Ledger</h3>
              <p className='text-muted-foreground text-[10px] uppercase font-bold tracking-tighter opacity-60'>Please wait while we sync customer portfolio...</p>
            </div>
          </div>
        ) : selectedCustomerDetail ? (
          <CustomerPortfolioView
            selectedCustomerDetail={selectedCustomerDetail}
            setSelectedCustomerDetail={setSelectedCustomerDetail}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <div className='space-y-8 animate-in fade-in duration-500'>
            <SectionHeader
              title="Customer Management"
              subtitle="Register and manage your professional client database"
              buttonText="Register Client"
              onButtonClick={() => { setFormData(initialFormState); setShowRegisterModal(true) }}
              className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
              titleClassName="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            />

            {success && <div className='bg-green-500/20 border border-green-500/50 text-green-500 p-4 rounded-2xl text-center text-sm font-bold animate-in slide-in-from-top-4'>{success}</div>}

            <CustomerList
              loading={loading}
              customers={customers}
              searchPhone={searchPhone}
              setSearchPhone={setSearchPhone}
              fetchCustomerDetail={fetchCustomerDetail}
              openEditModal={openEditModal}
              openDeleteConfirm={(c) => { setSelectedCustomer(c); setShowDeleteConfirm(true) }}
              setShowRegisterModal={setShowRegisterModal}
              resetForm={() => setFormData(initialFormState)}
              setFormData={setFormData}
              error={error}
            />
          </div>
        )}
      </div>

      {/* Unified Modals */}
      <CustomerFormModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        isEditing={false}
        formData={formData}
        handelChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handelSubmit={handelRegister}
        loading={loading}
        error={error}
      />

      <CustomerFormModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        isEditing={true}
        formData={formData}
        handelChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handelSubmit={handelUpdate}
        loading={loading}
        error={error}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200'>
          <div className='bg-card max-w-sm w-full p-8 rounded-[32px] border border-red-500/30 shadow-2xl text-center space-y-6'>
            <div className='h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-500/5'>
              <X className='h-10 w-10 text-red-500' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-xl font-black uppercase text-red-500'>Confirm Deletion</h2>
              <p className='text-sm text-muted-foreground font-medium'>Are you sure you want to permanently delete <span className='font-bold text-foreground'>"{selectedCustomer?.name}"</span>? This action cannot be reversed.</p>
            </div>
            <div className='flex gap-3 pt-2'>
              <button onClick={() => setShowDeleteConfirm(false)} className='flex-1 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 font-bold transition-all border border-border/50'>Cancel</button>
              <button onClick={handelDelete} className='flex-1 p-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20'>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { Customers }