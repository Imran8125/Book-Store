const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    itemImage: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: {
        type: String
    },
    stock: {
        type: Number,
        default: 5
    },
    formats: {
        type: [String],
        default: ['Paperback', 'E-Book']
    }
});

module.exports = mongoose.model('books', bookSchema);
