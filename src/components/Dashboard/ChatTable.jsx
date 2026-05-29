import ChatItem from './ChatItem';

const ChatTable = ({ filteredChannels, currentUser, formatDate, onEnterChat, onDeleteChannel }) => {
    return (
        <>
        <div className="cards-grid">
            {filteredChannels.map((channel) => (
                <ChatItem
                    key={channel.id}
                    channel={channel}
                    currentUser={currentUser}
                    formatDate={formatDate}
                    onEnterChat={onEnterChat}
                    onDeleteChannel={onDeleteChannel}
                />
            ))}
        </div>

        <div className="pagination-bar">
            <button className="btn-pagination" disabled>[ ◀ Précédent ]</button>
            <span className="page-info">Page 1 sur 1</span>
            <button className="btn-pagination" disabled>[ Suivant ▶ ]</button>
        </div>
        </>
);
};

export default ChatTable;