function Navbar({ currentPage, setCurrentPage }) {
    // Toutes les pages on un id qui correspond a celui sur App
    const navButton = [
        { id: 'home', label: 'Accueil' },
        { id: 'planifier', label: 'Planifier' },
        { id: 'chats', label: 'Mes Chats' },
        { id: 'invitations', label: 'Invitations' },
        { id: 'demandes', label: 'Demandes' },
        { id: 'envoyees', label: 'Mes envois' }
    ];

    return (
        <nav>
            {navButton.map((item) => (
                <button
                    key={item.id}
                    className={`btn ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => setCurrentPage(item.id)}
                >
                    [ {item.label} ]
                </button>
            ))}
        </nav>
    );
}

export default Navbar;