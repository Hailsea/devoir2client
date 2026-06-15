import  { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ channel, currentUser, onLeave }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const wsRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const baseWsUrl = import.meta.env.VITE_WS_URL;
        const wsurl = `${baseWsUrl}/channel?id=${channel.id}`;
        const websocket = new WebSocket(wsurl);

        websocket.onopen = () => {
            console.log('WebSocket is connected: ' + channel.id);
        };

        websocket.onmessage = (evt) => {
            setMessages((prev) => [...prev, evt.data]);
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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            channel_id: channel.id,
            user: `${currentUser.firstname} ${currentUser.lastname}`,
            message: newMessage,
        };

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(messageData));
            setNewMessage("");
            console.log("MESSAGE")
            console.log(messageData);
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
                <button className="btn-leave" onClick={onLeave}>Quitter le chat</button>
            </div>

            <div className="chat-layout">
                <div className="chat-main">
                    <div className="chat-messages-area">
                        {messages.length === 0 ? (
                            <div className="chat-empty-state">
                                Aucun message
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="message-item">
                                    <span>{msg}</span>
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
                        <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;