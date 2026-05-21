package com.example.chat.controller;

import com.example.chat.dto.CreateMessageRequest;
import com.example.chat.dto.MessageDto;
import com.example.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * WebSocket controller for real-time chat message handling.
 *
 * This controller handles messages sent from WebSocket clients and provides
 * real-time message broadcasting. It works in conjunction with the WebSocket
 * configuration to enable bidirectional communication.
 *
 * Message mappings:
 * - /app/chat.send: Sends message to public chat (broadcast to all)
 * - /app/chat.send.room: Sends message to specific room
 *
 * Note: The "/app" prefix is configured in WebSocketConfig as the
 * application destination prefix.
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    /**
     * Service for message business logic and persistence.
     * Injected via constructor using Lombok's @RequiredArgsConstructor.
     */
    private final MessageService messageService;

    /**
     * Template for sending messages to WebSocket destinations.
     * Used for programmatic message sending to specific topics.
     */
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Handles messages sent to the public chat.
     *
     * This method:
     * 1. Receives a message from a WebSocket client
     * 2. Creates and persists the message via the service layer
     * 3. Returns the message which is automatically broadcast to /topic/public
     *
     * Clients subscribed to /topic/public will receive this message.
     * The message is also published to RabbitMQ for asynchronous processing.
     *
     * @param request The message creation request from the client
     * @return The created message DTO that will be broadcast
     */
    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public MessageDto sendMessage(@Payload CreateMessageRequest request) {
        MessageDto message = messageService.createMessage(request);
        return message;
    }
    
    /**
     * Handles messages sent to a specific chat room.
     *
     * This method:
     * 1. Receives a message from a WebSocket client
     * 2. Creates and persists the message via the service layer
     * 3. Programmatically sends the message to the room-specific topic
     *
     * Unlike sendMessage(), this method doesn't use @SendTo because we need
     * to dynamically determine the destination based on the room name.
     * If no room name is provided, defaults to "general" room.
     *
     * Clients can subscribe to /topic/room.{roomName} to receive room messages.
     *
     * @param request The message creation request from the client
     */
    @MessageMapping("/chat.send.room")
    public void sendMessageToRoom(@Payload CreateMessageRequest request) {
        MessageDto message = messageService.createMessage(request);
        // Use provided room name or default to "general"
        String roomName = message.getRoomName() != null ? message.getRoomName() : "general";
        // Send to room-specific topic
        messagingTemplate.convertAndSend("/topic/room." + roomName, message);
    }
}
