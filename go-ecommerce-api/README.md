# Go E-commerce API

```
     /\_/\
    ( o.o )
     > ^ <
```

A simple e-commerce REST API built with Go, featuring PostgreSQL, Redis caching, and Elasticsearch search capabilities.

## Features

- RESTful API for product management (CRUD operations)
- PostgreSQL database for data persistence
- Redis for caching layer
- Elasticsearch for product search
- Multi-stage Docker builds for optimized images
- Health checks for all services
- Docker Compose orchestration

## Prerequisites

- Docker and Docker Compose installed
- (Optional) Go 1.21+ for local development

## Quick Start

### Using Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Build and start services:
```bash
docker-compose up -d
```

3. Check service status:
```bash
docker-compose ps
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product

### Example Requests

**Create a product:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 10
  }'
```

**Get all products:**
```bash
curl http://localhost:8080/api/products
```

## Services

- **API**: Go REST API (port 8080)
- **PostgreSQL**: Database (port 5432)
- **Redis**: Cache (port 6379)
- **Elasticsearch**: Search engine (port 9200)

## Development

### Local Development

1. Install dependencies:
```bash
go mod download
```

2. Set up environment variables in `.env`

3. Run the application:
```bash
go run main.go
```

### Docker Commands

- Start services: `docker-compose up -d`
- Stop services: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild: `docker-compose build --no-cache`
- Access database: `docker-compose exec postgres psql -U ecommerce -d ecommerce_db`

## Docker Features

- **Multi-stage builds**: Optimized image size using Alpine Linux
- **Health checks**: All services include health check configurations
- **Volume persistence**: Data persists across container restarts
- **Service dependencies**: Services start in correct order

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT
