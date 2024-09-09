import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PulseLoader from "react-spinners/PulseLoader";
import { jwtDecode } from 'jwt-decode';
import { setAdminDetails } from '../../features/adminSlice';
import { useDispatch } from 'react-redux';

const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { username, password };
        console.log('Login data:', loginData);
        setUsername('');
        setPassword('');

        try {
            setLoading(true)
            const res = await axiosInstance.post('/admin/login', loginData)
            console.log(res.data)
            const result = res.data
            if (result.success) {
                const token = result.token
                Cookies.set('authToken', token, { expires: 7 });

                const decodedToken = jwtDecode(token);
                console.log('decoded token is ', decodedToken)
                // const adminDetails = {
                //     username: decodedToken.username, 
                //     role: decodedToken.role,
                // };

                // Dispatch admin details to Redux
                dispatch(setAdminDetails({ username: decodedToken.username, role: decodedToken.role }));
          navigate('/admin/dash')
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setErrorMessage('Something went wrong')
            setLoading(false)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-darkGray">
            <div className="bg-purpleGray p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-lightCream text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-semibold text-lightCream mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => (setUsername(e.target.value), setErrorMessage(''))}
                            required
                            placeholder="Enter your username"
                            className="w-full p-3 border border-darkGray rounded-md bg-lightCream text-darkGray placeholder-darkGray"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-lightCream mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => (setPassword(e.target.value), setErrorMessage(''))}
                            required
                            placeholder="Enter your password"
                            className="w-full p-3 border border-darkGray rounded-md bg-lightCream text-darkGray placeholder-darkGray"
                        />
                    </div>
                    <button type="submit" className="w-full bg-mutedPurple text-lightCream py-3 rounded-md hover:bg-darkGray transition duration-300">
                        {loading ? <PulseLoader size={9} color='#F4EEE0' /> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;
