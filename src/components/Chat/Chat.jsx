import  { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ channel, currentUser, onLeave }) => {
    const [messages, setMessages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [fileLoading, setFileLoading] = useState(false);
    const wsRef = useRef(null);
    const chatEndRef = useRef(null); // ancre en bas de liste pour l'auto-scroll

    // Ouvre la connexion WebSocket
    useEffect(() => {
        const baseWsUrl = import.meta.env.VITE_WS_URL;
        const wsurl = `${baseWsUrl}/channel?channel_id=${channel.id}&user_id=${currentUser.id}`;
        const websocket = new WebSocket(wsurl);

        websocket.onopen = () => {
            console.log('WebSocket is connected: ' + channel.id);
        };

        websocket.onmessage = (evt) => {
            console.log("evt.data");
            console.log(evt.data);
            console.log("/evt.data");
            setMessages((prev) => [...prev, JSON.parse(evt.data)]);
        };

        websocket.onclose = (event) => {
            console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
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

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0){
            setNewFiles([]);
            return;
        }
        setFileLoading(true);
        try {
            const filePromises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64Data = event.target.result.split(',')[1];
                        resolve({
                            name: file.name,
                            type: file.type,
                            data: base64Data
                        });
                    };
                    reader.onerror = (error) => reject(error)
                    reader.readAsDataURL(file);
                });
            });
            const processedFiles = await Promise.all(filePromises);
            // Append new files to any files already staged for this message
            setNewFiles(processedFiles);
        } catch (error) {
            console.error("Error reading files:", error);
        } finally {
            setFileLoading(false);
            console.log("1");
            console.log(newFiles);
        }
    };

    const handleNewMessage = (e) => {
        e.preventDefault();
        console.log("newFiles");
        console.log(newFiles);
        if (!newMessage.trim()) return;
        const messageData = {
            channel_id: channel.id,
            user_id: currentUser.id,
            message: newMessage,
            files: newFiles
        };

        // on n'envoie que si la connexion est ouverte
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(messageData));
            console.log("MESSAGE")
            console.log(messageData);
            console.log("MESSAGE1")
            console.log(JSON.stringify(messageData));
            console.log("MESSAGE")
            setNewMessage("");
            setNewFiles([]);
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
                                    {/* affichage auteur */}
                                    <span className="message-author">{msg["l_name"]} {msg["f_name"]}</span>
                                    <div className="files-box">{msg.content}</div>

                                    {/* parcours des fichiers */}
                                    {msg["files"] && msg["files"].length > 0 && (
                                        <div className="message-attachments">
                                            {msg["files"].map((file, fileIndex) => {
                                                const isImage = file.type && file.type.startsWith('image/');

                                                return (
                                                    <div key={fileIndex} className="attachment-thumb">
                                                        {isImage ? (
                                                            <>
                                                                <img
                                                                    src={`data:${file.type};base64,${file.data}`}
                                                                    alt={file.name}
                                                                    className="attachment-image"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="attachment-remove"
                                                                    title="Retirer"
                                                                    onClick={() => setNewFiles(prev => prev.filter((_, i) => i !== fileIndex))}
                                                                >×</button>
                                                            </>
                                                        ) : (
                                                            <div
                                                                className="attachment-file"
                                                                onClick={() => setNewFiles(prev => prev.filter((_, i) => i !== fileIndex))}
                                                                title="Cliquer pour supprimer"
                                                            >
                                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                                </svg>
                                                                <div className="attachment-name">{file.name}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <span className="message-text">{msg["message"]}</span>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-form" onSubmit={handleNewMessage}>
                        <input type="file" name="files" id="files" onChange={handleFileChange} multiple/>
                        <span className="input-prefix">&gt;</span>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez votre message..."
                            autoFocus
                        />
                        <button type="submit" className="btn-send" disabled={!newMessage.trim() || fileLoading}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;