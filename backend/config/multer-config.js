const multer  = require('multer');
const crypto = require('crypto');


// const storage = some storage >> disk or memory



const upload = multer({ storage: storage })

module.exports = upload;