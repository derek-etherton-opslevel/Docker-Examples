
echo "🚀 Setting up Go E-commerce API..."

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Please install Podman first."
    echo "Visit: https://podman.io/getting-started/installation"
    exit 1
fi

# Check if Podman Compose is installed
if ! command -v podman-compose &> /dev/null; then
    echo "❌ Podman Compose is not installed. Please install Podman Compose first."
    echo "Visit: https://github.com/containers/podman-compose"
    exit 1
fi

fi

# Build and start services
echo "🔨 Building Podman images..."
podman-compose build

echo "🚀 Starting services..."
podman-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10
sleep 5

# Check if services are running
if podman-compose ps | grep -q "Up"; then
    echo "✅ All services are running!"
    echo ""
    echo "📍 API available at: http://localhost:8080"
    echo "  PUT    /api/products/{id}"
    echo "  DELETE /api/products/{id}"
    echo ""
    echo "To stop services: podman-compose down"
    echo "To view logs: podman-compose logs -f"
else
    echo "❌ Some services failed to start. Check logs with: podman-compose logs"
    exit 1
fi
