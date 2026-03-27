# Multi-stage Containerfile for Rails application
FROM ruby:3.2.0-slim as base

# Install dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  nodejs \
  npm \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Gemfile and install gems
COPY Gemfile Gemfile.lock* ./
RUN bundle check || bundle install

# Copy application code
COPY . .

# Precompile assets (if assets exist)
RUN if [ -d "app/assets" ] || [ -d "app/javascript" ]; then \
      RAILS_ENV=production SECRET_KEY_BASE=dummy bundle exec rails assets:precompile || true; \
    else \
      mkdir -p public/assets public/packs; \
    fi

# Production stage
FROM ruby:3.2.0-slim as production

RUN apt-get update -qq && apt-get install -y \
  libpq-dev \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy gems from base stage
COPY --from=base /usr/local/bundle /usr/local/bundle

# Copy application code
COPY --from=base /app /app

# Copy precompiled assets
COPY --from=base /app/public/assets /app/public/assets
COPY --from=base /app/public/packs /app/public/packs

# Set environment variables
ENV RAILS_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true
ENV RAILS_LOG_TO_STDOUT=true

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
