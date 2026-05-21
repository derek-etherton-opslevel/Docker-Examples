package com.example.chat.repository;

import com.example.chat.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Message entities.
 *
 * This interface provides database access methods for chat messages.
 * It extends JpaRepository which provides:
 * - CRUD operations (save, findById, findAll, delete, etc.)
 * - Pagination and sorting support
 * - Batch operations
 *
 * Custom query methods follow Spring Data JPA naming conventions,
 * allowing the framework to automatically generate the implementation
 * based on method names.
 *
 * All methods are implicitly transactional and thread-safe when used
 * with Spring's transaction management.
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Finds all messages in a specific room, ordered by creation time (newest first).
     *
     * This method returns all messages without pagination, which is suitable
     * for small datasets. For large datasets, use the paginated version.
     *
     * Query generated:
     * SELECT * FROM messages WHERE room_name = ? ORDER BY created_at DESC
     *
     * @param roomName Name of the chat room
     * @return List of messages in the specified room, ordered newest to oldest
     */
    List<Message> findByRoomNameOrderByCreatedAtDesc(String roomName);

    /**
     * Finds messages in a specific room with pagination, ordered by creation time (newest first).
     *
     * This method supports pagination and is recommended for retrieving
     * large message histories efficiently.
     *
     * Query generated:
     * SELECT * FROM messages WHERE room_name = ? ORDER BY created_at DESC
     * LIMIT ? OFFSET ?
     *
     * @param roomName Name of the chat room
     * @param pageable Pagination information (page number, size, etc.)
     * @return Page of messages with pagination metadata
     */
    Page<Message> findByRoomNameOrderByCreatedAtDesc(String roomName, Pageable pageable);

    /**
     * Finds all messages across all rooms with pagination, ordered by creation time (newest first).
     *
     * This method retrieves messages from all chat rooms, sorted by creation time.
     * Uses Pageable to limit the result set for performance.
     *
     * Note: Despite the method name suggesting pagination, this returns a List
     * rather than a Page. The Pageable parameter is used only for limiting
     * and sorting the results.
     *
     * Query generated:
     * SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?
     *
     * @param pageable Pagination information (used for limit and offset)
     * @return List of messages from all rooms, ordered newest to oldest
     */
    List<Message> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
