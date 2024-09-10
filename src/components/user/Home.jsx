import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/api';
import { CiUser } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [preferences, setPreferences] = useState([])
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const id = localStorage.getItem('id'); // Assuming user id is stored in localStorage
                const res = await axiosInstance.get(`/user/home/${id}`);

                if (res.data.success) {
                    console.log(res.data);
                    setArticles(res.data.articles);
                    setPreferences(res.data.user.preferences)
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);


    return (
        <div className='flex space-x-3'>

            {/* Preferences Section */}
            <div className='justify-start w-1/4 px-3 fixed '>
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
<div className='flex justify-center'>
            <div className=' w-1/2  space-y-3'>
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div className=' rounded-md bg-seriousDark p-3 shadow-lg space-y-3 flex flex-col' key={article._id}>
                            <div className='flex justify-between'>

                                <h2 className='px-3 flex items-center gap-2 font-semibold text-gray-300'><span><CiUser size={25} /></span>{article.author?.name}</h2>
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

                        </div>
                    ))
                ) : (
                    <p>No articles found for your preferences.</p>
                )}
            </div>
            </div>
        </div >
    );
}
