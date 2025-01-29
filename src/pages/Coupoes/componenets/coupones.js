import React, { useState } from 'react';
import { Search, Plus, ChevronDown, X, Clock, ArrowLeft } from 'lucide-react';

// Utility functions
const generateCouponId = () => {
  return `#UPA${Math.floor(1000 + Math.random() * 9000)}`;
};

const getCurrentDateTime = () => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'short' });
  const day = now.getDate();
  const time = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  return `${month} ${day}, ${time}`;
};

// Product Selection Popup Component
const ProductSelectionPopup = ({ onClose, onSelect }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  
  const sampleProducts = [
    { id: 1, name: 'Rani Pink Zariwork Art Silk Saree', mrp: 3999, price: 2999, image: '/api/placeholder/60/60' },
    { id: 2, name: 'Rani Pink Zariwork Art Silk Saree', mrp: 3999, price: 2999, image: '/api/placeholder/60/60' },
    { id: 3, name: 'Rani Pink Zariwork Art Silk Saree', mrp: 3999, price: 2999, image: '/api/placeholder/60/60' }
  ];

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedProducts(sampleProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Apply to Specific products</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="relative">
            <select className="w-full p-2 border rounded-lg appearance-none">
              <option>Kanchipuram Bridal silk</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 text-gray-500" size={16} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Search by Product</label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 border rounded-lg pl-10"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center text-sm mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            Select All
          </label>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {sampleProducts.map((product) => (
              <div key={product.id} className="flex items-center p-2 border-b">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => {
                    setSelectedProducts(prev =>
                      prev.includes(product.id)
                        ? prev.filter(id => id !== product.id)
                        : [...prev, product.id]
                    );
                  }}
                  className="mr-4"
                />
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded mr-4" />
                <div>
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">
                    MRP ${product.mrp} ${product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(selectedProducts);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create coupon
          </button>
        </div>
      </div>
    </div>
  );
};



const CouponForm = ({ onClose, onSubmit, onBack }) => {
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    duration: 'forever',
    limitDateRange: false,
    limitRedemptions: false,
    selectedProducts: []
  });

  const handleSubmit = () => {
    const newCoupon = {
      id: Date.now(),
      name: formData.name,
      discount: formData.type === 'percentage' ? `${formData.value}%` : `${formData.value}₹`,
      product: 'Sneakers shoe',
      startDate: "Oct 2nd",
      endDate: "Oct 24th",
      code: generateCouponId(),
      createdAt: getCurrentDateTime()
    };
    onSubmit(newCoupon);
  };
  const handleBack = (e) => {
    e.preventDefault(); // Prevent default button behavior
    if (typeof onBack === 'function') {
      onBack();
    }
  };


  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto ">
        {/* Back button header */}
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Create a coupon</h2>
          <p className="text-sm text-gray-600 mb-6">
            Coupons can be used to discount invoices, subscriptions, or entire customer accounts.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="First purchase discount"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.type === 'percentage'}
                    onChange={() => setFormData({ ...formData, type: 'percentage' })}
                    className="mr-2"
                  />
                  Percentage discount
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.type === 'fixed'}
                    onChange={() => setFormData({ ...formData, type: 'fixed' })}
                    className="mr-2"
                  />
                  Fixed amount discount
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">
                {formData.type === 'percentage' ? 'Percentage off' : 'Amount off'}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
                <span className="absolute right-3 top-2">
                  {formData.type === 'percentage' ? '%' : '₹'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProductSelection(true)}
              className="flex items-center text-sm text-purple-600 hover:text-purple-700"
            >
              <Plus size={16} className="mr-1" />
              Apply to specific products
            </button>

            <div>
              <label className="block text-sm mb-2">Duration</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              >
                <option value="forever">Forever</option>
                <option value="once">Once</option>
                <option value="multiple">Multiple times</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.limitDateRange}
                  onChange={(e) => setFormData({ ...formData, limitDateRange: e.target.checked })}
                  className="mr-2"
                />
                Limit the date range when customers can redeem this coupon
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.limitRedemptions}
                  onChange={(e) => setFormData({ ...formData, limitRedemptions: e.target.checked })}
                  className="mr-2"
                />
                Limit the total number of times this coupon can be redeemed
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create coupon
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProductSelection && (
        <ProductSelectionPopup
          onClose={() => setShowProductSelection(false)}
          onSelect={(products) => {
            setFormData({ ...formData, selectedProducts: products });
            setShowProductSelection(false);
          }}
        />
      )}
    </div>
  );
};

// Coupon Ticket Component
const CouponTicket = ({ coupon, onBack }) => {
  const {
    name = "First Purchase Discount",
    product = "Sneakers shoe",
    discount = "30%",
    startDate = "Oct 2nd",
    endDate = "Oct 24th",
    id = generateCouponId(),
    createdAt = getCurrentDateTime()
  } = coupon || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Back button in header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        {/* Coupon Ticket */}
        <div className="relative">
          <div className="bg-purple-500 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full" />

            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-purple-100">{product}</p>
                <p className="text-purple-100">
                  {startDate} - {endDate}
                </p>
                <p className="text-purple-100">{id}</p>
                <div className="flex items-center text-purple-100 text-sm mt-4">
                  <Clock size={16} className="mr-2" />
                  {createdAt}
                </div>
              </div>

              <div className="text-4xl font-bold">
                {discount}
                <span className="block text-xl font-normal">off</span>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
                <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
          </div>

          <div className="absolute -left-2 top-0 bottom-0 w-4 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full" />
            ))}
          </div>
          <div className="absolute -right-2 top-0 bottom-0 w-4 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full" />
            ))}
          </div>
        </div>

        {/* Coupon Information */}
        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Coupon Details</h4>
            <p className="text-gray-600">
              This coupon provides a {discount} discount on {product}. Valid from {startDate} to {endDate}.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">How to Use</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Copy the coupon code: {id}</li>
              <li>Apply it at checkout</li>
              <li>Enjoy your discount!</li>
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Terms & Conditions</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Valid only during the specified date range</li>
              <li>Cannot be combined with other offers</li>
              <li>One-time use per customer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// Coupon Card Component
const CouponCard = ({ name, discount, product, startDate, endDate, code, createdAt, onClick }) => (
  <div 
    className="relative cursor-pointer group"
    onClick={onClick}
  >
    <div className="bg-purple-500 rounded-xl p-4 text-white relative overflow-hidden hover:bg-purple-600 transition-colors">
      {/* Left and Right cutouts */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-l-full" />

      {/* Coupon Content */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold">{name || 'First Purchase Discount'}</h3>
          <p className="text-sm text-purple-100">{product}</p>
          <p className="text-sm text-purple-100">
            {startDate} - {endDate}
          </p>
          <p className="text-sm text-purple-100">{code}</p>
          {createdAt && (
            <div className="flex items-center text-purple-100 text-xs mt-2">
              <Clock size={14} className="mr-1" />
              {createdAt}
            </div>
          )}
        </div>
        <div className="text-6xl font-bold mr-8 mt-4">
          {discount}
          <span className="block text-base font-normal">off</span>
        </div>
      </div>

      
    </div>

    {/* Dotted Edges */}
    <div className="absolute -left-1.5 top-0 bottom-0 w-3 flex flex-col justify-around">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-3 h-3 bg-white rounded-full" />
      ))}
    </div>
    <div className="absolute -right-1.5 top-0 bottom-0 w-3 flex flex-col justify-around">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-3 h-3 bg-white rounded-full" />
      ))}
    </div>
  </div>
);


// Main Coupon Management Component
const CouponManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      name: "First Purchase Discount",
      discount: '30%',
      product: 'Sneakers shoe',
      startDate: 'Oct 2nd',
      endDate: 'Oct 24th',
      code: '#UPA3509',
      createdAt: 'Oct 2, 10:04 AM'
    },
    {
      id: 2,
      name: "Holiday Special",
      discount: '45₹',
      product: 'Sneakers shoe',
      startDate: 'Oct 2nd',
      endDate: 'Oct 24th',
      code: '#UPA3510',
      createdAt: 'Oct 2, 11:30 AM'
    },
  ]);

  const handleAddCoupon = (newCoupon) => {
    setCoupons([...coupons, newCoupon]);
    setShowForm(false);
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCoupon) {
    return (
      <CouponTicket
        coupon={selectedCoupon}
        onBack={() => setSelectedCoupon(null)}
      />
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Coupons</h1>
        <div className="flex items-center justify-end mb-6">
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} />
              Create a coupon
            </button>
          )}
        </div>

        {showForm ? (
          <CouponForm 
            onClose={() => setShowForm(false)} 
            onSubmit={handleAddCoupon}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                {...coupon}
                onClick={() => setSelectedCoupon(coupon)}
              />
            ))}
            {filteredCoupons.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No coupons found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;