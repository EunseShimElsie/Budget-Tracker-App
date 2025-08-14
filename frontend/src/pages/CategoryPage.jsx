import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import { useAuth } from '../context/AuthContext';

const CategoryPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCategories(response.data);
      } catch (error) {
        alert('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <CategoryForm
        categories={categories}
        setCategories={setCategories}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
      />
      <CategoryList
        categories={categories}
        setCategories={setCategories}
        setEditingCategory={setEditingCategory}
      />
    </div>
  );
};

export default CategoryPage;
