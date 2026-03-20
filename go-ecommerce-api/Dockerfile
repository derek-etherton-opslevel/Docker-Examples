WORKDIR /app

# Copy go mod files
COPY go.mod* go.sum* ./
RUN go mod download

# Copy source code
