import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import axiosInstance from '../../axios/api';
import PulseLoader from "react-spinners/PulseLoader";
import toast from 'react-hot-toast';

export default function Category() {
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null); // Track which category is being edited
  const [editedCategoryName, setEditedCategoryName] = useState(''); // Store edited category name

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/admin/preference');
        if (res.data.success) {
          setCategories(res.data.categories);
          setLoading(false);
        }
      } catch (error) {
        toast.error('Failed to fetch categories');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAddCategory = async () => {
    const newCategory = category.trim();
    if (newCategory.length > 0) {
      try {
        const res = await axiosInstance.post('/admin/preference', { category: newCategory });
        if (res.data.success) {
          toast.success('Category added successfully');
          setCategories([...categories, res.data.category]); // Add new category to state
          setCategory(''); // Clear input field
        }
      } catch (error) {
        toast.error('Failed to add category');
      }
    }
  };

  const handleEditCategory = (categoryId, currentName) => {
    setEditingCategoryId(categoryId); // Start editing
    setEditedCategoryName(currentName); // Pre-fill input with current category name
  };

  const handleSaveEdit = async (categoryId) => {
    const updatedCategory = editedCategoryName.trim();
    if (updatedCategory.length > 0) {
      try {
        const res = await axiosInstance.put(`/admin/preference/${categoryId}`, { name: updatedCategory });
        if (res.data.success) {
          toast.success('Category updated successfully');

        
          setCategories(categories.map((cat) =>
            cat._id === categoryId ? { ...cat, name: updatedCategory } : cat
          ));
          setEditingCategoryId(null); // Exit editing mode
        }
      } catch (error) {
        toast.error('Failed to update category');
        setEditingCategoryId(null)
      }
    } else {
      toast.error('Category name cannot be empty');
    }
  };

  return (
    <div className='flex items-center justify-center pt-10 bg-darkGray'>
      <div className='text-center w-1/2 p-6 rounded-lg border border-gray-500 shadow-lg'>
        <h1 className='text-2xl font-bold text-lightCream mb-4'>Preferences</h1>
        <div className='flex w-full justify-center items-center mb-4'>
          <input
            type='text'
            value={category}
            onChange={handleInputChange}
            placeholder='Enter category'
            className='w-3/4 p-3 border border-darkGray rounded-md bg-lightCream text-darkGray placeholder-darkGray mr-2'
          />
          <button
            onClick={handleAddCategory}
            className='bg-mutedPurple text-lightCream py-2 px-4 rounded-md hover:bg-darkGray hover:border transition duration-300 flex items-center'
          >
            <FaPlus size={16} className='mr-2' />
            Add
          </button>
        </div>

        <div>{loading ? <PulseLoader size={9} color='#F4EEE0' /> : null}</div>

        {/* Display the categories */}
        <div className='text-left mt-6'>
          <h2 className='text-xl text-lightCream mb-4'>Added Categories:</h2>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat._id} className='p-2 bg-mutedPurple mb-2 rounded-full px-4 flex justify-between items-center w-auto'>
                  {editingCategoryId === cat._id ? (
                    <input
                      type='text'
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className='bg-lightCream text-darkGray p-2 rounded'
                    />
                  ) : (
                    <span>{cat.name}</span>
                  )}

                  <div className="flex items-center">
                    {editingCategoryId === cat._id ? (
                      <button
                        onClick={() => handleSaveEdit(cat._id)}
                        className="ml-4 bg-green-500 text-white p-1 "
                      >
                        Save
                      </button>
                    ) : (
                      <FaEdit
                        className='text-lightCream cursor-pointer ml-4'
                        onClick={() => handleEditCategory(cat._id, cat.name)}
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className='text-lightCream'>No categories added yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
