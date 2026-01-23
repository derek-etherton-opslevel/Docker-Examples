# Calendar App

```
     /\_/\
    ( o.o )
     > ^ <
   /|     |\
  (_|     |_)
```

A full-stack calendar application built with React (Vite) frontend, Express.js backend, and MongoDB database. This project demonstrates Docker containerization with multi-stage builds, separate frontend/backend containers, and service orchestration.

## Features

- 📅 Interactive calendar view with month navigation
- ➕ Create, edit, and delete events
- 🎨 Color-coded events
- 💾 Persistent data storage with MongoDB
- 🐳 Fully containerized with Docker Compose
- 🚀 Multi-stage Docker builds for optimization
- 🔄 Hot reload in development mode

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Nginx** - Production web server

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Docker
- Multi-stage builds for optimized images
- Separate containers for frontend, backend, and database
- Network isolation between services
- Volume persistence for database

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

## Quick Start

### Production Mode

1. Clone the repository and navigate to the project directory:
   ```bash
   cd javascript-calendar-app
   ```

2. Start all services with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

4. Stop the services:
   ```bash
   docker-compose down
   ```

### Development Mode

For development with hot reload:

1. Start services in development mode:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

2. Access the application:
   - Frontend (Vite dev server): http://localhost:5173
   - Backend API: http://localhost:3001

## Project Structure

```
javascript-calendar-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar.jsx
│   │   │   ├── Calendar.css
│   │   │   ├── EventForm.jsx
│   │   │   └── EventForm.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile (production)
│   ├── Dockerfile.dev (development)
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── package.json
│   └── .dockerignore
├── backend/
│   ├── models/
│   │   └── Event.js
│   ├── routes/
│   │   └── calendar.js
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml
├── docker-compose.dev.yml
├── .gitignore
└── README.md
```

## Docker Architecture

### Multi-Stage Builds

**Frontend:**
- **Stage 1 (build)**: Installs dependencies and builds the React app with Vite
- **Stage 2 (production)**: Uses Nginx to serve the built static files

**Backend:**
- **Stage 1 (dependencies)**: Installs all npm packages
- **Stage 2 (runtime)**: Copies dependencies and source code to a minimal runtime image

### Services

1. **frontend**: React application served by Nginx (production) or Vite dev server (development)
2. **backend**: Express.js API server
3. **mongodb**: MongoDB database with persistent volume

### Networking

All services communicate through a custom bridge network (`calendar-network`), providing:
- Service discovery by container name
- Network isolation from other Docker networks
- Internal communication without exposing ports unnecessarily

## API Endpoints

### Events

- `GET /api/calendar/events` - Get all events (optional query params: `startDate`, `endDate`)
- `GET /api/calendar/events/:id` - Get event by ID
- `POST /api/calendar/events` - Create new event
- `PUT /api/calendar/events/:id` - Update event
- `DELETE /api/calendar/events/:id` - Delete event

### Health Check

- `GET /health` - Backend health check endpoint

## Environment Variables

### Backend

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://mongodb:27017/calendar)
- `NODE_ENV` - Environment mode (production/development)

### Frontend

- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

## Development

### Running Locally (without Docker)

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Building Images

Build all images:
```bash
docker-compose build
```

Build specific service:
```bash
docker-compose build frontend
docker-compose build backend
```

## Data Persistence

MongoDB data is persisted using a named Docker volume (`mongodb_data`). The data persists even when containers are stopped or removed.

To remove all data:
```bash
docker-compose down -v
```

## Troubleshooting

### Port Already in Use

If ports 80, 3001, or 27017 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change frontend port
  - "3002:3001"  # Change backend port
```

### MongoDB Connection Issues

Ensure MongoDB is healthy before the backend starts. The `depends_on` configuration with health checks handles this automatically.

### Frontend Can't Connect to Backend

In production, the frontend is served by Nginx which proxies `/api` requests to the backend. Ensure the `nginx.conf` proxy configuration is correct.

In development, ensure `VITE_API_URL` environment variable points to the correct backend URL.

## Docker Features Demonstrated

- ✅ Multi-stage builds for smaller production images
- ✅ Separate dev and production configurations
- ✅ Service dependencies and health checks
- ✅ Named volumes for data persistence
- ✅ Network isolation
- ✅ Environment variable configuration
- ✅ Nginx reverse proxy for static assets
- ✅ Hot reload in development mode

## License

MIT
