const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const suffix = Date.now();
        // Remove the extension from the original name if desired:
        const originalName = file.originalname.split('.')[0];
        return {
            folder: "fitsense", // Cloudinary folder name
            allowed_formats: ['jpg', 'png', 'jpeg'],
            public_id: `${suffix}-${originalName}`, // Custom file name
        };
    },

    // params: {
    //     folder: 'fitsense',     // Cloudinary folder name
    //     allowed_formats: ['jpg', 'png', 'jpeg'],
    // },
});


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory where files will be stored
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
//     },
// });

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);     // Accept file
    }
    else {
        cb(new Error('Only image files are allowed!'), false);  // Reject the file
    }
};

// Set up multer
const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
