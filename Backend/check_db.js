const mongoose = require('./node_modules/mongoose');
const Book = require('./models/Book');

const MONGO_URI = 'mongodb://127.0.0.1:27017/BookStore';

async function check() {
  await mongoose.connect(MONGO_URI);
  const books = await Book.find({});
  console.log(JSON.stringify(books.map(b => ({ title: b.title, itemImage: b.itemImage })), null, 2));
  await mongoose.disconnect();
}

check();
