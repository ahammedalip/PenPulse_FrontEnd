import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/api';
import { CiUser } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PulseLoader } from 'react-spinners';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';

// Import locales you need
import en from 'javascript-time-ago/locale/en.json'; // English locale
TimeAgo.addDefaultLocale(en);


export default function Home() {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [showPreferences, setShowPreferences] = useState(false); // State to control preferences visibility
    const userId = localStorage.getItem('id');


    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/user/home/${userId}`);

                if (res.data.success) {
                    console.log(res.data.articles);
                    setArticles(res.data.articles);
                    setPreferences(res.data.user.preferences);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
                setLoading(false);
                toast.error('Please retry again');
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
        setShowPreferences(!showPreferences); // Toggle visibility
    };

    return (
        <div className='flex space-x-3'>
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
                                    <div key={preference._id} className=''>
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

            {/* Preferences Section (for larger screens, not modal) */}
            <div className={`md:w-1/4 px-3 md:fixed hidden md:block`}>
                <div className='px-10 bg-seriousDark p-3 rounded-md'>
                    <h1 className='font-semibold underline w-full'>Tags</h1>
                    {preferences.length > 0 ? (
                        preferences.map((preference) => (
                            <div key={preference._id} className=''>
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

            {/* Articles Section */}
            <div className={`flex md:justify-center sm:w-full`}>
                {loading ? (
                    <div className='flex justify-center items-center h-screen'>
                        <div className='flex w-full'>
                            <PulseLoader size={20} color='#F4EEE0' />
                        </div>
                    </div>
                ) : (
                    // <div className={`  space-y-3 sm:w-full md:w-1/2  `}>
                    //     {articles.length > 0 ? (
                    //         articles.map((article) => (
                    //             <div className='rounded-md bg-seriousDark p-3 shadow-lg space-y-3 flex flex-col' key={article._id}>
                    //                 <div className='flex justify-between'>
                    //                     <h2 className='px-3 flex items-center gap-2 font-semibold text-gray-300'>
                    //                         <span><CiUser size={25} /></span>{article.author?.name}
                    //                         <span className='text-sm text-gray-500 ml-2'>
                    //                             <ReactTimeAgo date={new Date(article.createdAt)} locale="en-US" />
                    //                         </span>
                    //                     </h2>

                    //                     <span><BsThreeDotsVertical /></span>
                    //                 </div>
                    //                 <h3 className='font-semibold text-center'>{article.title}</h3>
                    //                 <p className='font-thin'>{article.description}</p>
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
                    //                     <button onClick={() => handleLike(article._id)}>
                    //                         <BiLike />
                    //                     </button>
                    //                     <button onClick={() => handleDislike(article._id)}>
                    //                         <BiDislike />
                    //                     </button>
                    //                 </div>
                    //             </div>
                    //         ))
                    //     ) : (
                    //         <p>No articles found for your preferences.</p>
                    //     )}
                    // </div>
                    <div className={`space-y-3 sm:w-full md:w-1/2`}>
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <div className='rounded-md bg-seriousDark p-3 shadow-lg space-y-3 flex flex-col' key={article._id}>
                                    <div className='flex justify-between'>
                                        <h2 className='px-3 flex items-center gap-2 font-semibold text-gray-300'>
                                            <span><CiUser size={25} /></span>{article.author?.name}
                                            <span className='text-sm text-gray-500 ml-2'>
                                                <ReactTimeAgo date={new Date(article.createdAt)} locale="en-US" />
                                            </span>
                                        </h2>

                                        <span><BsThreeDotsVertical /></span>
                                    </div>
                                    <h3 className='font-semibold text-center'>{article.title}</h3>
                                    <p className='font-thin'>{article.description}</p>
                                    {article.imageUrl && (
                                        <div className='flex justify-center'>
                                            <img
                                                className='border rounded-xl w-3/5 border-gray-900'
                                                src={article.imageUrl}
                                                alt={article.name}
                                            />
                                        </div>
                                    )}
                                    <div className='flex justify-center space-x-5 px-5 bg-lightDarkGrey/25 rounded-full p-2 shadow-2xl'>
                                        <div className='flex items-center'>

                                            <button onClick={() => handleLike(article._id)}>
                                                {article.likes?.includes(userId) ? <BiSolidLike size={25} color='#F4EEE0' /> : <BiLike size={25} />}
                                            </button>
                                            <h1 className='font-thin'>{article.likesCount}</h1>
                                        </div>


                                        <button onClick={() => handleDislike(article._id)}>
                                            {article.dislikes?.includes(userId) ? <BiSolidDislike size={25} color='F4EEE0' /> : <BiDislike size={25} />}
                                        </button>

                                    </div>
                                </div>

                            ))
                        ) : (
                            <p>No articles found for your preferences.</p>
                        )}
                    </div>

                )}
            </div>
        </div >
    );
}
