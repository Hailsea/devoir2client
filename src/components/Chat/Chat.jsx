import  { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ channel, currentUser, onLeave }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [closedReason, setClosedReason] = useState(null); // motif renvoyé par le serveur (salon fermé...)
    const wsRef = useRef(null);
    const chatEndRef = useRef(null); // ancre en bas de liste pour l'auto-scroll

    // Ouvre la connexion WebSocket
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

        websocket.onclose = (evt) => {
            console.log('WebSocket is closed');
            // Le serveur ferme avec un code applicatif (>= 4000) et un motif
            // quand l'accès est refusé (salon pas encore ouvert / fermé).
            if (evt.code >= 4000 && evt.reason) {
                setClosedReason(evt.reason);
            }
        };

        // On stocke la connexion dans le ref (pas de render provoqué)
        wsRef.current = websocket;

        // Ferme la connexion
        return () => {
            websocket.close();
        };
    }, [channel.id]);

    // Auto-scroll vers le bas a chaque nouveau message
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

        // on n'envoie que si la connexion est ouverte
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
                    {closedReason && (
                        <div className="chat-closed-banner">{closedReason}</div>
                    )}
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
                            placeholder={closedReason ? "Salon indisponible" : "Écrivez votre message..."}
                            disabled={Boolean(closedReason)}
                            autoFocus
                        />
                        <button type="submit" className="btn-send" disabled={!newMessage.trim() || Boolean(closedReason)}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;