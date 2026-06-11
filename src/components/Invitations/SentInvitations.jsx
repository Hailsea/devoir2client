import { useState, useEffect } from 'react';
import { getSentInvitations, deleteInvitation } from '../../services/api';
import { invitationStateLabel } from '../../utils/invitationState';
import { formatDate } from '../../utils/formatDate';
import './Invitations.css';

function SentInvitations({ currentUser }) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

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

    const invitationKey = (inv) => `${inv.idUser}-${inv.idUserTarget}-${inv.idChannel}`;

    const handleDelete = async (inv) => {
        const accepted = inv.stateInitation === true;
        const message = accepted
            ? "Cette invitation est acceptée : la supprimer retirera l'utilisateur du salon. Continuer ?"
            : "Supprimer cette invitation ?";
        if (!window.confirm(message)) return;

        try {
            await deleteInvitation(inv.idUser, inv.idUserTarget, inv.idChannel);
            setInvitations((prev) =>
                prev.filter((i) => invitationKey(i) !== invitationKey(inv))
            );
        } catch (err) {
            setError(err.message);
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
                                        onClick={() => handleDelete(inv)}>
                                        [Supprimer]
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default SentInvitations;
