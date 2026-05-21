# Multi-stage Dockerfile for Chat Application
# This Dockerfile uses a two-stage build process to:
# 1. Build the application with all build tools and dependencies
# 2. Create a minimal runtime image with only the JRE and application JAR
# Benefits: Smaller final image size, improved security, faster deployments

# ============================================
# Stage 1: Build Stage
# ============================================
# Uses Maven with Eclipse Temurin JDK 17 to build the application
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory for build operations
WORKDIR /app

# Copy pom.xml first to leverage Docker layer caching
# Dependencies are downloaded in a separate layer that can be cached
# This layer only rebuilds when pom.xml changes
COPY pom.xml .
# Download dependencies in offline mode for faster subsequent builds
# -B flag enables batch mode (non-interactive)
RUN mvn dependency:go-offline -B

# Copy application source code
# This layer rebuilds whenever source code changes
COPY src ./src

# Build the application
# clean: removes previous build artifacts
# package: compiles, tests, and packages the application as JAR
# -DskipTests: skips test execution for faster builds (tests should run in CI/CD)
RUN mvn clean package -DskipTests

# ============================================
# Stage 2: Runtime Stage
# ============================================
# Uses minimal JRE-only image based on Alpine Linux for smaller size
FROM eclipse-temurin:17-jre-alpine

# Set working directory for application
WORKDIR /app

# Install wget utility for health check operations
# --no-cache: don't cache the package index locally (keeps image smaller)
RUN apk add --no-cache wget

# Create a non-root user for security best practices
# Running as non-root reduces security risks if container is compromised
# -S: creates a system user/group
RUN addgroup -S spring && adduser -S spring -G spring
# Switch to the non-root user for running the application
USER spring:spring

# Copy the built JAR file from the build stage
# --from=build: references the build stage
# Copies only the compiled JAR, not the source code or build tools
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 for the application
# This is a documentation feature; actual port exposure happens at runtime
EXPOSE 8080

# Configure health check for container orchestration
# Health checks allow Docker/Kubernetes to monitor application health
# --interval=30s: check every 30 seconds
# --timeout=3s: fail if check takes longer than 3 seconds
# --start-period=40s: give the app 40 seconds to start before checking
# --retries=3: mark unhealthy after 3 consecutive failures
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
# ENTRYPOINT ensures the container always runs the Spring Boot application
# The application is started using the standard java -jar command
ENTRYPOINT ["java", "-jar", "app.jar"]
