const { v2 } = require("cloudinary");
const fs = require("fs");

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // upload the file on cloudinary
    const response = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    console.log("file has uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    // fs.unlinkSync(localFilePath); 
    //remove the locally sasved the temporary file as the upload operation got filed
    // return null;

    console.error("Cloudinary upload failed:", error.message);

    // Check if file exists before deleting
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

module.exports = uploadOnCloudinary;
