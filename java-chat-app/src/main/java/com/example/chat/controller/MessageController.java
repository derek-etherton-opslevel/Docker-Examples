package com.example.chat.controller;

import com.example.chat.dto.CreateMessageRequest;
import com.example.chat.dto.MessageDto;
import com.example.chat.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing chat messages via HTTP endpoints.
 *
 * This controller provides HTTP-based operations for:
 * - Creating new messages
 * - Retrieving messages by room
 * - Retrieving all messages with pagination support
 *
 * All endpoints are prefixed with /api/messages and support CORS
 * to allow access from different origins (e.g., frontend applications).
 *
 * Note: While messages can be created via this REST API, they can also
 * be sent through WebSocket connections for real-time communication.
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    /**
     * Service layer for message operations.
     * Injected via constructor using Lombok's @RequiredArgsConstructor.
     */
    private final MessageService messageService;
    
    /**
     * Creates a new chat message.
     *
     * This endpoint accepts a message request, validates it, persists it to
     * the database, and publishes it to RabbitMQ for asynchronous processing.
     *
     * Validation constraints:
     * - Username: required, max 100 characters
     * - Content: required, max 1000 characters
     * - Room name: optional, max 50 characters
     *
     * @param request The message creation request with validation
     * @return ResponseEntity with created message and HTTP 201 status
     */
    @PostMapping
    public ResponseEntity<MessageDto> createMessage(@Valid @RequestBody CreateMessageRequest request) {
        MessageDto message = messageService.createMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }
    
    /**
     * Retrieves messages for a specific chat room.
     *
     * Returns the most recent messages for the specified room,
     * ordered by creation time (newest first).
     *
     * @param roomName Name of the chat room
     * @param limit Maximum number of messages to return (default: 50)
     * @return ResponseEntity with list of messages
     */
    @GetMapping("/room/{roomName}")
    public ResponseEntity<List<MessageDto>> getMessagesByRoom(
            @PathVariable String roomName,
            @RequestParam(defaultValue = "50") int limit) {
        List<MessageDto> messages = messageService.getMessagesByRoom(roomName, limit);
        return ResponseEntity.ok(messages);
    }
    
    /**
     * Retrieves paginated messages for a specific chat room.
     *
     * This endpoint supports pagination for better performance when
     * dealing with large message histories. Returns messages in a
     * Spring Data Page object with metadata like total pages, total elements, etc.
     *
     * @param roomName Name of the chat room
     * @param page Page number (0-indexed, default: 0)
     * @param size Number of messages per page (default: 20)
     * @return ResponseEntity with paginated messages
     */
    @GetMapping("/room/{roomName}/page")
    public ResponseEntity<Page<MessageDto>> getMessagesByRoomPaginated(
            @PathVariable String roomName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<MessageDto> messages = messageService.getMessagesByRoomPaginated(roomName, page, size);
        return ResponseEntity.ok(messages);
    }
    
    /**
     * Retrieves all messages across all rooms.
     *
     * Returns the most recent messages from all chat rooms,
     * ordered by creation time (newest first).
     *
     * @param limit Maximum number of messages to return (default: 50)
     * @return ResponseEntity with list of messages
     */
    @GetMapping
    public ResponseEntity<List<MessageDto>> getAllMessages(
            @RequestParam(defaultValue = "50") int limit) {
        List<MessageDto> messages = messageService.getAllMessages(limit);
        return ResponseEntity.ok(messages);
    }
}
