const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    flatno: String,
    pincode: String,
    city: String,
    state: String,
    totalamount: String,
    seller: String,
    sellerId: String,
    booktitle: String,
    bookauthor: String,
    bookgenre: String,
    itemImage: String,
    description: String,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    userName: String,
    BookingDate: {
        type: String, // Store dates as strings
        default: () => new Date().toLocaleDateString('hi-IN')
    },
    Delivery: {
        type: String, // Store dates as strings
        default: () => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7); // Add 7 days
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
            const year = currentDate.getFullYear();
            return `${month}/${day}/${year}`;
        }
    }
});

module.exports = mongoose.model('myorders', orderSchema);
