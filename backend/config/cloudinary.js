import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
         folder: "vibe-connect", // your folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "mp4"],
},
});
  

export { cloudinary, storage };

