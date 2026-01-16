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

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {
    private final MessageService messageService;
    
    @PostMapping
    public ResponseEntity<MessageDto> createMessage(@Valid @RequestBody CreateMessageRequest request) {
        MessageDto message = messageService.createMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }
    
    @GetMapping("/room/{roomName}")
    public ResponseEntity<List<MessageDto>> getMessagesByRoom(
            @PathVariable String roomName,
            @RequestParam(defaultValue = "50") int limit) {
        List<MessageDto> messages = messageService.getMessagesByRoom(roomName, limit);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/room/{roomName}/page")
    public ResponseEntity<Page<MessageDto>> getMessagesByRoomPaginated(
            @PathVariable String roomName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<MessageDto> messages = messageService.getMessagesByRoomPaginated(roomName, page, size);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping
    public ResponseEntity<List<MessageDto>> getAllMessages(
            @RequestParam(defaultValue = "50") int limit) {
        List<MessageDto> messages = messageService.getAllMessages(limit);
        return ResponseEntity.ok(messages);
    }
}
