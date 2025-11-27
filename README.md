# 🛍️ E-Commerce Platform - Full Stack MERN Application

A modern, full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include product management, shopping cart, user authentication, order processing, admin dashboard, and inventory management.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://your-frontend-url.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Tawom/shop)

---

## 🚀 Live Demo

**Frontend:** [https://your-frontend-url.onrender.com](https://your-frontend-url.onrender.com)  
**Backend API:** [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)

### Demo Credentials

**Regular User:**

- Email: demo@example.com
- Password: demo123

**Admin User:**

- Email: admin@example.com
- Password: admin123

---

## ✨ Features

### 🛒 Customer Features

- **Product Catalog** - Browse products with search, filtering, and pagination
- **Product Details** - Detailed view with images, descriptions, and reviews
- **Shopping Cart** - Add/remove items, update quantities, persistent cart
- **User Authentication** - Secure registration and login with JWT
- **Order Management** - Place orders, track status, view order history
- **Product Reviews** - Rate and review products (5-star system)
- **User Profile** - Update profile information and change password
- **Password Recovery** - Forgot password with email reset link

### 👨‍💼 Admin Features

- **Admin Dashboard** - Real-time statistics (revenue, orders, users, products)
- **User Management** - View, edit, delete users, assign admin roles
- **Product Management** - CRUD operations for products with image upload
- **Order Management** - View all orders, update status, track shipments
- **Inventory Control** - Stock management with low stock alerts
- **File Management** - Upload and manage product images/documents
- **Low Stock Alerts** - Visual warnings for products running low

### 🔐 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Input validation and sanitization
- CORS protection
- Environment variable security

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

### Backend

- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email notifications

### DevOps & Deployment

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Render** - Cloud hosting (Backend & Frontend)
- **MongoDB Atlas** - Cloud database
- **Nginx** - Reverse proxy (in Docker)
- **Git/GitHub** - Version control

---

## 📁 Project Structure

```
shop/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # MongoDB connection
│   │   │   ├── email.js       # Email service (Nodemailer)
│   │   │   └── multer.js      # File upload config
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── userController.js
│   │   │   ├── adminController.js
│   │   │   └── reviewController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── Review.js
│   │   └── routes/            # API routes
│   │       ├── authRouter.js
│   │       ├── productRouter.js
│   │       ├── orderRouter.js
│   │       ├── userRouter.js
│   │       ├── adminRouter.js
│   │       ├── uploadRouter.js
│   │       └── reviewRouter.js
│   ├── uploads/               # Uploaded files
│   ├── Dockerfile            # Backend Docker config
│   ├── package.json
│   └── server.js             # Entry point
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductReviews.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── context/          # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile            # Frontend Docker config
│   ├── nginx.conf            # Nginx configuration
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml        # Docker orchestration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tawom/shop.git
   cd shop
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Create .env file
   cp ../.env.example .env
   # Edit .env with your configuration

   # Start backend
   npm start
   ```

3. **Frontend Setup** (in a new terminal)

   ```bash
   cd frontend
   npm install

   # Start frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# MongoDB: localhost:27017
```

### Individual Docker Builds

**Backend:**

```bash
cd backend
docker build -t ecommerce-backend .
docker run -p 3000:3000 --env-file .env ecommerce-backend
```

**Frontend:**

```bash
cd frontend
docker build -t ecommerce-frontend .
docker run -p 5173:80 ecommerce-frontend
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@shop.com

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # Login user
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password/:token  # Reset password
GET    /api/auth/verify-reset-token/:token  # Verify reset token
```

### Product Endpoints

```
GET    /api/products                # Get all products (with filters)
GET    /api/products/:id            # Get single product
POST   /api/products                # Create product (Admin)
PUT    /api/products/:id            # Update product (Admin)
DELETE /api/products/:id            # Delete product (Admin)
GET    /api/products/categories     # Get product categories
```

### Order Endpoints

```
POST   /api/orders                  # Create new order
GET    /api/orders/my-orders        # Get user's orders
GET    /api/orders/:id              # Get order by ID
PUT    /api/orders/:id/pay          # Update order to paid
PUT    /api/orders/:id/status       # Update order status
PUT    /api/orders/:id/cancel       # Cancel order
```

### Review Endpoints

```
GET    /api/reviews/product/:id    # Get product reviews
POST   /api/reviews                # Create review
PUT    /api/reviews/:id            # Update review
DELETE /api/reviews/:id            # Delete review
```

### Admin Endpoints

```
GET    /api/admin/dashboard         # Get dashboard stats
GET    /api/admin/users             # Get all users
GET    /api/admin/users/:id         # Get user by ID
PUT    /api/admin/users/:id/role    # Update user role
DELETE /api/admin/users/:id         # Delete user
GET    /api/admin/orders            # Get all orders
PUT    /api/admin/orders/:id/status # Update order status
```

---

## 📸 Screenshots

### Homepage

![Homepage](https://via.placeholder.com/800x400?text=Homepage+Screenshot)

### Product Details

![Product Details](https://via.placeholder.com/800x400?text=Product+Details)

### Shopping Cart

![Shopping Cart](https://via.placeholder.com/800x400?text=Shopping+Cart)

### Admin Dashboard

![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

---

## 🔄 Workflow & Features Implementation

### Phase 1: Foundation ✅

- User authentication (JWT)
- Product CRUD operations
- Shopping cart (localStorage)
- Basic routing

### Phase 2: Core Features ✅

- Order management
- User profile
- Admin dashboard
- File uploads

### Phase 3: Advanced Features ✅

- Email notifications
- Product reviews & ratings
- Inventory management
- Low stock alerts

### Phase 4: DevOps ✅

- Docker containerization
- Cloud deployment (Render)
- MongoDB Atlas integration
- CI/CD ready

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**

- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] JWT token validation

**Products:**

- [ ] View product catalog
- [ ] Search products
- [ ] Filter by category
- [ ] Product details page

**Shopping Cart:**

- [ ] Add to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart persistence

**Orders:**

- [ ] Create order
- [ ] View order history
- [ ] Order status updates
- [ ] Email notifications

**Admin:**

- [ ] Dashboard statistics
- [ ] User management
- [ ] Product management
- [ ] Order management
- [ ] Low stock alerts

---

## 🚧 Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Wishlist feature
- [ ] Advanced search with Elasticsearch
- [ ] Product recommendations
- [ ] Multiple image uploads per product
- [ ] Coupon/discount system
- [ ] Real-time notifications (Socket.io)
- [ ] Order tracking with maps
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Unit & integration tests

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Thavone Sonenousith**

- GitHub: [@Tawom](https://github.com/Tawom)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Portfolio](https://yourportfolio.com)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- React Documentation
- Express.js Documentation
- MongoDB Documentation
- Tailwind CSS
- Render Deployment Platform
- MongoDB Atlas

---

## 📞 Support

For support, email your.email@example.com or create an issue in this repository.

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using the MERN Stack**
