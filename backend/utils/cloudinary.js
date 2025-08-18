const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            console.log("Could not find filePath");
            return null;
        }

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: 'uploads',
            resource_type: 'auto', // Keep original format (image/video/raw)
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transformation: [] // 🚫 No transformations = no compression
        })

        // file uploaded on cloudinary
        //console.log("File has been uploaded");

        return response;
        
    } catch(err){
        console.log("Cloudinary File upload Error : ", err.message);
        return null;
    }
}

module.exports = uploadOnCloudinary;