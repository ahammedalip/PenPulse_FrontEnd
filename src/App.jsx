import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Login from './components/admin/login'
import AdminRoutes from './routes/adminRoutes'

export default function App() {
  return (
    <BrowserRouter>
      

        <Navbar />
        <div className="min-h-screen pt-20 text-lightCream justify-center bg-darkGray">
          <Routes>
            <Route path='/admin/*' element={<AdminRoutes />} />
          </Routes>
        </div>
    </BrowserRouter>
  )
}
