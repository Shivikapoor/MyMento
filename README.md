# MyMento

MyMento is a full-stack mental wellness and counselling platform built with React, Vite, Node.js, Express, MongoDB, and Socket.IO. It combines session booking, mood tracking, goal and dream progress, community chat, anonymous one-on-one chat, ratings, and role-based dashboards in one project.

The app is split into two parts:

- `frontend/` for the React client
- `backend/` for the Express API, MongoDB models, email flows, and real-time chat server

## Features

- User authentication with signup, login, JWT-based protected routes, and password reset via OTP email
- Role-based experience for `client`, `counsellor`, and `admin`
- Session booking with date and time slot selection
- Slot conflict protection to prevent overlapping appointments
- Counsellor dashboard to review, confirm, and delete bookings
- Client appointment history
- Ratings and reviews after sessions
- Mood tracking with a 7-day history view
- Wellness tools including breathing, grounding, journaling-style support, mood boosting, sleep help, and quick reset flows
- Dream and task tracking with progress calculation
- Personalized wellness insights generated from mood and progress trends
- Real-time Socket.IO chat with:
  - Community room
  - Anonymous private matching
  - Typing indicators
  - Report, block, and end chat actions
- Email notifications for bookings and confirmations
- Deployment-ready frontend/backend separation for Vercel + Render style hosting

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Axios
- Framer Motion
- Chart.js and `react-chartjs-2`
- Socket.IO Client

**Backend**

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- bcryptjs
- Nodemailer
- Socket.IO

## Project Structure

```text
.
|-- backend
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   |-- socket
|   |-- utils
|   `-- server.js
|-- frontend
|   |-- public
|   |-- src
|   |   |-- components
|   |   |-- config
|   |   |-- context
|   |   |-- pages
|   |   |-- services
|   |   |-- styles
|   |   `-- utils
|   `-- vite.config.js
`-- DEPLOYMENT.md
```

## Core Modules

- `Auth`: signup, login, forgot password OTP, reset password
- `Appointments`: booking flow, booked slot lookup, counsellor confirmation, client history
- `Wellness`: mood logs, tasks, dreams, and weekly insights
- `Chat`: community chat and anonymous private one-on-one chat
- `Ratings`: post-session feedback
- `Admin`: view and manage users and appointments

## Screens and User Flows

**For clients**

- Sign up and log in
- Book a counselling session
- View appointment history
- Track daily mood
- Manage dreams and tasks
- Use self-help wellness tools
- Join Talk Space community or one-on-one anonymous chat
- Rate counselling sessions

**For counsellors**

- View all booked appointments
- Confirm or delete appointments
- Review client ratings
- Access counsellor-specific dashboard and profile tools

**For admins**

- View all users
- View all appointments
- Delete users and appointments

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd counselling-app
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DNS_SERVERS=8.8.8.8,1.1.1.1
NODE_ENV=development
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Notes:

- If `VITE_API_URL` is omitted in development, the frontend can still use the local Vite proxy depending on your setup.
- Gmail-based email sending requires an app password if 2FA is enabled.
- The backend exposes Socket.IO from the same server used for the API.

## Running the Project

### Start the backend

From `backend/`:

```bash
npm run dev
```

The backend runs by default on `http://localhost:5000`.

### Start the frontend

From `frontend/`:

```bash
npm run dev
```

The frontend runs by default on `http://localhost:5173`.

## API Overview

Base URL:

```text
/api
```

Main route groups:

- `/api/auth`
  - `POST /signup`
  - `POST /login`
  - `POST /send-otp`
  - `POST /verify-otp`
  - `POST /reset-password`
- `/api/appointments`
  - `POST /`
  - `GET /my`
  - `GET /`
  - `PUT /:id`
  - `DELETE /:id`
  - `GET /booked-slots?date=YYYY-MM-DD`
- `/api/ratings`
- `/api/counsellors`
- `/api/profile`
- `/api/mood`
- `/api/task`
- `/api/dream`
- `/api/insight`
- `/api/admin`

Health routes:

- `GET /`
- `GET /health`

## Real-Time Chat Events

The chat server supports these key Socket.IO events:

- `set_nickname`
- `join_community`
- `community message`
- `request_private_chat`
- `private message`
- `user typing`
- `end chat`
- `report user`
- `block user`

## Authentication and Roles

JWT tokens are used to protect private routes and API endpoints.

Current roles in the codebase:

- `client`
- `counsellor`
- `admin`

Important implementation note:

- New accounts are created as `client` by default
- One specific email, `hrishabhadhikari@gmail.com`, is automatically assigned the `counsellor` role during signup

If you plan to open-source or productionize this project further, moving role assignment to an admin-managed workflow would be a stronger approach.

## Deployment

This repository already includes deployment notes in [DEPLOYMENT.md](./DEPLOYMENT.md).

The current deployment model appears to be:

- Frontend on Vercel
- Backend on Render
- Database on MongoDB Atlas or another hosted MongoDB instance

For production-style deployment, make sure:

- `FRONTEND_URL` and `CORS_ORIGINS` match your deployed frontend domains
- `VITE_API_URL` points to the deployed backend
- Your Render backend stays awake or is health-checked regularly if using a sleeping instance

## Known Limitations

- There is no automated test suite configured yet
- The backend `dev` script currently runs `node server.js` rather than a watcher like `nodemon`
- Some role assignment logic is hardcoded
- The ratings `GET` route is protected but not yet explicitly restricted to counsellor/admin in route middleware
- Email delivery depends on Gmail SMTP credentials being configured correctly

## Future Improvements

- Add unit and integration tests for API routes and critical UI flows
- Add proper admin tools for role management
- Add counsellor availability management instead of fixed hourly slots
- Persist chat moderation and reporting workflows
- Add pagination and filtering for ratings, users, and appointments
- Improve production validation, logging, and error handling
- Add Docker support and a root-level workspace script setup

## Repository Notes

- `DEPLOYMENT.md` contains deployment-specific troubleshooting notes
- `frontend/README.md` contains the default Vite README generated for the frontend app

## License

No license is currently specified in this repository. If you plan to publish it publicly on GitHub, adding a license file is recommended.
