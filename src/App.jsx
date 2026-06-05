import { useState, useEffect } from 'react';
import Header from './components/Layout/Header.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Login/Login.jsx';
import Footer from './components/Layout/Footer.jsx';
import Formulaire from './components/Formulaire/Formulaire.jsx';
import './App.css';
import Chat from "./components/Chat/Chat.jsx";
import {deleteChannel, getUserChannels} from "./services/api.js";

function App() {

    const [currentPage, setCurrentPage] = useState('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [channels, setChannels] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleLogin = (data) => {
        setUser(data);
        setIsAuthenticated(true);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setUser(null)
        setIsAuthenticated(false);
        setChannels([]);
        setActiveChat(null);
        setCurrentPage('login');
    };

    const handleDeleteChannel = async (idChannel) => {
       try {
           await deleteChannel(idChannel);
           setChannels(prev => prev.filter(c => c.id !== idChannel));
           if (activeChat?.id === idChannel) {
               setActiveChat(null);
           }
        } catch (err) {
            alert(err.message);
        }
    };

    const getChannels = (viewType) => {
        if (!user) return [];

        if (viewType === 'owner') {
            return channels.filter(channel => channel.ownerId === user.id);
        }
        if (viewType === 'guest') {
            return channels.filter(channel => channel.ownerId !== user.id);
        }

        return channels;
    };

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            return;
        }

        const fetchChannels = async () => {
            try {
                const data = await getUserChannels(user.id, 0, 4); //TODO pagination
                setChannels(data);
            } catch (err) {
                console.error(err.message);
            }
        };
        void fetchChannels();
    }, [isAuthenticated, user, refreshTrigger]);

    if (!isAuthenticated || currentPage === 'login') {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="app">
            <Header onLogout={handleLogout}
                    userName={user.firstname}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
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
                                filteredChannels={getChannels('all')}
                                currentUser={user}
                                viewType="all"
                                onEnterChat={setActiveChat}
                                onDeleteChannel={handleDeleteChannel}
                            />
                        )}
                        {currentPage === 'chats' && (
                            <Dashboard
                                filteredChannels={getChannels('owner')}
                                currentUser={user}
                                viewType="owner"
                                onEnterChat={setActiveChat}
                                onDeleteChannel={handleDeleteChannel}
                            />
                        )}
                        {currentPage === 'invitations' && (
                            <Dashboard
                                filteredChannels={getChannels('guest')}
                                currentUser={user}
                                viewType="guest"
                                onEnterChat={setActiveChat}
                            />
                        )}
                        {currentPage === 'demandes' && (
                            <div>
                                TODO
                            </div>
                        )}
                        {currentPage === 'planifier' && (
                            <Formulaire
                                currentUser={user}
                                setCurrentPage={setCurrentPage}
                                onChannelCreated={() => setRefreshTrigger(prev => prev + 1)}
                            />
                        )}
                        </>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default App;