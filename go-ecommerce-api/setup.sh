#!/bin/bash

set -e

echo "🚀 Setting up Go E-commerce API..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        cat > .env << 'EOF'
# Application
PORT=8080

# Database
DB_HOST=postgres
DB_USER=ecommerce
DB_PASSWORD=password
DB_NAME=ecommerce_db
DB_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_URL=http://elasticsearch:9200
ELASTICSEARCH_PORT=9200
EOF
    fi
    echo "✅ .env file created. You can modify it if needed."
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Initialize Elasticsearch indices (optional)
echo "📊 Initializing Elasticsearch indices..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ All services are running!"
    echo ""
    echo "📍 API available at: http://localhost:8080"
    echo "📍 Health check: http://localhost:8080/health"
    echo "📍 Elasticsearch: http://localhost:9200"
    echo ""
    echo "📚 API Endpoints:"
    echo "  GET    /api/products"
    echo "  GET    /api/products/{id}"
    echo "  POST   /api/products"
    echo "  PUT    /api/products/{id}"
    echo "  DELETE /api/products/{id}"
    echo ""
    echo "To stop services: docker-compose down"
    echo "To view logs: docker-compose logs -f"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
