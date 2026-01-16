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

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public MessageDto sendMessage(@Payload CreateMessageRequest request) {
        MessageDto message = messageService.createMessage(request);
        return message;
    }
    
    @MessageMapping("/chat.send.room")
    public void sendMessageToRoom(@Payload CreateMessageRequest request) {
        MessageDto message = messageService.createMessage(request);
        String roomName = message.getRoomName() != null ? message.getRoomName() : "general";
        messagingTemplate.convertAndSend("/topic/room." + roomName, message);
    }
}
