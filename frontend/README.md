# RateStore Frontend

A React-based frontend for the RateStore application that allows users to rate stores and manage their accounts.

## Features

- **Landing Page**: Beautiful introduction to the platform
- **User Authentication**: Login and signup with form validation
- **Role-based Access**: Different dashboards for Admin, Customer, and Store Owner
- **Store Rating System**: Rate stores with comments
- **Responsive Design**: Works on all device sizes
- **Inline CSS**: Minimal file structure with inline styling

## Pages

- **Landing Page**: Introduction and call-to-action
- **Login**: User authentication
- **Signup**: User registration with validation
- **Admin Dashboard**: Manage users, stores, and view statistics
- **Customer Dashboard**: Browse stores, search, and submit ratings
- **Store Owner Dashboard**: View ratings and performance metrics

## Getting Started

1. Ensure the backend server is running on `http://localhost:5000`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the displayed URL

## File Structure

```
src/
├── App.js          # Main application component
├── api.js          # API service functions
├── pages/          # Page components
│   ├── Login.js
│   ├── Signup.js
│   ├── AdminPage.js
│   ├── CustomerPage.js
│   └── StoreOwnerPage.js
```

## API Integration

The frontend communicates with the backend through the `api.js` service file, which handles:
- Authentication (login, signup, logout)
- Admin operations (dashboard, user management, store management)
- Customer operations (store browsing, rating submission)
- Store owner operations (rating viewing, performance tracking)

## Styling

All styling is done with inline CSS for minimal file structure and easy maintenance.
