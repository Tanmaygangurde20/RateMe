RateStore
RateStore is a web application for managing users, stores, and admins with a rating system. It features an admin dashboard to view statistics, manage user and store data, and handle admin accounts. The application is built with a React frontend and a Node.js/Express backend, using PostgreSQL for data storage.
Table of Contents

Features
Tech Stack
Prerequisites
Installation
Usage
Folder Structure
Screenshots and Demo
Troubleshooting
License

Features

Admin Dashboard: View total users, stores, and ratings.
User Management: Add, filter, sort, and view user details (name, email, role, address).
Store Management: Add, filter, sort, and view store details (name, email, address, average rating).
Admin Management: Add and view admin users (name, email, address).
Authentication: Secure login/logout with JWT-based authentication.
Validation: Client-side validation for user, store, and admin creation (e.g., password requirements, email format).
Responsive Design: Clean and responsive UI for desktop and mobile.

Tech Stack

Frontend: React, React Router, Axios, JavaScript (ES6+)
Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
Database: PostgreSQL
Tools: npm, VS Code, Postman (for API testing)

Prerequisites

Node.js: v14 or higher
PostgreSQL: v12 or higher
Git: For cloning the repository
Postman: Optional, for testing APIs
Browser: Chrome, Firefox, or any modern browser

Installation

Clone the Repository:
git clone https://github.com/yourusername/ratestore.git
cd ratestore


Set Up Backend:

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in backend with:PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=store_ratings
DB_PORT=5432
JWT_SECRET=your_jwt_secret


Set up the PostgreSQL database:psql -U postgres

CREATE DATABASE store_ratings;
\c store_ratings
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role VARCHAR(20) NOT NULL
);
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  avg_rating DECIMAL(3,1)
);
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  user_id INTEGER REFERENCES users(id),
  rating INTEGER NOT NULL,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Start the backend:npm run dev

The server runs on http://localhost:5000.


Set Up Frontend:

Navigate to the frontend directory:cd ../frontend


Install dependencies:npm install


Start the frontend:npm start

The app runs on http://localhost:3000.


Seed Initial Data (optional):
INSERT INTO users (name, email, password, address, role)
VALUES ('System Administrator Test User', 'admin@test.com', '$2a$10$...', '123 Admin St', 'admin');



Usage

Access the App:

Open http://localhost:3000 in your browser.
Log in with:
Email: admin@test.com
Password: Admin@123




Admin Dashboard:

Dashboard: View total users, stores, and ratings.
Users Tab: Filter/sort users, add new users, view details.
Stores Tab: Filter/sort stores, add new stores, view details.
Admins Tab: View admins, add new admins.
Logout: Clears session and redirects to login.


Testing APIs (with Postman):

GET /admin/admins:GET http://localhost:5000/admin/admins
Authorization: Bearer <token>


POST /admin/admins:POST http://localhost:5000/admin/admins
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Admin User Long Name Here",
  "email": "admin@example.com",
  "password": "Admin@1234",
  "address": "789 Admin Rd"
}





Folder Structure
ratestore/
├── backend/
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   ├── db.js
│   ├── .env
│   ├── package.json
│   ├── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   ├── api.jsx
│   │   ├── App.jsx
│   ├── package.json
├── screenshots/
│   ├── dashboard.png
│   ├── users.png
│   ├── admins.png
├── demo.mp4
├── README.md

Screenshots and Demo
Demo Video
A short video showcasing the admin dashboard, including navigation through the Dashboard, Users, Stores, and Admins tabs, adding a new admin, and logging out.
Dashboard
Displays total users, stores, and ratings with a clean, card-based layout.
Users Tab
Shows a table of users with filtering, sorting, and actions to view details or add new users.
Admins Tab
Lists admin users with an option to add new admins via a modal.
Troubleshooting

Admins List Empty:
Check Console for Admins response:.
Test GET /admin/admins in Postman with a valid JWT.
Verify users table has entries with role = 'admin':SELECT * FROM users WHERE role = 'admin';




Add Admin Fails:
Check Console for Add admin response:.
Test POST /admin/admins in Postman:{
  "name": "Admin User Long Name Here",
  "email": "admin@example.com",
  "password": "Admin@1234",
  "address": "789 Admin Rd"
}


Ensure password meets requirements (8-16 chars, uppercase, special).


401/403 Errors:
Verify localStorage has token and role: "admin".
Decode token at jwt.io.
Check JWT_SECRET in backend/.env.


Database Issues:
Ensure PostgreSQL is running and .env credentials are correct.
Verify table schemas:psql -U postgres -d store_ratings
\dt




Video Not Displaying:
Ensure demo.mp4 is in the root directory (ratestore/demo.mp4).
Check file format (use .mp4 or .webm for compatibility).
For GitHub, host the video on a platform like YouTube or Vimeo and link it.



License
MIT License. See LICENSE file for details.