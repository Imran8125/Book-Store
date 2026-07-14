const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String
    },
    readingProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only have one interaction record per book
interactionSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Interaction', interactionSchema);
