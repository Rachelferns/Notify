# Notify - Smart Notice Board

A full-stack microservices notice board application with React frontend and Node.js/Express backend services.

## Architecture

This project uses a microservices architecture with 4 services running together via `start.sh`:

| Service | Port | Description |
|---|---|---|
| Frontend (React CRA) | 5000 | User-facing notice board UI |
| Gateway | 5003 | API gateway that proxies to microservices |
| Notice Service | 5001 | CRUD operations for notices (MongoDB) |
| Auth Service | 5002 | Login and role assignment |

### Request Flow
```
Browser → Frontend (port 5000)
         → API calls → Gateway (port 5003)
                       → Notice Service (port 5001) → MongoDB
                       → Auth Service (port 5002)   → MongoDB
```

## Tech Stack

- **Frontend**: React 19, react-router-dom v7, Create React App (CRA)
- **Backend**: Node.js, Express v5
- **Database**: MongoDB via Mongoose
- **Architecture**: API Gateway pattern with http-proxy-middleware

## Running the App

The workflow command is: `bash start.sh`

This starts all 4 services in the correct order.

## Environment Variables / Secrets

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string (secret) |
| `NOTICE_SERVICE_URL` | Internal URL for notice service (auto-set to `http://localhost:5001`) |
| `AUTH_SERVICE_URL` | Internal URL for auth service (auto-set to `http://localhost:5002`) |

## Frontend Configuration

- `frontend/.env.development` sets `DANGEROUSLY_DISABLE_HOST_CHECK=true` for Replit proxy compatibility
- `PORT=5000`, `HOST=0.0.0.0` for Replit's webview
- `REACT_APP_API_URL=http://localhost:5003` points to the local gateway

## Key Files

- `start.sh` — Main startup script launching all services
- `gateway/server.js` — API gateway with proxy middleware
- `notice-service/server.js` — Notice CRUD + MongoDB schema
- `auth-service/server.js` — Simple username-based role login
- `frontend/src/config/api.js` — API base URL configuration
- `frontend/src/pages/Home.jsx` — Public notice listing page
- `frontend/src/pages/Admin.jsx` — Admin dashboard (post/delete/mark important)

## User Roles

- **admin** — Can post, delete, and mark notices as important (login with username `admin`)
- **student** — Read-only view of notices (any other username)

Role is stored in `localStorage` after login and sent as a header with each API request.
