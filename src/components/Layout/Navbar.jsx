function Navbar({ currentPage, setCurrentPage }) {
    return (
        <nav className="app-navbar">
            <button
                className={`btn ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
            >
                [ Accueil ]
            </button>

            <button
                className={`btn ${currentPage === 'planifier' ? 'active' : ''}`}
                onClick={() => setCurrentPage('planifier')}
            >
                [ Planifier ]
            </button>

            <button
                className={`btn ${currentPage === 'mes-chats' ? 'active' : ''}`}
                onClick={() => setCurrentPage('mes-chats')}
            >
                [ Mes Chats ]
            </button>

            <button
                className={`btn ${currentPage === 'invitations' ? 'active' : ''}`}
                onClick={() => setCurrentPage('invitations')}
            >
                [ Invitations ]
            </button>

            <button
                className={`btn ${currentPage === 'demandes' ? 'active' : ''}`}
                onClick={() => setCurrentPage('demandes')}
            >
                [ Demandes ]
            </button>
        </nav>
    );
}

export default Navbar;