import React, { lazy, Suspense, useEffect, useState } from 'react';
import axiosInstance from '../../axios/api';
import { CiUser } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PulseLoader } from 'react-spinners';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import Cookies from 'js-cookie';
// Import locales you need
import en from 'javascript-time-ago/locale/en.json'; // English locale
import { useNavigate } from 'react-router-dom';
TimeAgo.addDefaultLocale(en);
import './Home.css'

const ComponentArticles = lazy(() => import('./ComponentArticles'));


export default function Home() {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [showPreferences, setShowPreferences] = useState(false);
    const userId = localStorage.getItem('id');

    const navigate = useNavigate()

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/user/home/${userId}`);
                if (res.data.success) {
                    setArticles(res.data.articles);
                    console.log(res.data.articles);
                    setPreferences(res.data.user.preferences);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                if (error && error.response.status == 401) {
                    Cookies.remove('userAuthToken');
                    navigate('/user/login');
                    toast('Please Login', { icon: '🙆‍♀️' });
                } else {
                    toast.error('Something went wrong!');
                }
            }
        };
        fetchArticles();
    }, []);

    const handleLike = async (articleId) => {
        try {
            const res = await axiosInstance.put(`/user/article/${articleId}/like`, { userId });
            if (res.data.success) {
                setArticles((prevArticles) =>
                    prevArticles.map((article) =>
                        article._id === articleId
                            ? {
                                ...article,
                                likes: res.data.article.likes,
                                dislikes: res.data.article.dislikes,
                                likesCount: res.data.article.likes.length,
                                dislikesCount: res.data.article.dislikes.length
                            }
                            : article
                    )
                );
            }
        } catch (error) {
            console.error('Error liking article:', error);
        }
    };

    const handleDislike = async (articleId) => {
        try {
            const res = await axiosInstance.put(`/user/article/${articleId}/dislike`, { userId });
            if (res.data.success) {
                setArticles((prevArticles) =>
                    prevArticles.map((article) =>
                        article._id === articleId
                            ? {
                                ...article,
                                likes: res.data.article.likes,
                                dislikes: res.data.article.dislikes,
                                likesCount: res.data.article.likes.length,
                                dislikesCount: res.data.article.dislikes.length
                            }
                            : article
                    )
                );
            }
        } catch (error) {
            console.error('Error disliking article:', error);
        }
    };

    const togglePreferences = () => {
        setShowPreferences(!showPreferences);
    };

    return (
        <div className="relative h-[calc(100vh-90px)] from-darkGray via-darkGray  to-pureDarkGray flex ">
            {/* Hamburger Button (shown on small screens) */}
            <div className="md:hidden p-3">
                <button onClick={togglePreferences}>
                    {showPreferences ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
                </button>
            </div>

            {/* Preferences Modal for screen sizes below md */}
            {showPreferences && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center md:hidden">
                    <div className="bg-seriousDark p-6 rounded-lg w-11/12 max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-white">Tags</h2>
                            <button onClick={togglePreferences}>
                                <AiOutlineClose size={25} className="text-white" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {preferences.length > 0 ? (
                                preferences.map((preference) => (
                                    <div key={preference._id}>
                                        <div className='border border-gray-600 rounded-full p-2 px-3 w-fit flex items-center'>
                                            <h1>{preference.name}</h1>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1>nil</h1>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className='md:w-1/4'>
                {/* Preferences Section (for larger screens, not modal) */}
                <div className="md:w-1/4 px-3 md:fixed hidden md:block">
                    <div className='px-10 bg-seriousDark p-3 rounded-md'>
                        <h1 className='font-semibold underline w-full'>Tags</h1>
                        {preferences.length > 0 ? (
                            preferences.map((preference) => (
                                <div key={preference._id}>
                                    <div className='border border-gray-600 rounded-full p-2 px-3 w-fit flex items-center'>
                                        <h1>{preference.name}</h1>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1>nil</h1>
                        )}
                    </div>
                </div>
            </div>

            <div className='md:w-3/4 overflow-y-auto your-article-class'>
                {/* Articles Section */}
                <div className="md:w-3/4 px-3 h-screen">
                    {loading ? (
                        <div className='flex justify-center items-center h-screen'>
                            <div className='flex w-full'>
                                <PulseLoader size={20} color='#F4EEE0' />
                            </div>
                        </div>
                    ) : (
                        // <div className="space-y-3 justify-cent">
                        //     {articles.length > 0 ? (
                        //         articles.map((article) => (
                        //             <div className='rounded-md bg-seriousDark p-3 shadow-lg space-y-3 flex flex-col' key={article._id}>
                        //                 <div className='flex justify-between'>
                        //                     <h2 className='px-3 flex items-center gap-2 font-semibold text-gray-300'>
                        //                         <span><CiUser size={25} /></span>{article.author?._id == userId ? 'You' : article.author?.name}
                        //                         <span className='text-sm text-gray-500 ml-2'>
                        //                             <ReactTimeAgo date={new Date(article.createdAt)} locale="en-US" />
                        //                         </span>
                        //                     </h2>
                        //                     <span><BsThreeDotsVertical /></span>
                        //                 </div>
                        //                 <h3 className='font-semibold text-center'>{article.title}</h3>
                        //                 <p className="font-thin">
                        //                     {article.description.split('\n').map((line, index) => (
                        //                         <React.Fragment key={index}>
                        //                             {line}
                        //                             <br />
                        //                         </React.Fragment>
                        //                     ))}
                        //                 </p>
                        //                 {/* {article.tags.length > 0(
                        //                     article.tags.map((tag)=>{
                        //                         <div key={tag._is}>
                        //                             <h1>#{tag.name}</h1>
                        //                         </div>
                                                    
                        //                     })
                        //                 )} */}

                        //                 {article.imageUrl && (
                        //                     <div className='flex justify-center'>
                        //                         <img
                        //                             className='border rounded-xl w-3/5 border-gray-900'
                        //                             src={article.imageUrl}
                        //                             alt={article.name}
                        //                         />
                        //                     </div>
                        //                 )}
                        //                 <div className='flex justify-center space-x-5 px-5 bg-lightDarkGrey/25 rounded-full p-2 shadow-2xl'>
                        //                     <div className='flex items-center'>
                        //                         <button onClick={() => handleLike(article._id)}>
                        //                             {article.likes?.includes(userId) ? <BiSolidLike size={25} color='#F4EEE0' /> : <BiLike size={25} />}
                        //                         </button>
                        //                         <h1 className='font-thin'>{article.likesCount}</h1>
                        //                     </div>

                        //                     <button onClick={() => handleDislike(article._id)}>
                        //                         {article.dislikes?.includes(userId) ? <BiSolidDislike size={25} color='F4EEE0' /> : <BiDislike size={25} />}
                        //                     </button>
                        //                 </div>
                        //             </div>
                        //         ))
                        //     ) : (
                        //         <p>No articles found for your preferences.</p>
                        //     )}
                        // </div>
                        <Suspense fallback={<PulseLoader size={20} color='#F4EEE0' />}>
                            <div className="space-y-3">
                                {articles.length > 0 ? (
                                    articles.map((article) => (
                                        <ComponentArticles
                                            key={article._id}
                                            article={article}
                                            userId={userId}
                                            handleLike={handleLike}
                                            handleDislike={handleDislike}
                                        />
                                    ))
                                ) : (
                                    <p>No articles found for your preferences.</p>
                                )}
                            </div>
                        </Suspense>
                    )}
                </div>
            </div>


        </div>
    );
}
