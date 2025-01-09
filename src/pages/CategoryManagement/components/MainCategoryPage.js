import React, { useState, useEffect } from 'react';
import { MoreVertical, Plus, Edit, Trash2 } from 'lucide-react';

const AddCategoryModal = ({ onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onAdd(categoryName, selectedImage);
      onClose();
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

        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg mb-4 p-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected category"
              className="w-full h-48 object-cover rounded-lg"
            />
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

        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!categoryName.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      image: "/path/to/kanchipuram-soft.jpg",
      name: "Kanchipuram pure soft silk"
    },
    {
      id: 2,
      image: "/path/to/kanchipuram-bridal.jpg",
      name: "Kanchipuram bridal silk"
    },
    {
      id: 3,
      image: "/path/to/kanchipuram-pure.jpg",
      name: "Kanchipuram pure silk"
    },
    {
      id: 4,
      image: "/path/to/brocade.jpg",
      name: "Brocade kanchipuram silk"
    },
    {
      id: 5,
      image: "/path/to/ikat.jpg",
      name: "IKAT"
    },
    {
      id: 6,
      image: "/path/to/semi-silk.jpg",
      name: "Semi silk"
    },
    {
      id: 7,
      image: "/path/to/art-silk.jpg",
      name: "Art silk"
    },
    {
      id: 8,
      image: "/path/to/kubera.jpg",
      name: "Kubera pattu/ soft silk"
    },
    {
      id: 9,
      image: "/path/to/mysuru.jpg",
      name: "Mysuru silk"
    },
    {
      id: 10,
      image: "/path/to/banarasi.jpg",
      name: "Banarasi"
    }
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = (e, categoryId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === categoryId ? null : categoryId);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIsEditing(true);
    setOpenMenuId(null);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    if (newCategoryName.trim()) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: newCategoryName }
          : cat
      ));
      setIsEditing(false);
      setEditingCategory(null);
      setNewCategoryName('');
    }
  };

  const handleAddCategory = (categoryName, image) => {
    const newCategory = {
      id: categories.length + 1,
      name: categoryName,
      image: image || '/api/placeholder/64/64'
    };
    setCategories([...categories, newCategory]);
  };

  const ActionMenu = ({ category }) => (
    <div className="relative">
      <button 
        onClick={(e) => toggleMenu(e, category.id)} 
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical size={18} className="text-gray-500" />
      </button>
      
      {openMenuId === category.id && (
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
              onClick={() => handleDelete(category.id)}
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

  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Category</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Name</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
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
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Category Management</h1>
          <span className="text-sm text-gray-500">{categories.length} categories</span>
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
          <div className="col-span-8">
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Action</h3>
          </div>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50">
            <div className="col-span-2">
              <div className="w-16 h-16 overflow-hidden rounded">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/64/64';
                  }}
                />
              </div>
            </div>
            <div className="col-span-8 flex items-center">
              <span className="text-sm">{category.name}</span>
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
    </div>
  );
};

export default CategoryManagement;