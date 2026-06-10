import { useState, useEffect } from 'react';
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Login/Login.jsx';
import Footer from './components/Layout/Footer.jsx';
import Formulaire from './components/Formulaire/Formulaire.jsx';
import Demandes from './components/Invitations/Demandes.jsx';
import SentInvitations from './components/Invitations/SentInvitations.jsx';
import InviteModal from './components/Invitations/InviteModal.jsx';
import './App.css';
import Chat from "./components/Chat/Chat.jsx";
import { deleteChannel, getUserChannels, leaveChannel } from "./services/api.js";

const PAGE_STATE = {
    home: 'all',
    chats: 'owner',
    invitations: 'usertarget',
};

const PAGE_SIZE = 4;

function App() {

    const [currentPage, setCurrentPage] = useState('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [channels, setChannels] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [inviteChannel, setInviteChannel] = useState(null);
    const [editingChannel, setEditingChannel] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleNavigate = (target) => {
        setPage(0);
        setEditingChannel(null);
        setCurrentPage(target);
    };

    const handleEditChannel = (channel) => {
        setEditingChannel(channel);
        setCurrentPage('planifier');
    };

    const handleLogin = (data) => {
        setUser(data);
        setIsAuthenticated(true);
        setPage(0);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setUser(null)
        setIsAuthenticated(false);
        setChannels([]);
        setActiveChat(null);
        setPage(0);
        setCurrentPage('login');
    };

    const handleDeleteChannel = async (idChannel) => {
       try {
           await deleteChannel(idChannel);
           setChannels(prev => prev.filter(c => c.id !== idChannel));
           if (activeChat?.id === idChannel) {
               setActiveChat(null);
           }
           setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLeaveChannel = async (idChannel) => {
        try {
            await leaveChannel(idChannel, user.id);
            setChannels(prev => prev.filter(c => c.id !== idChannel));
            if (activeChat?.id === idChannel) {
                setActiveChat(null);
            }
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            return;
        }

        const state = PAGE_STATE[currentPage];
        if (!state) {
            return;
        }

        const fetchChannels = async () => {
            try {
                const data = await getUserChannels(user.id, page, PAGE_SIZE, state);
                setChannels(data.content);
                setTotalPages(data.totalPages);

                if (data.totalPages > 0 && page > data.totalPages - 1) {
                    setPage(data.totalPages - 1);
                }
            } catch (err) {
                console.error(err.message);
                setChannels([]);
                setTotalPages(0);
            }
        };
        void fetchChannels();
    }, [isAuthenticated, user, currentPage, page, refreshTrigger]);

    if (!isAuthenticated || currentPage === 'login') {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="app">
            <Header onLogout={handleLogout}
                    userName={user.firstname}
                    currentPage={currentPage}
                    setCurrentPage={handleNavigate} />
            <div className="main">
                <Sidebar user={user} />
                <main>
                    {activeChat ? (
                        <Chat
                            channel={activeChat}
                            currentUser={user}
                            onLeave={() => setActiveChat(null)}
                        /> ) : (
                        <>
                        {currentPage === 'home' && (
                            <Dashboard
                                filteredChannels={channels}
                                currentUser={user}
                                viewType="all"
                                onEnterChat={setActiveChat}
                                onDeleteChannel={handleDeleteChannel}
                                onInvite={setInviteChannel}
                                onEdit={handleEditChannel}
                                onLeave={handleLeaveChannel}
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}
                        {currentPage === 'chats' && (
                            <Dashboard
                                filteredChannels={channels}
                                currentUser={user}
                                viewType="owner"
                                onEnterChat={setActiveChat}
                                onDeleteChannel={handleDeleteChannel}
                                onInvite={setInviteChannel}
                                onEdit={handleEditChannel}
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}
                        {currentPage === 'invitations' && (
                            <Dashboard
                                filteredChannels={channels}
                                currentUser={user}
                                viewType="guest"
                                onEnterChat={setActiveChat}
                                onLeave={handleLeaveChannel}
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}
                        {currentPage === 'demandes' && (
                            <Demandes
                                currentUser={user}
                                onInvitationAccepted={() => setRefreshTrigger(prev => prev + 1)}
                            />
                        )}
                        {currentPage === 'envoyees' && (
                            <SentInvitations currentUser={user} />
                        )}
                        {currentPage === 'planifier' && (
                            <Formulaire
                                key={editingChannel ? editingChannel.id : 'new'}
                                currentUser={user}
                                setCurrentPage={handleNavigate}
                                channelToEdit={editingChannel}
                                onChannelCreated={() => setRefreshTrigger(prev => prev + 1)}
                            />
                        )}
                        </>
                    )}
                </main>
            </div>
            <Footer />

            {inviteChannel && (
                <InviteModal
                    channel={inviteChannel}
                    currentUser={user}
                    onClose={() => setInviteChannel(null)}
                />
            )}
        </div>
    );
}

export default App;
