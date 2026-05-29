import './Layout.css';
import Navbar from './Navbar';

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