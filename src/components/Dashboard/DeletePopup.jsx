import { useState } from "react";
import { deleteChannel } from "../../services/api.js";
import ConfirmPopup from "./ConfirmPopup.jsx";

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
        <ConfirmPopup
            title={`Voulez vous supprimer ${channel.title} ?`}
            error={error}
            onConfirm={handleDelete}
            onClose={onClose}
            isLoading={isLoading}
        />
    );
}

export default DeletePopup;
