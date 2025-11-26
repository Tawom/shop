import { useRouteError, Link } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>

        <p className="text-gray-600 mb-2">
          {error?.status === 404 ? "Page Not Found" : "Something went wrong"}
        </p>

        {error?.statusText && (
          <p className="text-gray-500 text-sm mb-6">{error.statusText}</p>
        )}

        {error?.data && (
          <p className="text-gray-500 text-sm mb-6 bg-gray-100 p-3 rounded">
            {error.data}
          </p>
        )}

        {error?.message && (
          <p className="text-gray-500 text-sm mb-6 bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Go Back Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Try Again
          </button>
        </div>

        {import.meta.env.DEV && error?.stack && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
