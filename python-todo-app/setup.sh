#!/bin/bash

# Setup script for Python Todo App
# This script checks for Podman installation and sets up the development environment

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

# Check for Podman
echo -e "\n${YELLOW}Checking for Podman...${NC}"
if ! command_exists podman; then
    echo -e "${RED}Podman is not installed.${NC}"
    echo "Please install Podman from https://podman.io/getting-started/installation"
    exit 1
else
    PODMAN_VERSION=$(podman --version)
    echo -e "${GREEN}✓ Podman found: ${PODMAN_VERSION}${NC}"
fi

# Check for Podman Compose
echo -e "\n${YELLOW}Checking for Podman Compose...${NC}"
if ! command_exists podman-compose; then
    echo -e "${RED}Podman Compose is not installed.${NC}"
    echo "Please install Podman Compose from https://github.com/containers/podman-compose"
    exit 1
else
    COMPOSE_VERSION=$(podman-compose --version)
    echo -e "${GREEN}✓ Podman Compose found: ${COMPOSE_VERSION}${NC}"
    COMPOSE_CMD="podman-compose"
fi

# Check if Podman is accessible
echo -e "\n${YELLOW}Checking Podman accessibility...${NC}"
if ! podman info >/dev/null 2>&1; then
    echo -e "${RED}Podman is not accessible.${NC}"
    echo "Please ensure Podman is properly configured."
    exit 1
else
    echo -e "${GREEN}✓ Podman is accessible${NC}"
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
echo -e "\n${YELLOW}Building Podman images...${NC}"
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
