const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const upload = multer ({
    storage: storage,
    // fileFilter: function(req, file, callback){
    //     if(file.mimetype == "application/pdf"){
    //         callback(null, true)
    //     } else {
    //         console.log("Only pdf file supported!");
    //         callback(null, false);
    //     }
    // },
    limits: {
        fileSize: 1024 * 1024 * 100
    }
})

module.exports = upload;