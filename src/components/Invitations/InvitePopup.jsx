import { useState, useEffect } from 'react';
import { getUsers, createInvitation } from '../../services/api';
import './Invitations.css';

function InvitePopup({ channel, currentUser, onClose }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(currentUser.id);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };
        void fetchUsers();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedUserId) {
            setError('Veuillez choisir un utilisateur à inviter');
            return;
        }

        setIsLoading(true);
        try {
            await createInvitation({
                idUser: currentUser.id,
                idUserTarget: Number(selectedUserId),
                idChannel: channel.id,
            });
            setSuccess('Invitation envoyée');
            setSelectedUserId('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>[ Inviter sur : {channel.title} ]</h2>
                </div>

                <div className="modal-body">
                    {error && <div className="error-box">ERREUR : {error}</div>}
                    {success && <div className="success-box">{success}</div>}

                    <form onSubmit={handleSubmit} className="invite-form">
                        <label htmlFor="userTarget">&gt; Utilisateur à inviter</label>
                        <select
                            id="userTarget"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            required>
                            <option value="">-- Choisir un utilisateur --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>

                        <div className="modal-actions">
                            <button type="submit" className="modal-btn modal-btn-send" disabled={isLoading}>
                                {isLoading ? '[ Envoi... ]' : '[ Envoyer ]'}
                            </button>
                            <button
                                type="button"
                                className="modal-btn modal-btn-close"
                                onClick={onClose}
                                disabled={isLoading}>
                                [ Fermer ]
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default InvitePopup;
