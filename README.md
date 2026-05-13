# 💎 JewelTrack

**JewelTrack** is a comprehensive, modern, and high-performance jewelry store management platform designed to streamline daily operations for jewelry business owners. It provides a robust suite of tools to manage custom orders, inventory, billing, customer relationships, and collaterals all from a beautifully crafted user interface.

---

## ✨ Key Features

- **🛍️ Custom Jewelry Orders:** Seamlessly create, update, and track custom jewelry orders. Upload reference photos, specify metals (gold, silver, diamond, platinum), purities, weights, and detailed price breakdowns (making charges, GST).
- **👥 Customer Management:** Register and manage customers securely. Keep track of user profiles, order histories, and outstanding balances.
- **🧾 Billing & Invoicing:** Generate professional invoices and bills for purchases quickly and efficiently.
- **📦 Inventory Management:** Keep track of live stock, metals, quantities, and real-time inventory adjustments.
- **🏦 Collateral (Mortgage) Management:** Manage and track pawn/mortgage records easily with a dedicated collateral module.
- **💳 Payment Tracking:** Record full, partial, and advance payments. Easily see paid vs unpaid statuses for every order.
- **🔒 Role-Based Access Control:** Secure platform with tailored modules for `Admin` and `Shopkeeper`.
- **📱 Responsive & Premium UI:** Built with modern design principles (glassmorphism, interactive components, dynamic search) ensuring a stunning and intuitive user experience.

---

## 🛠️ Technology Stack

**Frontend**
- **React.js** with **Vite** for blazing fast performance.
- **Tailwind CSS** for sleek, modern, and highly responsive styling.
- **Lucide React** for beautiful iconography.
- **Axios** for API communication.

**Backend**
- **Node.js** & **Express.js** providing a fast and scalable RESTful API.
- **MongoDB** & **Mongoose** for flexible and secure data storage.
- Expanded JSON payload limits for seamless high-quality image uploads.
- **JWT (JSON Web Tokens)** for robust user authentication.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/JewelTrack.git
   cd JewelTrack
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   *Create a `.env` file in the `Backend` directory and add the following variables:*
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```
   *Create a `.env` file (or `.env.development`) in the `Frontend` directory and add:*
   ```env
   VITE_API_BASE_KEY=http://localhost:3000/api
   ```

### Running the Application

You will need two separate terminal windows/tabs to run the backend and frontend simultaneously.

**Terminal 1 (Backend)**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend)**
```bash
cd Frontend
npm run dev
```

The application frontend will typically be running on `http://localhost:5173` while the backend runs on `http://localhost:3000`.

---

## 📁 Project Structure

```
JewelTrack/
├── Backend/                 # Express API server
│   ├── db/                  # MongoDB config
│   ├── module/              # Business logic (Auth, Shopkeeper, Admin)
│   │   ├── Auth/
│   │   ├── Shopkeeper/      # Billing, Orders, Inventory, CustomerRegister, Colletral
│   │   └── Admin/
│   └── index.js             # Entry point
│
└── Frontend/                # React Vite application
    ├── public/
    └── src/
        ├── components/      # UI Components (Modals, Views, Forms)
        ├── pages/           # Application Views
        ├── utils/           # Reusable components & API configs
        ├── App.jsx
        └── main.jsx
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request if you have any ideas to improve the platform.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
