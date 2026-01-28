<div align="center">

# 📝 Ruby Blog App

A full-featured blog platform built with Ruby on Rails 7, containerized with Docker. Features include user authentication, post management, comments, admin panel, and background job processing with Sidekiq.

[![Ruby Version](https://img.shields.io/badge/ruby-3.2.0-red.svg)](https://www.ruby-lang.org/)
[![Rails Version](https://img.shields.io/badge/rails-7.0-red.svg)](https://rubyonrails.org/)
[![Docker](https://img.shields.io/badge/docker-enabled-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-7-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [🌐 Accessing the Application](#-accessing-the-application)
- [🔐 Default Credentials](#-default-credentials)
- [🐳 Docker Services](#-docker-services)
- [💻 Development](#-development)
- [⚙️ Environment Variables](#️-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🎯 Docker Features](#-docker-features)
- [🔧 Troubleshooting](#-troubleshooting)
- [🚢 Production Considerations](#-production-considerations)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

- 🔐 **User Authentication**: Secure login system with password hashing
- 📄 **Blog Posts**: Create, edit, and delete blog posts with publishing controls
- 💬 **Comments**: Users can comment on posts
- 👥 **Admin Panel**: Administrative dashboard for managing posts and users
- ⚡ **Background Jobs**: Sidekiq integration for async task processing
- 🔄 **Reverse Proxy**: Nginx for serving static assets and proxying requests
- 🏗️ **Multi-Service Architecture**: PostgreSQL, Redis, Rails, Sidekiq, and Nginx

---

## 🏗️ Architecture

The application uses Docker Compose to orchestrate multiple services:

| Service | Description | Port |
|---------|-------------|------|
| 🚂 **Rails** | Main application server (Puma) | 3000 |
| 🐘 **PostgreSQL** | Database for storing posts, users, and comments | 5432 |
| 🔴 **Redis** | Cache and Sidekiq job queue | 6379 |
| ⚙️ **Sidekiq** | Background job processor | - |
| 🌐 **Nginx** | Reverse proxy and static asset server | 80 |

---

## 📋 Prerequisites

- 🐳 Docker and Docker Compose installed
- 💾 At least 2GB of available RAM
- 🔌 Ports 80, 3000, 5432, and 6379 available

---

## 🚀 Quick Start

### Option 1: Using the Setup Script (Recommended)

```bash
./setup.sh
```

The setup script will:
- Check for Docker installation
- Create `.env` file from `.env.example`
- Generate a secure `SECRET_KEY_BASE`
- Build Docker images
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
   docker-compose build
   docker-compose up -d
   ```

4. **Run database migrations:**
   ```bash
   docker-compose exec rails bundle exec rails db:create db:migrate db:seed
   ```

---

## 🌐 Accessing the Application

| Interface | URL | Description |
|-----------|-----|-------------|
| 🌐 **Web Interface** | http://localhost | Main application |
| 🚂 **Rails Server** | http://localhost:3000 | Direct Rails access |
| 👥 **Admin Panel** | http://localhost/admin | Admin dashboard |

---

## 🔐 Default Credentials

After running the seed script, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| 👤 **Admin User** | `admin@blog.com` | `admin123` |
| 👤 **Regular User** | `user@blog.com` | `password123` |

> ⚠️ **Security Note**: Change these credentials before deploying to production!

---

## 🐳 Docker Services

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f rails
docker-compose logs -f sidekiq
docker-compose logs -f nginx
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### Rebuild After Changes

```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## 💻 Development

### Running Rails Console

```bash
docker-compose exec rails bundle exec rails console
```

### Running Database Migrations

```bash
docker-compose exec rails bundle exec rails db:migrate
```

### Creating a New Migration

```bash
docker-compose exec rails bundle exec rails generate migration MigrationName
```

### Accessing Database

```bash
docker-compose exec postgres psql -U postgres -d blog_development
```

---

## ⚙️ Environment Variables

Key environment variables (configured in `.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `blog_development` |
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `RAILS_ENV` | Rails environment | `production` |
| `SECRET_KEY_BASE` | Rails secret key for encryption | *required* |
| `REDIS_URL` | Redis connection URL | `redis://redis:6379/0` |

---

## 📂 Project Structure

```plaintext
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
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile           # Multi-stage Docker build
├── nginx.conf           # Nginx reverse proxy config
├── setup.sh             # Automated setup script
└── README.md            # This file
```

---

## 🎯 Docker Features

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

---

## 🔧 Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check if PostgreSQL container is running:
   ```bash
   docker-compose ps
   ```

2. Verify database credentials in `.env`

3. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

### Port Already in Use

If ports 80, 3000, 5432, or 6379 are already in use:

1. Stop the conflicting service
2. Or modify port mappings in `docker-compose.yml`

### Asset Precompilation Errors

If assets fail to precompile:

1. Rebuild the Docker image:
   ```bash
   docker-compose build --no-cache rails
   ```

2. Check for missing dependencies in `Gemfile`

### Sidekiq Not Processing Jobs

1. Check Sidekiq logs:
   ```bash
   docker-compose logs sidekiq
   ```

2. Verify Redis connection:
   ```bash
   docker-compose exec redis redis-cli ping
   ```

---

## 🚢 Production Considerations

For production deployment:

- ✅ **Change default passwords** in `.env`
- ✅ **Use strong SECRET_KEY_BASE** (generate with `rails secret`)
- ✅ **Enable SSL/TLS** in Nginx configuration
- ✅ **Set up proper backup** for PostgreSQL volumes
- ✅ **Configure log rotation**
- ✅ **Use environment-specific configurations**
- ✅ **Set resource limits** in `docker-compose.yml`

---

## 📄 License

This is a sample application for demonstration purposes.

---

## 🤝 Contributing

This is a sample repository. Feel free to use it as a starting point for your own projects!

---

<div align="center">

**Made with ❤️ using Ruby on Rails and Docker**

[![Ruby](https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white)](https://www.ruby-lang.org/)
[![Rails](https://img.shields.io/badge/Rails-CC0000?style=for-the-badge&logo=ruby-on-rails&logoColor=white)](https://rubyonrails.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)

</div>
