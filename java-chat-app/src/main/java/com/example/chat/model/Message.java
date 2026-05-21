package com.example.chat.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA Entity representing a chat message in the database.
 *
 * This entity maps to the "messages" table in PostgreSQL and represents
 * the persistent state of chat messages. Messages are stored for:
 * - Message history retrieval
 * - Offline message delivery
 * - Analytics and auditing
 *
 * Table structure:
 * - id: Primary key (auto-generated)
 * - username: Sender's username (max 100 chars, required)
 * - content: Message text (max 1000 chars, required)
 * - room_name: Chat room identifier (max 50 chars, optional)
 * - created_at: Timestamp (auto-set on creation, immutable)
 *
 * Lombok annotations provide:
 * - @Data: Generates getters, setters, toString, equals, and hashCode
 * - @NoArgsConstructor: Required by JPA for entity instantiation
 * - @AllArgsConstructor: Convenient constructor with all fields
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    /**
     * Primary key for the message.
     * Auto-generated using database identity column.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Username of the message sender.
     * Required field with maximum length of 100 characters.
     * Stored in a column that cannot be null.
     */
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String username;
    
    /**
     * Content/text of the chat message.
     * Required field with maximum length of 1000 characters.
     * Stored in a column that cannot be null with explicit length constraint.
     */
    @NotBlank
    @Size(max = 1000)
    @Column(nullable = false, length = 1000)
    private String content;
    
    /**
     * Name of the chat room where the message belongs.
     * Optional field with maximum length of 50 characters.
     * If null, the message belongs to the default/general room.
     * Mapped to "room_name" column in the database.
     */
    @Column(name = "room_name")
    @Size(max = 50)
    private String roomName;
    
    /**
     * Timestamp when the message was created.
     * Automatically set when the entity is first persisted.
     * Cannot be null and cannot be updated after creation.
     * Mapped to "created_at" column in the database.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * JPA lifecycle callback executed before persisting the entity.
     * Automatically sets the createdAt timestamp to the current time.
     * This ensures every message has a creation timestamp without
     * requiring explicit setting by the application code.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
