import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (fileBuffer) => {
    // If Cloudinary keys are missing, return a placeholder image URL
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn("Cloudinary environment variables are missing! Using a placeholder image.");
        return "https://i.ibb.co/bRJ8LPw1/BUBBLE-AESPA-KARINA.png";
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'ad-kpop-merch' },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        ).end(fileBuffer);
    });
};
