package com.example.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateMessageRequest {
    @NotBlank(message = "Username is required")
    @Size(max = 100, message = "Username must not exceed 100 characters")
    private String username;
    
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Message content must not exceed 1000 characters")
    private String content;
    
    @Size(max = 50, message = "Room name must not exceed 50 characters")
    private String roomName;
}
