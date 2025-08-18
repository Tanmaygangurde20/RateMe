# RateStore

RateStore is a full‑stack web application for managing **users, stores, and ratings**. It includes an **Admin Dashboard** (totals & management), **Customer** views (browse stores & rate), and **Store Owner** views (see ratings). The stack is **React + Node/Express + PostgreSQL**, with **JWT** authentication.

---
<video src="./DemoVideo.mp4" controls width="600"></video>
![Customer View](./customer.png)  
![Admin View](./admin.png)

## ✨ Features

* **Authentication**: Signup/Login with JWT; protected role routes (admin, normal, store\_owner)
* **Admin**:

  * Dashboard (totals: users, stores, ratings)
  * Manage users (add, filter, sort, details)
  * Manage stores (add, filter, sort, details, avg rating)
  * Manage admins (add/view)
* **Customer**: Browse & filter stores, submit ratings & reviews
* **Store Owner**: View ratings for owned store(s)
* **Validation**: Email format; password policy; field length limits
* **Responsive UI**: Clean desktop & mobile layout

---

## 🧰 Tech Stack

* **Frontend**: React, React Router, Fetch/Axios
* **Backend**: Node.js, Express, JWT (jsonwebtoken), bcrypt
* **Database**: PostgreSQL
* **Tooling**: npm, VS Code, Postman (optional)

---

## ✅ Prerequisites

* **Node.js** v14+ (v18+ recommended)
* **PostgreSQL** v12+
* **Git** (to clone)
* **A modern browser** (Chrome/Edge/Firefox)

---

## ⚙️ Setup & Installation

### 1) Clone the repository

```bash
git clone https://github.com/yourusername/ratestore.git
cd ratestore
```

### 2) Backend setup

```bash
cd backend
npm install
```

Create **.env** in `backend/`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=store_ratings
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

#### Create the database & tables

```sql
-- In a terminal
psql -U postgres

-- Create DB
CREATE DATABASE store_ratings;
\c store_ratings

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','normal','store_owner'))
);

-- Stores  (aligned with backend: /signup inserts owner_id, NOT a password)
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  address VARCHAR(400),
  owner_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  avg_rating DECIMAL(3,1) DEFAULT 0
);

-- Ratings
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, store_id)
);
```

> **Note**: If you previously created a `stores` table with a `password` column, drop & recreate it to match the backend logic:
>
> ```sql
> DROP TABLE IF EXISTS ratings;
> DROP TABLE IF EXISTS stores;
> -- then re-run the CREATE TABLE stores & ratings shown above
> ```

#### Start the backend

```bash
npm run dev   # or: node index.js
```

The server should print: `Server running on port 5000`.

### 3) Frontend setup

```bash
cd ../frontend
npm install
npm start
```

The app runs at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔐 Auth Flow & API Examples

### Signup

`POST http://localhost:5000/signup`

```json
{
  "name": "John Customer Long Name Example",
  "email": "john@example.com",
  "address": "123 Main St",
  "password": "Strong@123",
  "role": "normal"  // or "store_owner"
}
```

> Password policy (from backend): 8–16 chars, **at least one uppercase** & **one special** `!@#$&*`.

If `role === "store_owner"`, backend auto-creates a default store linked via `owner_id`.

### Login

`POST http://localhost:5000/login`

```json
{
  "email": "john@example.com",
  "password": "Strong@123"
}
```

**Response** (as implemented):

```json
{
  "token": "<JWT>",
  "user": {
    "id": 1,
    "name": "John Customer Long Name Example",
    "email": "john@example.com",
    "role": "normal"
  }
}
```

> In the frontend, save `token` and `user.role`. Example: `localStorage.setItem('token', token); localStorage.setItem('role', user.role);`

### Protected example (profile)

`GET http://localhost:5000/profile`

Headers:

```
Authorization: Bearer <JWT>
```

### Admin examples

* List admins: `GET http://localhost:5000/admin/admins`
* Add admin: `POST http://localhost:5000/admin/admins`

All admin routes require: `Authorization: Bearer <JWT>` with an admin user.

---

## 🗂️ Project Structure

```
ratestore/
├── backend/
│   ├── routes/
│   │   ├── admin.js
│   │   ├── customer.js
│   │   ├── storeowner.js
│   ├── db.js
│   ├── .env
│   ├── package.json
│   ├── index.js            # (server entry)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   │   ├── CustomerPage.jsx
│   │   │   ├── StoreOwnerPage.jsx
│   │   │   ├── StoreDetailsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   ├── api.jsx
│   │   ├── App.jsx
│   ├── package.json
│
├── screenshots/
│   ├── dashboard.png
│   ├── users.png
│   ├── admins.png
├── demo.mp4
├── README.md
```

---

## 🧪 Seeding (optional)

Insert an initial admin (password must be **bcrypt** hash if you insert directly):

```sql
INSERT INTO users (name, email, password, address, role)
VALUES (
  'System Administrator Test User',
  'admin@test.com',
  '$2b$10$abcdefghijklmnopqrstuv1234567890abcdEFGHijklmnoPQRStU',
  '123 Admin St',
  'admin'
);
```

> Or use the app’s signup + role switch in DB for quick local testing.

---

## 🧭 Frontend Integration Notes

* Every protected request must include the header:

  ```http
  Authorization: Bearer <token>
  ```
* In `api.jsx`, prefer a **shared response handler** that throws on non‑OK responses and auto‑handles `401` (e.g., clear token & redirect to `/login`).
* When rendering lists (e.g., stores), **defensively** coerce to arrays to avoid `stores.map is not a function` when an error payload is returned:

  ```js
  setStores(Array.isArray(data) ? data : []);
  ```

---

## 🛡️ Troubleshooting

### 401 Unauthorized on frontend

* Confirm you’re saving `response.user.role` (not `response.role`) from `/login`.
* Ensure requests include `Authorization: Bearer <token>`.
* Check that your backend `JWT_SECRET` in `.env` matches what signed the token.

### PostgreSQL cannot connect (Windows)

* Start the service via **Services** (`services.msc`) → PostgreSQL → Start.
* Or reinstall with *Install as a Service* enabled.

### psql prompt stuck at `-#`

* You have an incomplete SQL statement. Press **Ctrl+C**, then re‑run with a semicolon `;`.

### `stores.map is not a function`

* The fetch likely returned an error object. Guard in React and log the response.

### CORS

* Backend uses `cors()` globally. If hosting separately, configure `cors({ origin: '<frontend-origin>', credentials: true })`.

---

## 📸 Screenshots & Demo

Place screenshots in `./screenshots/` and an optional short demo video in project root as `demo.mp4`.

---

## 📄 License

MIT License. See `LICENSE` for details.
