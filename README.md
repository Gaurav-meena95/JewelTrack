# 💎 JewelTrack

**JewelTrack** is a comprehensive, modern, and high-performance jewelry store management platform designed to streamline daily operations for jewelry business owners. It provides a robust suite of tools to manage custom orders, inventory, billing, customer relationships, and collaterals (mortgages) all from a beautifully crafted, responsive user interface.

---

## 📺 Video Demo & Tutorial

Watch the complete walkthrough and video tutorial of **JewelTrack** in action:

🎬 **[Watch Video Tutorial on Google Drive](https://drive.google.com/file/d/1P6Tl2Tb6x1aiibYFl6aNkrCCbHhAEl9R/view?usp=sharing)**

---

## ✨ Key Features

- **🛍️ Custom Jewelry Orders:** Seamlessly create, update, and track custom jewelry orders. Upload reference photos, specify metals (gold, silver, diamond, platinum), purities, weights, and detailed price breakdowns (making charges, GST).
- **👥 Customer Management:** Register and manage customers securely. Keep track of user profiles, order histories, and outstanding balances with comprehensive customer portfolios.
- **🧾 Billing & Invoicing:** Generate professional invoices and bills for purchases quickly and efficiently with detailed metal breakdowns.
- **📦 Inventory Management:** Keep track of live stock, metals, purities, quantities, and real-time inventory adjustments.
- **🏦 Collateral (Mortgage / Girvi) Management:** Record, manage, and track collateral/mortgage items with flexible valuation and status tracking.
- **💳 Payment Tracking:** Record full, partial, and advance payments across orders and collaterals with dedicated modal workflows.
- **📊 Business Analytics & Visuals:** Integrated charts and visual summaries for financial tracking and shop health.
- **🔒 Role-Based Access Control:** Secure platform with tailored modules for `Admin` and `Shopkeeper`.
- **📱 Responsive & Premium UI:** Built with modern design principles (glassmorphism, micro-animations, interactive modals, dynamic search) ensuring an intuitive user experience across devices.

---

## 🛠️ Technology Stack

### Frontend
- **React.js 19** with **Vite** for lightning-fast performance and hot module replacement.
- **Tailwind CSS v4** for clean, modern, and responsive styling.
- **Motion (Framer Motion)** for smooth animations and transitions.
- **AG Charts React** for responsive visual analytics.
- **Lucide React** for icons.
- **Axios** & **React Router v7** for API interaction and client-side routing.

### Backend
- **Node.js** & **Express.js** providing a fast and scalable RESTful API.
- **MongoDB** & **Mongoose** for flexible, schema-driven data persistence.
- **Bcryptjs** & **JWT (JSON Web Tokens)** for secure authentication and authorization.
- Expanded JSON payload limits for seamless high-resolution image uploads.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server or MongoDB Atlas cluster)
- [Git](https://git-scm.com/)

---

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gaurav-meena95/JewelTrack.git
   cd JewelTrack
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   *Create a `.env` file in the `Backend` directory (you can copy `.env.example`):*
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/JewelTrack
   sec_key=your_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```
   *Create a `.env` file in the `Frontend` directory (you can copy `.env.example`):*
   ```env
   VITE_API_BASE_KEY=http://localhost:3000/api
   ```

---

### Running the Application

You will need two separate terminal windows or tabs to run both services:

**Terminal 1 (Backend API)**
```bash
cd Backend
npm run dev
```
> The API server will start on `http://localhost:3000`.

**Terminal 2 (Frontend Client)**
```bash
cd Frontend
npm run dev
```
> The Vite dev server will start on `http://localhost:5173`.

Open [http://localhost:5173](http://localhost:5173) in your browser to access the app.

---

## 📁 Project Structure

```
JewelTrack/
├── Backend/                 # Express API server
│   ├── db/                  # MongoDB connection configuration
│   ├── module/              # Business logic modules
│   │   ├── Auth/            # Authentication & authorization (JWT)
│   │   ├── Shopkeeper/      # Billing, Orders, Inventory, CustomerRegister, Colletral
│   │   └── Admin/           # Admin controls
│   ├── .env.example         # Example environment template
│   └── index.js             # Express app entry point
│
└── Frontend/                # React Vite web application
    ├── public/              # Static assets
    ├── src/
    │   ├── components/      # Feature components (Modals, Views, Forms)
    │   ├── pages/           # Primary application routes
    │   ├── utils/           # Shared utilities, auth helpers, API configs
    │   ├── App.jsx          # Route declarations
    │   └── main.jsx         # React DOM mount point
    ├── .env.example         # Example environment template
    └── vite.config.js       # Vite build configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
