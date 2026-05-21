package com.example.chat.service;

import com.example.chat.dto.CreateMessageRequest;
import com.example.chat.dto.MessageDto;
import com.example.chat.model.Message;
import com.example.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for managing chat messages.
 *
 * This service provides business logic for message operations including:
 * - Creating and persisting new messages
 * - Publishing messages to RabbitMQ for asynchronous processing
 * - Retrieving message history with various filtering options
 * - Converting between entity and DTO representations
 *
 * The service acts as a bridge between controllers and the data layer,
 * implementing the business rules and coordinating between different
 * components (database, message queue).
 *
 * Transaction management:
 * - Write operations are transactional to ensure data consistency
 * - Read operations use default transaction settings
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    /**
     * Repository for database operations on Message entities.
     * Injected via constructor using Lombok's @RequiredArgsConstructor.
     */
    private final MessageRepository messageRepository;

    /**
     * Template for publishing messages to RabbitMQ.
     * Injected via constructor using Lombok's @RequiredArgsConstructor.
     */
    private final RabbitTemplate rabbitTemplate;
    
    /**
     * Name of the RabbitMQ exchange.
     * Configurable via application.properties with default value.
     */
    @Value("${rabbitmq.exchange.name:chat.exchange}")
    private String exchangeName;
    
    /**
     * Routing key for RabbitMQ message routing.
     * Configurable via application.properties with default value.
     */
    @Value("${rabbitmq.routing.key:chat.message}")
    private String routingKey;
    
    /**
     * Creates a new chat message.
     *
     * This method performs the following operations within a transaction:
     * 1. Creates a new Message entity from the request
     * 2. Sets default room name to "general" if not provided
     * 3. Persists the message to the database
     * 4. Converts the saved entity to DTO
     * 5. Publishes the message to RabbitMQ for asynchronous processing
     *
     * The transaction ensures that the message is either fully saved
     * or rolled back in case of errors.
     *
     * @param request The message creation request with validation
     * @return MessageDto representation of the created message
     */
    @Transactional
    public MessageDto createMessage(CreateMessageRequest request) {
        // Create new message entity
        Message message = new Message();
        message.setUsername(request.getUsername());
        message.setContent(request.getContent());
        // Use provided room name or default to "general"
        message.setRoomName(request.getRoomName() != null ? request.getRoomName() : "general");
        
        // Persist to database
        Message savedMessage = messageRepository.save(message);
        
        // Convert to DTO for return and publishing
        MessageDto messageDto = convertToDto(savedMessage);

        // Publish message to RabbitMQ for async processing and broadcasting
        rabbitTemplate.convertAndSend(exchangeName, routingKey, messageDto);
        
        return messageDto;
    }
    
    /**
     * Retrieves recent messages from a specific chat room.
     *
     * Returns the most recent messages up to the specified limit,
     * ordered by creation time (newest first).
     *
     * @param roomName Name of the chat room
     * @param limit Maximum number of messages to retrieve
     * @return List of message DTOs from the specified room
     */
    public List<MessageDto> getMessagesByRoom(String roomName, int limit) {
        // Create pageable for limiting results to first page with specified size
        Pageable pageable = PageRequest.of(0, limit);
        // Fetch messages from repository
        List<Message> messages = messageRepository.findByRoomNameOrderByCreatedAtDesc(roomName, pageable);
        // Convert entities to DTOs
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves recent messages from all chat rooms.
     *
     * Returns the most recent messages across all rooms up to the
     * specified limit, ordered by creation time (newest first).
     *
     * @param limit Maximum number of messages to retrieve
     * @return List of message DTOs from all rooms
     */
    public List<MessageDto> getAllMessages(int limit) {
        // Create pageable for limiting results to first page with specified size
        Pageable pageable = PageRequest.of(0, limit);
        // Fetch messages from repository
        List<Message> messages = messageRepository.findAllByOrderByCreatedAtDesc(pageable);
        // Convert entities to DTOs
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Retrieves messages from a specific room with full pagination support.
     *
     * This method returns a Page object containing:
     * - The requested page of messages
     * - Total number of messages
     * - Total number of pages
     * - Current page number and size
     *
     * Useful for implementing paginated message history views.
     *
     * @param roomName Name of the chat room
     * @param page Page number (0-indexed)
     * @param size Number of messages per page
     * @return Page of message DTOs with pagination metadata
     */
    public Page<MessageDto> getMessagesByRoomPaginated(String roomName, int page, int size) {
        // Create pageable with page and size information
        Pageable pageable = PageRequest.of(page, size);
        // Fetch paginated messages from repository
        Page<Message> messages = messageRepository.findByRoomNameOrderByCreatedAtDesc(roomName, pageable);
        // Map the Page content from entities to DTOs (preserves pagination metadata)
        return messages.map(this::convertToDto);
    }
    
    /**
     * Converts a Message entity to a MessageDto.
     *
     * This is a helper method that creates a DTO representation from
     * the database entity, making it suitable for API responses and
     * message broadcasting.
     *
     * @param message The message entity to convert
     * @return MessageDto representation of the entity
     */
    private MessageDto convertToDto(Message message) {
        return new MessageDto(
                message.getId(),
                message.getUsername(),
                message.getContent(),
                message.getRoomName(),
                message.getCreatedAt()
        );
    }
}
