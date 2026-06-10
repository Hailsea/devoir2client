import ChatItem from './ChatItem';

const ChatTable = ({ filteredChannels, currentUser, onEnterChat, onDeleteChannel, onInvite, onEdit, onLeave, page = 0, totalPages = 1, onPageChange }) => {
    const pageCount = Math.max(totalPages, 1);
    const isFirst = page <= 0;
    const isLast = page >= pageCount - 1;

    return (
        <>
        <div className="cards-grid">
            {filteredChannels.map((channel) => (
                <ChatItem
                    key={channel.id}
                    channel={channel}
                    currentUser={currentUser}
                    onEnterChat={onEnterChat}
                    onDeleteChannel={onDeleteChannel}
                    onInvite={onInvite}
                    onEdit={onEdit}
                    onLeave={onLeave}
                />
            ))}
        </div>

        <div className="pagination-bar">
            <button
                className="btn-pagination"
                disabled={isFirst}
                onClick={() => onPageChange(page - 1)}>
                [ Précédent ]
            </button>
            <span className="page-info">Page {page + 1} sur {pageCount}</span>
            <button
                className="btn-pagination"
                disabled={isLast}
                onClick={() => onPageChange(page + 1)}>
                [ Suivant ]
            </button>
        </div>
        </>
);
};

export default ChatTable;