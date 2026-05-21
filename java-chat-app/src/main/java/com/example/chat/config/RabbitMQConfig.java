package com.example.chat.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for RabbitMQ message broker.
 *
 * This class sets up the RabbitMQ infrastructure including:
 * - Topic exchange for message routing
 * - Durable queue for message persistence
 * - Binding between exchange and queue
 * - JSON message converter for serialization/deserialization
 * - RabbitTemplate for sending messages
 *
 * The configuration uses a topic exchange pattern which allows flexible
 * message routing based on routing keys.
 *
 * @author Chat Application Team
 * @version 1.0.0
 */
@Configuration
public class RabbitMQConfig {
    
    /**
     * Name of the RabbitMQ exchange.
     * Can be overridden via application.properties.
     * Default: chat.exchange
     */
    @Value("${rabbitmq.exchange.name:chat.exchange}")
    private String exchangeName;
    
    /**
     * Name of the RabbitMQ queue.
     * Can be overridden via application.properties.
     * Default: chat.queue
     */
    @Value("${rabbitmq.queue.name:chat.queue}")
    private String queueName;
    
    /**
     * Routing key for binding queue to exchange.
     * Can be overridden via application.properties.
     * Default: chat.message
     */
    @Value("${rabbitmq.routing.key:chat.message}")
    private String routingKey;
    
    /**
     * Creates a topic exchange bean.
     *
     * Topic exchanges route messages to queues based on routing key patterns.
     * This is useful for implementing pub/sub patterns with selective routing.
     *
     * @return TopicExchange configured with the exchange name
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchangeName);
    }
    
    /**
     * Creates a durable queue bean.
     *
     * A durable queue persists across RabbitMQ server restarts, ensuring
     * that messages are not lost even if the broker goes down.
     *
     * @return Queue configured as durable with the specified name
     */
    @Bean
    public Queue queue() {
        return QueueBuilder.durable(queueName).build();
    }
    
    /**
     * Creates a binding between the queue and exchange.
     *
     * The binding uses the routing key to determine which messages
     * should be routed from the exchange to the queue.
     *
     * @return Binding that connects the queue to the exchange
     */
    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(exchange())
                .with(routingKey);
    }
    
    /**
     * Creates a JSON message converter.
     *
     * This converter uses Jackson to serialize/deserialize Java objects
     * to/from JSON when sending/receiving messages through RabbitMQ.
     * This allows us to send complex objects rather than just strings.
     *
     * @return Jackson2JsonMessageConverter for JSON serialization
     */
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    /**
     * Creates and configures the RabbitTemplate.
     *
     * RabbitTemplate is the main class for sending messages to RabbitMQ.
     * It's configured with the JSON message converter to automatically
     * serialize messages to JSON format.
     *
     * @param connectionFactory RabbitMQ connection factory (auto-injected)
     * @return AmqpTemplate configured for sending messages
     */
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
