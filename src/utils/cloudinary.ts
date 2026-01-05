import { v2 as cloudinary } from "cloudinary";
import fs, { unlinkSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const response = cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload error: ", error);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null;
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting from cloudinary: ", error);
    return false;
  }
};
