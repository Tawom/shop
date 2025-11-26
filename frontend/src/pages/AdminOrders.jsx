import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import Loading from "../components/Loading";

const AdminOrders = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchOrders = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getAllOrders({
        signal: controller.signal,
      });
      // Ensure orders is always an array
      const ordersData = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];
      setOrders(ordersData);
      setRetryCount(0);
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          "Request timed out. The server is taking too long to respond. Please try again."
        );
      } else if (err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch orders. Please try again."
        );
      }
      console.error("Failed to fetch orders:", err);
      setOrders([]); // Set to empty array on error
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`Update order status to ${newStatus}?`)) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      setUpdatingOrderId(orderId);
      await adminAPI.updateOrderStatus(orderId, newStatus, {
        signal: controller.signal,
      });

      // Optimistically update the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      if (err.name === "AbortError") {
        alert("Request timed out. Please try again.");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to update order status. Please try again."
        );
      }
      // Refresh orders on error to ensure consistency
      fetchOrders();
    } finally {
      clearTimeout(timeoutId);
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const matchesStatus = statusFilter
          ? order.status === statusFilter
          : true;
        const matchesSearch = searchTerm
          ? order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.username
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesStatus && matchesSearch;
      })
    : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loading />
          <p className="mt-4 text-gray-600">Loading orders...</p>
          <p className="mt-2 text-sm text-gray-500">
            This may take a moment if there are many orders
          </p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Failed to Load Orders
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again {retryCount > 0 && `(${retryCount})`}
              </button>
              <Link
                to="/admin/dashboard"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            View and manage all customer orders
            {Array.isArray(orders) && orders.length > 0 && (
              <span className="ml-2 text-sm">
                ({orders.length} total order{orders.length !== 1 ? "s" : ""})
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRetry}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          <Link
            to="/admin/dashboard"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {error && orders.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold">Warning</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, customer name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">
            {Array.isArray(orders) ? orders.length : 0}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-800">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {Array.isArray(orders)
              ? orders.filter((o) => o.status === "Pending").length
              : 0}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-sm text-blue-800">Processing</p>
          <p className="text-2xl font-bold text-blue-900">
            {Array.isArray(orders)
              ? orders.filter((o) => o.status === "Processing").length
              : 0}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-4">
          <p className="text-sm text-purple-800">Shipped</p>
          <p className="text-2xl font-bold text-purple-900">
            {Array.isArray(orders)
              ? orders.filter((o) => o.status === "Shipped").length
              : 0}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-800">Delivered</p>
          <p className="text-2xl font-bold text-green-900">
            {Array.isArray(orders)
              ? orders.filter((o) => o.status === "Delivered").length
              : 0}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      {searchTerm || statusFilter
                        ? "No orders match your filters"
                        : "No orders yet"}
                    </p>
                    <p className="text-sm mt-2">
                      {searchTerm || statusFilter
                        ? "Try adjusting your search or filter criteria"
                        : "Orders will appear here once customers place them"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id?.slice(-8).toUpperCase() || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.user?.username || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.orderItems?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.paymentMethod || "N/A"}
                      </div>
                      <div className="text-xs">
                        {order.isPaid ? (
                          <span className="text-green-600">Paid</span>
                        ) : (
                          <span className="text-yellow-600">Unpaid</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        disabled={updatingOrderId === order._id}
                        className={`px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          updatingOrderId === order._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {updatingOrderId === order._id ? (
                        <span className="ml-2 text-gray-400 text-xs">
                          Updating...
                        </span>
                      ) : (
                        <Link
                          to={`/order/${order._id}`}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Revenue Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              $
              {Array.isArray(orders)
                ? orders
                    .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    .toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid Orders</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {Array.isArray(orders)
                ? orders
                    .filter((o) => o.isPaid)
                    .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    .toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">
              $
              {Array.isArray(orders)
                ? orders
                    .filter((o) => !o.isPaid)
                    .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    .toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
