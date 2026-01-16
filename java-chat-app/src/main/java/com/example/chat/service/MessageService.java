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

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.name:chat.exchange}")
    private String exchangeName;
    
    @Value("${rabbitmq.routing.key:chat.message}")
    private String routingKey;
    
    @Transactional
    public MessageDto createMessage(CreateMessageRequest request) {
        Message message = new Message();
        message.setUsername(request.getUsername());
        message.setContent(request.getContent());
        message.setRoomName(request.getRoomName() != null ? request.getRoomName() : "general");
        
        Message savedMessage = messageRepository.save(message);
        
        // Publish message to RabbitMQ for async processing
        MessageDto messageDto = convertToDto(savedMessage);
        rabbitTemplate.convertAndSend(exchangeName, routingKey, messageDto);
        
        return messageDto;
    }
    
    public List<MessageDto> getMessagesByRoom(String roomName, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Message> messages = messageRepository.findByRoomNameOrderByCreatedAtDesc(roomName, pageable);
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MessageDto> getAllMessages(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Message> messages = messageRepository.findAllByOrderByCreatedAtDesc(pageable);
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<MessageDto> getMessagesByRoomPaginated(String roomName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByRoomNameOrderByCreatedAtDesc(roomName, pageable);
        return messages.map(this::convertToDto);
    }
    
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
