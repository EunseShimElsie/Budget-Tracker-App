const Transaction = require('../models/Transaction');

// Read
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create
const addTransaction = async (req, res) => {
  const { amount, date, type, category, note } = req.body;
  try {
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });
    if (!date || !type || !category) return res.status(400).json({ message: 'Date, type, and category are required' });

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      date,
      type,
      category,
      note
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateTransaction = async (req, res) => {
  const { amount, date, type, category, note } = req.body;
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.amount = amount ?? transaction.amount;
    transaction.date = date || transaction.date;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.note = note || transaction.note;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };
