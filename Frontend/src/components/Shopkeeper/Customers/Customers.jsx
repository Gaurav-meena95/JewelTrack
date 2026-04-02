import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, User, X, Eye, ArrowLeft } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'
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
        const customersArray = Array.isArray(data) ? data : [data]
        setCustomers(customersArray)
        setAllCustomers(customersArray)
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Failed to fetch customers')
    }
    setLoading(false)
  }

  // Live search effect on frontend instead of hitting backend every keystroke
  useEffect(() => {
    if (!searchPhone.trim()) {
      setCustomers(allCustomers)
    } else {
      const filtered = allCustomers.filter(c => String(c.phone).includes(searchPhone.trim()))
      setCustomers(filtered)
    }
  }, [searchPhone, allCustomers])

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

  // Fetch Customer Details
  const fetchCustomerDetail = async (id) => {
    try {
      setDetailsLoading(true)
      setSelectedCustomerDetail(null)
      const response = await axios.get(`${VITE_API_BASE_KEY}/customers/register/detail?id=${id}`, {
        headers: header
      })
      if (response.data) {
        setSelectedCustomerDetail(response.data)
        setActiveTab('bills')
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || 'Failed to fetch details')
      setSelectedCustomerDetail(null)
    }
    setDetailsLoading(false)
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

        {detailsLoading && !selectedCustomerDetail && (
          <div className='flex flex-col items-center justify-center py-40 space-y-4'>
            <div className='w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin'></div>
            <p className='text-muted-foreground'>Loading customer portfolio...</p>
          </div>
        )}

        {!detailsLoading && !selectedCustomerDetail ? (
          <>
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
                  className='w-full border border-border/50 pl-10 rounded-2xl bg-input/90 p-2 pr-4'
                  type='text'
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder='Live search by phone number...'
                />
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
                          onClick={() => fetchCustomerDetail(customer._id)}
                          className='p-2 hover:bg-blue-400/20 rounded-[8px] transition-all'
                          title='View Details'
                        >
                          <Eye className='h-4 w-4 text-blue-400' />
                        </button>
                        <button
                          onClick={() => openEditModal(customer)}
                          className='p-2 hover:bg-amber-400/20 rounded-[8px] transition-all'
                          title='Edit Customer'
                        >
                          <Edit className='h-4 w-4 text-amber-400' />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(customer)}
                          className='p-2 hover:bg-red-400/20 rounded-[8px] transition-all'
                          title='Delete Customer'
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
                <h2 className='text-muted-foreground'>
                  {searchPhone ? `No customer found with phone ${searchPhone}` : 'No customers found'}
                </h2>
                <p className='text-muted-foreground text-sm mb-4'>
                  {searchPhone ? 'Register them now to continue' : 'Register your first customer to get started'}
                </p>
                {searchPhone && (
                  <button
                    onClick={() => {
                      resetForm();
                      setFormData(prev => ({ ...prev, phone: searchPhone }));
                      setShowRegisterModal(true);
                    }}
                    className='p-2 px-4 bg-amber-400/80 rounded-[8px] inline-flex items-center gap-2 text-black'
                  >
                    <Plus className='h-4 w-4' />
                    Register New Customer
                  </button>
                )}
              </div>
            )}
          </>
        ) : !detailsLoading && selectedCustomerDetail ? (
          // ==================== NEW DETAIL FULL PAGE ====================
          <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10'>
            {/* Header / Back */}
            <div className='flex items-center gap-4 border-b border-border/50 pb-4'>
              <button
                onClick={() => setSelectedCustomerDetail(null)}
                className='p-2 hover:bg-secondary rounded transition-all'
              >
                <ArrowLeft className='h-5 w-5' />
              </button>
              <div>
                <h2>Customer Portfolio</h2>
                <p className='text-muted-foreground text-sm'>View complete details and transaction history</p>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-6 bg-gradient-to-br from-amber-400/10 to-transparent p-6 rounded-2xl border border-amber-400/20'>
              <div className='h-20 w-20 shadow-lg shadow-amber-400/20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0'>
                <User className='h-10 w-10 text-black' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Full Name</p>
                  <p className='font-semibold text-lg'>{selectedCustomerDetail.customer.name}</p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Father's Name</p>
                  <p className='font-semibold text-lg'>{selectedCustomerDetail.customer.father_name}</p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Contact Info</p>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-3 w-3 text-amber-500' />
                    <span className='font-medium'>+91 {selectedCustomerDetail.customer.phone}</span>
                  </div>
                  {selectedCustomerDetail.customer.email && (
                    <div className='flex items-center gap-2 mt-1'>
                      <Mail className='h-3 w-3 text-amber-500' />
                      <span className='text-sm text-muted-foreground truncate'>{selectedCustomerDetail.customer.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wider mb-1'>Registered Date</p>
                  <p className='font-medium'>{new Date(selectedCustomerDetail.customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Portfolio Summaries */}
            <h3 className='text-lg font-semibold mb-4 px-1 pt-4'>Portfolio Overview</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Bills Summary */}
              <div className='bg-secondary/30 border border-border/50 p-5 rounded-2xl hover:border-amber-400/50 transition-all group'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='font-semibold text-amber-400'>Total Bills</h3>
                  <span className='bg-amber-400/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold'>
                    {selectedCustomerDetail.bills.length} Records
                  </span>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg'>
                    <span className='text-sm text-muted-foreground'>Total Value</span>
                    <span className='font-semibold'>₹{selectedCustomerDetail.bills.reduce((sum, b) => sum + (b.invoice?.grandTotal || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg'>
                    <span className='text-sm text-muted-foreground'>Collected</span>
                    <span className='font-semibold text-green-500'>₹{selectedCustomerDetail.bills.reduce((sum, b) => sum + (b.payment?.amountPaid || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg border border-red-500/20'>
                    <span className='text-sm text-muted-foreground'>Pending</span>
                    <span className='font-semibold text-red-400'>₹{selectedCustomerDetail.bills.reduce((sum, b) => sum + (b.payment?.remainingAmount || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Orders Summary */}
              <div className='bg-secondary/30 border border-border/50 p-5 rounded-2xl hover:border-blue-400/50 transition-all group'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='font-semibold text-blue-400'>Active Orders</h3>
                  <span className='bg-blue-400/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold'>
                    {selectedCustomerDetail.orders.length} Records
                  </span>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg'>
                    <span className='text-sm text-muted-foreground'>Order Value</span>
                    <span className='font-semibold'>₹{selectedCustomerDetail.orders.reduce((sum, o) => sum + (o.Total || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg'>
                    <span className='text-sm text-muted-foreground'>Advance Paid</span>
                    <span className='font-semibold text-green-500'>₹{selectedCustomerDetail.orders.reduce((sum, o) => sum + (o.AdvancePayment || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg border border-red-500/20'>
                    <span className='text-sm text-muted-foreground'>Pending Balance</span>
                    <span className='font-semibold text-red-400'>₹{selectedCustomerDetail.orders.reduce((sum, o) => sum + (o.RemainingAmount || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Collateral Summary */}
              <div className='bg-secondary/30 border border-border/50 p-5 rounded-2xl hover:border-purple-400/50 transition-all group'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='font-semibold text-purple-400'>Collateral / Loan</h3>
                  <span className='bg-purple-400/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold'>
                    {selectedCustomerDetail.collaterals.length} Records
                  </span>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg'>
                    <span className='text-sm text-muted-foreground'>Total Loan Given</span>
                    <span className='font-semibold'>₹{selectedCustomerDetail.collaterals.reduce((sum, c) => sum + (c.price || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg'>
                    <span className='text-sm text-muted-foreground'>Interest/Recovered</span>
                    <span className='font-semibold text-green-500'>₹{selectedCustomerDetail.collaterals.reduce((sum, c) => sum + (c.totalPaid || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className='flex justify-between items-center bg-card/50 p-2 rounded-lg border border-red-500/20'>
                    <span className='text-sm text-muted-foreground'>Principle Due</span>
                    <span className='font-semibold text-red-400'>₹{selectedCustomerDetail.collaterals.reduce((sum, c) => sum + (c.remainingAmount || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Records Detailed Lists */}
            <div className='mt-8 pt-4 space-y-4'>
              <h3 className='text-lg font-semibold mb-2 px-1'>Detailed Records</h3>

              <div className='flex gap-2 border-b border-border/50 pb-0 overflow-x-auto'>
                <button
                  onClick={() => setActiveTab('bills')}
                  className={`px-4 py-3 rounded-t-lg transition-all whitespace-nowrap ${activeTab === 'bills' ? 'bg-amber-400/20 text-amber-500 border-b-2 border-amber-500 font-medium' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Bills History ({selectedCustomerDetail.bills.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-3 rounded-t-lg transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-400/20 text-blue-400 border-b-2 border-blue-400 font-medium' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Orders History ({selectedCustomerDetail.orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('collaterals')}
                  className={`px-4 py-3 rounded-t-lg transition-all whitespace-nowrap ${activeTab === 'collaterals' ? 'bg-purple-400/20 text-purple-400 border-b-2 border-purple-400 font-medium' : 'text-muted-foreground hover:bg-secondary/50'}`}
                >
                  Collaterals History ({selectedCustomerDetail.collaterals.length})
                </button>
              </div>

              {/* Lists Container */}
              <div className='bg-card/30 border border-border/50 rounded-2xl p-4 md:p-6 min-h-[300px]'>
                {/* Bills Tab */}
                {activeTab === 'bills' && (
                  <div className='space-y-4'>
                    {selectedCustomerDetail.bills.length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-10 opacity-60'>
                        <Search className='h-8 w-8 mb-2' />
                        <p>No bills found for this customer.</p>
                      </div>
                    ) : (
                      selectedCustomerDetail.bills.map((bill, i) => (
                        <div key={bill._id} className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-secondary/20 rounded border border-border/50 hover:border-amber-400/30 transition-all gap-5'>
                          <div className='space-y-1 w-full lg:w-1/4'>
                            <p className='font-semibold text-amber-500'>Bill #{i + 1}</p>
                            <p className='text-sm font-medium'>Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
                            <p className='text-xs text-muted-foreground'>{bill.invoice?.items?.length || 0} items purchased</p>
                          </div>
                          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm w-full lg:w-3/4'>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Total</p>
                              <p className='font-medium text-base'>₹{bill.invoice?.grandTotal?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Paid</p>
                              <p className='font-medium text-green-500 text-base'>₹{bill.payment?.amountPaid?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Pending</p>
                              <p className='font-medium text-red-400 text-base'>₹{bill.payment?.remainingAmount?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Status</p>
                              <p className='capitalize font-medium'>{bill.payment?.paymentStatus?.replace('_', ' ')}</p>
                              {bill.payment?.paymentMethod && <p className='text-xs text-muted-foreground'>{bill.payment.paymentMethod}</p>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className='space-y-4'>
                    {selectedCustomerDetail.orders.length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-10 opacity-60'>
                        <Search className='h-8 w-8 mb-2' />
                        <p>No active orders found.</p>
                      </div>
                    ) : (
                      selectedCustomerDetail.orders.map((order, i) => (
                        <div key={order._id} className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-secondary/20 rounded border border-border/50 hover:border-blue-400/30 transition-all gap-5'>
                          <div className='space-y-1 w-full lg:w-1/4'>
                            <p className='font-semibold text-blue-400'>Order #{i + 1}</p>
                            <p className='text-sm font-medium'>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className='text-xs text-muted-foreground'>Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm w-full lg:w-3/4'>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Total Estimate</p>
                              <p className='font-medium text-base'>₹{order.Total?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Advance</p>
                              <p className='font-medium text-green-500 text-base'>₹{order.AdvancePayment?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Pending</p>
                              <p className='font-medium text-red-400 text-base'>₹{order.RemainingAmount?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Status</p>
                              <p className='capitalize font-medium'>{order.paymentStatus?.replace('_', ' ')}</p>
                              <p className='text-xs text-muted-foreground'>P: {order.orderStatus}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Collaterals Tab */}
                {activeTab === 'collaterals' && (
                  <div className='space-y-4'>
                    {selectedCustomerDetail.collaterals.length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-10 opacity-60'>
                        <Search className='h-8 w-8 mb-2' />
                        <p>No collateral records found.</p>
                      </div>
                    ) : (
                      selectedCustomerDetail.collaterals.map((col, i) => (
                        <div key={col._id} className='flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-secondary/20 rounded border border-border/50 hover:border-purple-400/30 transition-all gap-5'>
                          <div className='space-y-1 w-full lg:w-1/4'>
                            <p className='font-semibold text-purple-400'>Loan #{i + 1}</p>
                            <p className='text-sm font-medium'>Date: {new Date(col.createdAt).toLocaleDateString()}</p>
                            <p className='text-xs text-muted-foreground truncate'>{col.jewellery} ({col.weight}g)</p>
                          </div>
                          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm w-full lg:w-3/4'>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Principal Loan</p>
                              <p className='font-medium text-base'>₹{col.price?.toLocaleString('en-IN')}</p>
                              <p className='text-xs text-muted-foreground'>Interest: {col.interestRate}%</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Paid</p>
                              <p className='font-medium text-green-500 text-base'>₹{col.totalPaid?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Pending</p>
                              <p className='font-medium text-red-400 text-base'>₹{col.remainingAmount?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className='bg-card/40 p-3 rounded-lg'>
                              <p className='text-muted-foreground text-xs uppercase mb-1'>Status</p>
                              <p className='capitalize font-medium flex items-center gap-1'>
                                <span className={`w-2 h-2 rounded-full ${col.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {col.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : null}

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
            <div className='bg-red-500/10 border border-red-500/30 p-4 rounded-[8px]'>
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