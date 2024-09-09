import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../pages/AdminPages/AdminLogin.jsx'
import AdminPrivateRoute from './AdminPrivateRoute'
import Dash from '../components/admin/Dash'
import Category from '../pages/AdminPages/Category'
import '../App.css'

export default function AdminRoutes() {
  return (
   <>
   <Routes> 
    <Route path='/login' element={<AdminLogin/>}/>
    <Route element={<AdminPrivateRoute/>}>
    <Route path='/dash' element={<Dash/>}/>
    <Route path='/category' element={<Category/>}/>
    </Route>
   </Routes>
   </>
  )
}
