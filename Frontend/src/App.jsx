import { useState } from 'react'
import { Landing } from './components/Landing'
import Signup from './components/Auth/Signup'
import {Routes,Route} from 'react-router-dom'
import { Login } from './components/Auth/Login'
import { AdminLogin } from './components/Admin/AdminLogin'
import { DashboardLayout } from './components/Shopkeeper/DashboardLayout'



function App() {

  return (
    <>
    <Routes>
      {/* <Route path='/' element={<Landing/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/admin' element={<AdminLogin/>}/> */}
      <Route path='/dashboard' element={<DashboardLayout/>}/>
    </Routes>

    </>
  )
}

export default App
