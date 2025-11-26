import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI, orderAPI } from "../services/api";
import Loading from "../components/Loading";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all"); // all, pending, processing, shipped, delivered, cancelled

  // Profile update state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchProfile();

    // Fetch orders if orders tab is active
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [isAuthenticated, navigate, activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setUpdateLoading(true);

    try {
      const response = await userAPI.updateProfile({ username, email });
      setProfile(response.data.user);
      setUpdateSuccess("Profile updated successfully!");

      // Update user in localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...storedUser, username, email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      setUpdateError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);

    try {
      await userAPI.changePassword({ currentPassword, newPassword });
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);

    try {
      await userAPI.deleteAccount(deletePassword);
      logout();
      navigate("/");
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Failed to delete account"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "password"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("delete")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "delete"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Delete Account
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Update Profile Information
              </h2>

              {updateSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {updateSuccess}
                </div>
              )}

              {updateError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {updateError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={3}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {updateLoading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>

              {passwordSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Orders</h2>
              </div>

              {/* Order Filter Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setOrderFilter("all")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      orderFilter === "all"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("pending")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      orderFilter === "pending"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Pending (
                    {orders.filter((o) => o.status === "Pending").length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("processing")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      orderFilter === "processing"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Processing (
                    {orders.filter((o) => o.status === "Processing").length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("shipped")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      orderFilter === "shipped"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Shipped (
                    {orders.filter((o) => o.status === "Shipped").length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("delivered")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      orderFilter === "delivered"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Delivered (
                    {orders.filter((o) => o.status === "Delivered").length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("cancelled")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      orderFilter === "cancelled"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Cancelled (
                    {orders.filter((o) => o.status === "Cancelled").length})
                  </button>
                </nav>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.filter((order) => {
                    if (orderFilter === "all") return true;
                    return (
                      order.status.toLowerCase() === orderFilter.toLowerCase()
                    );
                  }).length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="mt-4 text-gray-600">
                        No {orderFilter !== "all" && orderFilter} orders found.
                      </p>
                    </div>
                  ) : (
                    orders
                      .filter((order) => {
                        if (orderFilter === "all") return true;
                        return (
                          order.status.toLowerCase() ===
                          orderFilter.toLowerCase()
                        );
                      })
                      .map((order) => (
                        <div
                          key={order._id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.orderItems.slice(0, 2).map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center space-x-3"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <p className="text-sm text-gray-600">
                                +{order.orderItems.length - 2} more item(s)
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-lg font-bold">
                                Total: ${order.totalPrice.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.isPaid ? (
                                  <span className="text-green-600">Paid</span>
                                ) : (
                                  <span className="text-yellow-600">
                                    Not Paid
                                  </span>
                                )}
                              </p>
                            </div>
                            <Link
                              to={`/order/${order._id}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Delete Account Tab */}
          {activeTab === "delete" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Delete Account
              </h2>

              <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                <p className="font-semibold">Warning!</p>
                <p>
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </p>
              </div>

              {deleteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {deleteError}
                </div>
              )}

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                >
                  Delete My Account
                </button>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Enter your password to confirm
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading || !deletePassword}
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
                    >
                      {deleteLoading ? "Deleting..." : "Confirm Delete"}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">User ID:</dt>
            <dd className="font-medium">{profile?._id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Member Since:</dt>
            <dd className="font-medium">
              {profile?.createdAt &&
                new Date(profile.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Last Updated:</dt>
            <dd className="font-medium">
              {profile?.updatedAt &&
                new Date(profile.updatedAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
