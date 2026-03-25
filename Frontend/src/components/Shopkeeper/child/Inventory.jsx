import React, { useState, useEffect, useMemo } from 'react'
import {
   Search, Plus, X, Package, Layers, AlertTriangle, Edit, Trash2, Tag, Calendar
} from 'lucide-react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

const METAL_OPTIONS = ['gold', 'silver', 'diamond', 'platinum', 'other']

const Inventory = () => {
   const header = getAuthHeaders()

   // ─── App State ────────────────────────────────────────────────────────────
   const [inventory, setInventory] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [success, setSuccess] = useState('')

   // ─── Predefined Settings ──────────────────────────────────────────────────
   const [predefinedItemNames, setPredefinedItemNames] = useState([])

   // ─── Dashboard & Filters ──────────────────────────────────────────────────
   const [searchQuery, setSearchQuery] = useState('')
   const [metalFilter, setMetalFilter] = useState('all')

   // ─── Modals ───────────────────────────────────────────────────────────────
   const [showModal, setShowModal] = useState(false)
   const [isEditing, setIsEditing] = useState(false)

   // ─── Form Data ────────────────────────────────────────────────────────────
   const initialFormState = {
      _id: '',
      jewelleryType: '',
      metalType: 'gold',
      quantity: '',
      totalWeight: ''
   }
   const [formData, setFormData] = useState(initialFormState)

   // ─── API: Fetch Inventory ─────────────────────────────────────────────────
   const fetchInventory = async () => {
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/shops/inventory/me`, { headers: header })
         if (res.data?.allInventorys) {
            setInventory(res.data.allInventorys)
         }
      } catch (err) {
         console.error(err)
         setError('Failed to fetch inventory')
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
      fetchInventory()
      fetchProfileSettings()
   }, [])

   useEffect(() => {
      if (success || error) {
         const t = setTimeout(() => { setSuccess(''); setError('') }, 5000)
         return () => clearTimeout(t)
      }
   }, [success, error])

   // ─── Derived Data ─────────────────────────────────────────────────────────
   const filteredInventory = useMemo(() => {
      let list = inventory
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase()
         list = list.filter(item =>
            item.jewelleryType?.toLowerCase().includes(q) ||
            item.metalType?.toLowerCase().includes(q)
         )
      }
      if (metalFilter !== 'all') {
         list = list.filter(item => item.metalType === metalFilter)
      }
      return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
   }, [inventory, searchQuery, metalFilter])

   // Dashboard Metrics
   const totalItems = inventory.length
   const totalQuantity = inventory.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
   const uniqueCategories = new Set(inventory.map(item => item.metalType)).size
   const lowStockItems = inventory.filter(item => (Number(item.quantity) || 0) < 5)

   // ─── Handlers ─────────────────────────────────────────────────────────────
   const handleOpenAddModal = () => {
      setFormData(initialFormState)
      setIsEditing(false)
      setShowModal(true)
   }

   const handleOpenEditModal = (item) => {
      setFormData({
         _id: item._id,
         jewelleryType: item.jewelleryType,
         metalType: item.metalType,
         quantity: item.quantity,
         totalWeight: item.totalWeight
      })
      setIsEditing(true)
      setShowModal(true)
   }

   const handleSave = async (e) => {
      e.preventDefault()
      if (!formData.jewelleryType || !formData.quantity || !formData.totalWeight) {
         return setError('Please fill in all required fields')
      }

      setLoading(true)
      try {
         const payload = {
            jewelleryType: formData.jewelleryType,
            metalType: formData.metalType,
            quantity: Number(formData.quantity),
            totalWeight: Number(formData.totalWeight)
         }

         if (isEditing) {
            await axios.patch(
               `${VITE_API_BASE_KEY}/shops/inventory/update?inventory_id=${formData._id}`,
               payload,
               { headers: header }
            )
            setSuccess('Item updated successfully!')
         } else {
            await axios.post(
               `${VITE_API_BASE_KEY}/shops/inventory/create`,
               payload,
               { headers: header }
            )
            setSuccess('Item added successfully!')
         }
         setShowModal(false)
         fetchInventory()
      } catch (err) {
         setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} item`)
      }
      setLoading(false)
   }

   const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this item?')) return
      setLoading(true)
      try {
         await axios.delete(
            `${VITE_API_BASE_KEY}/shops/inventory/delete?inventory_id=${id}`,
            { headers: header }
         )
         setSuccess('Item deleted successfully!')
         fetchInventory()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to delete item')
      }
      setLoading(false)
   }

   // ─── Helpers ──────────────────────────────────────────────────────────────
   const formatDate = (dateStr) => {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
   }

   return (
      <>
         <div className={`space-y-6 min-h-screen ${showModal ? 'blur-[2px] pointer-events-none' : ''}`}>
            {/* ─── Header ────────────────────────────────────────────────────────── */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
               <div>
                  <h1>Inventory Management</h1>
                  <p className='text-muted-foreground'>Track live stock, metals, and quantities</p>
               </div>
               <button
                  onClick={handleOpenAddModal}
                  className='p-2 px-4 bg-amber-400/80 text-black rounded-[8px] flex items-center gap-2 hover:bg-amber-400 font-medium'
               >
                  <Plus className='h-4 w-4' /> New Item
               </button>
            </div>

            {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
            {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

            {/* ─── Dashboard Metrics ─────────────────────────────────────────────── */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
               <div className='bg-card/40 border border-border/50 p-5 rounded-[8px] flex items-center gap-4'>
                  <div className='h-12 w-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500 shrink-0'>
                     <Package className='w-6 h-6' />
                  </div>
                  <div>
                     <h3 className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>Total Items</h3>
                     <div className='flex items-baseline gap-2'>
                        <span className='text-2xl font-bold'>{totalItems}</span>
                        <span className='text-xs text-muted-foreground'>({totalQuantity} total qty)</span>
                     </div>
                  </div>
               </div>

               <div className='bg-card/40 border border-border/50 p-5 rounded-[8px] flex items-center gap-4'>
                  <div className='h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0'>
                     <Layers className='w-6 h-6' />
                  </div>
                  <div>
                     <h3 className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>Metals / Categories</h3>
                     <p className='text-2xl font-bold'>{uniqueCategories}</p>
                  </div>
               </div>

               <div className={`bg-card/40 border border-border/50 p-5 rounded-[8px] flex items-center gap-4 ${lowStockItems.length > 0 ? 'border-red-500/30 bg-red-500/5' : ''}`}>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${lowStockItems.length > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                     <AlertTriangle className='w-6 h-6' />
                  </div>
                  <div>
                     <h3 className='text-muted-foreground text-sm font-semibold uppercase tracking-wider'>Low Stock Alerts</h3>
                     <div className='flex items-baseline gap-2'>
                        <span className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-red-500' : ''}`}>{lowStockItems.length}</span>
                        <span className='text-xs text-muted-foreground'>items &lt; 5 qty</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* ─── Search & Filters ──────────────────────────────────────────────── */}
            <div className='flex flex-col md:flex-row justify-between gap-4 bg-secondary/30 p-4 rounded border border-border/50'>
               <div className='relative w-full md:max-w-md flex items-center bg-card rounded-[8px] border border-border/50'>
                  <Search className='absolute left-3 text-muted-foreground w-4 h-4' />
                  <input
                     className='w-full bg-transparent border-none pl-9 pr-4 py-2 text-sm outline-none'
                     type='text'
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder='Search inventory...'
                  />
               </div>

               <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
                  <button onClick={() => setMetalFilter('all')} className={`px-4 py-1.5 rounded-[6px] text-sm whitespace-nowrap transition-colors ${metalFilter === 'all' ? 'bg-amber-400 text-black font-medium' : 'bg-card border border-border hover:bg-secondary'}`}>
                     All Metals
                  </button>
                  {METAL_OPTIONS.map(m => (
                     <button key={m} onClick={() => setMetalFilter(m)} className={`px-4 py-1.5 rounded-[6px] text-sm whitespace-nowrap transition-colors capitalize ${metalFilter === m ? 'bg-amber-400 text-black font-medium' : 'bg-card border border-border hover:bg-secondary'}`}>
                        {m}
                     </button>
                  ))}
               </div>
            </div>

            {/* ─── Inventory Table ───────────────────────────────────────────────── */}
            <div className='bg-card/40 rounded border border-border/50 overflow-hidden overflow-x-auto'>
               <table className='w-full text-left text-sm'>
                  <thead className='bg-secondary/50 text-muted-foreground uppercase text-xs'>
                     <tr>
                        <th className='p-4 font-semibold'>Item Name</th>
                        <th className='p-4 font-semibold'>Category / Metal</th>
                        <th className='p-4 font-semibold'>Quantity</th>
                        <th className='p-4 font-semibold'>Total Weight</th>
                        <th className='p-4 font-semibold'>Last Updated</th>
                        <th className='p-4 font-semibold text-right'>Actions</th>
                     </tr>
                  </thead>
                  <tbody className='divide-y divide-border/50'>
                     {loading ? (
                        <tr><td colSpan='6' className='p-8 text-center text-muted-foreground'>Loading inventory...</td></tr>
                     ) : filteredInventory.length === 0 ? (
                        <tr>
                           <td colSpan='6' className='p-12 text-center text-muted-foreground'>
                              <Package className='w-12 h-12 mx-auto mb-3 opacity-30' />
                              <p>No items found.</p>
                           </td>
                        </tr>
                     ) : (
                        filteredInventory.map(item => {
                           const isLowStock = item.quantity < 5
                           return (
                              <tr key={item._id} className='hover:bg-secondary/20 transition-colors'>
                                 <td className='p-4 font-medium'>
                                    <div className='flex items-center gap-2'>
                                       {item.jewelleryType}
                                    </div>
                                 </td>
                                 <td className='p-4'>
                                    <span className='capitalize inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-xs border border-border/50'>
                                       <Tag className='w-3 h-3 text-amber-500' />
                                       {item.metalType}
                                    </span>
                                 </td>
                                 <td className='p-4'>
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${isLowStock ? 'bg-red-500/20 text-red-500 font-bold border border-red-500/20' : ''}`}>
                                       {isLowStock && <AlertTriangle className='w-3 h-3' />}
                                       {item.quantity} units
                                    </span>
                                 </td>
                                 <td className='p-4'>{item.totalWeight}g</td>
                                 <td className='p-4 text-muted-foreground flex items-center gap-1.5'>
                                    <Calendar className='w-3.5 h-3.5' /> {formatDate(item.updatedAt)}
                                 </td>
                                 <td className='p-4'>
                                    <div className='flex items-center justify-end gap-3'>
                                       <button
                                          onClick={() => handleOpenEditModal(item)}
                                          className='text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-400/10 rounded transition-colors'
                                          title="Edit Item"
                                       >
                                          <Edit className='w-4 h-4' />
                                       </button>
                                       <button
                                          onClick={() => handleDelete(item._id)}
                                          className='text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded transition-colors'
                                          title="Delete Item"
                                       >
                                          <Trash2 className='w-4 h-4' />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           )
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* ─── Add/Edit Modal ────────────────────────────────────────────────── */}
         {showModal && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
               <div className='bg-card w-full max-w-lg p-6 rounded-2xl border border-border/50 shadow-2xl'>
                  <div className='flex justify-between items-center mb-6'>
                     <h2 className='text-xl font-bold flex items-center gap-2'>
                        <Package className='w-5 h-5 text-amber-500' />
                        {isEditing ? 'Edit Inventory Item' : 'Add New Item'}
                     </h2>
                     <button onClick={() => setShowModal(false)} className='hover:bg-secondary p-1.5 rounded-full transition-colors'><X className='w-5 h-5' /></button>
                  </div>

                  <form onSubmit={handleSave} className='space-y-4'>
                     <div>
                        <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Item Name <span className='text-red-500'>*</span></label>
                        <input
                           type='text'
                           list='predefined-items'
                           required
                           placeholder='e.g. Gold Necklace, Silver Ring'
                           value={formData.jewelleryType}
                           onChange={e => setFormData({ ...formData, jewelleryType: e.target.value })}
                           className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50'
                        />
                     </div>

                     <div>
                        <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Category / Metal <span className='text-red-500'>*</span></label>
                        <select
                           value={formData.metalType}
                           onChange={e => setFormData({ ...formData, metalType: e.target.value })}
                           className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50 capitalize'
                        >
                           {METAL_OPTIONS.map(m => (
                              <option key={m} value={m}>{m}</option>
                           ))}
                        </select>
                     </div>

                     <div className='grid grid-cols-2 gap-4'>
                        <div>
                           <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Quantity <span className='text-red-500'>*</span></label>
                           <input
                              type='number'
                              min="1"
                              required
                              placeholder='0'
                              value={formData.quantity}
                              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                              className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50'
                           />
                        </div>
                        <div>
                           <label className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Total Weight (g) <span className='text-red-500'>*</span></label>
                           <input
                              type='number'
                              step="0.01"
                              min="0"
                              required
                              placeholder='0.00'
                              value={formData.totalWeight}
                              onChange={e => setFormData({ ...formData, totalWeight: e.target.value })}
                              className='w-full p-3 rounded-[8px] bg-input border border-border outline-none focus:border-amber-400/50'
                           />
                        </div>
                     </div>

                     <div className='pt-4 flex gap-3'>
                        <button
                           type='button'
                           onClick={() => setShowModal(false)}
                           className='flex-1 p-3 bg-secondary hover:bg-secondary/80 font-bold rounded-[8px] transition-colors'
                        >
                           Cancel
                        </button>
                        <button
                           type='submit'
                           disabled={loading}
                           className='flex-1 p-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-[8px] disabled:opacity-50 transition-colors'
                        >
                           {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Item')}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
         {/* Datalist for custom settings */}
         <datalist id="predefined-items">
            {predefinedItemNames.map((name, idx) => <option key={idx} value={name} />)}
         </datalist>
      </>
   )
}

export { Inventory }