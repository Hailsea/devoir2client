import { formatDate } from '../../utils/formatDate';

const ChatItem = ({ channel, currentUser, onEnterChat, onDeleteChannel, onInvite, onEdit, onLeave }) => {
    const isOwner = channel.ownerId === currentUser.id;

    return (
        <div className="chat-card">
            <div className="card-header">
                <h3>{channel.title}</h3>
                <span className="owner">
                    {isOwner ? '[ Propriétaire ]' : '[ Invité ]'}
                </span>
            </div>

            <p className="description">
                {channel.description || <span className="muted">Aucune description</span>}
            </p>

            <div className="dates">
                <span>Début : {formatDate(channel.startChannel)}</span>
                <span>Fin : {formatDate(channel.endChannel)}</span>
            </div>

            <div className="actions">
                <div className="button-group">
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
                                    onClick={() => onDeleteChannel(channel.id)}>
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
                    <button className="button" title="Rejoindre le chat" onClick={() => onEnterChat(channel)}>[Entrer]</button>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;