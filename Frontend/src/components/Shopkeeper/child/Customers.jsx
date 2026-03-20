import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, User, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Customers = () => {

  const VITE_API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY
  const token = localStorage.getItem('x-access-token')
  const refreshToken = localStorage.getItem('x-refresh-token')
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${token}`,
    'x-refresh-token': refreshToken
  }

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    phone: '',
    email: '',
    address: ''
  })

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ name: '', father_name: '', phone: '', email: '', address: '' })
    setError('')
    setSuccess('')
  }

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get`, {
        headers: header
      })
      if (response.data) {
        const data = response.data.customer
        setCustomers(Array.isArray(data) ? data : [data])
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Failed to fetch customers')
    }
    setLoading(false)
  }

  // Search customer by phone
  const handelSearch = async () => {
    if (!searchPhone.trim()) {
      fetchCustomers()
      return
    }
    try {
      setLoading(true)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/register/get?phone=${searchPhone}`, {
        headers: header
      })
      if (response.data) {
        const data = response.data.customer
        setCustomers(Array.isArray(data) ? data : [data])
      }
    } catch (error) {
      console.log(error)
      setCustomers([])
      setError(error.response?.data?.message || 'Customer not found')
    }
    setLoading(false)
  }

  // Register new customer
  const handelRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const response = await axios.post(`${VITE_API_BASE_KEY}/customers/register`, formData, {
        headers: header
      })
      if (response.data) {
        setSuccess('Customer registered successfully!')
        setShowRegisterModal(false)
        resetForm()
        fetchCustomers()
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  // Update customer
  const handelUpdate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const response = await axios.patch(`${VITE_API_BASE_KEY}/customers/register/update`, formData, {
        headers: header
      })
      if (response.data) {
        setSuccess('Customer updated successfully!')
        setShowEditModal(false)
        resetForm()
        fetchCustomers()
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Update failed')
    }
    setLoading(false)
  }

  // Delete customer
  const handelDelete = async () => {
    if (!selectedCustomer) return
    try {
      setLoading(true)
      const response = await axios.delete(`${VITE_API_BASE_KEY}/customers/register/delete?phone=${selectedCustomer.phone}`, {
        headers: header
      })
      if (response.data) {
        setSuccess('Customer deleted successfully!')
        setShowDeleteConfirm(false)
        setSelectedCustomer(null)
        fetchCustomers()
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Delete failed')
    }
    setLoading(false)
  }

  // Open edit modal with pre-filled data
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

  // Open delete confirmation
  const openDeleteConfirm = (customer) => {
    setSelectedCustomer(customer)
    setShowDeleteConfirm(true)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  return (
    <>
      <div className={`min-h-screen ${showRegisterModal || showEditModal || showDeleteConfirm ? 'blur-[2px] pointer-events-none' : ''}`}>

        <div className='space-y-5'>
          {/* Header */}
          <div className='flex justify-between items-center'>
            <div className='space-y-1'>
              <h1>Customers</h1>
              <p className='text-muted-foreground'>Manage your customer registrations</p>
            </div>
            <div>
              <button
                onClick={() => { resetForm(); setShowRegisterModal(true) }}
                className='p-2 px-4 bg-amber-400/80 rounded-[5px] flex items-center gap-2'
              >
                <Plus className='h-4 w-4' />
                Register Customer
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-2xl text-center'>
              {success}
            </div>
          )}

          {/* Search Bar */}
          <div className='relative bg-secondary/50 p-5 rounded-2xl'>
            <Search className='absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5' />
            <input
              className='w-full border border-border/50 pl-10 rounded-2xl bg-input/90 p-2 pr-24'
              type='text'
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handelSearch()}
              placeholder='Search by phone number..'
            />
            <button
              onClick={handelSearch}
              className='absolute right-8 top-1/2 -translate-y-1/2 bg-amber-400/80 px-4 py-1 rounded-[8px] text-sm'
            >
              Search
            </button>
          </div>

          {/* Stats */}
          <div className='flex items-center gap-3'>
            <div className='backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl p-4 flex items-center gap-3'>
              <Users className='h-5 w-5 text-amber-400' />
              <div>
                <p className='text-muted-foreground text-sm'>Total Customers</p>
                <h3>{customers.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className='text-center py-10'>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        )}

        {/* Error */}
        {error && !showRegisterModal && !showEditModal && (
          <div className='text-destructive text-center py-3'>
            {error}
          </div>
        )}

        {/* Customer Cards */}
        {!loading && customers.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6'>
            {customers.map((customer, index) => (
              <div key={customer._id || index} className='backdrop-blur-md bg-card/40 border border-border/50 p-5 rounded-2xl space-y-4'>
                <div className='flex justify-between items-start'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-amber-400/20 flex items-center justify-center'>
                      <User className='h-5 w-5 text-amber-400' />
                    </div>
                    <div>
                      <h3>{customer.name}</h3>
                      <p className='text-muted-foreground text-sm'>S/O {customer.father_name}</p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => openEditModal(customer)}
                      className='p-2 hover:bg-amber-400/20 rounded-xl transition-all'
                    >
                      <Edit className='h-4 w-4 text-amber-400' />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(customer)}
                      className='p-2 hover:bg-red-400/20 rounded-xl transition-all'
                    >
                      <Trash2 className='h-4 w-4 text-red-400' />
                    </button>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-muted-foreground' />
                    <p className='text-sm'>+91 {customer.phone}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <p className='text-sm'>{customer.email}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <p className='text-sm'>{customer.address}</p>
                  </div>
                </div>

                <div className='flex gap-5 pt-2 border-t border-border/30'>
                  <span className='text-muted-foreground text-xs'>Registered: {new Date(customer.createdAt).toISOString().split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No customers */}
        {!loading && customers.length === 0 && !error && (
          <div className='text-center py-20'>
            <Users className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <h2 className='text-muted-foreground'>No customers found</h2>
            <p className='text-muted-foreground text-sm'>Register your first customer to get started</p>
          </div>
        )}

      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-card max-w-lg w-full mx-4 space-y-4 p-6 rounded-2xl border border-border/50'>
            <div className='flex justify-between items-center'>
              <h2>Register New Customer</h2>
              <button onClick={() => { setShowRegisterModal(false); resetForm() }}>
                <X className='h-5 w-5' />
              </button>
            </div>

            {error && <div className='text-destructive text-sm'>{error}</div>}

            <form onSubmit={handelRegister} className='space-y-3'>
              <div className='space-y-1'>
                <label htmlFor='regName'>Customer Name</label>
                <input
                  type='text'
                  id='regName'
                  name='name'
                  value={formData.name}
                  onChange={handelChange}
                  placeholder='Enter full name'
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='regFather'>Father's Name</label>
                <input
                  type='text'
                  id='regFather'
                  name='father_name'
                  value={formData.father_name}
                  onChange={handelChange}
                  placeholder="Enter father's name"
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='regPhone'>Phone Number</label>
                <input
                  type='text'
                  id='regPhone'
                  name='phone'
                  value={formData.phone}
                  onChange={handelChange}
                  placeholder='10-digit phone number'
                  maxLength={10}
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='regEmail'>Email</label>
                <input
                  type='email'
                  id='regEmail'
                  name='email'
                  value={formData.email}
                  onChange={handelChange}
                  placeholder='customer@email.com'
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='regAddress'>Address</label>
                <input
                  type='text'
                  id='regAddress'
                  name='address'
                  value={formData.address}
                  onChange={handelChange}
                  placeholder='Full address'
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  type='submit'
                  className='flex-1 p-2 rounded-[8px] bg-[#eab71eec] cursor-pointer'
                >
                  {loading ? 'Registering...' : 'Register Customer'}
                </button>
                <button
                  type='button'
                  onClick={() => { setShowRegisterModal(false); resetForm() }}
                  className='flex-1 p-2 rounded-[8px] bg-secondary cursor-pointer'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-card max-w-lg w-full mx-4 space-y-4 p-6 rounded-2xl border border-border/50'>
            <div className='flex justify-between items-center'>
              <h2>Update Customer</h2>
              <button onClick={() => { setShowEditModal(false); resetForm() }}>
                <X className='h-5 w-5' />
              </button>
            </div>

            {error && <div className='text-red-500 text-sm'>{error}</div>}

            <form onSubmit={handelUpdate} className='space-y-3'>
              <div className='space-y-1'>
                <label htmlFor='editName'>Customer Name</label>
                <input
                  type='text'
                  id='editName'
                  name='name'
                  value={formData.name}
                  onChange={handelChange}
                  placeholder='Enter full name'
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='editFather'>Father's Name</label>
                <input
                  type='text'
                  id='editFather'
                  name='father_name'
                  value={formData.father_name}
                  onChange={handelChange}
                  placeholder="Enter father's name"
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='editPhone'>Phone Number</label>
                <input
                  type='text'
                  id='editPhone'
                  name='phone'
                  value={formData.phone}
                  onChange={handelChange}
                  placeholder='10-digit phone number'
                  maxLength={10}
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  disabled
                />
                <p className='text-xs text-muted-foreground'>Phone number cannot be changed</p>
              </div>
              <div className='space-y-1'>
                <label htmlFor='editEmail'>Email</label>
                <input
                  type='email'
                  id='editEmail'
                  name='email'
                  value={formData.email}
                  onChange={handelChange}
                  placeholder='customer@email.com'
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='space-y-1'>
                <label htmlFor='editAddress'>Address</label>
                <input
                  type='text'
                  id='editAddress'
                  name='address'
                  value={formData.address}
                  onChange={handelChange}
                  placeholder='Full address'
                  className='p-2 rounded-[8px] w-full bg-input/90 backdrop-blur-sm border border-border/80 focus:border-[#513b01] transition-all'
                  required
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  type='submit'
                  className='flex-1 p-2 rounded-[8px] bg-[#eab71eec] cursor-pointer'
                >
                  {loading ? 'Updating...' : 'Update Customer'}
                </button>
                <button
                  type='button'
                  onClick={() => { setShowEditModal(false); resetForm() }}
                  className='flex-1 p-2 rounded-[8px] bg-secondary cursor-pointer'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedCustomer && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-card max-w-md w-full mx-4 space-y-4 p-6 rounded-2xl border border-border/50'>
            <div className='flex justify-between items-center'>
              <h2>Delete Customer</h2>
              <button onClick={() => setShowDeleteConfirm(false)}>
                <X className='h-5 w-5' />
              </button>
            </div>
            <div className='bg-red-500/10 border border-red-500/30 p-4 rounded-xl'>
              <p className='text-sm'>Are you sure you want to delete <strong>{selectedCustomer.name}</strong> (+91 {selectedCustomer.phone})?</p>
              <p className='text-xs text-muted-foreground mt-2'>This action cannot be undone.</p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={handelDelete}
                className='flex-1 p-2 rounded-[8px] bg-red-600 cursor-pointer'
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='flex-1 p-2 rounded-[8px] bg-secondary cursor-pointer'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { Customers }