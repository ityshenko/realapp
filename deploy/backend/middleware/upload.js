const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем директорию если не существует
const uploadDir = path.join(__dirname, '../../public/uploads');
const listingsDir = path.join(uploadDir, 'listings');
const avatarsDir = path.join(uploadDir, 'avatars');

[uploadDir, listingsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Конфигурация хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = listingsDir;
    
    if (file.fieldname === 'avatar') {
      uploadPath = avatarsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\u0400-\u04FF-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (jpeg, jpg, png, gif, webp)'));
  }
};

// Создаем экземпляр multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB лимит
  },
  fileFilter: fileFilter
});

module.exports = upload;
module.exports.default = upload;
