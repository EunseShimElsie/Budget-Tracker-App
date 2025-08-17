import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CategoryList = ({ categories, setCategories, setEditingCategory }) => {
  const { user } = useAuth();

  const handleDelete = async (categoryId) => {
    try {
      await axiosInstance.delete(`/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(categories.filter((c) => c._id !== categoryId));
    } catch (error) {
      alert('Failed to delete category.');
    }
  };

  return (
    <div>
      {categories.map((c) => (
        <div key={c._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{c.name}</h2>
          <p>Type: {c.type}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingCategory(c)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(c._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
