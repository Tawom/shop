import { useState } from "react";
import api from "../services/api";

const FileUpload = ({ type = "image", onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && type === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('input[type="file"]');
    const files = fileInput.files;

    if (!files || files.length === 0) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();

      if (multiple) {
        Array.from(files).forEach((file) => {
          formData.append(type === "image" ? "images" : "documents", file);
        });
      } else {
        formData.append(type === "image" ? "image" : "document", files[0]);
      }

      const endpoint = multiple
        ? type === "image"
          ? "/upload/images"
          : "/upload/documents"
        : type === "image"
        ? "/upload/image"
        : "/upload/document";

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      // Reset form
      fileInput.value = "";
      setPreview(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload file. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === "image" ? "Upload Image" : "Upload Document"}
            {multiple && " (Multiple files allowed)"}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept={
              type === "image"
                ? "image/jpeg,image/jpg,image/png,image/gif,image/webp"
                : ".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
            }
            multiple={multiple}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            {type === "image"
              ? "Accepted formats: JPEG, JPG, PNG, GIF, WEBP (Max 5MB)"
              : "Accepted formats: PDF, DOC, DOCX, TXT, XLS, XLSX, CSV (Max 10MB)"}
          </p>
        </div>

        {preview && type === "image" && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-md border border-gray-300"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
