package com.example.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Chat Application.
 *
 * This is a Spring Boot application that provides a real-time chat system
 * using WebSocket for real-time communication, RabbitMQ for message queuing,
 * and PostgreSQL for message persistence.
 *
 * The @SpringBootApplication annotation enables:
 * - Auto-configuration
 * - Component scanning
 * - Configuration properties
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@SpringBootApplication
public class ChatApplication {

    /**
     * Main method that starts the Spring Boot application.
     *
     * @param args Command-line arguments passed to the application
     */
    public static void main(String[] args) {
        SpringApplication.run(ChatApplication.class, args);
    }
}
