import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      // For development only - remove in production
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold mb-2">Password reset link sent!</p>
            <p className="text-sm mb-2">
              Check your email for instructions to reset your password.
            </p>
            {resetToken && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded">
                <p className="text-xs font-semibold mb-1 text-yellow-800">
                  Development Mode - Reset Token:
                </p>
                <p className="text-xs text-yellow-900 break-all mb-2">
                  {resetToken}
                </p>
                <Link
                  to={`/reset-password/${resetToken}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Click here to reset password
                </Link>
              </div>
            )}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link
            to="/login"
            className="block text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
