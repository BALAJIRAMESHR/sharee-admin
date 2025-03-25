import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import orderService from "../../../services/orderService";
import { toast } from "react-toastify";
import { handleImageError, getImageUrl } from "../../../utils/imageUtils";

const OrderTable = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All orders");
  const ordersPerPage = 10;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      // Sort orders by createdAt date in descending order (latest first)
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await orderService.updateOrderStatus(orderToDelete._id, {
        isDeleted: true,
      });
      toast.success("Order deleted successfully");
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Failed to delete order");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const handleView = (order) => {
    onSelectOrder(order);
  };

  // Replace filter tabs with fulfillment status options
  const fulfillmentStatuses = [
    "All orders",
    "Processing",
    "Hold",
    "Packed",
    "Shipped",
    "Delivered",
  ];

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  // Filter orders based on shipping status (keeping the sorted order)
  const filteredOrders = orders.filter((order) => {
    if (!order.isDeleted) {
      if (filter === "All orders") {
        return true;
      }
      return order.shippingStatus === filter;
    }
    return false;
  });

  // Update pagination calculation to use filtered orders
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  console.log(orders);

  return (
    <div className="w-full">
      {/* Replace Filter Tabs with Dropdown */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-48 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {fulfillmentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-gray-600 font-medium">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">
                Order Detail
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">
                Customer Detail
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="px-6 py-4 text-gray-600 font-medium">
                Total Amount
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ORDER#{order._id.slice(-6)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</span>
                    <br />
                    <span className="text-gray-500">
                      {order.shippingAddress.phoneNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={
                        order.isPaid ? "text-green-500" : "text-red-500"
                      }
                    >
                      {order.isPaid
                        ? `Paid on ${new Date(
                            order.paidAt
                          ).toLocaleDateString()}`
                        : "Pending"}
                    </span>
                    <span
                      className={`text-sm ${
                        order.shippingStatus === "Delivered"
                          ? "text-green-500"
                          : order.shippingStatus === "Shipped"
                          ? "text-blue-500"
                          : order.shippingStatus === "Packed"
                          ? "text-orange-500"
                          : order.shippingStatus === "Hold"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {order.shippingStatus || "Processing"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">₹{order.totalPrice}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(order)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this order?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Showing {indexOfFirstOrder + 1} to{" "}
          {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
          {filteredOrders.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : "border hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
