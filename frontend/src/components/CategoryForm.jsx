import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CategoryForm = ({ categories, setCategories, editingCategory, setEditingCategory }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', type: 'income' });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        type: editingCategory.type
      });
    } else {
      setFormData({ name: '', type: 'income' });
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await axiosInstance.put(`/api/categories/${editingCategory._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCategories(categories.map((c) => (c._id === response.data._id ? response.data : c)));
      } else {
        const response = await axiosInstance.post('/api/categories', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCategories([...categories, response.data]);
      }
      setEditingCategory(null);
      setFormData({ name: '', type: 'income' });
    } catch (error) {
      alert('Failed to save category.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Create Category'}</h1>
      <input
        type="text"
        placeholder="Category Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingCategory ? 'Update Category' : 'Add Category'}
      </button>
    </form>
  );
};

export default CategoryForm;
