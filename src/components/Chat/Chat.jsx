import  { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ channel, currentUser, onLeave }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const wsRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const wsurl = `ws://localhost:8080/salon?id=${channel.id}`;
        const websocket = new WebSocket(wsurl);

        websocket.onopen = () => {
            console.log('WebSocket is connected: ' + channel.id);
        };

        websocket.onmessage = (evt) => {
            try {
                const message = JSON.parse(evt.data);
                setMessages((prev) => [...prev, message]);
            } catch (err) {
                console.warn(err);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket is closed');
        };

        // On stocke la connexion dans le ref (pas de render provoqué)
        wsRef.current = websocket;

        return () => {
            websocket.close();
        };
    }, [channel.id]);

    const handleNewMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            user: currentUser,
            message: newMessage,
        };

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(messageData));
            setNewMessage("");
        } else {
            console.warn("Le WebSocket n'est pas prêt ou est déconnecté.");
        }
    };


    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-info">
                    <h2>[ Salon : {channel.title} ]</h2>
                    <span className="chat-desc">{channel.description}</span>
                </div>
                <button className="button btn-leave" onClick={onLeave}>Quitter le chat</button>
            </div>

            <div className="chat-layout">
                <div className="chat-main">
                    <div className="chat-messages-area">
                        {messages.length === 0 ? (
                            <div className="chat-empty-state">
                                aucun message
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="message-item">
                                    <strong>{msg.user} : </strong>
                                    <span>{msg.message}</span>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-form" onSubmit={handleNewMessage}>
                        <span className="input-prefix">&gt;</span>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez votre message..."
                            autoFocus
                        />
                        <button type="submit" className="button btn-send" disabled={!newMessage.trim()}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;