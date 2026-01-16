package com.example.chat.repository;

import com.example.chat.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomNameOrderByCreatedAtDesc(String roomName);
    Page<Message> findByRoomNameOrderByCreatedAtDesc(String roomName, Pageable pageable);
    List<Message> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
