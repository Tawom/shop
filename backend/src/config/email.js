const nodemailer = require("nodemailer");

// Email configuration
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP service)
  // For production, use real SMTP service (Gmail, SendGrid, etc.)

  if (process.env.NODE_ENV === "production") {
    // Production email configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Log emails to console instead of sending
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "ethereal.user@ethereal.email",
        pass: process.env.SMTP_PASS || "ethereal.pass",
      },
      // For development, we'll just log to console
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
  }
};

// Email templates
const emailTemplates = {
  // Order confirmation email
  orderConfirmation: (data) => {
    const order = data.order || data;
    const user = data.user || data;
    order.totalPrice = order.totalPrice || order.totalAmount;
    return {
      subject: `Order Confirmation #${order._id
        .toString()
        .slice(-8)
        .toUpperCase()}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .order-item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
          .total { font-size: 1.2em; font-weight: bold; margin-top: 20px; }
          .button { background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Order!</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            <p>We've received your order and it's being processed. Here are the details:</p>
            
            <h2>Order #${order._id.toString().slice(-8).toUpperCase()}</h2>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            
            <h3>Items:</h3>
            ${order.orderItems
              .map(
                (item) => `
              <div class="order-item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(
                  item.quantity * item.price
                ).toFixed(2)}
              </div>
            `
              )
              .join("")}
            
            <div class="total">
              <p>Subtotal: $${order.itemsPrice.toFixed(2)}</p>
              <p>Shipping: $${order.shippingPrice.toFixed(2)}</p>
              <p>Tax: $${order.taxPrice.toFixed(2)}</p>
              <p style="color: #2563eb;">Total: $${order.totalPrice.toFixed(
                2
              )}</p>
            </div>
            
            <h3>Shipping Address:</h3>
            <p>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${
        order.shippingAddress.postalCode
      }<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
            
            <a href="${process.env.FRONTEND_URL}/order/${
        order._id
      }" class="button">View Order Details</a>
          </div>
          <div class="footer">
            <p>Questions? Contact us at support@e-shop.com</p>
            <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
  },

  // Order status update email
  orderStatusUpdate: (data) => {
    const order = data.order || data;
    const user = data.user || data;
    order.totalPrice = order.totalPrice || order.totalAmount;
    return {
      subject: `Order #${order._id
        .toString()
        .slice(-8)
        .toUpperCase()} - Status Updated to ${order.status}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-processing { background-color: #dbeafe; color: #1e40af; }
          .status-shipped { background-color: #e9d5ff; color: #6b21a8; }
          .status-delivered { background-color: #d1fae5; color: #065f46; }
          .button { background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            <p>Your order status has been updated:</p>
            
            <h2>Order #${order._id.toString().slice(-8).toUpperCase()}</h2>
            <div class="status-badge status-${order.status.toLowerCase()}">
              ${order.status}
            </div>
            
            ${
              order.status === "Shipped"
                ? `
              <p><strong>Great news!</strong> Your order has been shipped and is on its way to you.</p>
            `
                : order.status === "Delivered"
                ? `
              <p><strong>Your order has been delivered!</strong> We hope you enjoy your purchase.</p>
            `
                : order.status === "Processing"
                ? `
              <p>Your order is being prepared for shipment.</p>
            `
                : ""
            }
            
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${order.totalPrice.toFixed(
              2
            )}</p>
            
            <a href="${process.env.FRONTEND_URL}/order/${
        order._id
      }" class="button">Track Your Order</a>
          </div>
          <div class="footer">
            <p>Questions? Contact us at support@e-shop.com</p>
            <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
  },

  // Password reset email
  passwordReset: (data) => {
    const user = data.user || data;
    const resetToken = data.resetToken || data.token;
    return {
      subject: "Password Reset Request",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .button { background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <a href="${
              process.env.FRONTEND_URL
            }/reset-password/${resetToken}" class="button">Reset Password</a>
            
            <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${
              process.env.FRONTEND_URL
            }/reset-password/${resetToken}</p>
            
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </div>
          </div>
          <div class="footer">
            <p>Questions? Contact us at support@e-shop.com</p>
            <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
  },

  // Welcome email
  welcome: (data) => {
    const user = data.user || data;
    return {
      subject: "Welcome to E-Shop!",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .button { background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          .features { margin: 20px 0; }
          .feature { margin: 15px 0; padding: 15px; background-color: white; border-radius: 6px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to E-Shop! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            <p>Thank you for joining E-Shop! We're excited to have you as part of our community.</p>
            
            <div class="features">
              <div class="feature">
                <strong>🛍️ Shop Amazing Products</strong><br>
                Browse thousands of products at great prices
              </div>
              <div class="feature">
                <strong>🚚 Fast Shipping</strong><br>
                Get your orders delivered quickly and safely
              </div>
              <div class="feature">
                <strong>💯 Secure Payments</strong><br>
                Shop with confidence using our secure payment system
              </div>
              <div class="feature">
                <strong>📦 Order Tracking</strong><br>
                Track your orders from purchase to delivery
              </div>
            </div>
            
            <a href="${
              process.env.FRONTEND_URL
            }" class="button">Start Shopping</a>
          </div>
          <div class="footer">
            <p>Questions? Contact us at support@e-shop.com</p>
            <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
  },
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateName](data);

    const mailOptions = {
      from: `"E-Shop" <${process.env.SMTP_FROM || "noreply@e-shop.com"}>`,
      to,
      subject: template.subject,
      html: template.html,
    };

    // In development, log email instead of sending
    if (process.env.NODE_ENV !== "production") {
      console.log("\n📧 Email would be sent:");
      console.log("To:", to);
      console.log("Subject:", template.subject);
      console.log("Preview URL: Open the HTML in a browser to preview");
      console.log("---");
      return { messageId: "dev-mode-no-send" };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    // Don't throw error to prevent breaking the application flow
    // Log the error and continue
    return null;
  }
};

module.exports = {
  sendEmail,
  emailTemplates,
};
