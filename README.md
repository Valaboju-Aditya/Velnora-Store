# VELNORA — Fashion E-Commerce Store

VELNORA is a full-stack fashion e-commerce project built with React, Express, and MongoDB. It includes product browsing, shopping cart management, online payments, and admin tools.

**Website:** https://velnora-store.onrender.com  
**Repository:** https://github.com/Valaboju-Aditya/Velnora-Store

## Features

### Storefront
- Responsive home page with categories and featured products
- Product listings and product-detail pages
- Product search, price filters, sorting, and stock filtering
- Wishlist and shopping cart
- Cart quantity updates and checkout

### Accounts and Administration
- User authentication
- Protected admin pages
- Admin order and user management

### Payments and Orders
- Cash on delivery
- Razorpay online payments
- Order cancellation and refund handling
- Stock restoration after cancellation
- Order and refund email notifications
- Refund email tracking

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router |
| Icons and Charts | Lucide React, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Payments | Razorpay |
| Email | Nodemailer |
| Middleware | CORS, Helmet, express-rate-limit |
| Hosting | Render |

## Requirements

- Node.js and npm compatible with the project dependencies
- MongoDB database
- Razorpay credentials for payment functionality
- Email provider credentials for email notifications

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Valaboju-Aditya/Velnora-Store.git
cd Velnora-Store
```

### 2. Install Dependencies

From the main project folder:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Files

Create a `.env` file beside each `.env.example` by copying the example file.

#### Frontend: `.env`

```env
VITE_API_URL=https://velnora-api.onrender.com
```

This address connects the frontend to the deployed backend.

To use the local backend instead:

```env
VITE_API_URL=http://localhost:5000
```

Restart the frontend development server after changing this value.

#### Backend: `server/.env`

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER/velnora
PORT=5000

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

EMAIL_USER=your_email@example.com
EMAIL_APP_PASSWORD=your_email_app_password

FRONTEND_URL=http://localhost:5173

RESEND_API_KEY=your_resend_api_key
```

Replace the placeholders with your own configuration. Use the email credentials required by the email-sending implementation.

Keep real credentials in `.env` files or hosting environment settings. Commit only placeholder values in `.env.example` files.

Never put database passwords, JWT secrets, email passwords, or Razorpay secrets in frontend variables.

### 4. Start the Backend

In a terminal, from the main project folder:

```bash
cd server
npm run dev
```

### 5. Start the Frontend

In another terminal, from the main project folder:

```bash
npm run dev
```

Open the local URL printed by Vite. Keep both terminals running when using the local backend.

## Available Commands

### Frontend

Run from the main project folder:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the frontend |
| `npm run preview` | Preview the frontend build locally |
| `npm run lint` | Run ESLint |

### Backend

Run from the `server` folder:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the backend with nodemon |
| `npm start` | Start the backend with Node.js |

## Deployment

The frontend and backend are hosted on Render:

- Frontend: https://velnora-store.onrender.com
- Backend: https://velnora-api.onrender.com

Production environment values must match the deployed services:

- Frontend `VITE_API_URL`: deployed backend URL
- Backend `FRONTEND_URL`: deployed frontend URL
- Backend credentials: configured through hosting environment settings

Rebuild the frontend after changing its API URL.

## Project Status

VELNORA is in final launch preparation.

Remaining checks:

- Investigate the cancellation email showing `Refund status: None` after an online-payment cancellation.
- Verify refund processing and refund email delivery end-to-end.
- Verify login, checkout, payments, cancellations, and stock updates on the deployed website.
- Confirm production payment and webhook configuration before accepting live payments.
- Add desktop and mobile screenshots to this README.

## Maintainer

[Valaboju-Aditya](https://github.com/Valaboju-Aditya)