import React, { useState } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    
    const handleSendMessage = () => {
        if (message.trim()) {
            // Send message logic here (e.g., update state, send to server)
            console.log('Message sent:', message);
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
                        <div className="message sent">
                            <img src="https://via.placeholder.com/50" alt="avatar" />
                            <div className="message-content">Hey, I need your help</div>
                        </div>
                        <div className="message received">
                            <img src="https://via.placeholder.com/50" alt="avatar" />
                            <div className="message-content">Sure, how can i help you?</div>
                        </div>
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
