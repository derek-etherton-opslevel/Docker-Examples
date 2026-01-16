package com.example.chat.consumer;

import com.example.chat.dto.MessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class MessageConsumer {
    private final SimpMessagingTemplate messagingTemplate;
    
    public MessageConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    @RabbitListener(queues = "${rabbitmq.queue.name:chat.queue}")
    public void consumeMessage(MessageDto message) {
        log.info("Received message from queue: {}", message);
        
        // Broadcast to all connected clients
        messagingTemplate.convertAndSend("/topic/public", message);
        
        // Also send to specific room if room name is provided
        if (message.getRoomName() != null && !message.getRoomName().isEmpty()) {
            messagingTemplate.convertAndSend("/topic/room." + message.getRoomName(), message);
        }
    }
}
