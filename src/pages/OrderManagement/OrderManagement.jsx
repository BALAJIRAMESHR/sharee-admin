import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import OrderTable from './components/OrderTable';
import OrderDetails from './components/OrderDetails';

const OrdersManagement = () => {
  const [activePage, setActivePage] = useState('Order Management');
  const [Details, setDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleNavigate = (page) => {
    setActivePage(page);
    console.log(`Navigated to: ${page}`);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4F4]">
      <div className='max-sm:hidden flex'>
        <Sidebar active={activePage} onNavigate={handleNavigate} />
      </div>
      <div className="flex-1 py-6 px-8 max-h-screen min-h-screen overflow-scroll">
        <Header />
        {!Details && !orderDetails && <OrderTable setDetails={setDetails} orderDetails={orderDetails} setOrderDetails={setOrderDetails} />}
        {orderDetails && <OrderDetails orderDetails={orderDetails} />}
      </div>
    </div>
  );
};

export default OrdersManagement;
