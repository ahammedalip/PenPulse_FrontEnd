import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserSignup from '../components/user/UserSignup'
import { UserPrivateRoute } from './UserPrivateRoute'
import UserLogin from '../components/user/UserLogin'
import Home from '../components/user/Home'
import CreateArticle from '../components/user/CreateArticle'
import Home1 from '../components/user/Home1'


export default function UserRoutes() {
  return (
    <>
    <Routes>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route element= {<UserPrivateRoute/>}>
            <Route path='/home' element={<Home/>}/>
            <Route path='/create-article' element={<CreateArticle/>}/>
        </Route>
    </Routes>
    </>
  )
}
