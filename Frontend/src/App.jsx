import { useState } from 'react'
import { Landing } from './components/Landing'
import Signup from './components/Auth/Signup'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Auth/Login'
import { AdminLogin } from './components/Admin/AdminLogin'
import { DashboardLayout } from './components/Shopkeeper/DashboardLayout'
import { Inventory } from './components/Shopkeeper/child/Inventory'
import { Orders } from './components/Shopkeeper/child/Orders'
import { Bills } from './components/Shopkeeper/child/Bills'
import { Colletral } from './components/Shopkeeper/child/Colletral'
import { Customers } from './components/Shopkeeper/child/Customers'
import { Report } from './components/Shopkeeper/child/Report'
import { Settings } from './components/Shopkeeper/child/Settings'
import { Dashboard } from './components/Shopkeeper/child/Dashboard'



function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<AdminLogin />} />


        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<Inventory />} />
          <Route path='inventory' element={<Inventory />} />
          <Route path='orders' element={<Orders />} />
          <Route path='bills' element={<Bills />} />
          <Route path='colletral' element={<Colletral />} />
          <Route path='customers' element={<Customers />} />
          <Route path='reports' element={<Report />} />
          <Route path='settings' element={<Settings />} />
          <Route path='dashboard' element={<Dashboard />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
