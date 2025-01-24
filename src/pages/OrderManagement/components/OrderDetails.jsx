import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Truck, 
  IndianRupee,
  Building2,
  User,
  Map,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Mock RefundModal component
const RefundModal = ({ onRequestClose, id, totalAmt }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2>Process Refund</h2>
        <p>Total Amount: ₹{totalAmt/100}</p>
        <button onClick={onRequestClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

function OrderDetails({ orderDetails: initialOrderDetails }) {
  const orderedProducts = [
    {
      id: 1,
      image: "/api/placeholder/100/100",
      name: "Sample Product 1",
      quantity: 2,
      price: "999.99"
    },
    {
      id: 2,
      image: "/api/placeholder/100/100",
      name: "Sample Product 2",
      quantity: 1,
      price: "1499.99"
    }
  ];
  
  const [shippingAddress, setShippingAddress] = useState({
    shippingName: "John Doe",
    shippingAddress1: "123 Main St",
    shippingAddress2: "Apt 4B",
    shippingState: "Karnataka",
    shippingPincode: "560001",
    shippingphNum: "9876543210",
    shippingEmail: "john@example.com"
  });
  
  const [amountDetails, setAmountDetails] = useState({
    totalAmount: 349900,
    gst: 1800,
    shippingCharge: 100
  });
  
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [shippingStatus, setShippingStatus] = useState(initialOrderDetails?.Status || 'New');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setShippingStatus(value);
    // Simulating success toast notification
    console.log('Status updated successfully');
  };

  const handleRefund = () => {
    setOpenRefundModal(true);
  };

  useEffect(() => {
    if (initialOrderDetails) {
      setShippingAddress(initialOrderDetails.shippingInfo);
      setAmountDetails({
        totalAmount: initialOrderDetails.shippingInfo.totalAmount,
        gst: initialOrderDetails.shippingInfo.totalGST,
        shippingCharge: initialOrderDetails.shippingInfo.shippingCharge,
      });
    }
  }, [initialOrderDetails]);

  // const getStatusColor = (status) => {
  //   const colors = {
  //     New: "bg-blue-100 text-blue-800",
  //     Processing: "bg-yellow-100 text-yellow-800",
  //     Hold: "bg-red-100 text-red-800",
  //     Packed: "bg-purple-100 text-purple-800",
  //     Shipped: "bg-indigo-100 text-indigo-800",
  //     Delivered: "bg-green-100 text-green-800"
  //   };
  //   return colors[status] || "bg-gray-100 text-gray-800";
  // };

  return (
    <div className="p-6 space-y-6">
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping Address Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Shipping Address</h2>
            <MapPin className="h-5 w-5 text-gray-500" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{shippingAddress.shippingName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span>{shippingAddress.shippingAddress1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-gray-500" />
              <span>{shippingAddress.shippingAddress2}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{shippingAddress.shippingState}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{shippingAddress.shippingPincode}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{shippingAddress.shippingphNum}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{shippingAddress.shippingEmail}</span>
            </div>
          </div>
        </div>

        {/* Amount Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Amount Details</h2>
            <IndianRupee className="h-5 w-5 text-gray-500" />
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping Charges</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                ₹{amountDetails.shippingCharge}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                ₹{amountDetails.totalAmount / 100}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Refunded Amount</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                ₹{initialOrderDetails?.refundedAmt || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Grant Total</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800">
                ₹{(amountDetails.totalAmount / 100) - (initialOrderDetails?.refundedAmt || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Status Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Shipping Status</h2>
            <Truck className="h-5 w-5 text-gray-500" />
          </div>
          <div className="p-4">
            <select
              value={shippingStatus}
              onChange={handleStatusChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="New">New</option>
              <option value="Processing">Processing</option>
              <option value="Hold">Hold</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products and Refund Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ordered Products Card */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Ordered Products</h2>
            <Package className="h-5 w-5 text-gray-500" />
          </div>
          <div className="p-4 space-y-4">
            {orderedProducts.length > 0 ? (
              orderedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg bg-gray-50 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-24 h-24">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{product.name}</p>
                      <span className="inline-block px-2 py-1 text-sm bg-gray-100 rounded">
                        Qty: {product.quantity}
                      </span>
                    </div>
                    <span className="py-1 bg-gray-100 rounded-full text-gray-800 px-3">
                      ₹{(parseFloat(product.price) * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No products found in this order.
              </div>
            )}
          </div>
        </div>

        {/* Refund Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Refund Payment</h2>
          </div>
          <div className="p-4 space-y-4">
            <button 
              onClick={handleRefund}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Process Refund
            </button>
          </div>
        </div>
      </div>

      {openRefundModal && (
        <RefundModal
          onRequestClose={() => setOpenRefundModal(false)}
          id={initialOrderDetails?.id}
          totalAmt={amountDetails.totalAmount}
        />
      )}
    </div>
  );
}

export default OrderDetails;