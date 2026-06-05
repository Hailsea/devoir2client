import './Layout.css';

function Sidebar({ user }) {
    if (!user) return null;
    const role = user.admin ? '[ ADMIN ]' : '[ USER ]';

    return (
        <aside>
            <h2>Utilisateur</h2>

            <div className="profile">
                <div className="info">
                    <label>Nom</label>
                    <div className="info-value">{user.firstname} {user.lastname}</div>
                </div>

                <div className="info">
                    <label>Email</label>
                    <div className="info-value email">{user.email}</div>
                </div>

                <div className="info">
                    <label>Rôle</label>
                    <div className="info-value">{role}</div>
                </div>
            </div>
        </aside>
    );
}
export default Sidebar;