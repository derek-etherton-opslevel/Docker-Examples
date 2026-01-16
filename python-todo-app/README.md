# Python Todo App

A practical REST API Todo application built with Flask, PostgreSQL, and Redis, fully containerized with Docker.

## Features

- ✅ Full CRUD operations for todos
- ✅ PostgreSQL database for persistent storage
- ✅ Redis caching for improved performance
- ✅ Health check endpoints
- ✅ RESTful API design
- ✅ Docker Compose multi-service setup
- ✅ Health checks for all services
- ✅ Named volumes for data persistence

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

If you don't have Docker installed, the `setup.sh` script can help guide you through installation.

## Quick Start

### Option 1: Using the Setup Script (Recommended)

The setup script will check for Docker, create environment files, and start all services:

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Clone or navigate to this directory:**
   ```bash
   cd python-todo-app
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

   Or with newer Docker versions:
   ```bash
   docker compose up -d
   ```

4. **Verify services are running:**
   ```bash
   curl http://localhost:5000/health
   ```

## Development Mode

For development with hot-reload and volume mounting:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the application, database, and Redis.

### Get All Todos
```
GET /api/todos
GET /api/todos?completed=true
GET /api/todos?completed=false
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Sample Todo",
    "description": "This is a sample todo item",
    "completed": false,
    "created_at": "2024-01-01T12:00:00",
    "updated_at": "2024-01-01T12:00:00"
  }
]
```

### Get Single Todo
```
GET /api/todos/:id
```

### Create Todo
```
POST /api/todos
Content-Type: application/json

{
  "title": "New Todo",
  "description": "Optional description",
  "completed": false
}
```

### Update Todo
```
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true
}
```

### Delete Todo
```
DELETE /api/todos/:id
```

### Toggle Todo Status
```
POST /api/todos/:id/toggle
```

## Docker Architecture

This application uses a multi-service Docker Compose setup:

- **app**: Flask application (Python 3.11)
- **postgres**: PostgreSQL 15 database
- **redis**: Redis 7 cache

### Service Health Checks

All services include health checks:
- PostgreSQL: `pg_isready` command
- Redis: `redis-cli ping`
- Flask App: HTTP health endpoint

### Volumes

- `postgres_data`: Persistent storage for PostgreSQL data
- `redis_data`: Persistent storage for Redis data

### Networks

All services communicate through a custom bridge network (`todo-network`).

## Environment Variables

Create a `.env` file (or copy from `.env.example`) to customize:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `FLASK_DEBUG`: Enable/disable debug mode

## Useful Commands

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f app      # App logs only
docker-compose logs -f postgres # Database logs only
docker-compose logs -f redis    # Redis logs only
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Access Database
```bash
docker-compose exec postgres psql -U todo_user -d todo_db
```

### Access Redis CLI
```bash
docker-compose exec redis redis-cli
```

### Restart a Service
```bash
docker-compose restart app
```

## Testing the API

### Using curl

```bash
# Create a todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Todo", "description": "This is a test"}'

# Get all todos
curl http://localhost:5000/api/todos

# Get a specific todo (replace 1 with actual ID)
curl http://localhost:5000/api/todos/1

# Update a todo
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Todo", "completed": true}'

# Toggle todo status
curl -X POST http://localhost:5000/api/todos/1/toggle

# Delete a todo
curl -X DELETE http://localhost:5000/api/todos/1
```

## Project Structure

```
python-todo-app/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Production Docker Compose config
├── docker-compose.dev.yml # Development overrides
├── setup.sh              # Setup script
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Troubleshooting

### Services won't start
- Check if ports 5000, 5432, or 6379 are already in use
- Verify Docker daemon is running: `docker info`
- Check logs: `docker-compose logs`

### Database connection errors
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Wait a few seconds after starting for database to initialize

### Redis connection errors
- Check Redis container status: `docker-compose ps redis`
- Verify Redis is accessible: `docker-compose exec redis redis-cli ping`

## License

This is a sample project for educational purposes.
