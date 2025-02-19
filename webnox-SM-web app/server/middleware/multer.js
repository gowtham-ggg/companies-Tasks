import multer from "multer";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from 'cloudinary';

// Set up Cloudinary configuration
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to handle the image upload
const storage = multer.memoryStorage();  // Store the file in memory temporarily

const upload = multer({ storage: storage });

export default upload;
