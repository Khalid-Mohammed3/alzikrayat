# Alzikrayat — MERN Photo Sharing App

Full-stack photo sharing application built for the *Advanced Web Technologies* course (Project 3).
Users can register, log in, upload photos, browse a gallery, and comment on photos.

**Author:** Khalid Mohammed Saleh Khalid — Student ID: 20201176367

## Features
- Register / login with bcrypt-hashed passwords and JWT authentication
- Public gallery and photo detail pages
- Photo upload (multer), display, and deletion (only by the photo's owner)
- Comments on photos
- Server-side validation (Joi) and consistent JSON error responses
- Responsive UI

## Tech stack
- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose, multer, Joi, bcryptjs, jsonwebtoken
- **Database:** MongoDB Atlas

## Project structure
```
Alzikrayat/
├── client/                 # React + Vite app
│   ├── src/
│   │   ├── components/     # Navbar, PhotoCard, CommentForm, ProtectedRoute
│   │   ├── pages/          # Home, Gallery, PhotoDetail, LoginRegister, NotFound
│   │   ├── api.js          # Axios instance (adds JWT, handles expired sessions)
│   │   ├── AuthContext.jsx # Login state shared across the app
│   │   ├── App.jsx         # React Router configuration
│   │   └── main.jsx
│   └── vite.config.js      # Dev proxy to the Express API
└── server/
    ├── models/             # User.js, Photo.js, Comment.js
    ├── routes/             # authRoutes.js, photoRoutes.js, commentRoutes.js
    ├── controllers/        # authController.js, photoController.js, commentController.js
    ├── middleware/         # auth.js, upload.js, validation.js, errorHandler.js
    ├── uploads/            # Stored image files (git-ignored)
    ├── .env.example
    └── server.js
```

## Prerequisites
- Node.js 18 or newer
- A free MongoDB Atlas cluster (https://www.mongodb.com/atlas)

## MongoDB Atlas setup
1. Create a free (M0) cluster.
2. **Database Access:** create a database user with a password (letters and numbers only).
3. **Network Access:** add IP address `0.0.0.0/0` (allow access from anywhere) for development.
4. **Connect → Drivers:** copy the connection string and add the database name `alzikrayat`.

## Installation and running

### 1. Backend
```bash
cd server
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```
Edit `.env` and fill in your values, then start the API:
```bash
npm run dev
```
The API runs on http://localhost:5000 (health check: `/api/health`).

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173. The Vite dev server proxies `/api` and `/uploads` to the Express server.

## Environment variables (`server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string, including the `alzikrayat` database name |
| `JWT_SECRET` | Long random string used to sign login tokens |

The `.env` file is excluded from Git and must never be committed.

## REST API
| Method | Endpoint | Auth | Success | Errors |
|---|---|---|---|---|
| POST | `/api/auth/register` | — | 201 | 400 validation, 409 email exists |
| POST | `/api/auth/login` | — | 200 | 400 validation, 401 wrong credentials |
| GET | `/api/photos` | — | 200 | — |
| GET | `/api/photos/:id` | — | 200 (photo + comments) | 400 bad id, 404 not found |
| POST | `/api/photos` | Bearer token | 201 | 400 validation/file, 401 |
| DELETE | `/api/photos/:id` | Bearer token (owner) | 200 | 400, 401, 403 not owner, 404 |
| POST | `/api/photos/:id/comments` | Bearer token | 201 | 400, 401, 404 |

Protected requests send the header `Authorization: Bearer <token>`.
Photo upload uses `multipart/form-data` with fields `title`, `description`, and `photo` (image, max 5 MB).

## Data model
- **User:** firstName, lastName, email (unique), password (bcrypt hash), optional bio/profilePicture
- **Photo:** userId → User, fileName, title, description, dateTime
- **Comment:** photoId → Photo, userId → User, comment, dateTime

## Security notes
- Passwords are hashed with bcrypt and never stored or returned in plain text.
- Deleting a photo is allowed only for its owner (checked on the server, returns 403 otherwise).
- Secrets live in `.env`, which is excluded from version control.
- Uploads accept image files only, with a size limit.