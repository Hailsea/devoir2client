
import ChatTable from './ChatTable';
import './Dashboard.css';

const Dashboard = ({ filteredChannels, currentUser, formatDate, onEnterChat, onDeleteChannel }) => {
    return (
        <>
        {filteredChannels.length === 0 ? (
            <p className="no-data">[ Aucun salon trouvé ]</p>
        ) : (
            <ChatTable
                filteredChannels={filteredChannels}
                currentUser={currentUser}
                formatDate={formatDate}
                onEnterChat={onEnterChat}
                onDeleteChannel={onDeleteChannel}
            />
        )}
        </>
    );
};

export default Dashboard;