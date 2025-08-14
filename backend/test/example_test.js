const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const { createTransaction } = require('../controllers/transactionController');
const { createCategory } = require('../controllers/categoryController');

const { expect } = chai;

afterEach(() => {
  sinon.restore();
});

// Transaction Tests
describe('Transaction Controller - createTransaction', () => {

  it('should create a new transaction successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        amount: 100,
        date: "2025-12-31",
        type: "expense",
        category: "Food",
        note: "Lunch"
      }
    };

    const createdTransaction = { 
      _id: new mongoose.Types.ObjectId(), 
      ...req.body, 
      userId: req.user.id 
    };

    const createStub = sinon.stub(Transaction, 'create').resolves(createdTransaction);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createTransaction(req, res);

    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTransaction)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const createStub = sinon.stub(Transaction, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        amount: 100,
        date: "2025-12-31",
        type: "expense",
        category: "Food",
        note: "Lunch"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createTransaction(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

// Category Tests
describe('Category Controller - createCategory', () => {

  it('should create a new category successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        name: "Food", 
        type: "expense"
      }
    };

    const createdCategory = { 
      _id: new mongoose.Types.ObjectId(), 
      ...req.body, 
      userId: req.user.id 
    };

    const createStub = sinon.stub(Category, 'create').resolves(createdCategory);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createCategory(req, res);

    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdCategory)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    const createStub = sinon.stub(Category, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        name: "Food", 
        type: "expense"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createCategory(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});
