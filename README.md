# HRMS Lite — Human Resource Management System

Managing a team shouldn't be complicated. **HRMS Lite** is a streamlined, modern human resource platform designed to help small teams stay organized with minimal effort. It focuses on the essentials: managing your people and keeping track of who's in.


---

## 🌟 Key Features

- **Intuitive Dashboard**: At-a-glance view of team attendance and recent activity.
- **Employee Directory**: Easily add, manage, and onboard new team members.
- **Smart Attendance**: A refined, one-click interface to mark status (Present/Absent).
- **Automated Reporting**: Real-time email updates for attendance rate and scheduled daily reports.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ The Tech Stack

I built this using a modern, type-safe stack to ensure both performance and reliability:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/) for styling, and [ShadCN UI](https://ui.shadcn.com/) for a premium component feel.
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) for a lightweight but powerful REST API.
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) to handle our data with strict integrity.
- **Email**: [Nodemailer](https://nodemailer.com/) with custom network optimizations for high delivery reliability in cloud environments.

---

## 🚀 Getting Started Locally

Getting the project running on your machine is straightforward. You'll need to set up both the backend and the frontend.

### 1. Prerequisites
- **Node.js**: Version 18 or higher.
- **PostgreSQL**: A running instance (local or hosted like Neon.tech).

### 2. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/hrms_lite"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-char-app-password"
   JWT_SECRET="your-secret-key"
   FRONTEND_URL="http://localhost:3000"
   ```
4. Generate the database client: `npx prisma generate`
5. Run the dev server: `npm run dev` (API will live on port 5001).

### 3. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5001/api"
   ```
4. Start the app: `npm run dev` (Visit `http://localhost:3000`).

---

## 💡 Important Notes (Assumptions & Limitations)

- **Attendance Logic**: The system currently tracks attendance on a daily "status" basis (Present/Absent). It does not currently support multiple clock-in/out timestamps per day.
- **Daily Reports**: The automated summary emails are scheduled to send at **6:00 PM server time** every day.
- **Email Credentials**: For Gmail integration, you **must** use a 16-character App Password. A standard Gmail password will be rejected for security reasons.
- **Network Routing**: I've included a custom network fix in the backend to ensure the app works reliably on cloud platforms (like Render) that sometimes struggle with outbound IPv6 routing.

---

## 📄 License
This project is open-source and available for use and modification. Developed with ❤️ for better team management.
