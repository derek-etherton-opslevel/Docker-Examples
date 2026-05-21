package com.example.chat.consumer;

import com.example.chat.dto.MessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * RabbitMQ message consumer for chat messages.
 *
 * This component listens to messages from the RabbitMQ queue and broadcasts
 * them to WebSocket clients. It acts as a bridge between the message queue
 * and the WebSocket communication layer.
 *
 * The consumer enables:
 * - Asynchronous message processing
 * - Decoupling of message persistence from real-time delivery
 * - Scalability through message queue distribution
 *
 * Messages are sent to:
 * - /topic/public: for global chat broadcasts
 * - /topic/room.{roomName}: for room-specific messages
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Component
@Slf4j
public class MessageConsumer {

    /**
     * Template for sending messages to WebSocket clients.
     * Injected by Spring's dependency injection.
     */
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Constructor for MessageConsumer.
     *
     * @param messagingTemplate Template for sending WebSocket messages
     */
    public MessageConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    /**
     * Consumes messages from the RabbitMQ queue and broadcasts to WebSocket clients.
     *
     * This method is triggered automatically when a message arrives in the queue.
     * It performs the following actions:
     * 1. Logs the received message for monitoring
     * 2. Broadcasts to the global public topic
     * 3. If a room name is specified, also sends to the room-specific topic
     *
     * The @RabbitListener annotation makes this method a message consumer,
     * automatically deserializing messages using the configured JSON converter.
     *
     * @param message The message DTO received from the queue
     */
    @RabbitListener(queues = "${rabbitmq.queue.name:chat.queue}")
    public void consumeMessage(MessageDto message) {
        log.info("Received message from queue: {}", message);
        
        // Broadcast to all connected clients on the public topic
        messagingTemplate.convertAndSend("/topic/public", message);
        
        // Also send to specific room if room name is provided
        // This allows clients to subscribe to room-specific topics
        if (message.getRoomName() != null && !message.getRoomName().isEmpty()) {
            messagingTemplate.convertAndSend("/topic/room." + message.getRoomName(), message);
        }
    }
}
