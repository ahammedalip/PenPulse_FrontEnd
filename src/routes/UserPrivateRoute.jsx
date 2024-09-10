import { Navigate, Outlet } from "react-router-dom"
import Cookies from 'js-cookie';

export function UserPrivateRoute() {
    const token = Cookies.get('userAuthToken')

    return token ? <Outlet /> : <Navigate to='/user/login' />
}