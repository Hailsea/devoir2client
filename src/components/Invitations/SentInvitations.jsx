// Invitations envoyees par un user
import { useState, useEffect } from 'react';
import { getSentInvitations, deleteInvitation } from '../../services/api';
import { invitationStateLabel } from '../../utils/invitationState';
import { formatDate } from '../../utils/formatDate';
import ConfirmPopup from '../Dashboard/ConfirmPopup.jsx';
import './Invitations.css';

function SentInvitations({ currentUser }) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null); // invitation en attente de confirmation
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchSent = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getSentInvitations(currentUser.id, 0, 20); //TODO pagination
                setInvitations(data.content);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchSent();
    }, [currentUser]);

    // Clé compose niveau back
    const invitationKey = (inv) => `${inv.idUser}-${inv.idUserTarget}-${inv.idChannel}`;

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        setIsDeleting(true);
        try {
            await deleteInvitation(pendingDelete.idUser, pendingDelete.idUserTarget, pendingDelete.idChannel);
            setInvitations((prev) =>
                prev.filter((i) => invitationKey(i) !== invitationKey(pendingDelete))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
            setPendingDelete(null);
        }
    };

    if (isLoading) {
        return <p className="no-data">[ Chargement des invitations envoyées... ]</p>;
    }

    return (
        <>
            {error && <div className="error-box">ERREUR : {error}</div>}

            {invitations.length === 0 ? (
                <p className="no-data">[ Aucune invitation envoyée ]</p>
            ) : (
                <div className="cards-grid">
                    {invitations.map((inv) => (
                        <div key={invitationKey(inv)} className="chat-card">
                            <div className="card-header">
                                <h3>{inv.channelTitle || `Salon #${inv.idChannel}`}</h3>
                                <span className="owner">[ {invitationStateLabel(inv.stateInitation)} ]</span>
                            </div>

                            <p className="description">
                                Invité :{' '}
                                <strong>
                                    {inv.userTargetFirstname} {inv.userTargetLastname}
                                </strong>
                            </p>

                            <div className="dates">
                                <span>Envoyée le : {formatDate(inv.dateInvitation)}</span>
                            </div>

                            <div className="actions">
                                <div className="button-group">
                                    <button
                                        className="button btn-refuse"
                                        title="Supprimer l'invitation"
                                        onClick={() => setPendingDelete(inv)}>
                                        [Supprimer]
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pendingDelete && (
                <ConfirmPopup
                    title="Supprimer l'invitation ?"
                    onConfirm={handleConfirmDelete}
                    onClose={() => setPendingDelete(null)}
                    isLoading={isDeleting}
                />
            )}
        </>
    );
}

export default SentInvitations;
