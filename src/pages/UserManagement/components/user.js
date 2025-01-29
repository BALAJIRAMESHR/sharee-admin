import React, { useState } from 'react';
import { Edit, X } from 'lucide-react';

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
    }
  ]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    permissions: {
      productManagement: false,
      categoryManagement: false,
      order: false,
      coupons: false,
      inventory: false,
      marketing: false,
      analytics: false
    }
  });

  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    permissions: {
      productManagement: false,
      categoryManagement: false,
      order: false,
      coupons: false,
      inventory: false,
      marketing: false,
      analytics: false
    }
  });

  const handleCreateUser = () => {
    const newUserData = {
      id: users.length + 1,
      name: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      location: newUser.address,
      isActive: true,
      permissions: newUser.permissions
    };

    setUsers([...users, newUserData]);
    setIsCreateModalOpen(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      permissions: {
        productManagement: false,
        categoryManagement: false,
        order: false,
        coupons: false,
        inventory: false,
        marketing: false,
        analytics: false
      }
    });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      permissions: { ...user.permissions }
    });
  };

  const handleSaveEdit = (id) => {
    setUsers(users.map(user => 
      user.id === id ? {
        ...user,
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        location: editUser.location,
        permissions: editUser.permissions
      } : user
    ));
    setEditingId(null);
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setNewUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleEditPermissionChange = (permission) => {
    setEditUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg border border-blue-200 p-8 w-full">
      <div className="border-b border-dotted border-gray-200 pb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-base font-medium">
              {user.isActive ? 'User Active' : 'User Inactive'}
            </span>
          </div>
          <button 
            onClick={() => handleEdit(user)}
            className="p-3 rounded-full bg-purple-100 hover:bg-purple-200"
          >
            <Edit className="w-5 h-5 text-purple-600" />
          </button>
        </div>

        <div className="space-y-4 mt-6">
          {editingId === user.id ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">👤</span>
                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditUserChange}
                  className="flex-1 border-2 border-blue-200 rounded-lg p-2 text-base focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <input
                  type="text"
                  name="phone"
                  value={editUser.phone}
                  onChange={handleEditUserChange}
                  className="flex-1 border-2 border-blue-200 rounded-lg p-2 text-base focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditUserChange}
                  className="flex-1 border-2 border-blue-200 rounded-lg p-2 text-base focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <input
                  type="text"
                  name="location"
                  value={editUser.location}
                  onChange={handleEditUserChange}
                  className="flex-1 border-2 border-blue-200 rounded-lg p-2 text-base focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <span className="text-xl text-gray-500">👤</span>
                <span className="text-base">{user.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl text-gray-500">📞</span>
                <span className="text-base">{user.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl text-gray-500">✉️</span>
                <span className="text-base">{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-4">
                  <span className="text-xl text-gray-500">📍</span>
                  <span className="text-base">{user.location}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.productManagement : user.permissions.productManagement}
              onChange={() => editingId === user.id && handleEditPermissionChange('productManagement')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Product Management</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.categoryManagement : user.permissions.categoryManagement}
              onChange={() => editingId === user.id && handleEditPermissionChange('categoryManagement')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Category Management</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.order : user.permissions.order}
              onChange={() => editingId === user.id && handleEditPermissionChange('order')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Order</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.coupons : user.permissions.coupons}
              onChange={() => editingId === user.id && handleEditPermissionChange('coupons')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Coupons</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.inventory : user.permissions.inventory}
              onChange={() => editingId === user.id && handleEditPermissionChange('inventory')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Inventory</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.marketing : user.permissions.marketing}
              onChange={() => editingId === user.id && handleEditPermissionChange('marketing')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Marketing</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingId === user.id ? editUser.permissions.analytics : user.permissions.analytics}
              onChange={() => editingId === user.id && handleEditPermissionChange('analytics')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-base">Analytics</span>
          </div>
        </div>
      </div>

      {editingId === user.id && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setEditingId(null)}
            className="px-6 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveEdit(user.id)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-base"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );

  const CreateUserModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isCreateModalOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium">Create New User</h2>
          <button 
            onClick={() => setIsCreateModalOpen(false)} 
            className="text-gray-500 text-2xl hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="text-base mb-2">Username</div>
              <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">👤</span>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  className="flex-1 outline-none text-base"
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <div className="text-base mb-2">Email</div>
              <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="flex-1 outline-none text-base"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <div className="text-base mb-2">Password</div>
              <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="flex-1 outline-none text-base"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <div className="text-base mb-2">Phone Number</div>
              <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">📞</span>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  className="flex-1 outline-none text-base"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div>
              <div className="text-base mb-2">Address</div>
              <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <span className="text-xl">📍</span>
                <input
                  type="text"
                  name="address"
                  value={newUser.address}
                  onChange={handleNewUserChange}
                  className="flex-1 outline-none text-sm"
                  placeholder="Address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.productManagement}
                onChange={() => handlePermissionChange('productManagement')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Product Management</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.categoryManagement}
                onChange={() => handlePermissionChange('categoryManagement')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Category Management</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.order}
                onChange={() => handlePermissionChange('order')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Order</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.coupons}
                onChange={() => handlePermissionChange('coupons')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Coupons</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.inventory}
                onChange={() => handlePermissionChange('inventory')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Inventory</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.marketing}
                onChange={() => handlePermissionChange('marketing')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Marketing</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.permissions.analytics}
                onChange={() => handlePermissionChange('analytics')}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Analytics</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="px-4 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateUser}
            className="px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Create User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <CreateUserModal />
    </div>
  );
};

export default UserManagement;