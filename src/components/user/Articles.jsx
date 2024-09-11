// Article.js
import React from 'react';
import { CiUser } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import ReactTimeAgo from 'react-time-ago';

const Article = ({ article, userId, handleLike, handleDislike }) => {
    return (
        <div className='rounded-md bg-seriousDark p-3 shadow-lg space-y-3 flex flex-col'>
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
    );
};

export default Article;
