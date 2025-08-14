import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TransactionForm = ({ transactions, setTransactions, editingTransaction, setEditingTransaction }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    amount: '',       
    date: '',     
    type: 'income',
    category: '',
    note: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        date: editingTransaction.date.split('T')[0],
        type: editingTransaction.type,
        category: editingTransaction.category,
        note: editingTransaction.note || ''
      });
    } else {
      setFormData({ amount: '', date: '', type: 'income', category: '', note: '' });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        const response = await axiosInstance.put(`/api/transactions/${editingTransaction._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTransactions(transactions.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/transactions', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTransactions([...transactions, response.data]);
      }
      setEditingTransaction(null);
      setFormData({ amount: '', date: '', type: 'income', category: '', note: '' });
    } catch (error) {
      alert('Failed to save transaction.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingTransaction ? 'Edit Transaction' : 'Create Transaction'} {/* 변경됨 */}
      </h1>
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Note"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
