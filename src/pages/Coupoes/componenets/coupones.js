import React, { useState } from 'react';
import { PlusCircle, Copy, Pencil, Trash2, Filter } from 'lucide-react';

const CouponCard = ({ coupon, onEdit, onDelete }) => (
  <div className="bg-white border-2 border-purple-500 p-4 rounded-lg">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="font-medium text-gray-800">{coupon.name}</h3>
        <p className="text-sm text-gray-600">{coupon.product}</p>
        <p className="text-sm text-gray-600">
          {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">{coupon.code}</p>
        <div className="flex items-center gap-4 mt-2">
          <button className="text-sm text-purple-600 flex items-center gap-1 hover:text-purple-700">
            <Copy size={14} />
            Copy URL
          </button>
          <button 
            onClick={() => onEdit(coupon)} 
            className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-700"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(coupon.id)} 
            className="text-sm text-red-600 flex items-center gap-1 hover:text-red-700"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
      <div className="text-2xl font-bold text-purple-600">
        {coupon.value}{coupon.type === 'percentage' ? '%' : '$'} off
      </div>
    </div>
  </div>
);

const FilterSection = ({ filters, onFilterChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
    <div className="flex items-center gap-4 mb-4">
      <Filter size={20} className="text-gray-600" />
      <h3 className="font-medium">Filter Coupons</h3>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Type</label>
        <select 
          value={filters.type} 
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Status</label>
        <select 
          value={filters.status} 
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Product</label>
        <input
          type="text"
          value={filters.product}
          onChange={(e) => onFilterChange('product', e.target.value)}
          placeholder="Search by product"
          className="w-full p-2 border rounded-lg"
        />
      </div>
    </div>
  </div>
);

const CouponManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    product: ''
  });

  const initialFormState = {
    name: '',
    product: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    code: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCoupon) {
      setCoupons(coupons.map(c => 
        c.id === editingCoupon.id ? { ...formData, id: c.id } : c
      ));
      setEditingCoupon(null);
    } else {
      const newCoupon = {
        ...formData,
        id: Date.now(),
        code: `#UPK${Math.floor(Math.random() * 10000)}`
      };
      setCoupons([...coupons, newCoupon]);
    }
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredCoupons = coupons.filter(coupon => {
    return (
      (!filters.type || coupon.type === filters.type) &&
      (!filters.status || (
        filters.status === 'active' 
          ? new Date(coupon.endDate) >= new Date() 
          : new Date(coupon.endDate) < new Date()
      )) &&
      (!filters.product || coupon.product.toLowerCase().includes(filters.product.toLowerCase()))
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Coupons</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <PlusCircle size={20} />
            Create a coupon
          </button>
        )}
      </div>

      {!showForm && <FilterSection filters={filters} onFilterChange={handleFilterChange} />}

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">
            {editingCoupon ? 'Edit Coupon' : 'Create a coupon'}
          </h2>
          <p className="text-gray-600 mb-6">
            Coupons can be used to discount invoices, subscriptions, or entire customer accounts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same as previous version */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="First Purchase Discount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Sneakers shoe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discount Type</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="percentage"
                    checked={formData.type === 'percentage'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Percentage discount
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="fixed"
                    checked={formData.type === 'fixed'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Fixed amount
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {formData.type === 'percentage' ? 'Percentage off' : 'Amount off'}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg pr-8"
                />
                <span className="absolute right-3 top-2">
                  {formData.type === 'percentage' ? '%' : '$'}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                {editingCoupon ? 'Save changes' : 'Create coupon'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCoupon(null);
                  setFormData(initialFormState);
                }}
                className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {filteredCoupons.map(coupon => (
          <CouponCard 
            key={coupon.id} 
            coupon={coupon} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredCoupons.length === 0 && !showForm && (
        <div className="text-center text-gray-500 py-8">
          No coupons found. Create a new coupon to get started.
        </div>
      )}
    </div>
  );
};

export default CouponManagement;