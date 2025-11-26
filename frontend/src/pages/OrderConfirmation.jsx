import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isAuthenticated, navigate]);

  const refreshOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order details");
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await orderAPI.cancelOrder(orderId);
      refreshOrder(); // Refresh order details
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h2 className="text-lg font-bold">Order Placed Successfully!</h2>
            <p className="text-sm">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="text-gray-700">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">
                <span className="font-semibold">Phone:</span>{" "}
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.shippingPrice === 0
                      ? "Free"
                      : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-600">{order.paymentMethod}</p>
              <p className="text-sm text-gray-500 mt-1">
                {order.isPaid ? (
                  <span className="text-green-600 font-semibold">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-yellow-600 font-semibold">
                    Not Paid
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/profile?tab=orders"
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700"
              >
                View All Orders
              </Link>
              <Link
                to="/"
                className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-md hover:bg-gray-300"
              >
                Continue Shopping
              </Link>
              {order.status === "Pending" && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
