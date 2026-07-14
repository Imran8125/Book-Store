const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor"
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Seller', SellerSchema);
