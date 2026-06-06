# Roxiler Store Rating System

## Project Overview
Store Rating System is a Full Stack Web Application developed using:
Frontend: React JS
Backend: Node.js + Express JS
Database: MySQL
Authentication: JWT (JSON Web Token)
ORM: Sequelize

## Features
=== System Administrator ===
- Login to Admin Dashboard
- View Total Users
- View Total Stores
- View Total Ratings
- Add New Users
- Add New Stores
- Search Users
- Search Stores
- View User Details
- View Store Details
- Logout

=== Normal User ===
- User Registration
- Login
- View Stores
- Search Stores
- Submit Rating (1-5)
- Update Existing Rating
- View Own Rating
- Change Password
- Logout

=== Store Owner ===
- Login
- View Store Dashboard
- View Average Store Rating
- View Users Who Rated Store
- Change Password
- Logout

## Technology Stack
== Frontend ==
- React JS
- React Router DOM
- Axios
- Bootstrap

== Backend ==
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- bcryptjs

== Database ==
- MySQL

## Database Tables
- Users
- Stores
- Rating


## Installation
npm install

## Start Server
npm start

## Environment Variables
PORT= 5000
DB_HOST= localhost
DB_USER= root
DB_PASSWORD= Anuksha1334
DB_NAME= roxiler_db
JWT_SECRET= roxiler_secret_key

## Login Credentials
Admin
- Email: admin@gmail.com
- Password: Admin@123

Store Owner
- Email: owner@gmail.com
- Password: Owner@123

User
- Email: user@gmail.com
- Password: User@123

## APIs
Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET  /api/auth/profile
- PUT /api/auth/change-password

Admin
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/admin/stores
- GET /api/admin/users/:id
- POST /api/admin/users

Store Owner
- GET /api/stores
- GET /api/stores/user/:userId
- GET /api/store-owner/dashboard/:storeId

Ratings
- POST /api/ratings
- PUT /api/ratings/:id
- GET /api/ratings
- GET /api/ratings/average/:storeId

## Validation Rules
Name
- Minimum: 20 characters
- Maximum: 60 characters

Address
- Maximum: 400 characters

Password
- Minimum: 8 characters
- Maximum: 16 characters 
- Must contain:
✓ One uppercase letter
✓ One special character

Email
- Must be valid email format

## Developed By
- Sanju Banka