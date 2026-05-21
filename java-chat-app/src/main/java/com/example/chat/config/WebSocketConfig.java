package com.example.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuration class for WebSocket support.
 *
 * This class configures WebSocket endpoints and message brokers for
 * real-time bidirectional communication between the server and clients.
 *
 * It uses STOMP (Simple Text Oriented Messaging Protocol) over WebSocket
 * to enable message-based communication with support for different
 * destination types (topics and queues).
 *
 * Features:
 * - SockJS fallback for browsers that don't support WebSocket
 * - Topic-based broadcasting for multiple subscribers
 * - Queue-based point-to-point messaging
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    /**
     * Configures the message broker for handling messages.
     *
     * This method sets up:
     * - A simple in-memory message broker with "/topic" and "/queue" prefixes
     *   - /topic: for broadcasting messages to multiple subscribers
     *   - /queue: for point-to-point messaging
     * - Application destination prefix "/app" for messages bound for @MessageMapping methods
     *
     * @param config MessageBrokerRegistry to configure the message broker
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker for broadcasting to subscribers
        config.enableSimpleBroker("/topic", "/queue");
        // Set prefix for messages that are bound for @MessageMapping-annotated methods
        config.setApplicationDestinationPrefixes("/app");
    }
    
    /**
     * Registers STOMP endpoints for WebSocket connections.
     *
     * This method configures:
     * - Endpoint "/ws" for WebSocket connections
     * - CORS policy allowing all origins (customize for production)
     * - SockJS fallback for browsers that don't support WebSocket natively
     *
     * SockJS provides WebSocket emulation through various transports like
     * XHR streaming, XHR polling, etc.
     *
     * @param registry StompEndpointRegistry for registering STOMP endpoints
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins (configure for production!)
                .withSockJS(); // Enable SockJS fallback options
    }
}
