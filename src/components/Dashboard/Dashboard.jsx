
import ChatTable from './ChatTable';
import './Dashboard.css';

const Dashboard = ({ filteredChannels, currentUser, onEnterChat, onDeleteChannel, onInvite, onEdit, onLeave, page, totalPages, onPageChange }) => {
    return (
        <>
        {filteredChannels.length === 0 ? (
            <p className="no-data">[ Aucun chat trouvé ]</p>
        ) : (
            <ChatTable
                filteredChannels={filteredChannels}
                currentUser={currentUser}
                onEnterChat={onEnterChat}
                onDeleteChannel={onDeleteChannel}
                onInvite={onInvite}
                onEdit={onEdit}
                onLeave={onLeave}
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        )}
        </>
    );
};

export default Dashboard;