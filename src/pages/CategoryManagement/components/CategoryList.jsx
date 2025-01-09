import { CirclePlus, Edit2, Trash2 } from 'lucide-react';
import React from 'react';

const CategoryList = ({ categories, onEdit, onDelete, setIsAdding }) => {

  const handleEdit = (category) => {
    console.log('Editing category:', category); // Log the category being edited
    onEdit(category); // Pass category data to the parent for editing
  }

  const handleDelete = (category) => {
    console.log('Deleting category:', category); // Log the category being deleted
    onDelete(category); // Pass category data to the parent for deletion
  }

  return (
    <div className="rounded-lg shadow">

      <div className='flex items-center justify-between py-4'>
        <h1 className="text-2xl font-semibold">Category Management</h1> 
        <div className="bg-purple-500 px-4 py-2 rounded-lg" onClick={() => {setIsAdding(true)}}>
          <button className="text-md text-white flex font-medium gap-2 rounded-lg">
            <CirclePlus className="" /> Add Category
          </button>
        </div>
      </div> 

      <table className="bg-white w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="px-6 py-4 text-gray-600 font-medium text-left">No</th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">Category</th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">Subcategories</th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
            {categories.map((category, index) => (
                <tr key={category.categoryId} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{category.CategoryName}</td>
                    <td className="px-6 py-4">
                    {category.Subcategories?.map((sub) => sub.subcategoryname).join(", ")}
                    </td>
                    <td className="px-6 py-4 flex items-center min-w-fit justify-center">
                      <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700 mx-2">
                          <Edit2 />
                      </button>
                      <button onClick={() => handleDelete(category)} className="text-red-500 hover:text-red-700">
                          <Trash2 />
                      </button>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
