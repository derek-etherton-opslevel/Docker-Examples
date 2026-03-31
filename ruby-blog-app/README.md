# Ruby Blog App

A full-featured blog platform built with Ruby on Rails 7, containerized with Podman. Features include user authentication, post management, comments, admin panel, and background job processing with Sidekiq.

## Features

- **User Authentication**: Secure login system with password hashing
- **Blog Posts**: Create, edit, and delete blog posts with publishing controls
- **Comments**: Users can comment on posts
- **Admin Panel**: Administrative dashboard for managing posts and users
- **Background Jobs**: Sidekiq integration for async task processing
- **Reverse Proxy**: Nginx for serving static assets and proxying requests
- **Multi-Service Architecture**: PostgreSQL, Redis, Rails, Sidekiq, and Nginx

## Architecture

The application uses Podman Compose to orchestrate multiple services:

- **Rails**: Main application server (Puma)
- **PostgreSQL**: Database for storing posts, users, and comments
- **Redis**: Cache and Sidekiq job queue
- **Sidekiq**: Background job processor
- **Nginx**: Reverse proxy and static asset server

## Prerequisites

- Podman and Podman Compose installed
- At least 2GB of available RAM
- Ports 80, 3000, 5432, and 6379 available

## Quick Start

### Option 1: Using the Setup Script (Recommended)

```bash
./setup.sh
```

The setup script will:
- Check for Podman installation
- Create `.env` file from `.env.example`
- Generate a secure `SECRET_KEY_BASE`
- Build Podman images
- Start all services
- Run database migrations
- Seed the database with sample data

### Option 2: Manual Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Generate SECRET_KEY_BASE:**
   ```bash
   # Generate a secret key
   openssl rand -hex 32
   # Add it to .env file
   ```

3. **Build and start services:**
   ```bash
   podman-compose build
   podman-compose up -d
   ```

4. **Run database migrations:**
   ```bash
   podman-compose exec rails bundle exec rails db:create db:migrate db:seed
   ```

## Accessing the Application

- **Web Interface**: http://localhost
- **Rails Server** (direct): http://localhost:3000
- **Admin Panel**: http://localhost/admin (requires admin login)

## Default Credentials

After running the seed script, you can log in with:

- **Admin User:**
  - Email: `admin@blog.com`
  - Password: `admin123`

- **Regular User:**
  - Email: `user@blog.com`
  - Password: `password123`

## Podman Services

### View Logs

```bash
# All services
podman-compose logs -f

# Specific service
podman-compose logs -f rails
podman-compose logs -f sidekiq
podman-compose logs -f nginx
```

### Stop Services

```bash
podman-compose down
```

### Stop and Remove Volumes

```bash
podman-compose down -v
```

### Rebuild After Changes

```bash
podman-compose build --no-cache
podman-compose up -d
```

## Development

### Running Rails Console

```bash
podman-compose exec rails bundle exec rails console
```

### Running Database Migrations

```bash
podman-compose exec rails bundle exec rails db:migrate
```

### Creating a New Migration

```bash
podman-compose exec rails bundle exec rails generate migration MigrationName
```

### Accessing Database

```bash
podman-compose exec postgres psql -U postgres -d blog_development
```

## Environment Variables

Key environment variables (configured in `.env`):

- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `RAILS_ENV`: Rails environment (development/production)
- `SECRET_KEY_BASE`: Rails secret key for encryption
- `REDIS_URL`: Redis connection URL

## Project Structure

```
ruby-blog-app/
├── app/
│   ├── controllers/      # Application controllers
│   ├── models/           # ActiveRecord models
│   ├── views/            # ERB templates
│   └── jobs/             # Background jobs (Sidekiq)
├── config/
│   ├── database.yml      # Database configuration
│   ├── puma.rb          # Puma server config
│   ├── sidekiq.yml      # Sidekiq configuration
│   └── routes.rb        # Application routes
├── db/
│   ├── migrate/         # Database migrations
│   └── seeds.rb         # Seed data
├── podman-compose.yml    # Podman Compose configuration
├── Dockerfile           # Multi-stage Podman build
├── nginx.conf           # Nginx reverse proxy config
├── setup.sh             # Automated setup script
└── README.md            # This file
```

## Podman Features

### Multi-Stage Build

The Dockerfile uses a multi-stage build to:
- Compile assets in the build stage
- Create a minimal production image
- Reduce final image size

### Health Checks

All services include health checks to ensure proper startup ordering and service availability.

### Volume Persistence

- `postgres_data`: Database persistence
- `redis_data`: Redis data persistence
- `bundle_cache`: Gem cache for faster rebuilds

### Nginx Reverse Proxy

Nginx serves static assets directly and proxies dynamic requests to Rails, improving performance and reducing load on the application server.

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check if PostgreSQL container is running:
   ```bash
   podman-compose ps
   ```

2. Verify database credentials in `.env`

3. Check PostgreSQL logs:
   ```bash
   podman-compose logs postgres
   ```

### Port Already in Use

If ports 80, 3000, 5432, or 6379 are already in use:

1. Stop the conflicting service
2. Or modify port mappings in `podman-compose.yml`

### Asset Precompilation Errors

If assets fail to precompile:

1. Rebuild the Podman image:
   ```bash
   podman-compose build --no-cache rails
   ```

2. Check for missing dependencies in `Gemfile`

### Sidekiq Not Processing Jobs

1. Check Sidekiq logs:
   ```bash
   podman-compose logs sidekiq
   ```

2. Verify Redis connection:
   ```bash
   podman-compose exec redis redis-cli ping
   ```

## Production Considerations

For production deployment:

1. **Change default passwords** in `.env`
2. **Use strong SECRET_KEY_BASE** (generate with `rails secret`)
3. **Enable SSL/TLS** in Nginx configuration
4. **Set up proper backup** for PostgreSQL volumes
5. **Configure log rotation**
6. **Use environment-specific configurations**
7. **Set resource limits** in `podman-compose.yml`

## License

This is a sample application for demonstration purposes.

## Contributing

This is a sample repository. Feel free to use it as a starting point for your own projects!
