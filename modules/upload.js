const multer = require('multer');

const  storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    storage: storage
});

module.exports = upload