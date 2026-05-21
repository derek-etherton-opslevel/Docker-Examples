package com.example.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for creating a new chat message.
 *
 * This class represents the request payload when creating a message
 * either through REST API or WebSocket. It includes validation constraints
 * to ensure data integrity before processing.
 *
 * Validation rules:
 * - Username: required, max 100 characters
 * - Content: required, max 1000 characters
 * - Room name: optional, max 50 characters (defaults to "general" if not provided)
 *
 * The @Data annotation from Lombok automatically generates:
 * - Getters and setters for all fields
 * - toString(), equals(), and hashCode() methods
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Data
public class CreateMessageRequest {

    /**
     * Username of the message sender.
     * Must not be blank and cannot exceed 100 characters.
     */
    @NotBlank(message = "Username is required")
    @Size(max = 100, message = "Username must not exceed 100 characters")
    private String username;
    
    /**
     * Content/text of the message.
     * Must not be blank and cannot exceed 1000 characters.
     */
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Message content must not exceed 1000 characters")
    private String content;
    
    /**
     * Name of the chat room where the message will be sent.
     * Optional field - if not provided, message goes to the default "general" room.
     * Maximum length is 50 characters.
     */
    @Size(max = 50, message = "Room name must not exceed 50 characters")
    private String roomName;
}
