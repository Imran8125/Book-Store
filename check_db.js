const mongoose = require('mongoose');
const Book = require('./Backend/models/Book');

const MONGO_URI = 'mongodb://127.0.0.1:27017/BookStore';

async function check() {
  await mongoose.connect(MONGO_URI);
  const books = await Book.find({});
  console.log(books.map(b => ({ title: b.title, itemImage: b.itemImage })));
  await mongoose.disconnect();
}

check();
