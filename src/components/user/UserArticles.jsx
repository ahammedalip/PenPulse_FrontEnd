import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/api';
import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { BiLike, BiDislike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function UserArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeArticleId, setActiveArticleId] = useState(null); // State for which article has an active menu
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [editArticle, setEditArticle] = useState({ description: '', imageUrl: '' }); // State for editing article

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyArticles = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/user/my-articles');
                if (res.data.success) {
                    console.log(res.data.articles);
                    setArticles(res.data.articles);
                    setLoading(false);
                }
            } catch (error) {
                toast.error('Something went wrong, Please try again');
            }
        };
        fetchMyArticles();
    }, []);

    // Function to toggle the active article's menu
    const toggleMenu = (id) => {
        setActiveArticleId(activeArticleId === id ? null : id); // Toggle menu for clicked article
    };

    // Function to handle opening the edit modal
    const handleEdit = (article) => {
        setEditArticle({ description: article.description, imageUrl: article.imageUrl });
        setIsModalOpen(true); // Open modal
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle submitting the edited article
    const handleUpdate = async () => {
        try {
            const res = await axiosInstance.put(`/user/update-article/${activeArticleId}`, editArticle);
            if (res.data.success) {
                toast.success('Article updated successfully');
                setIsModalOpen(false);
                // Optionally, you can refetch articles or update the state locally
            }
        } catch (error) {
            toast.error('Failed to update article');
        }
    };

    return (
        <div className='flex justify-center pt-10'>
            {loading ? (
                <div className=' sm:w-full md:w-1/2 items-center'>
                    <PulseLoader color='#F4EEE0' />
                </div>
            ) : (
                <div className={`space-y-3 sm:w-full md:w-1/2`}>
                    {articles?.length > 0 ? (
                        articles.map((article) => (
                            <div className='rounded-md bg-seriousDark p-3 shadow-lg space-y-3 flex flex-col relative' key={article._id}>
                                <div className='flex justify-between'>
                                    <h3 className='font-semibold'>{article.title}</h3>
                                    <button onClick={() => toggleMenu(article._id)}>
                                        <BsThreeDotsVertical />
                                    </button>
                                </div>
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
                                        <BiLike size={25} />
                                        <h1 className='font-thin'>{article.likesCount}</h1>
                                    </div>
                                    <div className='flex items-center'>
                                        <BiDislike size={25} />
                                        <h1 className='font-thin'>{article.dislikesCount}</h1>
                                    </div>
                                </div>

                                {/* Dropdown menu next to the three dots */}
                                {activeArticleId === article._id && (
                                    <div className="absolute top-10 right-10 bg-lightDarkGrey p-2 rounded-md shadow-lg z-10">
                                        <ul>
                                            <li
                                                className='hover:bg-gray-500 p-2 rounded cursor-pointer'
                                                onClick={() => handleEdit(article)} // Open modal for editing
                                            >
                                                Edit
                                            </li>
                                            <li
                                                className='hover:bg-gray-500 p-2 rounded cursor-pointer'
                                                onClick={() => {
                                                    // Functionality to make article private
                                                    toast.success('Article is now private');
                                                }}
                                            >
                                                Make Private
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className='border border-gray-700 shadow-lg shadow-gray-800  rounded-md p-10 space-y-5 flex flex-col justify-center'>
                            <p>Your articles are empty. Please post an article</p>
                            <button
                                className='p-2 w-fit rounded-lg border border-gray-600  bg-purpleGray hover:bg-lightDarkGrey duration-200'
                                onClick={() => navigate('/user/create-article')}
                            >
                                Create Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-darkGray p-5 rounded-md w-96 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit Article</h2>
                        <div className="mb-4">
                            <label className="block ">Description</label>
                            <textarea
                                className="w-full text-black p-2 border rounded"
                                rows="4"
                                value={editArticle.description}
                                onChange={(e) => setEditArticle({ ...editArticle, description: e.target.value })}
                            ></textarea>
                        </div>
                        {/* <div className="mb-4">
                            <label className="block ">Image URL</label>
                            <input
                                type="text"
                                className="w-full p-2 border text-black rounded"
                                value={editArticle.imageUrl}
                                onChange={(e) => setEditArticle({ ...editArticle, imageUrl: e.target.value })}
                            />
                        </div> */}
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-500  rounded"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2  rounded"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
