#!/bin/bash

set -e

echo "🚀 Setting up Ruby Blog App with Podman..."

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed."
    echo "Please install Podman from https://podman.io/getting-started/installation"
    exit 1
fi

# Check if Podman Compose is installed
if ! command -v podman-compose &> /dev/null && ! podman compose version &> /dev/null; then
    echo "❌ Podman Compose is not installed."
    echo "Please install Podman Compose from https://github.com/containers/podman-compose"
    exit 1
fi

echo "✅ Podman is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "⚠️  Please update .env file with your SECRET_KEY_BASE"
        echo "   You can generate one with: rails secret"
    else
        echo "⚠️  .env.example not found, creating basic .env file..."
        cat > .env << EOF
POSTGRES_DB=blog_development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
RAILS_ENV=production
SECRET_KEY_BASE=$(openssl rand -hex 32)
REDIS_URL=redis://redis:6379/0
EOF
    fi
else
    echo "✅ .env file already exists"
fi

# Generate SECRET_KEY_BASE if not set
if ! grep -q "SECRET_KEY_BASE=" .env || grep -q "SECRET_KEY_BASE=your_secret_key_base_here" .env; then
    echo "🔑 Generating SECRET_KEY_BASE..."
    SECRET_KEY=$(openssl rand -hex 32)
    if grep -q "SECRET_KEY_BASE=" .env; then
        sed -i.bak "s/SECRET_KEY_BASE=.*/SECRET_KEY_BASE=$SECRET_KEY/" .env
        rm .env.bak 2>/dev/null || true
    else
        echo "SECRET_KEY_BASE=$SECRET_KEY" >> .env
    fi
    echo "✅ SECRET_KEY_BASE generated"
fi

# Build and start containers
echo "🏗️  Building container images..."
podman-compose build

echo "🚀 Starting containers..."
podman-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations and seed
echo "📊 Running database migrations..."
podman-compose exec -T rails bundle exec rails db:create db:migrate || true

echo "🌱 Seeding database..."
podman-compose exec -T rails bundle exec rails db:seed || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Default admin credentials:"
echo "   Email: admin@blog.com"
echo "   Password: admin123"
echo ""
echo "🌐 Access the application at:"
echo "   http://localhost"
echo ""
echo "📊 View logs with:"
echo "   podman-compose logs -f"
echo ""
echo "🛑 Stop the application with:"
echo "   podman-compose down"
echo ""
