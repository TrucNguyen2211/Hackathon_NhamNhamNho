import React, { useState, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, type: 'sent', content: 'Hey, I need your help' },
        { id: 2, type: 'received', content: 'Sure, how can I help you?' },
    ]);

    // Simulate fetching a new message from an API
    useEffect(() => {
        const interval = setInterval(() => { //change this to the actuall API call
            // Simulated API response
            const apiMessage = {
                id: Date.now(),
                type: 'received',
                content: 'This is a message from the server.',
            };
            setMessages((prevMessages) => [...prevMessages, apiMessage]);
        }, 5000); // Fetch a new message every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now(),
                type: 'sent',
                content: message,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage('');
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
