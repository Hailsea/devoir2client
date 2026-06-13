import {useEffect, useState} from "react";
import {deleteChannel} from "../../services/api.js";

function DeletePopup({ channel, onClose, setChannels, activeChat, setActiveChat, setRefreshTrigger }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
            setSuccess('Channel supprimé');
        }  catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>[ Supprimer : {channel.title} ]</h2>
                </div>

                < div className="modal-body">
                    {error && <div className="error-box">ERREUR : {error}</div>}
                    {success && <div className="success-box">{success}</div>}

                    <form onSubmit={handleSubmit} className="invite-form">
                        <button type="submit" className="modal-btn modal-btn-send" disabled={isLoading}>
                            {isLoading ? '[ Suprression... ]' : '[ Supprimer ]'}
                        </button>
                        <button
                            type="button"
                            className="modal-btn modal-btn-close"
                            onClick={onClose}
                            disabled={isLoading}>
                            [ Fermer ]
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default DeletePopup;