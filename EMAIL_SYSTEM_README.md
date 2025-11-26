# Email Notification System

## Overview

Comprehensive email notification system using Nodemailer with environment-aware sending (development vs production).

## Installation

```bash
cd backend
npm install nodemailer
```

## Configuration

### Environment Variables (.env)

```env
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="E-Commerce Shop <noreply@yourshop.com>"
```

### Development Mode

- **Current Setting**: `NODE_ENV=development`
- **Behavior**: Emails are logged to console instead of being sent
- **Purpose**: Prevents spam during testing and development
- **Output**: Full email details (to, subject, HTML preview) printed to server console

### Production Mode

- **Setting**: `NODE_ENV=production`
- **Behavior**: Emails sent via SMTP server
- **Supported Providers**: Gmail, SendGrid, AWS SES, custom SMTP
- **Security**: Use app-specific passwords, never commit credentials

## Email Templates

### 1. Welcome Email

**Trigger**: New user registration  
**Template**: `welcome`  
**Data Required**: `{ username, email }`  
**Implementation**: `authController.js` line ~46

### 2. Password Reset Email

**Trigger**: User requests password reset  
**Template**: `passwordReset`  
**Data Required**: `{ username, resetUrl, token }`  
**Implementation**: `authController.js` forgotPassword function  
**Security**: Token expires in 1 hour

### 3. Order Confirmation Email

**Trigger**: Order successfully created  
**Template**: `orderConfirmation`  
**Data Required**: `{ order: { _id, totalAmount, orderItems, shippingAddress }, user: { username } }`  
**Implementation**: `orderController.js` createOrder function (after stock reduction)  
**Features**:

- Displays order ID (last 8 chars)
- Line items with quantities
- Total amount
- Shipping address

### 4. Order Status Update Email

**Trigger**: Order status changed (by user or admin)  
**Template**: `orderStatusUpdate`  
**Data Required**: `{ order: { _id, status, totalAmount }, user: { username } }`  
**Implementation**:

- `orderController.js` updateOrderStatus (user updates)
- `adminController.js` updateOrderStatusAdmin (admin updates)

## Technical Details

### Email Service (`/backend/src/config/email.js`)

```javascript
const { sendEmail } = require("../config/email");

// Send email
await sendEmail(
  recipientEmail, // string: "user@example.com"
  templateName, // string: "welcome" | "passwordReset" | "orderConfirmation" | "orderStatusUpdate"
  data // object: template-specific data
);
```

### Error Handling

- Non-blocking: Email failures don't crash the application
- Returns `null` on error
- Errors logged to console
- Application flow continues even if email fails

### Email Templates Features

- Responsive HTML design
- Inline CSS for email client compatibility
- Professional styling with brand colors
- Works in all major email clients (Gmail, Outlook, Apple Mail, etc.)

## Testing

### Development Testing

1. Ensure `NODE_ENV=development` in `.env`
2. Trigger email actions (register, reset password, create order, update order status)
3. Check server console for email output
4. Verify email content matches expected data

### Example Console Output

```
=== EMAIL (Development Mode) ===
To: user@example.com
Subject: Welcome to E-Commerce Shop!
---HTML Content Below---
<!DOCTYPE html>...
================================
```

### Production Testing with Ethereal

```javascript
// Temporary test account (add to email.js for testing)
const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});
// View sent emails at: https://ethereal.email
```

## Integration Points

### Authentication (`authController.js`)

- ✅ Registration welcome email
- ✅ Password reset email with secure token

### Orders (`orderController.js`)

- ✅ Order confirmation email (after stock reduction)
- ✅ Status update email (user-triggered)

### Admin (`adminController.js`)

- ✅ Status update email (admin-triggered)

## Inventory Management

### Stock Validation (Before Order Creation)

- Location: `orderController.js` lines 26-46
- Checks each product has sufficient stock
- Returns 400 error if any product out of stock
- Prevents overselling

### Stock Reduction (After Order Save)

- Location: `orderController.js` lines 67-71
- Reduces product stock by order quantities
- Happens after order is saved to database
- Ensures data consistency

### Order Flow

1. Validate stock availability
2. Create order document
3. Save order to database
4. Reduce product stock quantities
5. Populate order with user/product details
6. Send confirmation email
7. Return response to client

## Next Steps

### Pending Features

- [ ] Product reviews and ratings system
- [ ] Low stock alerts in admin dashboard
- [ ] Email templates for low stock notifications
- [ ] Order shipped email with tracking number
- [ ] Promotional email templates

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production SMTP credentials
- [ ] Test emails with real email addresses
- [ ] Set up email sending monitoring
- [ ] Configure SPF/DKIM records for domain
- [ ] Add unsubscribe links (for promotional emails)
- [ ] Implement email rate limiting

## Troubleshooting

### Emails Not Appearing in Console

- Check `NODE_ENV` is set to `development`
- Verify server restarted after installing nodemailer
- Check for errors in server console

### Gmail SMTP Not Working

- Use App Password instead of regular password
- Enable 2FA on Google account
- Generate app-specific password in Google Account settings
- Use `smtp.gmail.com` port `587`

### Email Templates Not Rendering

- Check data object has all required fields
- Verify order is populated with user/product data
- Check for typos in template names
- Review email.js template HTML structure

## File Locations

```
backend/
  src/
    config/
      email.js              # Email service and templates
    controllers/
      authController.js     # Welcome & password reset emails
      orderController.js    # Order confirmation & status emails
      adminController.js    # Admin order status emails
  .env                      # Email configuration
```

## Summary

The email system is fully implemented and operational in development mode. All critical user touchpoints (registration, password reset, order lifecycle) now send professional HTML emails. The system is production-ready and only requires SMTP credentials to start sending real emails.
