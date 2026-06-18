// Carte d'un chat
// Les actions dépendent du rôle le propriétaire peut modifier/inviter/supprimer, les autres membres peuvent seulement quitter
import { formatDate } from '../../utils/formatDate';
import { getChannelAccess } from '../../utils/channelAccess';

const ChatItem = ({ channel, currentUser, onEnterChat, onDeleteChannel, onInvite, onEdit, onLeave }) => {
    const isOwner = channel.ownerId === currentUser.id;
    const access = getChannelAccess(channel);

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
                <span className={`channel-status status-${access.status}`}>[ {access.label} ]</span>
            </div>

            <div className="actions">
                <div className="button-group">

                    <button className="button"
                            title={access.open ? 'Rejoindre le chat' : `Salon ${access.label.toLowerCase()}`}
                            disabled={!access.open}
                            onClick={() => onEnterChat(channel)}>
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