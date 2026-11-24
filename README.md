# 📱 Jio Smart Recharge - True 5G Mobile Recharge Application

![Jio Brand](https://img.shields.io/badge/Brand-Jio%20True%205G-0050d5?style=for-the-badge&logo=5g)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)
![Status](https://img.shields.io/badge/Build-Passing%20100%25-brightgreen?style=for-the-badge)

A complete, enterprise-grade **Jio Mobile Recharge Web Application** designed with authentic **Jio / MyJio UI/UX**. Features True 5G Unlimited plans, entertainment bundles (Disney+ Hotstar, SonyLIV, ZEE5, Prime Video, JioCinema), data boosters, real-time usage analytics, instant JioPay checkout, support ticketing, refund tracking, and an admin operations console.

---

## 🌟 Key Features

### 1. 📱 Authentic Jio Range & Plan Catalog
- **⚡ True 5G Unlimited Range**: Plans from ₹349, ₹399, ₹899 featuring Unlimited 5G Data, high-speed daily quota, and complimentary Jio apps.
- **⭐ Popular Bestsellers**: India's favorite recharge packs (₹199, ₹299, ₹749).
- **🎬 Entertainment & OTT Bundles**: Packs bundled with Disney+ Hotstar, Amazon Prime Video, SonyLIV, and ZEE5.
- **🚀 Data Boosters**: Instant add-on packs (₹19, ₹29, ₹69) for seamless streaming.
- **📅 Annual Value Packs**: 365-day peace of mind plans (₹2999, ₹3599).
- **📞 Top-up & ISD**: Full talktime vouchers with unlimited validity.

### 2. ⚡ Live Active Pack & 5G Telemetry
- Dynamic daily data meter (used today vs daily limit).
- Pack validity counter with real-time countdown.
- 5G network telemetry: carrier aggregation, sub-10ms latency metrics, and VoNR status.

### 3. 💳 Secure JioPay Payment Simulation
- Multi-option payment flow: JioPay UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Jio Wallet.
- Instant transaction confirmation with animated checkmark and printable receipt.

### 4. 🎫 Jio Care & Support System
- Interactive issue reporting with categorized quick selectors.
- Live ticket tracking with status updates (`Open`, `In Progress`, `Resolved`).

### 5. 💰 Automated Refund & Reversal Portal
- Track failed recharges and request cancellations for prepaid packs.
- Admin approval & rejection workflow with automated customer notifications.

### 6. 🔔 Real-Time Notification Center
- Categorized alerts: Recharge confirmations, plan expiry reminders, 5G offers, and security notices.

### 7. 🔒 Admin Operations Console
- Full CRUD operations for Jio recharge plans.
- Subscriber monitoring and transaction audit trail.
- Customer support ticket resolution.

---

## 🏗️ Project Architecture

```
mobile-recharge-application/
├── backend/
│   ├── database.js            # Resilient MongoDB Atlas connector with memory fallback
│   ├── schemas.js             # Consolidated Mongoose models (User, Plan, Subscription, etc.)
│   ├── authMiddleware.js      # JWT authentication middleware
│   ├── roleMiddleware.js      # Role-based access control (Admin / User)
│   ├── notificationsRoutes.js # Notification endpoints
│   ├── supportRoutes.js       # Jio Care ticket endpoints
│   └── server.js              # Express API server & static React server
├── frontend/
│   ├── public/
│   │   └── index.html         # Jio themed HTML template & loader
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js                # Jio mobile OTP & registration screen
│   │   │   ├── RechargesDashboard.js   # Jio plans catalog & active pack meter
│   │   │   ├── PlanDetailsPage.js      # JioPay checkout & confirmation
│   │   │   ├── RechargeStatusPage.js   # Printable receipt & status
│   │   │   ├── RechargeHistoryPage.js  # Account statements & past recharges
│   │   │   ├── UsageAnalyticsPage.js   # 5G speed test & consumption charts
│   │   │   ├── NotificationsPage.js    # Alerts & reminders center
│   │   │   ├── HelpSupportPage.js      # Jio Care support ticket system
│   │   │   ├── RefundsPage.js          # Refund claims & admin approval
│   │   │   ├── SettingsPage.js         # Preferences, regional language, 5G SA
│   │   │   ├── InfoPagesContainer.js   # 5G coverage, compliance & system status
│   │   │   └── AdminDashboard.jsx      # Telecom admin management console
│   │   ├── styles/
│   │   │   └── global.css              # Jio design system & CSS variables
│   │   ├── App.js                      # SPA routing and state manager
│   │   └── index.js                    # React 18 entrypoint
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Step 1: Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*(Or install manually: `cd backend && npm install`, then `cd ../frontend && npm install`)*

### Step 2: Build Frontend
```bash
npm run build
```

### Step 3: Start the Application
```bash
npm start
```
The server will start on **http://localhost:5000**.
Visit **http://localhost:5000** in your web browser.

---

## 🔑 Demo Credentials

| Role | Mobile Number | OTP | Capabilities |
| :--- | :--- | :--- | :--- |
| **Subscriber** | Any 10-digit number (e.g. `9876543210`) | `123456` | Browse plans, recharge, view usage, raise tickets, request refunds |
| **Admin** | `6360603552` | `123456` | Manage plans (Add/Edit/Delete), approve refunds, resolve support tickets |

---

## 📡 API Reference

### Authentication
- `POST /auth/send-otp` - Generate 6-digit OTP
- `POST /auth/verify-otp` - Verify OTP & obtain JWT token
- `POST /auth/register` - Register new subscriber profile
- `POST /auth/logout` - Invalidate session

### User & Recharge Plans
- `GET /user/plans` - List all active Jio recharge plans
- `POST /subscribe` - Perform recharge transaction
- `GET /user/subscription/:mobile` - Get current active plan & remaining days
- `GET /user/recharge-history/:mobile` - Transaction history
- `GET /usage/analytics/:mobile` - 5G telemetry & daily data consumption

### Support & Care
- `POST /support/tickets` - Raise support ticket
- `GET /support/tickets/:mobile` - Retrieve user tickets
- `GET /admin/support/tickets` - Admin ticket queue
- `PATCH /admin/support/tickets/:ticketId` - Resolve ticket

### Refunds
- `POST /refunds/request` - Submit refund claim
- `GET /refunds/:mobile` - Check refund status
- `GET /admin/refunds` - Admin refund list
- `PATCH /admin/refunds/:id/:action` - Approve (`approve`) or reject (`reject`) refund

### System Health
- `GET /health` - API server health status
- `GET /system/status` - Network gateway health check
- `GET /test-db` - Database connectivity test

---

## 📤 How to Upload to GitHub

Follow these steps to push this clean repository to GitHub:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: complete Jio mobile recharge application with True 5G range and zero errors"

# 4. Set main branch
git branch -M main

# 5. Add your GitHub remote repository URL
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🛡️ License
Licensed under the [MIT License](LICENSE). Built for enterprise telecom demonstration.
