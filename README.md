# HRMS Lite — Human Resource Management System

A full-stack web application for managing employees and tracking attendance.

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | Next.js (App Router), TypeScript, Tailwind CSS, Axios |
| Backend   | Node.js, Express.js, REST API         |
| Database  | MongoDB with Mongoose                 |
| Deploy    | Vercel (frontend), Render (backend)   |

## Project Structure

```
HRMS/
├── backend/          # Express.js REST API
│   ├── config/       # MongoDB connection
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   ├── middleware/    # Error handling
│   └── server.js     # Entry point
│
└── frontend/         # Next.js App
    └── src/
        ├── app/          # Pages (dashboard, employees, attendance)
        ├── components/   # Reusable UI components
        ├── services/     # API client (Axios)
        └── types/        # TypeScript interfaces
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### Backend

```bash
cd backend
npm install
# Edit .env with your MONGO_URI
npm run dev
```

The API runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
# Edit .env.local with your NEXT_PUBLIC_API_URL
npm run dev
```

The app runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/employees`            | Create a new employee    |
| GET    | `/api/employees`            | List all employees       |
| DELETE | `/api/employees/:employeeId`| Delete an employee       |
| POST   | `/api/attendance`           | Mark attendance          |
| GET    | `/api/attendance/:employeeId`| Get attendance history  |

## Deployment

- **Frontend** → Push to GitHub and connect to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` to your Render backend URL.
- **Backend** → Push to GitHub and connect to [Render](https://render.com). Set `MONGO_URI` environment variable.
