import { useAuth } from "../context/AuthContext";

const Debug = () => {
  const { user, token, isAuthenticated, isAdmin } = useAuth();

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  const clearAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Auth Context State</h2>
          <div className="space-y-2">
            <p>
              <strong>isAuthenticated:</strong>{" "}
              <span
                className={isAuthenticated ? "text-green-600" : "text-red-600"}
              >
                {String(isAuthenticated)}
              </span>
            </p>
            <p>
              <strong>isAdmin:</strong>{" "}
              <span className={isAdmin ? "text-green-600" : "text-red-600"}>
                {String(isAdmin)}
              </span>
            </p>
            <p>
              <strong>User object:</strong>
            </p>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
            <p>
              <strong>Token exists:</strong>{" "}
              <span className={token ? "text-green-600" : "text-red-600"}>
                {String(!!token)}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">LocalStorage Data</h2>
          <div className="space-y-2">
            <p>
              <strong>Stored User:</strong>
            </p>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {storedUser || "null"}
            </pre>
            <p>
              <strong>Stored Token:</strong>
            </p>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {storedToken ? storedToken.substring(0, 50) + "..." : "null"}
            </pre>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-400 p-6 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">Admin Not Showing?</h3>
          <p className="text-yellow-700 mb-4">
            If you were recently made an admin but the Admin link doesn't show:
          </p>
          <ol className="list-decimal list-inside text-yellow-700 space-y-2 mb-4">
            <li>Log out from the current session</li>
            <li>Log back in with your admin credentials</li>
            <li>The admin role will be loaded from the server</li>
          </ol>
          <button
            onClick={clearAndReload}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Clear Storage & Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Debug;
