import React, { useState } from 'react';
import './ChatInterface.css';
import { set } from 'mongoose';

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, type: 'sent', content: 'Hey, I need your help' },
        { id: 2, type: 'received', content: 'Sure, how can I help you?' },
    ]);

    // Function to call chatbot API
    const getChatbotResponse = async (userInput) => {
        try {
            const response = await fetch('/api/chatbot/ask', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.response : 'Chatbot failed to respond.';
        } catch (error) {
            console.error('Error:', error);
            return 'Error connecting to chatbot.';
        }
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now(),
                type: 'sent',
                content: message,
            };

            setMessage('');
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            
            // Fetch chatbot response
            const botResponse = await getChatbotResponse(message);
            const newBotMessage = {
                id: Date.now(),
                type: 'received',
                content: botResponse,
            };

            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        }
    };

    return (
        <div className="chat-interface">
            <div className="container">
                <div className="contacts">
                    <div className="search-box">
                        <div className="search-icon"></div>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="contact active">
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                        <div>
                            <strong>Your AI Companion</strong>
                            <p>messages content</p>
                        </div>
                    </div>
                    <div className="contact active">
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                        <div>
                            <strong>Khanh</strong>
                            <p>messages content</p>
                        </div>
                    </div>
                </div>

                <div className="chat-area">
                    <div className="chat-header">DR. NAME</div>
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message ${msg.type}`}
                            >
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt="avatar"
                                />
                                <div className="message-content">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            placeholder="Write a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
