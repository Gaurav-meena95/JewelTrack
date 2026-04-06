import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { VITE_API_BASE_KEY, getAuthHeaders } from '../../../utils/apiConfig'

// Shared Utils
import SectionHeader from '../../../utils/SectionHeader'
import SearchBar from '../../../utils/SearchBar'

// Sub-components
import InventoryMetrics from './components/InventoryMetrics'
import InventoryTable from './components/InventoryTable'
import InventoryFormModal from './components/InventoryFormModal'

const METAL_OPTIONS = ['gold', 'silver', 'diamond', 'platinum', 'other']

const Inventory = () => {
   const header = getAuthHeaders()

   // App State
   const [inventory, setInventory] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [success, setSuccess] = useState('')

   // Predefined Settings
   const [predefinedItemNames, setPredefinedItemNames] = useState([])

   // Dashboard & Filters
   const [searchQuery, setSearchQuery] = useState('')
   const [metalFilter, setMetalFilter] = useState('all')

   // Modals
   const [showModal, setShowModal] = useState(false)
   const [isEditing, setIsEditing] = useState(false)

   // Form Data
   const initialFormState = {
      _id: '',
      jewelleryType: '',
      metalType: 'gold',
      quantity: '',
      totalWeight: ''
   }
   const [formData, setFormData] = useState(initialFormState)

   // API Actions ---
   const fetchInventory = async () => {
      try {
         setLoading(true)
         const res = await axios.get(`${VITE_API_BASE_KEY}/shops/inventory/me`, { headers: header })
         if (res.data?.data?.allInventorys) {
            setInventory(res.data.data.allInventorys)
         }
      } catch (err) {
         setError('Failed to fetch inventory')
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
      fetchInventory()
      fetchProfileSettings()
   }, [])

   useEffect(() => {
      if (success || error) {
         const t = setTimeout(() => { setSuccess(''); setError('') }, 5000)
         return () => clearTimeout(t)
      }
   }, [success, error])

   // Derived Data ---
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

   const metrics = useMemo(() => ({
      totalItems: inventory.length,
      totalQuantity: inventory.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
      uniqueCategories: new Set(inventory.map(item => item.metalType)).size,
      lowStockItemsCount: inventory.filter(item => (Number(item.quantity) || 0) < 5).length
   }), [inventory])

   // Event Handlers ---
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
            await axios.patch(`${VITE_API_BASE_KEY}/shops/inventory/update?inventory_id=${formData._id}`, payload, { headers: header })
            setSuccess('Item updated successfully!')
         } else {
            try {
               const res = await axios.post(`${VITE_API_BASE_KEY}/shops/inventory/create`, payload, { headers: header })
               setSuccess(res.data?.message || 'Item created successfully')
            } catch (error) {
               setError(error.response?.data?.message || 'Failed to create item')
               console.log('Error creating inventory item:', error)
            }
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
         await axios.delete(`${VITE_API_BASE_KEY}/shops/inventory/delete?inventory_id=${id}`, { headers: header })
         setSuccess('Item deleted successfully!')
         fetchInventory()
      } catch (err) {
         setError(err.response?.data?.message || 'Failed to delete item')
      }
      setLoading(false)
   }

   const formatDate = (dateStr) => {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
   }

   const hasBlur = showModal

   return (
      <>
         <div className={`space-y-6 min-h-screen ${hasBlur ? 'blur-[2px] pointer-events-none' : ''}`}>
            
            <SectionHeader 
               title="Inventory Management" 
               subtitle="Track live stock, metals, and quantities"
               buttonText="New Item"
               onButtonClick={handleOpenAddModal}
               className="bg-linear-to-r from-secondary/50 to-transparent p-6 rounded-2xl border border-border/50"
               titleClassName="text-3xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            />

            {success && <div className='bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 p-3 rounded-[8px] text-center'>{success}</div>}
            {error && <div className='bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-[8px] text-center'>{error}</div>}

            <InventoryMetrics {...metrics} />

            <div className='flex flex-col md:flex-row justify-between gap-4 bg-secondary/30 p-4 rounded border border-border/50'>
               <div className='w-full md:max-w-md'>
                  <SearchBar 
                     value={searchQuery} 
                     onChange={(e) => setSearchQuery(e.target.value)} 
                     placeholder="Search inventory by item or metal..." 
                  />
               </div>

               <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
                  <button 
                     onClick={() => setMetalFilter('all')} 
                     className={`px-4 py-1.5 rounded-[6px] text-sm whitespace-nowrap transition-all border ${metalFilter === 'all' ? 'bg-amber-400 text-black font-bold border-amber-400' : 'bg-card border-border/50 hover:border-amber-400/30'}`}
                  >
                     All Metals
                  </button>
                  {METAL_OPTIONS.map(m => (
                     <button 
                        key={m} 
                        onClick={() => setMetalFilter(m)} 
                        className={`px-4 py-1.5 rounded-[6px] text-sm whitespace-nowrap transition-all border capitalize ${metalFilter === m ? 'bg-amber-400 text-black font-bold border-amber-400' : 'bg-card border-border/50 hover:border-amber-400/30'}`}
                     >
                        {m}
                     </button>
                  ))}
               </div>
            </div>

            <InventoryTable 
               loading={loading}
               filteredInventory={filteredInventory}
               formatDate={formatDate}
               handleOpenEditModal={handleOpenEditModal}
               handleDelete={handleDelete}
            />
         </div>

         <InventoryFormModal 
            show={showModal}
            onClose={() => setShowModal(false)}
            isEditing={isEditing}
            formData={formData}
            setFormData={setFormData}
            predefinedItemNames={predefinedItemNames}
            METAL_OPTIONS={METAL_OPTIONS}
            handleSave={handleSave}
            loading={loading}
         />
      </>
   )
}

export { Inventory }