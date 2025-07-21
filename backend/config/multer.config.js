const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(15, (err, bytes) => {
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        })
    }

})

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',       // .jpeg or .jpg
        'image/jpg',        // (not always needed, but included for safety)
        'image/png',        // .png
        'image/heic',       // iOS default image format (newer devices)
        'image/heif'        // some variations of HEIC
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 50MB max
    }
})

module.exports = upload;