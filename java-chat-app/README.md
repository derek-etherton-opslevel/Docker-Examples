# Java Chat Application

A real-time chat application built with Spring Boot, featuring WebSocket support, PostgreSQL persistence, and RabbitMQ message queue integration.

## Features

- **REST API** for sending and retrieving chat messages
- **WebSocket** support for real-time bidirectional communication
- **PostgreSQL** database for message persistence
- **RabbitMQ** message broker for asynchronous message processing
- **Multi-stage Podman build** for optimized container images
- **Podman Compose** setup for easy development and deployment

## Architecture

The application follows a microservices architecture pattern:

- **API Service**: Spring Boot application handling REST endpoints and WebSocket connections
- **PostgreSQL**: Relational database for storing chat messages
- **RabbitMQ**: Message broker for async message processing and distribution

## Prerequisites

- Podman and Podman Compose installed
  - For desktop environments, consider [Podman Desktop](https://podman-desktop.io/)
  - For CLI installation, see [Podman Installation Guide](https://podman.io/getting-started/installation)
- Java 17+ (for local development without Podman)
- Maven 3.6+ (for local development)

## Quick Start with Podman

1. **Clone the repository** (if not already done):
   ```bash
   cd java-chat-app
   ```

2. **Create environment file** (optional):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to customize database credentials, ports, etc.

3. **Start all services**:
   ```bash
   podman-compose up -d
   ```

4. **Check service status**:
   ```bash
   podman-compose ps
   ```

5. **View logs**:
   ```bash
   podman-compose logs -f api
   ```

## Services

Once started, the following services will be available:

- **API**: http://localhost:8080
- **RabbitMQ Management UI**: http://localhost:15672 (guest/guest)
- **PostgreSQL**: localhost:5432

## API Endpoints

### REST API

- `POST /api/messages` - Create a new message
  ```json
  {
    "username": "john_doe",
    "content": "Hello, world!",
    "roomName": "general"
  }
  ```

- `GET /api/messages` - Get all messages (limit: 50 by default)
  - Query params: `limit` (default: 50)

- `GET /api/messages/room/{roomName}` - Get messages by room
  - Query params: `limit` (default: 50)

- `GET /api/messages/room/{roomName}/page` - Get paginated messages by room
  - Query params: `page` (default: 0), `size` (default: 20)

### WebSocket

- **Endpoint**: `ws://localhost:8080/ws`
- **Send to**: `/app/chat.send` or `/app/chat.send.room`
- **Subscribe to**: 
  - `/topic/public` - All messages
  - `/topic/room.{roomName}` - Messages for specific room

#### WebSocket Example (JavaScript)

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to public messages
    stompClient.subscribe('/topic/public', function(message) {
        const chatMessage = JSON.parse(message.body);
        console.log('Received:', chatMessage);
    });
    
    // Send a message
    stompClient.send('/app/chat.send', {}, JSON.stringify({
        username: 'john_doe',
        content: 'Hello, everyone!',
        roomName: 'general'
    }));
});
```

## Development

### Local Development (without Podman)

1. **Start PostgreSQL and RabbitMQ** (using Podman Compose):
   ```bash
   podman-compose up -d postgres rabbitmq
   ```

2. **Update application.properties** with local connection details

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

### Building the Podman Image

```bash
podman build -t chat-app:latest .
```

### Running Individual Services

```bash
# Start only database
podman-compose up -d postgres

# Start only RabbitMQ
podman-compose up -d rabbitmq

# Start API (requires postgres and rabbitmq)
podman-compose up -d api
```

## Podman Features

- **Multi-stage build**: Separates build and runtime stages for smaller images
- **JRE-only runtime**: Uses JRE instead of full JDK for reduced image size
- **Health checks**: All services include health check configurations
- **Service dependencies**: API waits for database and RabbitMQ to be healthy
- **Named volumes**: Data persistence for PostgreSQL and RabbitMQ
- **Network isolation**: Services communicate through dedicated Podman network

## Environment Variables

See `.env.example` for all available environment variables:

- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` - PostgreSQL configuration
- `RABBITMQ_USER`, `RABBITMQ_PASSWORD`, `RABBITMQ_PORT` - RabbitMQ configuration
- `API_PORT` - API service port

## Testing the Application

### Using cURL

```bash
# Create a message
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "content": "Hello from cURL!",
    "roomName": "general"
  }'

# Get messages
curl http://localhost:8080/api/messages

# Get messages by room
curl http://localhost:8080/api/messages/room/general
```

### Using WebSocket Client

You can use any WebSocket client or browser console to test WebSocket functionality. The application uses STOMP over WebSocket.

## Stopping Services

```bash
podman-compose down
```

To also remove volumes (⚠️ this will delete all data):

```bash
podman-compose down -v
```

## Troubleshooting

### Port Already in Use

If ports 8080, 5432, or 5672 are already in use, modify the port mappings in `podman-compose.yml` or set different values in `.env`.

### Database Connection Issues

Ensure PostgreSQL is healthy before starting the API:
```bash
podman-compose ps postgres
```

### RabbitMQ Connection Issues

Check RabbitMQ health:
```bash
podman-compose ps rabbitmq
```

Access RabbitMQ Management UI at http://localhost:15672 to monitor queues and connections.

## Project Structure

```
java-chat-app/
├── src/
│   └── main/
│       ├── java/com/example/chat/
│       │   ├── ChatApplication.java
│       │   ├── config/
│       │   │   ├── RabbitMQConfig.java
│       │   │   └── WebSocketConfig.java
│       │   ├── controller/
│       │   │   ├── MessageController.java
│       │   │   └── WebSocketController.java
│       │   ├── consumer/
│       │   │   └── MessageConsumer.java
│       │   ├── dto/
│       │   │   ├── CreateMessageRequest.java
│       │   │   └── MessageDto.java
│       │   ├── model/
│       │   │   └── Message.java
│       │   ├── repository/
│       │   │   └── MessageRepository.java
│       │   └── service/
│       │       └── MessageService.java
│       └── resources/
│           └── application.properties
├── Containerfile
├── podman-compose.yml
├── pom.xml
├── .env.example
├── .gitignore
└── README.md
```

## License

This is a sample application for demonstration purposes.
