// Invitations recues par un user
import { useState, useEffect } from 'react';
import { getInvitations, acceptInvitation, refuseInvitation } from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import './Invitations.css';

function Demandes({ currentUser, onInvitationAccepted }) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchInvitations = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getInvitations(currentUser.id, 0, 10); //TODO pagination
                // On ne garde que les invitations en attente
                setInvitations(data.content.filter((inv) => inv.stateInitation == null));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchInvitations();
    }, [currentUser]);

    // Clé compose côté back
    const invitationKey = (inv) => `${inv.idUser}-${inv.idUserTarget}-${inv.idChannel}`;

    const removeFromList = (inv) => {
        setInvitations((prev) =>
            prev.filter((i) => invitationKey(i) !== invitationKey(inv))
        );
    };

    // Accepte l'invitation puis prévient le parent pour rafraîchir les chats
    const handleAccept = async (inv) => {
        try {
            await acceptInvitation(inv.idUser, inv.idUserTarget, inv.idChannel);
            removeFromList(inv);
            if (onInvitationAccepted) {
                onInvitationAccepted();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRefuse = async (inv) => {
        try {
            await refuseInvitation(inv.idUser, inv.idUserTarget, inv.idChannel);
            removeFromList(inv);
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <p className="no-data">[ Chargement des demandes... ]</p>;
    }

    return (
        <>
            {error && <div className="error-box">ERREUR : {error}</div>}

            {invitations.length === 0 ? (
                <p className="no-data">[ Aucune demande en attente ]</p>
            ) : (
                <div className="cards-grid">
                    {invitations.map((inv) => (
                        <div key={invitationKey(inv)} className="chat-card">
                            <div className="card-header">
                                <h3>{inv.channelTitle || `Salon #${inv.idChannel}`}</h3>
                                <span className="owner">[ En attente ]</span>
                            </div>

                            <p className="description">
                                Invitation de{' '}
                                <strong>
                                    {inv.ownerFirstname} {inv.ownerLastname}
                                </strong>
                            </p>

                            <div className="dates">
                                <span>Reçue le : {formatDate(inv.dateInvitation)}</span>
                            </div>

                            <div className="actions">
                                <div className="button-group">
                                    <button
                                        className="button btn-accept"
                                        title="Accepter l'invitation"
                                        onClick={() => handleAccept(inv)}>
                                        [Accepter]
                                    </button>
                                    <button
                                        className="button btn-refuse"
                                        title="Refuser l'invitation"
                                        onClick={() => handleRefuse(inv)}>
                                        [Refuser]
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

export default Demandes;
