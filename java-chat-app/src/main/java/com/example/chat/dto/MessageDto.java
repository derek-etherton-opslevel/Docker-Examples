package com.example.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private String username;
    private String content;
    private String roomName;
    private LocalDateTime createdAt;
}
