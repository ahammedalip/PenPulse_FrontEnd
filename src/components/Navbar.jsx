import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaBars, FaTimes } from "react-icons/fa";
import { FaCircleNodes } from "react-icons/fa6";
import { clearAdminDetails } from '../features/adminSlice';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Fix import for jwtDecode
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css'
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const adminToken = Cookies.get('authToken');
  const userToken = Cookies.get('userAuthToken')
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigate based on role if token exists
  // if (token) {
  //   try {
  //     const decodedToken = jwtDecode(token);
  //     if (decodedToken.role === 'Admin') {
  //       navigate('/admin/dash');
  //     } else {
  //       navigate('/home');
  //     }
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //   }
  // }


  const handleLogout = () => {
    dispatch(clearAdminDetails());
    Cookies.remove('authToken');
    toast.success('Logged Out successfully')
    navigate('/admin/login');
  };
  const handleUserLogout = () => {
    dispatch(clearAdminDetails());
    Cookies.remove('userAuthToken');
    localStorage.removeItem('name')
    toast.success('Logged Out successfully')
    navigate('/user/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-purpleGray text-lightCream p-4 shadow-md fixed w-full ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-extralight flex items-center">
          <FaCircleNodes className="mr-2" />
          PenPulse
        </div>

        {/* Hamburger Icon for small screens */}
        <button className="md:hidden text-lightCream" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
        </button>

        {/* Menu items */}
        <ul
          className={`md:flex md:space-x-6 md:items-center 
                      ${menuOpen ? 'block' : 'hidden'} 
                      md:static md:right-0 md:bg-transparent 
                      absolute top-16 left-0 w-full bg-purpleGray 
                      md:flex-row md:justify-end md:w-auto`}>
          {adminToken ? (
            <>
              <li className="p-4">
                <NavLink to='/users' className="navbar-link" activeClassName="active">Users</NavLink>
              </li>
              <li className="p-4">
                <NavLink to='/admin/category' className='navbar-link' activeClassName="active">Category</NavLink>
              </li>
              <li className="p-4">
                <button onClick={handleLogout} className="navbar-link">Logout</button>
              </li>
            </>
          ) : userToken ? (
            <>

              <NavLink to="/user/home" className="navbar-link" activeClassName="active">Home</NavLink>


              <NavLink to="/user/settings" activeClassName="active" className="navbar-link">Settings</NavLink>

              <NavLink to="/user/articles" activeClassName="active" className="navbar-link">Articles List</NavLink>


              <NavLink to="/user/create-article" activeClassName="active" className="navbar-link">New Article</NavLink>

              <button onClick={handleUserLogout} className="navbar-link border rounded-md border-red-300 px-3">
                Logout ({localStorage.getItem('name')})
              </button>

            </>
          ) : (
            <>

              <li className="p-4">
                <Link to="/user/login" className="navbar-link">Login</Link>
              </li>
              <li className="p-4">
                <Link to="/user/signup" className="navbar-link">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;