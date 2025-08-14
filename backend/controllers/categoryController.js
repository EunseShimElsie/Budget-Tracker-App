const Category = require('../models/Category');

// Read
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create
const createCategory = async (req, res) => {
  const { name, type } = req.body;
  try {
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    const category = await Category.create({
      userId: req.user.id,
      name,
      type
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateCategory = async (req, res) => {
  const { name, type } = req.body;
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = name || category.name;
    category.type = type || category.type;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userId: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
