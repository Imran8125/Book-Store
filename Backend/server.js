require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`server is running on  ${PORT}`);
});