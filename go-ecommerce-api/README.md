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
podman-compose -f podman-compose.yml up -d
```

3. Check service status:
```bash
podman-compose -f podman-compose.yml ps
```

## API Endpoints
go run main.go
```

### Podman Commands

- Start services: `podman-compose -f podman-compose.yml up -d`
- Stop services: `podman-compose -f podman-compose.yml down`
- View logs: `podman-compose -f podman-compose.yml logs -f`
- Rebuild: `podman-compose -f podman-compose.yml build --no-cache`
- Access database: `podman-compose -f podman-compose.yml exec postgres psql -U ecommerce -d ecommerce_db`

## Podman Features

- **Multi-stage builds**: Optimized image size using Alpine Linux
- **Health checks**: All services include health check configurations
