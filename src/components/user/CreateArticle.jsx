import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/api';
import toast from 'react-hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../firebase/firebaseConfig';
import { PulseLoader } from 'react-spinners';

export default function CreateArticle() {
    const [preferences, setPreferences] = useState([]);
    const [loading, setLoading] = useState(false)
    const [articleData, setArticleData] = useState({
        userId: '',
        title:'',
        description: '',
        selectedImage: null,
        selectedPreferences: []
    });
    const [isUploading, setIsUploading] = useState(false); // To track the upload state

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get('/user/preferences');
                if (res.data.success) {
                    console.log(res.data)
                    setPreferences(res.data.preference);
                    setLoading(false)
                }
            } catch (error) {
                console.log('Error at fetching preferences', error);
                toast.error('Error fetching preferences');
            }
        };
        fetchCategories();
        // console.log(preferences);
    }, []);

    // Handle input changes for description
    const handleInputChange = (e) => {
        setArticleData({
            ...articleData,
            [e.target.name]: e.target.value
        });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        setArticleData({
            ...articleData,
            selectedImage: e.target.files[0] // Store the selected image file
        });
    };

    // Handle preference selection (checkboxes)
    const handlePreferenceChange = (e) => {
        const preferenceId = e.target.value;
        const isChecked = e.target.checked;

        setArticleData((prevState) => ({
            ...prevState,
            selectedPreferences: isChecked
                ? [...prevState.selectedPreferences, preferenceId]
                : prevState.selectedPreferences.filter((id) => id !== preferenceId)
        }));
    };

    // Handle image upload to Firebase
    const uploadImageToFirebase = async (imageFile) => {
        const storage = getStorage(firebaseApp);
        const imageRef = ref(storage, `images/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };

    // Handle form submission (for article creation)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title,description, selectedImage, selectedPreferences } = articleData;

        // Validation
        if(title.trim().length<5){
            toast.error('Title must me at least 5 characters long')
            return;
        }
        if (description.trim().length < 10) {
            toast.error('Description must be at least 10 characters long');
            return;
        }
        if (selectedPreferences.length < 1) {
            toast.error('Please select at least one preference');
            return;
        }

        setIsUploading(true);

        try {
            let imageUrl = '';
            if (selectedImage) {
                // Upload image to Firebase and get the URL
                imageUrl = await uploadImageToFirebase(selectedImage);
            }

            const formData = {
                author:localStorage.getItem('id'),
                title: articleData.title,
                description: articleData.description,
                imageUrl,
                preferences: articleData.selectedPreferences
            };

            const res = await axiosInstance.post('/user/articles', formData);

            if (res.data.success) {
                toast.success('Article created successfully!');
                setArticleData({
                    title:'',
                    description: '',
                    selectedImage: null,
                    selectedPreferences: []
                });
            } else {
                toast.error('Failed to create article');
            }
        } catch (error) {
            console.error('Error creating article', error);
            toast.error('Error creating article');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='pt-10 flex items-center justify-center'>
            <div className='flex flex-col border rounded-lg border-gray-400 w-1/2 p-6'>
                <h2 className='text-xl font-bold mb-4'>Create a New Article</h2>
                <form onSubmit={handleSubmit}>
                    {/* Input for Article Description */}
                    <div className='mb-4'>
                        <label htmlFor='title' className='block text-sm font-medium'>
                            Article Title
                        </label>
                        <input
                            id='title'
                            name='title'
                            value={articleData.title}
                            onChange={handleInputChange}
                            className='mt-1 p-2 w-full border text-black border-gray-400 rounded-md'
                            
                            placeholder='Article title'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='description' className='block text-sm font-medium'>
                            Article Description
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            value={articleData.description}
                            onChange={handleInputChange}
                            className='mt-1 p-2 w-full border text-black border-gray-400 rounded-md'
                            rows='4'
                            placeholder='Write your article description here...'
                        />
                    </div>

                    {/* Image Selector */}
                    <div className='mb-4'>
                        <label htmlFor='image' className='block text-sm font-medium'>
                            Upload Image
                        </label>
                        <input
                            type='file'
                            id='image'
                            name='image'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='mt-1 block w-auto text-sm border border-gray-400 rounded-md'
                        />
                    </div>

                    {/* Preview selected image */}
                    {articleData.selectedImage && (
                        <div className='mb-4'>
                            <img
                                src={URL.createObjectURL(articleData.selectedImage)}
                                alt='Selected'
                                className='h-40 w-auto object-cover'
                            />
                        </div>
                    )}

                    {/* Available Preferences (Checkboxes) */}

                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>
                            Select Preferences:
                        </label>
                        {loading ? (
                            <div className='flex justify-center'>

                            <PulseLoader  size={14} color='#F4EEE0' />
                            </div>
                        ) : (
                            <div className='flex flex-wrap mt-2 gap-2'>
                                {preferences?.map((preference) => (
                                    <div className='border border-purpleGray hover:border-gray-400 rounded-full px-2 p-2 bg-purpleGray hover:bg-mutedPurple transform duration-300'>
                                        <label key={preference._id} className='mr-4 mb-2'>
                                            <input
                                                type='checkbox'
                                                value={preference._id}
                                                checked={articleData.selectedPreferences.includes(preference._id)}
                                                onChange={handlePreferenceChange}
                                                className='mr-2'
                                            />
                                            {preference.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Submit Button */}
                    <div className='flex items-center justify-center'>
                        <button
                            type='submit'
                            disabled={isUploading}
                            className='w-fill bg-mutedPurple text-white py-2 px-4 rounded-md hover:bg-lightDarkGrey transition duration-300'
                        >
                            {isUploading ? 'Creating Article...' : 'Create Article'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
