import  { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ channel, currentUser, onLeave }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const [connectedUsers, setConnectedUsers] = useState([
        currentUser,
        { id: 2, firstname: "Alice", lastname: "Bob" },
        { id: 3, firstname: "Alice", lastname: "Bob" },
        { id: 4, firstname: "Alice", lastname: "Bob" }
    ]);

    const chatEndRef = useRef(null);

    const handleNewMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        const messageData = {
            id: Date.now(),
            user: currentUser,
            text: newMessage,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, messageData]);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                user: currentUser,
                message: newMessage,
            }));
        } else {
            console.warn("Le WebSocket n'est pas prêt ou est déconnecté.");
        }
        setNewMessage("");
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //  Utilisation de useRef à la place de useState pour le WebSocket
    const wsRef = useRef(null);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8080/salon');

        websocket.onopen = () => {
            console.log('WebSocket is connected');
        };

        websocket.onmessage = (evt) => {
            const message = evt.data;
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        websocket.onclose = () => {
            console.log('WebSocket is closed');
        };

        // On stocke la connexion dans le ref (pas de render provoqué)
        wsRef.current = websocket;

        return () => {
            websocket.close();
        };
    }, []);

    const sendMessage = () => {
        // On accède au WebSocket via wsRef.current
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                user: currentUser,
                message: newMessage,
            }));

            setNewMessage("");
        } else {
            console.warn("Le WebSocket n'est pas prêt ou est déconnecté.");
        }
    };

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
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
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={1} className="chat-message">
                                    <span>
                                        &lt;{msg.user}&gt;
                                    </span>
                                    <span className="msg-text">{msg.message}</span>
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
                            onChange={handleInputChange}
                            placeholder="Écrivez votre message..."
                            autoFocus
                        />
                        <button type="submit" className="button btn-send" disabled={!newMessage.trim()} onClick={sendMessage}>
                            Envoyer
                        </button>
                    </form>
                </div>

                <div className="chat-sidebar">
                    <div className="sidebar-header">
                        Connectés ({connectedUsers.length})
                    </div>
                    <ul className="users-list">
                        {connectedUsers.map((user) => (
                            <li key={user.id} className={user.id === currentUser.id ? "user-me" : ""}>
                                {user.firstname} {user.lastname && user.lastname.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Chat;