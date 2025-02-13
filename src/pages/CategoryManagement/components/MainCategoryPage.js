import React, { useState, useEffect } from "react";
import { MoreVertical, Plus, Edit, Trash2 } from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import { API_BASE_URL } from "../../../config/api";
import axios from "axios";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    // Add some mock data
    {
      _id: '1',
      categoryName: 'Sample Category 1',
      categoryType: 'Saree',
      categotyImage: 'https://via.placeholder.com/150'
    },
    {
      _id: '2',
      categoryName: 'Sample Category 2',
      categoryType: 'Others',
      categotyImage: 'https://via.placeholder.com/150'
    }
  ]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleAddCategory = async (categoryName, image, categoryType) => {
    // Mock adding a category
    const newCategory = {
      _id: Date.now().toString(),
      categoryName,
      categoryType,
      categotyImage: URL.createObjectURL(image)
    };
    setCategories([...categories, newCategory]);
    setShowAddModal(false);
  };

  const handleDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCategories(categories.filter(cat => cat._id !== categoryToDelete));
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setOpenMenuId(null);
  };

  const handleSaveEdit = (newImage, categoryType) => {
    if (newCategoryName.trim()) {
      const updatedCategories = categories.map(cat => {
        if (cat._id === editingCategory._id) {
          return {
            ...cat,
            categoryName: newCategoryName,
            categoryType,
            categotyImage: newImage ? URL.createObjectURL(newImage) : cat.categotyImage
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      setIsEditing(false);
      setEditingCategory(null);
      setNewCategoryName("");
    }
  };

  const toggleMenu = (e, categoryId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === categoryId ? null : categoryId);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.categoryName);
    setIsEditing(true);
    setOpenMenuId(null);
  };

  const ActionMenu = ({ category }) => (
    <div className="relative">
      <button
        onClick={(e) => toggleMenu(e, category._id)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical size={18} className="text-gray-500" />
      </button>

      {openMenuId === category._id && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => handleEdit(category)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={() => handleDelete(category._id)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const EditModal = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(
      editingCategory.categotyImage
    );
    const [editCategoryType, setEditCategoryType] = useState(
      editingCategory.categoryType
    );

    const handleImageSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          setSelectedImage(file);
          const imageUrl = URL.createObjectURL(file);
          setPreviewImage(imageUrl);
        } else {
          alert("Please select an image file");
        }
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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Edit Category</h2>

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
                  alt="Category"
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Category Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Category Type
            </label>
            <select
              value={editCategoryType}
              onChange={(e) => setEditCategoryType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Saree">Saree</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingCategory(null);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveEdit(selectedImage, editCategoryType)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <div className="flex flex-col items-center">
            {/* Delete Icon Circle */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={32} className="text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-2">Delete Category</h2>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Do you want to delete this category? This action can't be undone
            </p>

            {/* Buttons */}
            <div className="flex gap-4 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryImage = (imageUrl) => {
    // Add authorization header for image requests
    return (
      <img
        src={imageUrl}
        alt="Category"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = "/api/placeholder/64/64";
        }}
      />
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Category Management</h1>
          <span className="text-sm text-gray-500">
            {categories.length} categories
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 border-b">
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Product Image</h3>
          </div>
          <div className="col-span-4">
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
          </div>
          <div className="col-span-4">
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Action</h3>
          </div>
        </div>

        {categories.map((category) => (
          <div
            key={category._id}
            className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50"
          >
            <div className="col-span-2">
              <div className="w-16 h-16 overflow-hidden rounded">
                {renderCategoryImage(category.categotyImage)}
              </div>
            </div>
            <div className="col-span-4 flex items-center">
              <span className="text-sm">{category.categoryName}</span>
            </div>
            <div className="col-span-4 flex items-center">
              <span className="text-sm capitalize">
                {category.categoryType}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <ActionMenu category={category} />
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCategory}
        />
      )}

      {isEditing && <EditModal />}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => {
            setShowDeleteModal(false);
            setCategoryToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
