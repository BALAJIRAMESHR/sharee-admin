import React, { useState } from "react";
import { Upload, X, GripVertical } from "lucide-react";

const AddProduct = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    category: "Women",
    variant: "",
    description: "",
    actualPrice: "",
    sellingPrice: "",
    tax: "",
    couponCode: "",
    couponMethod: "",
    color: "",
    images: [],
    tags: [],
    stock: "",
    availability: "in-stock",
    sareeSize: "5.5",
    blouseSize: "0.80",
    materialCare: [],
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [isPriceSame, setIsPriceSame] = useState(false);
  const [materialCare, setMaterialCare] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (isPriceSame && name === "actualPrice") {
      setFormData((prev) => ({
        ...prev,
        sellingPrice: value,
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && formData.images.length < 6) {
      files.slice(0, 6 - formData.images.length).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, reader.result].slice(0, 6),
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.target.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.closest('.image-container')?.classList.add('border-purple-500');
  };

  const handleDragLeave = (e) => {
    e.target.closest('.image-container')?.classList.remove('border-purple-500');
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && formData.images.length < 6) {
      handleImageSelect({ target: { files } });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    if (formData.images.length === 1) {
      setSelectedImage(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    setFormData(prev => {
      const newImages = [...prev.images];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      return {
        ...prev,
        images: newImages
      };
    });

    e.target.closest('.image-container')?.classList.remove('border-purple-500');
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddMaterialCare = (care) => {
    if (!materialCare.includes(care)) {
      setMaterialCare([...materialCare, care]);
      setFormData((prev) => ({
        ...prev,
        materialCare: [...prev.materialCare, care],
      }));
    }
  };

  const handleRemoveMaterialCare = (careToRemove) => {
    setMaterialCare(materialCare.filter((care) => care !== careToRemove));
    setFormData((prev) => ({
      ...prev,
      materialCare: prev.materialCare.filter((care) => care !== careToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Code
              </label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Variant</label>
              <div className="flex gap-2">
                <select
                  name="variant"
                  value={formData.variant}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Kanchipuram Bridal">Kanchipuram Bridal</option>
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                </select>
                <button type="button" className="px-3 py-2 border rounded-md">
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="pre-order">Pre-Order</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Saree Size (meters)
              </label>
              <input
                type="number"
                step="0.1"
                name="sareeSize"
                value={formData.sareeSize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Blouse Size (meters)
              </label>
              <input
                type="number"
                step="0.01"
                name="blouseSize"
                value={formData.blouseSize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Actual Price
              </label>
              <input
                type="number"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Selling Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                disabled={isPriceSame}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPriceSame}
                onChange={(e) => {
                  setIsPriceSame(e.target.checked);
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      sellingPrice: prev.actualPrice,
                    }));
                  }
                }}
                className="rounded"
              />
              <label className="text-sm">
                Actual Price same as Selling Price
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg p-6"
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-purple-50 bg-opacity-90 flex items-center justify-center rounded-lg z-10">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-purple-600 stroke-1" />
                    <p className="text-purple-600 font-medium">
                      Drop your images here
                    </p>
                    <p className="text-sm text-purple-500">Release to upload</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-6">
                {formData.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="image-container relative bg-gray-50 p-2 rounded-lg group transition-all hover:shadow-md border-2 border-transparent"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="absolute top-1 left-1 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                      <GripVertical className="w-4 h-4 text-gray-600" />
                    </div>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-40 object-contain rounded-lg"
                      draggable={false}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition-all"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 6 && (
                  <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-2 cursor-pointer hover:bg-gray-100 transition-all hover:shadow-md ${formData.images.length === 0 ? 'col-span-3 h-40' : 'h-50'}`}>
                    <div className="text-center">
                      <Upload className={`mx-auto mb-2 stroke-1 ${formData.images.length === 0 ? 'w-10 h-10 text-gray-400' : 'w-10 h-10 text-gray-400'}`} />
                      <p className={`font-medium text-gray-600 ${formData.images.length === 0 ? 'text-sm' : 'text-sm'}`}>
                        Upload Product Images
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ({6 - formData.images.length} of 6 remaining) • PNG, JPG • 800x1200px
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tax (in percentage)
              </label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Coupon / Code
              </label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="Use Code PARTY 56689"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Coupons Method
              </label>
              <select
                name="couponMethod"
                value={formData.couponMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-select-</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Type Color Code"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tags"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Material & Care
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {materialCare.map((care, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                  >
                    {care}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterialCare(care)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add material & care instructions"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMaterialCare(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
