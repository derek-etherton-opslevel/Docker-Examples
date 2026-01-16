#!/bin/bash

# Setup script for Python Todo App
# This script checks for Docker installation and sets up the development environment

set -e

echo "🚀 Setting up Python Todo App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Docker
echo -e "\n${YELLOW}Checking for Docker...${NC}"
if ! command_exists docker; then
    echo -e "${RED}Docker is not installed.${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker found: ${DOCKER_VERSION}${NC}"
fi

# Check for Docker Compose
echo -e "\n${YELLOW}Checking for Docker Compose...${NC}"
if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}Docker Compose is not installed.${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
else
    if command_exists docker-compose; then
        COMPOSE_VERSION=$(docker-compose --version)
        echo -e "${GREEN}✓ Docker Compose found: ${COMPOSE_VERSION}${NC}"
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_VERSION=$(docker compose version)
        echo -e "${GREEN}✓ Docker Compose found: ${COMPOSE_VERSION}${NC}"
        COMPOSE_CMD="docker compose"
    fi
fi

# Check if Docker daemon is running
echo -e "\n${YELLOW}Checking Docker daemon...${NC}"
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Docker daemon is not running.${NC}"
    echo "Please start Docker Desktop or the Docker daemon."
    exit 1
else
    echo -e "${GREEN}✓ Docker daemon is running${NC}"
fi

# Create .env file if it doesn't exist
echo -e "\n${YELLOW}Setting up environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file from .env.example${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping...${NC}"
fi

# Build and start containers
echo -e "\n${YELLOW}Building Docker images...${NC}"
$COMPOSE_CMD build

echo -e "\n${YELLOW}Starting containers...${NC}"
$COMPOSE_CMD up -d

# Wait for services to be healthy
echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"
sleep 5

# Check service health
echo -e "\n${YELLOW}Checking service health...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:5000/health >/dev/null 2>&1; then
        echo -e "${GREEN}✓ All services are healthy!${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "\n${RED}⚠ Services took longer than expected to start.${NC}"
    echo "You can check the logs with: $COMPOSE_CMD logs"
else
    echo -e "\n${GREEN}✅ Setup complete!${NC}"
    echo ""
    echo "Your Todo App is running at: http://localhost:5000"
    echo ""
    echo "Useful commands:"
    echo "  View logs:        $COMPOSE_CMD logs -f"
    echo "  Stop services:    $COMPOSE_CMD down"
    echo "  Restart services: $COMPOSE_CMD restart"
    echo "  View health:      curl http://localhost:5000/health"
    echo ""
    echo "API endpoints:"
    echo "  GET    http://localhost:5000/api/todos"
    echo "  POST   http://localhost:5000/api/todos"
    echo "  GET    http://localhost:5000/api/todos/:id"
    echo "  PUT    http://localhost:5000/api/todos/:id"
    echo "  DELETE http://localhost:5000/api/todos/:id"
    echo "  POST   http://localhost:5000/api/todos/:id/toggle"
fi
