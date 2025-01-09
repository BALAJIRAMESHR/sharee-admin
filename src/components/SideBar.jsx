import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ active }) => {
  const navigate = useNavigate();

  const mainMenuItems = [
    { name: 'Dashboard', icon: <Home className='w-5'/> },
    { name: 'ProductManagement', icon: <Package className='w-5'/> },
    { name: 'CategoryManagement', icon: <BarChart2 className='w-5'/> },
    { name: 'Order', icon: <ShoppingCart className='w-5'/> },
    { name: 'User Management', icon: <Users className='w-5' /> },
    { name: 'Coupons', icon: <BarChart2 className='w-5' /> },
    { name: 'Inventory', icon: <Settings className='w-5'/> },
    { name: 'Marketing', icon: <BarChart2 className='w-5' /> },
  ];

  const onNavigate = (page) => {
    navigate(`/${page.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 flex items-center justify-center">
        <img src="/assets/header.svg" alt="Logo" className="w-24 h-24" />
      </div>
      <nav className="mt-4 ml-4">
        {mainMenuItems.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-3 text-gray-700 flex items-center gap-3 hover:bg-purple-50 hover:text-purple-600 cursor-pointer ${
              active === item.name 
                ? 'bg-purple-100 text-purple-600 border-l-4 border-purple-700' 
                : 'border-l-4 border-white'
            }`}
            onClick={() => onNavigate(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
