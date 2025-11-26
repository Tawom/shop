# File Upload System

This application supports file uploads for images and documents.

## Backend Implementation

### Upload Directories

- `/backend/uploads/images/` - For image files (JPEG, JPG, PNG, GIF, WEBP)
- `/backend/uploads/documents/` - For document files (PDF, DOC, DOCX, TXT, XLS, XLSX, CSV)

### API Endpoints

#### Upload Single Image

```
POST /api/upload/image
Headers: Authorization: Bearer <token> (Admin only)
Body: FormData with 'image' field
Max Size: 5MB
```

#### Upload Multiple Images

```
POST /api/upload/images
Headers: Authorization: Bearer <token> (Admin only)
Body: FormData with 'images' field (max 10 files)
Max Size: 5MB per file
```

#### Upload Single Document

```
POST /api/upload/document
Headers: Authorization: Bearer <token> (Admin only)
Body: FormData with 'document' field
Max Size: 10MB
```

#### Upload Multiple Documents

```
POST /api/upload/documents
Headers: Authorization: Bearer <token> (Admin only)
Body: FormData with 'documents' field (max 5 files)
Max Size: 10MB per file
```

#### Delete File

```
DELETE /api/upload/file
Headers: Authorization: Bearer <token> (Admin only)
Body: { "filename": "file.jpg", "type": "image" }
```

#### List Files

```
GET /api/upload/files?type=image
Headers: Authorization: Bearer <token> (Admin only)
Query Params: type (optional) - "image" or "document"
```

### Access Uploaded Files

Files are served as static content:

```
http://localhost:3000/uploads/images/filename.jpg
http://localhost:3000/uploads/documents/filename.pdf
```

## Frontend Implementation

### Components

#### FileUpload Component

Reusable component for file uploads:

```jsx
import FileUpload from "../components/FileUpload";

<FileUpload
  type="image" // or "document"
  onUploadSuccess={(data) => console.log(data)}
  multiple={false} // or true for multiple files
/>;
```

#### AdminFiles Page

Admin page for managing all uploaded files:

- Upload images and documents
- View all uploaded files
- Copy file URLs
- Delete files
- Filter by type

Access at: `http://localhost:5173/admin/files`

## Usage Examples

### Upload Image in Product Form

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);

const response = await api.post("/upload/image", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

// Use the returned URL
const imageUrl = response.data.url;
// http://localhost:3000/uploads/images/image-1234567890.jpg
```

### Upload Multiple Documents

```javascript
const formData = new FormData();
Array.from(files).forEach((file) => {
  formData.append("documents", file);
});

const response = await api.post("/upload/documents", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

// Access uploaded files
response.data.files.forEach((file) => {
  console.log(file.url);
});
```

## File Restrictions

### Images

- Formats: JPEG, JPG, PNG, GIF, WEBP
- Max Size: 5MB
- Max Count (multiple): 10 files

### Documents

- Formats: PDF, DOC, DOCX, TXT, XLS, XLSX, CSV
- Max Size: 10MB
- Max Count (multiple): 5 files

## Security

- All upload endpoints require admin authentication
- File types are validated on the server
- File sizes are restricted
- Files are stored outside the web root with controlled access

## Git

Upload directories are tracked but files are ignored:

- Directories are preserved with `.gitkeep` files
- Actual uploaded files are in `.gitignore`
