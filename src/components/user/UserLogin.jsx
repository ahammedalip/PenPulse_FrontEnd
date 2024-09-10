import React, { useState } from 'react';
import axiosInstance from '../../axios/api'; // Adjust the import based on your setup
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../features/userSlice';

export default function UserLogin() {
    const [loginData, setLoginData] = useState({
        emailOrMobile: '',
        password: ''
    });

    const navigate =useNavigate()
    const dispatch = useDispatch()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const { emailOrMobile, password } = loginData;

        // Basic validation
        if (!emailOrMobile || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const res = await axiosInstance.post('/user/login', {
                emailOrMobile,
                password
            });
            if (res.data.success) {
                toast.success('Login successful!');
                Cookies.set('userAuthToken', res.data.token)
                const decodedToken = jwtDecode(res.data.token)
                // console.log('decoded token is ',decodedToken);

                // dispatch user details to store
                dispatch(setUserDetails({
                    id: decodedToken.id,
                    name: decodedToken.name,
                    role: decodedToken.role
                }));
                localStorage.setItem('name', decodedToken.name)

                navigate('/user/home')
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            toast.error('Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center pt-10">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-center text-lightCream mb-6">
                    User Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="emailOrMobile"
                            value={loginData.emailOrMobile}
                            onChange={handleInputChange}
                            placeholder="Email or Mobile"
                            className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-mutedPurple text-lightCream py-3 px-4 rounded-md hover:bg-darkGray transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
