import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AdminRoutes from './routes/adminRoutes'
import { Toaster } from 'react-hot-toast'
import UserRoutes from './routes/UserRoute'

export default function App() {
  return (
    <BrowserRouter>


      <Navbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="min-h-screen pt-20 text-lightCream justify-center bg-darkGray">
        <Routes>
          <Route path='/admin/*' element={<AdminRoutes />} />
          <Route path='/user/*' element={<UserRoutes/>}/>
        </Routes>
      </div>

    </BrowserRouter>
  )
}
