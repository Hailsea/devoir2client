import { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Sidebar/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Footer from '../Layout/Footer';
import Formulaire from '../Formulaire/Formulaire';
import './App.css';
import Chat from "../Chat/Chat";

function App() {

    const [currentPage, setCurrentPage] = useState('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState();
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
        setCurrentPage('login');
    };

    const handleEnterChat = (channel) => {
        setActiveChat(channel);
    };

    const handleLeaveChat = () => {
        setActiveChat(null);
    };

    const handleChannelCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDeleteChannel = async (idChannel) => {
       try {
            const response = await fetch(`http://localhost:8080/api/channel?id=${idChannel}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("");
            }

            console.log("Salon supprimé avec succès !");

            setRefreshTrigger(prev => prev + 1);

        } catch (err) {
            alert(err.message || "Une erreur est survenue lors de la suppression.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).replace(',', '');
    };

    const getChannels = (viewType) => {
        if (viewType === 'owner') {
            return channels.filter(channel => channel.owner.id === user.id);
        }
        if (viewType === 'guest') {
            return channels.filter(channel => channel.owner.id !== user.id);
        }
        return channels;
    };

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            const fetchChannels = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/user/channel?idUser=${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.error || 'Impossible de charger vos salons');
                    }
                    console.log(data);
                    setChannels(data);
                } catch (err) {
                    console.error("Erreur lors de la récupération des salons :", err.message);
                }
            };
            fetchChannels();
        } else {
            setChannels([]);
        }
    }, [isAuthenticated, user, refreshTrigger]);

    if (!isAuthenticated || currentPage === 'login') {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="app-container">
            <Header onLogout={handleLogout} userName={user.firstname} currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
            <div className="main-layout">
                <Sidebar user={user} />
                <main>
                    {activeChat ? (
                        <Chat
                            channel={activeChat}
                            currentUser={user}
                            onLeave={handleLeaveChat}
                        /> ) : (
                        <>
                        {currentPage === 'home' && (
                            <Dashboard
                                filteredChannels={getChannels('all')}
                                currentUser={user}
                                viewType="all"
                                formatDate={formatDate}
                                onEnterChat={handleEnterChat}
                                onDeleteChannel={handleDeleteChannel}
                            />
                        )}
                        {currentPage === 'mes-chats' && (
                            <Dashboard
                                filteredChannels={getChannels('owner')}
                                currentUser={user}
                                viewType="owner"
                                formatDate={formatDate}
                                onEnterChat={handleEnterChat}
                                onDeleteChannel={handleDeleteChannel}
                            />
                        )}
                        {currentPage === 'invitations' && (
                            <Dashboard
                                filteredChannels={getChannels('guest')}
                                currentUser={user}
                                viewType="guest"
                                formatDate={formatDate}
                                onEnterChat={handleEnterChat}
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
                                onChannelCreated={handleChannelCreated}
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