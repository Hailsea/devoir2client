import  { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ channel, currentUser, onLeave }) => {
    const [messages, setMessages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [fileLoading, setFileLoading] = useState(false);
    const wsRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const baseWsUrl = import.meta.env.VITE_WS_URL;
        const wsurl = `${baseWsUrl}/channel?channel_id=${channel.id}&user_id=${currentUser.id}`;
        const websocket = new WebSocket(wsurl);

        websocket.onopen = () => {
            console.log('WebSocket is connected: ' + channel.id);
        };

        websocket.onmessage = (evt) => {
            console.log(evt.data);
            setMessages((prev) => [...prev, JSON.parse(evt.data)]);
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
            setNewFiles([processedFiles]);
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
        if (!newMessage.trim()) return;
        const messageData = {
            channel_id: channel.id,
            user_id: currentUser.id,
            message: newMessage,
            files: newFiles
        };
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
                                    <span>{msg["l_name"]} {msg["f_name"]}</span>
                                    <div className="files-box">{msg.content}</div>

                                    {/* --- Début de la partie msg["files"] intégrée --- */}
                                    {msg["files"] && msg["files"].length > 0 && (
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '10px 0' }}>
                                            {msg["files"].map((file, fileIndex) => {
                                                const isImage = file.type && file.type.startsWith('image/');

                                                return (
                                                    <div
                                                        key={fileIndex}
                                                        style={{
                                                            position: 'relative', width: '80px', height: '80px',
                                                            border: '1px solid #ccc', borderRadius: '8px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            backgroundColor: '#f9f9f9', overflow: 'hidden'
                                                        }}
                                                    >
                                                        {isImage ? (
                                                            <>
                                                                <img
                                                                    src={`data:${file.type};base64,${file.data}`}
                                                                    alt={file.name}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                                <button
                                                                    onClick={() => setNewFiles(prev => prev.filter((_, i) => i !== fileIndex))}
                                                                    style={{
                                                                        position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.6)',
                                                                        color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px',
                                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                                                                    }}
                                                                >
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div
                                                                onClick={() => setNewFiles(prev => prev.filter((_, i) => i !== fileIndex))}
                                                                style={{ cursor: 'pointer', textAlign: 'center', color: '#666', padding: '4px' }}
                                                                title="Cliquer pour supprimer"
                                                            >
                                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                                </svg>
                                                                <div style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '70px' }}>
                                                                    {file.name}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* --- Fin de la partie msg["files"] --- */}

                                    <span>{msg["message"]}</span>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-form" onSubmit={handleNewMessage}>
                        <input type="file" name="files" id="files" onChange={handleFileChange} multiple/>
                        <button type="button" name="files_clear" onChange={()=>setNewFiles([])}/>
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