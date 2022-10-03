const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp', //folder where cloudinary things should be stored in
        allowedFormats: ['jpegs', 'png', 'jpg'],
        width: 200,
        height: 300
    }
});

module.exports = {
    cloudinary,
    storage
}