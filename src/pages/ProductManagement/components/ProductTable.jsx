import React, { useState } from 'react';
import { CirclePlus, MoreVertical } from 'lucide-react';

// Dummy data for categories
const dummyCategories = [
  {
    categoryId: '1',
    CategoryName: 'Electronics',
    Subcategories: [
      { subcategoriesId: '1', subcategoryname: 'Phones' },
      { subcategoriesId: '2', subcategoryname: 'Laptops' },
      { subcategoriesId: '3', subcategoryname: 'Accessories' }
    ]
  },
  {
    categoryId: '2',
    CategoryName: 'Clothing',
    Subcategories: [
      { subcategoriesId: '4', subcategoryname: 'Men' },
      { subcategoriesId: '5', subcategoryname: 'Women' },
      { subcategoriesId: '6', subcategoryname: 'Kids' }
    ]
  }
];

// Dummy data for products
const dummyProducts = [
  {
    id: '1',
    productName: 'iPhone 14',
    category: '1',
    subcategory: '1',
    subcategoryName: 'Phones',
    costPrice: 800,
    sellingPrice: 999,
    tax: 18,
    stock: 50
  },
  {
    id: '2',
    productName: 'MacBook Pro',
    category: '1',
    subcategory: '2',
    subcategoryName: 'Laptops',
    costPrice: 1200,
    sellingPrice: 1499,
    tax: 18,
    stock: 30
  },
  {
    id: '3',
    productName: 'Men\'s T-Shirt',
    category: '2',
    subcategory: '4',
    subcategoryName: 'Men',
    costPrice: 15,
    sellingPrice: 29.99,
    tax: 12,
    stock: 100
  }
];

const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Edit Product</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={editedProduct.productName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost Price</label>
            <input
              type="number"
              name="costPrice"
              value={editedProduct.costPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={editedProduct.sellingPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={editedProduct.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedProduct)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductTable = ({ setAddForm }) => {
  const [products, setProducts] = useState(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");

    if (categoryId) {
      const filtered = products.filter((product) => product.category === categoryId);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    setSelectedSubcategory(subcategoryId);

    if (subcategoryId) {
      const filtered = products.filter((product) => product.subcategory === subcategoryId);
      setFilteredProducts(filtered);
    } else {
      const filtered = products.filter((product) => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  };

  const handleMenuClick = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setActiveMenu(null);
  };

  const handleUpdate = (updatedProduct) => {
    const newProducts = products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return <EditProductModal 
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
      onSave={handleUpdate}
    />;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden p-4">
      <div className="w-full flex max-sm:flex-col items-center justify-between py-4">
        <div className="flex items-center justify-center gap-10">
          <h1 className="text-2xl font-semibold">Product Management</h1>

          <div className="flex items-center mt-2 space-y-2 gap-6 text-sm">
            <div className="px-2 py-1 bg-white border-2">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-[10em] outline-none border-none"
              >
                <option value="">Select Category</option>
                {dummyCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.CategoryName}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div className="px-2 py-1 bg-white border-2 mt-0">
                <select
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="w-[12em] outline-none border-none"
                >
                  <option value="">Select Subcategory</option>
                  {dummyCategories
                    .find((cat) => cat.categoryId === selectedCategory)
                    ?.Subcategories.map((sub) => (
                      <option key={sub.subcategoriesId} value={sub.subcategoriesId}>
                        {sub.subcategoryname}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div 
          className="bg-purple-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600"
          onClick={() => setAddForm(true)}
        >
          <button className="text-md text-white flex font-medium gap-2 rounded-lg">
            <CirclePlus /> Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-gray-600 font-medium">No</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Product Name</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Sub Category</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Cost Price</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Selling Price</th>
              <th className="px-6 py-4 text-gray-600 font-medium">GST</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Stock</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 text-gray-500">{product.productName}</td>
                <td className="px-6 py-4 text-gray-500">{product.subcategoryName}</td>
                <td className="px-6 py-4 text-gray-500">{product.costPrice}</td>
                <td className="px-6 py-4 text-gray-500">{product.sellingPrice}</td>
                <td className="px-6 py-4 text-gray-500">{product.tax} %</td>
                <td className="px-6 py-4 text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 text-gray-500 relative">
                  <button
                    onClick={() => handleMenuClick(product.id)}
                    className="hover:bg-gray-100 p-1 rounded-full"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {activeMenu === product.id && (
                    <div className="absolute right-8 top-12 bg-white shadow-lg rounded-lg py-2 w-48 z-10">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Delete
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        View Details
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;