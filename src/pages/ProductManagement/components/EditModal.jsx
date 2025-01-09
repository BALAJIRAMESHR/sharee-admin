import React, { useState } from "react";

const EditProductModal = ({ product, onClose, onSave }) => {
  console.log("Product Data:", product);

  const [formData, setFormData] = useState({
    productName: product.productName,
    costPrice: product.costPrice,
    mrp: product.mrp,
    sellingPrice: product.sellingPrice,
    stock: product.stock,
    tax: product.tax,
    weightAmount: product.weightAmount,
    weightUnit: product.weightUnit,
    shortDescription: product.shortDescription,
    image: product.image,
  });

  const [imageUploading, setImageUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dmlnengy8/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (response.ok) {
          setFormData((prev) => ({ ...prev, image: data.secure_url }));
          console.log("Uploaded Image URL:", data.secure_url);
        } else {
          console.error("Upload failed:", data.error.message);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    } else {
      console.log("No file selected");
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      id: product.id,
      subcategory: product.subcategory,
      category: product.category,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      createdAt: product.createdAt,
      updatedAt: new Date(),
    };
    onSave(updatedData);
  };

  return (
    <div className="relative -top-10 bg-white rounded-lg shadow-lg w-full mx-auto max-h-[90vh] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Product</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Price</label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">MRP</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax</label>
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight Amount</label>
            <input
              type="number"
              name="weightAmount"
              value={formData.weightAmount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight Unit</label>
            <select
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="kg">KG</option>
              <option value="gms">Gms</option>
              <option value="piece">Piece</option>
              <option value="pair">Pair</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.shortDescription}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleImageSelect}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
            {imageUploading ? (
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            ) : (
              <img
                src={formData.image}
                alt="Product"
                className="mt-4 w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>
        </form>
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
