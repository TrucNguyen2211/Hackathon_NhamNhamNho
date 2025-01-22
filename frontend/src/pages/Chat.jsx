import React, { useState } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', content: 'Hi! How can I help you today?' }
    ]);

    // Function to call chatbot API
    async function getChatbotResponse(userInput) {
        try {
            const response = await fetch("/api/chatbot/ask", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userInput }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            return data.success ? data.response : "Chatbot failed to respond.";
        } catch (error) {
            console.error("Error:", error);
            return "Error connecting to chatbot.";
        }
    }
    

    // Handle sending a message
    const handleSendMessage = async () => {
        if (message.trim()) {
            // Add user message to chat
            const newUserMessage = { sender: 'user', content: message };
            setChatMessages([...chatMessages, newUserMessage]);

            // Clear input field
            setMessage('');

            // Get chatbot response
            const botResponse = await getChatbotResponse(message);
            const newBotMessage = { sender: 'bot', content: botResponse };

            // Update chat with bot response
            setChatMessages([...chatMessages, newUserMessage, newBotMessage]);
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
                            <strong>DR. NAME</strong>
                            <p>messages content</p>
                        </div>
                    </div>
                </div>

                <div className="chat-area">
                    <div className="chat-header">DR. NAME</div>
                    <div className="chat-messages">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                                <img src="https://via.placeholder.com/50" alt="avatar" />
                                <div className="message-content">{msg.content}</div>
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

                <div className="profile">
                    <img src="https://via.placeholder.com/100" alt="profile" />
                    <h2>DR. NAME</h2>
                    <p>Information here</p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
