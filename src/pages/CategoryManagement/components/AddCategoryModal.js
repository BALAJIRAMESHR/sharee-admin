import React, { useState } from "react";
import { API_IMAGE_URL, API_BASE_URL } from "../../../config/api";
import axios from "axios";
import { imageAPI, baseAPI } from "../../../config/api";

const AddCategoryModal = ({ onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoryType, setCategoryType] = useState("Saree");

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
      } else {
        alert("Please drop an image file");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    try {
      // Validate file size before upload (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedImage.size > maxSize) {
        throw new Error("Image size should be less than 5MB");
      }

      // First upload the image
      const formData = new FormData();
      formData.append("file", selectedImage);

      // Log the request details
      console.log('Uploading image...', {
        url: `${API_IMAGE_URL}/upload`,
        fileSize: selectedImage.size,
        fileName: selectedImage.name,
        fileType: selectedImage.type
      });

      const imageUploadResponse = await imageAPI.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress:', percentCompleted + '%');
        }
      });

      console.log('Image upload response:', imageUploadResponse);
      if (!imageUploadResponse.data || !imageUploadResponse.data.filePath) {
        throw new Error("Invalid response from image upload");
      }

      const imageUrl = imageUploadResponse.data.filePath;

      // Then create the category with the image URL
      const categoryData = {
        categoryName: categoryName.trim(),
        categoryType,
        categotyImage: imageUrl,
      };

      console.log('Creating category with data:', categoryData);
      const categoryResponse = await baseAPI.post("/categories/addcategory", categoryData);

      if (categoryResponse.data) {
        await onAdd(categoryName, imageUrl, categoryType);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      let errorMessage = "An unexpected error occurred";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Log additional error details
      console.error('Detailed error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      
      alert(`Failed to add category: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Image Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg mb-4 p-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Selected category"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewImage(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
              <p>Drop your image here or</p>
              <label className="text-purple-600 cursor-pointer hover:text-purple-700">
                Browse
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          )}
        </div>

        {/* Category Name Input */}
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        {/* Category Type Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Type
          </label>
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Saree">Saree</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!categoryName.trim() || !selectedImage}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
