import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';

const OrderTable = ({ setDetails, setOrderDetails }) => {
  // Sample data to replicate Firebase data structure
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: '001',
      createdAt: new Date(),
      shippingInfo: {
        shippingName: 'John Doe',
        shippingphNum: '9856432210',
        totalAmount: 119900
      },
      paidStatus: 'Paid',
      Status: 'Processing'
    },
    {
      id: '2',
      orderNumber: '002',
      createdAt: new Date(),
      shippingInfo: {
        shippingName: 'Jane Smith',
        shippingphNum: '9856432211',
        totalAmount: 89900
      },
      paidStatus: 'Paid',
      Status: 'Shipped'
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleDelete = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };

  const handleView = (order) => {
    setOrderDetails(order);
  };

  return (
    <div className="w-full rounded-lg shadow-sm overflow-hidden">
      <div className="w-full flex max-sm:flex-col items-center justify-between py-4">
        <div className="flex items-center justify-center gap-10">
          <h1 className="text-2xl font-semibold">Orders Management</h1>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-gray-600 font-medium">No</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Order Details</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Customer Details</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Cost Price</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex flex-col">
                    <div>ORD#{order.orderNumber}</div>
                    <div>{order.createdAt.toLocaleString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex flex-col">
                    <div>{order.shippingInfo.shippingName}</div>
                    <div>{order.shippingInfo.shippingphNum}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  Rs. {order.shippingInfo.totalAmount / 100}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex flex-col">
                    <div>{order.paidStatus}</div>
                    <div>{order.Status}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 relative">
                  <div className="flex bg-white py-2 z-10">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <Trash2 className="" />
                    </button>
                    <button
                      onClick={() => handleView(order)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <Eye className="" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;