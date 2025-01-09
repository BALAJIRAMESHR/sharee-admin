import { Search } from 'lucide-react';
import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center bg-white text-black gap-4 px-4 py-2 rounded-full">
        <Search className="w-4 h-4 text-gray-500" />
        <input
        type="search"
        placeholder="Search"
        className="border-none outline-none bg-white border-gray-200 rounded-md"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 font-medium rounded-full"></div>
        <span>Admin Account</span>
      </div>
    </div>
  );
};

export default Header;
