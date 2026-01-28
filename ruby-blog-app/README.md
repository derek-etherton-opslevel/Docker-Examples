<div align="center">

![Ruby Blog App Banner](https://via.placeholder.com/1200x300/FF6B6B/FFFFFF?text=Ruby+Blog+App+-+Dockerized+Rails+7+Application)

# 📝 Ruby Blog App

![Ruby](https://img.shields.io/badge/Ruby-3.2.0-red?style=for-the-badge&logo=ruby&logoColor=white)
![Rails](https://img.shields.io/badge/Rails-7.0-red?style=for-the-badge&logo=rubyonrails&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-red?style=for-the-badge&logo=redis&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A full-featured blog platform built with Ruby on Rails 7, containerized with Docker**

*Features include user authentication, post management, comments, admin panel, and background job processing with Sidekiq*

[Getting Started](#-quick-start) • [Features](#-features) • [Documentation](#-table-of-contents) • [Contributing](#-contributing)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [🌐 Accessing the Application](#-accessing-the-application)
- [🔑 Default Credentials](#-default-credentials)
- [🐳 Docker Services](#-docker-services)
- [💻 Development](#-development)
- [⚙️ Environment Variables](#️-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🎯 Docker Features](#-docker-features)
- [🔧 Troubleshooting](#-troubleshooting)
- [🚀 Production Considerations](#-production-considerations)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

- **User Authentication**: Secure login system with password hashing
- **Blog Posts**: Create, edit, and delete blog posts with publishing controls
- **Comments**: Users can comment on posts
- **Admin Panel**: Administrative dashboard for managing posts and users
- **Background Jobs**: Sidekiq integration for async task processing
- **Reverse Proxy**: Nginx for serving static assets and proxying requests
- **Multi-Service Architecture**: PostgreSQL, Redis, Rails, Sidekiq, and Nginx

---

## 🏗️ Architecture

The application uses Docker Compose to orchestrate multiple services:

- **Rails**: Main application server (Puma)
- **PostgreSQL**: Database for storing posts, users, and comments
- **Redis**: Cache and Sidekiq job queue
- **Sidekiq**: Background job processor
- **Nginx**: Reverse proxy and static asset server

<div align="center">

```
┌─────────────┐
│   Nginx     │ ← Port 80
│ (Port 80)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Rails     │ ← Port 3000
│   (Puma)    │
└──┬──────┬───┘
   │      │
   │      └──────────┐
   │                 │
   ▼                 ▼
┌──────────┐   ┌──────────┐
│PostgreSQL│   │  Redis   │
│          │   │          │
└──────────┘   └────┬─────┘
                    │
                    ▼
              ┌──────────┐
              │ Sidekiq  │
              │Background│
              │  Jobs    │
              └──────────┘
```

*Multi-service architecture with reverse proxy, application server, database, cache, and background job processor*

</div>

---

## 📋 Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available RAM
- Ports 80, 3000, 5432, and 6379 available

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

- **Web Interface**: http://localhost
- **Rails Server** (direct): http://localhost:3000
- **Admin Panel**: http://localhost/admin (requires admin login)

---

## 🔑 Default Credentials

After running the seed script, you can log in with:

- **Admin User:**
  - Email: `admin@blog.com`
  - Password: `admin123`

- **Regular User:**
  - Email: `user@blog.com`
  - Password: `password123`

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

- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `RAILS_ENV`: Rails environment (development/production)
- `SECRET_KEY_BASE`: Rails secret key for encryption
- `REDIS_URL`: Redis connection URL

---

## 📂 Project Structure

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

## 🚀 Production Considerations

For production deployment:

1. **Change default passwords** in `.env`
2. **Use strong SECRET_KEY_BASE** (generate with `rails secret`)
3. **Enable SSL/TLS** in Nginx configuration
4. **Set up proper backup** for PostgreSQL volumes
5. **Configure log rotation**
6. **Use environment-specific configurations**
7. **Set resource limits** in `docker-compose.yml`

---

## 📄 License

This is a sample application for demonstration purposes.

---

## 🤝 Contributing

This is a sample repository. Feel free to use it as a starting point for your own projects!

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🔨 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

---

<div align="center">

Made with ❤️ by developers, for developers

**[⬆ Back to Top](#-ruby-blog-app)**

</div>
