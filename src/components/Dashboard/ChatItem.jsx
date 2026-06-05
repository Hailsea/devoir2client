import { formatDate } from '../../utils/formatDate';

const ChatItem = ({ channel, currentUser, onEnterChat, onDeleteChannel }) => {
    const isOwner = channel.ownerId === currentUser.id;

    return (
        <div className="chat-card">
            <div className="card-header">
                <h3>{channel.title}</h3>
                <span className="owner">
                    // TODO
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
                            <button className="button" title="Modifier le salon">[Modifier]</button>
                            <button className="button"
                                    title="Supprimer"
                                    onClick={() => onDeleteChannel(channel.id)}>
                                [Supprimer]
                            </button>
                        </>
                    )}
                    <button className="button" title="Rejoindre le chat" onClick={() => onEnterChat(channel)}>[Entrer]</button>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;