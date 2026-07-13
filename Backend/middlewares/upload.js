const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
