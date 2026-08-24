# 🚐 Kouini Caravane

> Interactive 3D Caravan Customization Studio, Showroom, and Fleet Inventory Management Platform.

Kouini Caravane is a premium, full-stack web application designed for interactive vehicle customization. It features an advanced **3D Studio** built on WebGL (React Three Fiber & Three.js), a public interactive **Showroom**, and a comprehensive **Admin Dashboard** to control inventory, design custom chassis primitives, and manage customer submissions.

---

## 🚀 Key Features

### 🎨 3D Customization Studio (Procedural Engine)
* **100% Procedural Generation:** The 3D engine uses pure math and parametric geometry (no `.glb` or `.gltf` files). Components scale, rotate, and render instantly.
* **Interactive Turntable View:** Place, rotate, and snap modular elements (beds, kitchens, bathrooms) inside the selected van chassis.
* **Live Physics & Metrics Calculator:** Dynamically computes weight distributions, floor heights, solar wattage, water capacity, and winterization levels in real-time.
* **Save & Submit Build:** Client builds are submitted to the admin database alongside contact details and specific requirements.

### 🌟 Interactive Showroom
* **3D Templates Showcase:** View preset layouts in standard orthographic and orbital camera angles.
* **Environment Controls:** Live lighting overrides, day/night scene toggles, and dynamic headlights control.
* **Next-Gen Vertical Navigation:** Fully responsive scroll-snapped transitions for exploring caravan categories.

### 🚐 Fleet & Expeditions Platform
* **Live Inventory:** Browse custom builds currently available for sale or expedition rental.
* **Craft & Brand Experience:** Showcasing the "Hand-built in Chéraga" process and off-grid Sahara expedition capabilities.

### 🔒 Admin Dashboard
* **Submissions Inbox:** View client design submissions, inspect detailed layout specifications, and review bills of materials.
* **Chassis & Component Builders:** Procedural CAD-like primitive builders to add new chassis and modular parts.
* **PDF Bill of Materials (BOM) Generator:** Export design specifications into high-quality PDFs with custom metadata.
* **Mobile-Responsive Controllers:** Optimized single-pane tab switchers and scrollbars for admin users on smartphones.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
* **Core:** Next.js (React 19), JavaScript (ES6+)
* **Styling:** TailwindCSS, Custom HSL Hues
* **3D WebGL:** React Three Fiber, React Three Drei, Three.js
* **Animations:** Framer Motion, GSAP
* **State Management:** Zustand
* **Utilities:** jsPDF, html2canvas (automated PDF reports)

### Backend (`/server`)
* **Framework:** Node.js, Express (REST API)
* **Database:** MongoDB Atlas, Mongoose ODM
* **Security:** JWT (JSON Web Tokens), bcryptjs
* **CORS:** Configuration for production cross-origin resource sharing

---

## 📂 Project Structure

```bash
Kouini Caravane/
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # Next.js Pages & Admin Viewports
│   │   ├── components/     # UI & WebGL 3D Canvas Components
│   │   ├── store/          # Zustand State Stores
│   │   └── utils/          # Client-side Utilities (PDF Generator, etc.)
│   ├── .env.example        # Client environment variables blueprint
│   └── package.json
└── server/                 # Express API Backend
    ├── src/
    │   ├── config/         # MongoDB Connections
    │   ├── controllers/    # API Controllers (Vehicles, Chassis, Templates, Submissions)
    │   ├── models/         # Mongoose Database Schemas
    │   └── routes/         # Express Router Handlers
    ├── .env.example        # Server environment variables blueprint
    ├── update_chassis_pro.js # DB Migration script for procedural chassis data
    └── package.json
```

---

## 💻 Local Development

### Prerequisites
* Node.js (v18+)
* MongoDB Local Instance or Atlas Account

### 1. Run the Backend Server & Migrate Data
```bash
cd server
npm install

# Create .env file based on .env.example and populate variables
# IMPORTANT: Run the migration script to populate the procedural DB (Sprinter/Transit data)
node update_chassis_pro.js

npm run dev
```
*The server will boot on `http://localhost:5000`.*

### 2. Run the Next.js Frontend
```bash
cd client
npm install

# Create .env file based on .env.example
npm run dev
```
*The client will start on `http://localhost:3000`.*

---

## ☁️ Deployment

### Backend Server (Render / VPS)
1. Set **Root Directory** to `server`.
2. **Build Command:** `npm install`
3. **Start Command:** `node src/server.js`
4. Define Env Variables: `MONGODB_URI`, `PORT`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.

### Frontend Web (Vercel)
1. Set **Root Directory** to `client`.
2. **Framework Preset:** `Next.js`
3. Define Env Variable: `NEXT_PUBLIC_API_URL` (points to your deployed backend URL).

---

## 📄 License
Created for **Kouini Caravane**. All rights reserved.
