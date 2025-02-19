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
  ArrowLeft,
  Printer,
  Pencil,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import orderService from "../../../services/orderService";
import { toast } from "react-toastify";
import placeholderImage from "../../../assets/images/placeholder-image.jpg";

const RefundModal = ({ onRequestClose, id, totalAmt, onRefund }) => {
  const [refundAmount, setRefundAmount] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Process Refund</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2"></label>
          <input
            type="number"
            value={refundAmount}
            onChange={(e) =>
              setRefundAmount(Math.min(totalAmt, Math.max(0, e.target.value)))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            max={totalAmt}
            min={0}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!refundAmount) {
                toast.error("Please enter a refund amount");
                return;
              }
              onRefund(refundAmount);
              onRequestClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Process Refund
          </button>
        </div>
      </div>
    </div>
  );
};

// ... existing code ...

const OrderDetails = ({ orderDetails, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(orderDetails);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });

  const [amountDetails, setAmountDetails] = useState({
    totalAmount: 0,
    taxPrice: 0,
    shippingPrice: 0,
    itemsPrice: 0,
  });

  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [shippingStatus, setShippingStatus] = useState(
    orderDetails.shippingStatus || "Processing"
  );
  const [isPacked, setIsPacked] = useState(
    orderDetails.shippingStatus === "Packed" ||
      orderDetails.shippingStatus === "Shipped" ||
      orderDetails.shippingStatus === "Delivered"
  );
  const [orderedItems, setOrderedItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(
    orderDetails.isPaid ? "Paid" : "Pending"
  );
  const [codPaid, setCodPaid] = useState(orderDetails.isPaid);

  const handleBack = () => {
    onBack();
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);
    try {
      // Update shipping status in backend
      const updatedOrder = await orderService.updateShippingStatus(
        orderData._id,
        newStatus
      );

      // Update local state with the response from backend
      setShippingStatus(updatedOrder.shippingStatus);
      setIsPacked(
        updatedOrder.shippingStatus === "Packed" ||
          updatedOrder.shippingStatus === "Shipped" ||
          updatedOrder.shippingStatus === "Delivered"
      );
      setOrderData(updatedOrder);

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update status");
      // Revert to previous status on error
      setShippingStatus(orderData.shippingStatus);
    }
    setLoading(false);
  };

  const handleRefundClick = (itemId) => {
    setSelectedItemId(itemId);
    setOpenRefundModal(true);
  };

  const handleRefund = async (amount) => {
    if (!selectedItemId) {
      toast.error("No item selected for refund");
      return;
    }

    setLoading(true);
    try {
      const orderItem = orderData.orderItems.find(
        (item) => item._id === selectedItemId
      );
      if (!orderItem) throw new Error("Order item not found");

      await orderService.processRefund(orderData._id, selectedItemId, amount);
      toast.success("Refund processed successfully");

      // Update the local state to show refunded status
      setOrderData((prev) => ({
        ...prev,
        orderItems: prev.orderItems.map((item) =>
          item._id === selectedItemId
            ? { ...item, refunded: true, refundAmount: amount }
            : item
        ),
      }));
    } catch (error) {
      toast.error(error.message || "Failed to process refund");
    }
    setLoading(false);
    setOpenRefundModal(false);
    setSelectedItemId(null);
  };

  const handleCodPaymentChange = async (event) => {
    const isPaid = event.target.checked;
    setLoading(true);
    try {
      // Update payment status in backend
      const updatedOrder = await orderService.updatePaymentStatus(
        orderData._id
      );

      // Update local state with the response from backend
      setCodPaid(updatedOrder.isPaid);
      setPaymentStatus(updatedOrder.isPaid ? "Paid" : "Pending");
      setOrderData(updatedOrder);

      toast.success("Payment status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update payment status");
      // Revert to previous state on error
      setCodPaid(orderData.isPaid);
      setPaymentStatus(orderData.isPaid ? "Paid" : "Pending");
    }
    setLoading(false);
  };

  const handlePaymentStatusChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);
    try {
      if (newStatus === "Paid") {
        await orderService.updateOrderToPaid(orderData._id);
      }
      setPaymentStatus(newStatus);
      setOrderData((prev) => ({
        ...prev,
        isPaid: newStatus === "Paid",
        paidAt: newStatus === "Paid" ? new Date() : null,
      }));
      toast.success("Payment status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update payment status");
      setPaymentStatus(orderData.isPaid ? "Paid" : "Pending");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (orderDetails) {
      // Update shipping address from order details
      const { shippingAddress } = orderDetails;
      setShippingAddress(shippingAddress);

      // Update amount details from order details
      setAmountDetails({
        totalAmount: orderDetails.totalPrice || 0,
        taxPrice: orderDetails.taxPrice || 0,
        shippingPrice: orderDetails.shippingPrice || 0,
        itemsPrice: orderDetails.itemsPrice || 0,
      });

      // Update shipping status
      setShippingStatus(orderDetails.shippingStatus || "Processing");
      setPaymentStatus(orderDetails.isPaid ? "Paid" : "Pending");

      // Update ordered items
      setOrderedItems(orderDetails.orderItems || []);
    }
  }, [orderDetails]);

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  if (!orderDetails) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          ORDER #{orderDetails._id.slice(-6)}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-purple-600 bg-white border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Back
          </button>
          <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Send Bill
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Customer Details Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                {shippingAddress.firstName?.charAt()}
                {shippingAddress.lastName?.charAt(0)}
              </div>
              <h3 className="text-purple-600 font-medium text-lg">
                Customer Details
              </h3>
            </div>
          </div>
          <div className="space-y-6 text-center">
            <div>
              <p className="font-medium text-gray-900 text-lg mb-1">
                {orderDetails.shippingAddress.firstName}{" "}
                {orderDetails.shippingAddress.lastName}
              </p>
              <p className="text-gray-500">
                {orderDetails.shippingAddress.email}
              </p>
            </div>
            <div>
              <h4 className="text-purple-600 font-medium mb-2">
                Delivery Address
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {orderDetails.shippingAddress.addressLine1}
                {orderDetails.shippingAddress.addressLine2 && (
                  <>
                    <br />
                    {orderDetails.shippingAddress.addressLine2}
                  </>
                )}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.pincode}`}
                <br />
                India
                <br />
                {orderDetails.shippingAddress.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Amount Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-purple-600 font-medium text-lg mb-6 text-center">
            Amount Details
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Payment Method</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {orderDetails.paymentMethod}
                </span>
                <span>💳</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Items Total</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.itemsPrice)}
                </span>
                <span>💰</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Tax</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.taxPrice)}
                </span>
                <span>💵</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Shipping</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.shippingPrice)}
                </span>
                <span>🚚</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1 border-t">
              <span className="text-gray-900 font-medium">Grand Total</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.totalAmount)}
                </span>
                <span>💸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-purple-600 font-medium text-lg mb-6 text-center">
            Order Status
          </h3>
          <div className="space-y-6 w-full">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ordered Location</p>
                  <p className="text-gray-900 font-medium">
                    {shippingAddress.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Order Date</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(orderDetails.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Payment Status
                </h4>
                {orderDetails.paymentMethod.toLowerCase() === "cod" ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="relative flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                          <IndianRupee className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Cash</p>
                          <p className="text-sm text-gray-500">
                            {codPaid ? "Payment collected" : "Payment pending"}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={codPaid}
                          onChange={handleCodPaymentChange}
                          disabled={loading}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                      </div>
                    </label>
                  </div>
                ) : (
                  <select
                    value={paymentStatus}
                    onChange={handlePaymentStatusChange}
                    disabled={loading}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Fulfillment Status
                </h4>
                <div className="relative">
                  <select
                    value={shippingStatus}
                    onChange={handleStatusChange}
                    disabled={loading}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Hold">Hold</option>
                    <option value="Packed">Packed</option>
                    {isPacked && (
                      <>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Ordered Products Table */}
        <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-purple-600 font-medium">Ordered Products</h3>
            <span className="text-sm text-gray-500">
              Number of ordered products: {orderedItems.length}
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 font-medium">Image</th>
                <th className="py-3 font-medium">Product Details</th>
                <th className="py-3 font-medium">Quantity</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium">Total</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orderedItems.map((item) => (
                <tr key={item._id} className="text-gray-700">
                  <td className="py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={handleImageError}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.qty}</td>
                  <td className="py-4">₹{formatPrice(item.price)}</td>
                  <td className="py-4">
                    ₹{formatPrice(item.price * item.qty)}
                  </td>
                  <td className="py-4">
                    {orderDetails.isPaid && (
                      <button
                        onClick={() => !item.refunded && handleRefundClick(item._id)}
                        disabled={item.refunded}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          item.refunded 
                            ? 'bg-green-100 text-green-600 cursor-default'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {item.refunded ? (
                          <div className="flex items-center gap-1">
                            <span>Refunded</span>
                          </div>
                        ) : (
                          "Refund"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Invoice */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-purple-600 font-medium">Order Invoice</h3>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <Printer size={16} />
                Print
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Subtotal</span>
                <span>₹{formatPrice(orderDetails.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Charges</span>
                <span>₹{formatPrice(orderDetails.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{formatPrice(orderDetails.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Order Amount</span>
                <span>₹{formatPrice(orderDetails.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={
                    orderDetails.isPaid ? "text-green-600" : "text-red-600"
                  }
                >
                  {orderDetails.isPaid
                    ? `Paid on ${new Date(
                        orderDetails.paidAt
                      ).toLocaleDateString()}`
                    : "Pending"}
                </span>
              </div>
              {orderDetails.isPaid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span>{orderDetails.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {openRefundModal && (
        <RefundModal
          id={orderDetails._id}
          totalAmt={orderDetails.totalPrice}
          onRequestClose={() => setOpenRefundModal(false)}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default OrderDetails;
