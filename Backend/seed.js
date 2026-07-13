require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Seller = require('./models/Seller');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
const Wishlist = require('./models/Wishlist');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/BookStore';

async function seed() {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Clear existing collections
    console.log("Clearing existing data...");
    await Admin.deleteMany({});
    await Seller.deleteMany({});
    await User.deleteMany({});
    await Book.deleteMany({});
    await Order.deleteMany({});
    await Wishlist.deleteMany({});
    console.log("Existing data cleared.");

    // Create Admin
    const admin = await Admin.create({
      name: "System Admin",
      email: "admin@example.com",
      password: "admin"
    });
    console.log(`Admin created: ${admin.email}`);

    // Create Sellers
    const seller1 = await Seller.create({
      name: "Classic Books Vendor",
      email: "seller1@example.com",
      password: "password123"
    });
    const seller2 = await Seller.create({
      name: "Modern Novels Bookstore",
      email: "seller2@example.com",
      password: "password123"
    });
    console.log(`Sellers created: ${seller1.email}, ${seller2.email}`);

    // Create Users
    const user1 = await User.create({
      name: "Alice Smith",
      email: "user1@example.com",
      password: "password123"
    });
    const user2 = await User.create({
      name: "Bob Jones",
      email: "user2@example.com",
      password: "password123"
    });
    console.log(`Users created: ${user1.email}, ${user2.email}`);

    // Create mock image assets if they don't exist
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Write placeholder text to cover images if not present
    const covers = ['classic.jpg', 'dystopian.jpg', 'fantasy.jpg', 'scifi.jpg'];
    covers.forEach(cover => {
      const coverPath = path.join(uploadDir, cover);
      if (!fs.existsSync(coverPath)) {
        // Create a dummy text file as a placeholder image
        fs.writeFileSync(coverPath, 'Placeholder Cover Image Data');
      }
    });

    // Create Books (Items)
    const book1 = await Book.create({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      description: "A portrait of the Jazz Age in all its decadence and excess.",
      price: "450",
      itemImage: "uploads/classic.jpg",
      userId: seller1._id,
      userName: seller1.name
    });

    const book2 = await Book.create({
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      description: "A startlingly prescient novel about totalitarianism and state surveillance.",
      price: "350",
      itemImage: "uploads/dystopian.jpg",
      userId: seller1._id,
      userName: seller1.name
    });

    const book3 = await Book.create({
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      description: "A fantasy story about the quest of Bilbo Baggins to reclaim a lost treasure.",
      price: "600",
      itemImage: "uploads/fantasy.jpg",
      userId: seller2._id,
      userName: seller2.name
    });

    const book4 = await Book.create({
      title: "Dune",
      author: "Frank Herbert",
      genre: "Sci-Fi",
      description: "The epic masterpiece set on the desert planet Arrakis.",
      price: "550",
      itemImage: "uploads/scifi.jpg",
      userId: seller2._id,
      userName: seller2.name
    });

    console.log("Mock books created successfully.");

    await mongoose.disconnect();
    console.log("Seeding complete. Disconnected database.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
