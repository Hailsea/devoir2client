// Carte d'un chat
// Les actions dépendent du rôle le propriétaire peut modifier/inviter/supprimer, les autres membres peuvent seulement quitter
import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import { getChannelAccess } from '../../utils/channelAccess';

const ChatItem = ({ channel, currentUser, onEnterChat, onDeleteChannel, onInvite, onEdit, onLeave }) => {
    const isOwner = channel.ownerId === currentUser.id;
    const [accessError, setAccessError] = useState('');

    const handleEnter = () => {
        const current = getChannelAccess(channel);
        if (current.open) {
            setAccessError('');
            onEnterChat(channel);
        } else if (current.status === 'upcoming') {
            setAccessError("Ce salon n'est pas encore ouvert");
        } else {
            setAccessError('Ce salon est fermé');
        }
    };

    return (
        <div className="chat-card">
            <div className="card-header">
                <h3>{channel.title}</h3>
            </div>

            <p className="description">
                {channel.description || <span className="muted">Aucune description</span>}
            </p>

            <div className="dates">
                <span>Début : {formatDate(channel.startChannel)}</span>
                <span>Fin : {formatDate(channel.endChannel)}</span>
            </div>

            {accessError && <p className="card-error">{accessError}</p>}

            <div className="actions">
                <div className="button-group">

                    <button className="button"
                            title="Rejoindre le chat"
                            onClick={handleEnter}>
                        [Entrer]
                    </button>
                    {isOwner && (
                        <>
                            {onEdit && (
                                <button className="button"
                                        title="Modifier le salon"
                                        onClick={() => onEdit(channel)}>
                                    [Modifier]
                                </button>
                            )}
                            {onInvite && (
                                <button className="button"
                                        title="Inviter un utilisateur"
                                        onClick={() => onInvite(channel)}>
                                    [Inviter]
                                </button>
                            )}
                            <button className="button"
                                    title="Supprimer"
                                    onClick={() => onDeleteChannel(channel)}>
                                [Supprimer]
                            </button>
                        </>
                    )}
                    {!isOwner && onLeave && (
                        <button className="button btn-refuse"
                                title="Quitter le salon"
                                onClick={() => onLeave(channel.id)}>
                            [Quitter]
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;