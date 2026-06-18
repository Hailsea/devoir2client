import Navbar from "./Navbar.jsx";

function Header({ userName, onLogout, currentPage, setCurrentPage }) {
    return (
        <header>
            <div>
                <h1>Bienvenue {userName}</h1>
                <button onClick={onLogout} className="btn btn-red">[ Déconnexion ]</button>
            </div>
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </header>
    );
}
export default Header;