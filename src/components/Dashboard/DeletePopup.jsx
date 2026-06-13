import { useState } from "react";
import { deleteChannel } from "../../services/api.js";

function DeletePopup({ channel, onClose, setChannels, activeChat, setActiveChat, setRefreshTrigger }) {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setError('');

        if (!channel.id) {
            setError('Aucun channel à supprimer');
            return;
        }
        setIsLoading(true);
        try {
            await deleteChannel(channel.id);
            setChannels(prev => prev.filter(c => c.id !== channel.id));
            if (activeChat?.id === channel.id) {
                setActiveChat(null);
            }
            setRefreshTrigger(prev => prev + 1);
            onClose();
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Voulez vous supprimer {channel.title} ?</h2>
                </div>

                <div className="modal-body">
                    {error && <div className="error-box">ERREUR : {error}</div>}

                    <div className="modal-actions modal-actions-column">
                        <button
                            type="button"
                            className="modal-btn modal-btn-send"
                            onClick={handleDelete}
                            disabled={isLoading}>
                            {isLoading ? '[ Suprression... ]' : '[ Supprimer ]'}
                        </button>
                        <button
                            type="button"
                            className="modal-btn modal-btn-close"
                            onClick={onClose}
                            disabled={isLoading}>
                            [ Fermer ]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletePopup;
