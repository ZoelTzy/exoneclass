import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// 🔧 Replace these with your Cloudinary credentials
const CLOUD_NAME = "dttbnie0t";
const UPLOAD_PRESET = "exoneclass";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_UPLOADS_PER_DAY = 20;

function UploadImage() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadImagesFromStorage();
  }, []);

  // Load previously uploaded image URLs from localStorage
  const loadImagesFromStorage = () => {
    const saved = JSON.parse(localStorage.getItem("uploadedImageUrls")) || [];
    setImageList(saved);
  };

  const checkUploadLimit = () => {
    const lastUploadDate = localStorage.getItem("lastUploadDate");
    const currentDate = new Date().toDateString();

    if (lastUploadDate && new Date(lastUploadDate).toDateString() !== currentDate) {
      // Reset count if it's a new day
      localStorage.setItem("uploadedImagesCount", 0);
    }

    const uploadedCount = parseInt(localStorage.getItem("uploadedImagesCount")) || 0;
    return uploadedCount;
  };

  const uploadImage = async () => {
    if (!imageUpload) return;

    // Check file size
    if (imageUpload.size > MAX_SIZE_BYTES) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The maximum size for a photo is 10MB",
        customClass: { container: "sweet-alert-container" },
      });
      return;
    }

    // Check daily upload limit
    const uploadedCount = checkUploadLimit();
    if (uploadedCount >= MAX_UPLOADS_PER_DAY) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You have reached the maximum uploads for today.",
        customClass: { container: "sweet-alert-container" },
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageUpload);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${dttbnie0t}/image/upload`,
        formData
      );

      const uploadedUrl = response.data.secure_url;

      // Save URL to localStorage
      const existingUrls = JSON.parse(localStorage.getItem("uploadedImageUrls")) || [];
      const updatedUrls = [...existingUrls, uploadedUrl];
      localStorage.setItem("uploadedImageUrls", JSON.stringify(updatedUrls));
      localStorage.setItem("uploadedImagesCount", uploadedCount + 1);
      localStorage.setItem("lastUploadDate", new Date().toISOString());

      setImageList(updatedUrls);
      setImageUpload(null);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your image has been successfully uploaded.",
        customClass: { container: "sweet-alert-container" },
      });
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong. Please try again.",
        customClass: { container: "sweet-alert-container" },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="text-1xl md:text-2xl md:px-10 font-bold mb-4 w-full text-white">
          Upload Your Classroom Memories
        </h1>
      </div>

      <div className="mx-auto p-4">
        <div className="mb-4">
          <input type="file" id="imageUpload" className="hidden" onChange={handleImageChange} accept="image/*" />
          <label
            htmlFor="imageUpload"
            className="cursor-pointer border-dashed border-2 border-gray-400 rounded-lg p-4 w-56 h-auto flex items-center justify-center">
            {imageUpload ? (
              <div className="w-full h-full overflow-hidden">
                <img
                  src={URL.createObjectURL(imageUpload)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-center px-5 py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-12 w-12 mx-auto text-gray-400">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-white opacity-60">Click to select an image</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <button
        type="button"
        disabled={isUploading}
        className="py-2.5 w-[60%] mb-0 md:mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={uploadImage}>
        {isUploading ? "Uploading..." : "UPLOAD"}
      </button>
    </div>
  );
}

export default UploadImage;