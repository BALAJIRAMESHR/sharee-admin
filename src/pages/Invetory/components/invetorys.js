import React, { useState } from "react";
import { Search, MoreVertical, Plus } from "lucide-react";

const InventoryManagement = () => {
  const [view, setView] = useState("list");
  const [products, setProducts] = useState([
    {
      id: "#789034",
      name: "Rani Pink Silk Saree",
      category: "Saree",
      status: "In stock",
      count: 86,
      vendor: "Cloud tail",
    },
    {
      id: "#789012",
      name: "Rani Pink Silk Saree",
      category: "Saree",
      status: "Out of Stock",
      count: 0,
      vendor: "-------",
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    status: "In Stock",
    category: "Saree",
    vendor: ""
  });

  const handleAddProduct = () => {
    const newProductEntry = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      name: newProduct.name,
      category: newProduct.category,
      status: newProduct.status,
      count: newProduct.quantity,
      vendor: newProduct.vendor
    };

    setProducts([...products, newProductEntry]);
    setView("list");
    
    // Reset new product form
    setNewProduct({
      name: "",
      quantity: 0,
      status: "In Stock",
      category: "Saree",
      vendor: ""
    });
  };

  const ListViewComponent = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <div className="flex-1 relative mr-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView("manage")}
              className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
            >
              <Plus size={20} />
              Add new product
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              Export as CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y">
              <tr>
                <th className="w-8 p-4">
                  <input type="checkbox" />
                </th>
                <th className="p-4 text-left">Product ID</th>
                <th className="p-4 text-left">Product Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Count</th>
                <th className="p-4 text-left">Vendor</th>
                <th className="w-8 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        item.status === "In stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded ${
                        item.count > 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {item.count}
                    </span>
                  </td>
                  <td className="p-4">{item.vendor}</td>
                  <td className="p-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>Showing 1 to {products.length} of {products.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-purple-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ManageInventoryComponent = () => (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Manage Inventory
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Enter Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1">Enter quantity to add</label>
            <div className="flex border rounded">
              <button 
                onClick={() => setNewProduct({...newProduct, quantity: Math.max(0, newProduct.quantity - 1)})}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="text"
                value={newProduct.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewProduct({...newProduct, quantity: value});
                }}
                className="flex-1 text-center focus:outline-none"
              />
              <button 
                onClick={() => setNewProduct({...newProduct, quantity: newProduct.quantity + 1})}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Select Status</label>
            <select 
              value={newProduct.status}
              onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Select product Category</label>
            <select 
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Saree</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Enter vendor name</label>
            <input
              type="text"
              value={newProduct.vendor}
              onChange={(e) => setNewProduct({...newProduct, vendor: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button 
            onClick={handleAddProduct}
            className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {view === "list" ? <ListViewComponent /> : <ManageInventoryComponent />}
    </div>
  );
};

export default InventoryManagement;