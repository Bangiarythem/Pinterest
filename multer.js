const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'public', 'images', 'uploads');
    
    // Ensure the directory exists, create it if necessary
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4(); // Generate a unique filename
    cb(null, uniqueName+path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
