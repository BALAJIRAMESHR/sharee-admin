import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Manikandan G',
      phone: '63687 54210',
      email: 'manimanila@2gmail.com',
      location: '08, Raji st, CBE',
      isActive: true,
      permissions: {
        productManagement: false,
        categoryManagement: true,
        order: false,
        customerManagement: true,
        coupons: false,
        inventory: true,
        analytics: true,
        marketing: true
      }
    },
    {
      id: 2,
      name: 'Sharmila T',
      phone: '63687 54210',
      email: 'Sharmila0@2gmail.com',
      location: '08, Raji st, CBE',
      isActive: true,
      permissions: {
        productManagement: false,
        categoryManagement: true,
        order: true,
        customerManagement: true,
        coupons: true,
        inventory: true,
        analytics: true,
        marketing: true
      }
    },
    {
      id: 3,
      name: 'Boobesh G',
      phone: '63687 54210',
      email: 'manimanila@2gmail.com',
      location: '',
      isActive: false,
      permissions: {
        productManagement: false,
        categoryManagement: false,
        order: false,
        customerManagement: false,
        coupons: false,
        inventory: false,
        analytics: true,
        marketing: false
      }
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: ''
  });

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      phone: user.phone,
      email: user.email,
      location: user.location
    });
  };

  const handleSave = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, ...editForm }
        : user
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      phone: '',
      email: '',
      location: ''
    });
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg p-6 mb-4 shadow-sm w-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {user.isActive ? 'User Active' : 'User Unactive'}
          </span>
        </div>
        <div className="flex gap-2">
          {editingId === user.id ? (
            <>
              <button 
                onClick={() => handleSave(user.id)}
                className="p-2 rounded-full bg-green-100 hover:bg-green-200"
              >
                <Save className="w-4 h-4 text-green-600" />
              </button>
              <button 
                onClick={handleCancel}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleEdit(user)}
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200"
            >
              <Edit className="w-4 h-4 text-purple-600" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-4 w-full">
        {editingId === user.id ? (
          // Edit Form
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">👤</div>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                className="flex-1 p-2 border rounded-md"
                placeholder="Name"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">📞</div>
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                className="flex-1 p-2 border rounded-md"
                placeholder="Phone"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">✉️</div>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                className="flex-1 p-2 border rounded-md"
                placeholder="Email"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">📍</div>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleChange}
                className="flex-1 p-2 border rounded-md"
                placeholder="Address"
              />
            </div>
          </div>
        ) : (
          // Display Mode
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">👤</div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">📞</div>
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">✉️</div>
              <span className="text-sm">{user.email}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">📍</div>
                <span className="text-sm">{user.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.productManagement}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Product Management</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.categoryManagement}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Category Management</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.order}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Order</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.customerManagement}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Customer Management</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.coupons}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Coupons</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.inventory}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Inventory</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.analytics}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user.permissions.marketing}
              readOnly
              className="rounded border-gray-300"
            />
            <span className="text-sm">Marketing</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto"> {/* Increased width */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">User Management</h1>
            <span className="text-sm text-gray-500">{users.length} user's</span>
          </div>
        </div>
        <div className="space-y-4">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;