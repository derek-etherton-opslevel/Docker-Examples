- PostgreSQL database for data persistence
- Redis for caching layer
- Elasticsearch for product search
- Multi-stage Podman builds for optimized images
- Health checks for all services
- Podman Compose orchestration

## Prerequisites

- Podman and Podman Compose installed
- (Optional) Go 1.21+ for local development

## Quick Start

2. Build and start services:
```bash
podman-compose up -d
```

3. Check service status:
```bash
podman-compose ps
```

## API Endpoints
go run main.go
```

### Podman Commands

- Start services: `podman-compose up -d`
- Stop services: `podman-compose down`
- View logs: `podman-compose logs -f`
- Rebuild: `podman-compose build --no-cache`
- Access database: `podman-compose exec postgres psql -U ecommerce -d ecommerce_db`

## Podman Features

- **Multi-stage builds**: Optimized image size using Alpine Linux
- **Health checks**: All services include health check configurations
- **Volume persistence**: Data persists across container restarts
- **Service dependencies**: Services start in correct order
- **Rootless containers**: Enhanced security through daemonless architecture

## Environment Variables

