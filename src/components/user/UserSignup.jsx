import React, { useState } from 'react';
import axiosInstance from '../../axios/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        dob: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [signup, setSignup] = useState(true)
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [fetchCat, setFetchCat] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignup = async () => {
        const { name, email, mobile, password, confirmPassword, dob } = formData;

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!name || !email || !mobile || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const res = await axiosInstance.post('/user/signup', {
                name,
                email,
                mobile,
                dob,
                password
            });

            if (res.data.success) {
                toast.success('OTP sent to your email!');
                setSignup(false)
                setIsOtpSent(true);
            }
        } catch (error) {
            console.log(error);
            toast.error('Signup failed');
        }
    };

    const handleOtpVerification = async () => {
        try {
            const res = await axiosInstance.post('/user/verify-otp', {
                email: formData.email,
                otp
            });

            if (res.data.success) {
                toast.success('OTP verified! Please select your preferences.');
                setIsOtpSent(false);
                setFetchCat(true);
                fetchCategories();
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            toast.error('OTP verification failed');
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get('/admin/preference');
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategories(prevSelectedCategories =>
            prevSelectedCategories.includes(categoryId)
                ? prevSelectedCategories.filter(id => id !== categoryId)
                : [...prevSelectedCategories, categoryId]
        );
        console.log(selectedCategories);
    };

    const handleCompleteSignup = async () => {
        try {
            const res = await axiosInstance.post('/user/complete-signup', {
                email: formData.email,
                selectedCategories
            });

            if (res.data.success) {
                toast.success('Signup complete!, Please login');
                // Cookies.set('userAuthToken', res.data.token, {expires:7})
                navigate('/user/login')
                // setFormData({ name: '', email: '', mobile: '', dob: '', password: '', confirmPassword: '' });
                setSelectedCategories([]);
                setFetchCat(false);
            }
        } catch (error) {
            toast.error('Signup failed');
        }
    };

    return (
        <div className="flex items-center justify-center pt-10">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-center text-lightCream mb-6">
                    {isOtpSent ? (fetchCat ? 'Select Preferences' : 'Enter OTP') : 'Sign Up'}
                </h2>

                {signup ? (
                    <>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                placeholder="Mobile"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                placeholder="Date of Birth"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Re-enter Password"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <button
                            onClick={handleSignup}
                            className="w-full bg-mutedPurple text-lightCream py-3 px-4 rounded-md hover:bg-darkGray transition duration-300"
                        >
                            Sign Up
                        </button>
                    </>
                ) : null}
                {isOtpSent ? (
                    <>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="w-full p-3 text-darkGray bg-lightCream border border-gray-500 rounded-md"
                            />
                        </div>
                        <button
                            onClick={handleOtpVerification}
                            className="w-full bg-mutedPurple text-lightCream py-3 px-4 rounded-md hover:bg-darkGray transition duration-300"
                        >
                            Verify OTP
                        </button>
                    </>
                ) : null}
                {fetchCat ? (
                     <>
                     <div className="mb-4">
                         <h3 className="text-lg  text-lightCream mb-4">Select Your Preferences:</h3>
                         <div className="flex flex-wrap gap-2 items-center justify-center">
                             {categories.map(category => (
                                // <div className=' ustify-center'>

                                
                                 <div key={category._id} className="w-auto md:w-1/3 lg:w-1/4 px-2 p-2 mb-2 border bg-darkGray hover:bg-lightDarkGrey rounded-full">
                                     <label className="flex items-center">
                                         <input
                                             type="checkbox"
                                             checked={selectedCategories.includes(category._id)}
                                             onChange={() => handleCategorySelect(category._id)}
                                             className="mr-2"
                                         />
                                         {category.name}
                                     </label>
                                 </div>
                                //  </div>
                             ))}
                         </div>
                     </div>
                     <button
                         onClick={handleCompleteSignup}
                         className="w-full bg-mutedPurple text-lightCream py-3 px-4 rounded-md hover:bg-darkGray transition duration-300"
                     >
                         Complete Signup
                     </button>
                 </>
                ) : null}

            </div>
        </div>
    );
}
