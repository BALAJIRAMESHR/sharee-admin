import React, { useState, useEffect } from "react";
import { MoreVertical, Plus, Edit, Trash2 } from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import { API_BASE_URL } from "../../../config/api";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await fetch(`${API_BASE_URL}/categories/allcategory`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Categories fetched:", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories. Please try again later.");
    }
  };

  const handleAddCategory = async (categoryName, image, categoryType) => {
    try {
      const imageName = image.name;

      const response = await fetch(`${API_BASE_URL}/categories/addcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName,
          categoryType,
          categotyImage: imageName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add category");
      }

      const result = await response.json();
      console.log("Success:", result);

      await fetchCategories();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert(`Failed to add category: ${error.message}`);
    }
  };

  const handleDelete = async (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/deletecategory/${categoryToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      await fetchCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleSaveEdit = async (newImage, categoryType) => {
    if (newCategoryName.trim()) {
      try {
        const imageName = newImage
          ? newImage.name
          : editingCategory.categotyImage.split("/").pop();

        const response = await fetch(
          `${API_BASE_URL}/categories/editcategory/${editingCategory._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryName: newCategoryName,
              categoryType: categoryType,
              categotyImage: imageName,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update category");
        }

        await fetchCategories();
        setIsEditing(false);
        setEditingCategory(null);
        setNewCategoryName("");
      } catch (error) {
        console.error("Error updating category:", error);
        alert(error.message || "Failed to update category. Please try again.");
      }
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
                <img
                  src={category.categotyImage}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/64/64";
                  }}
                />
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
