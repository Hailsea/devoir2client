// Invitations recues par un user (les "demandes" en attente)
import { useState, useEffect } from 'react';
import { getInvitations, acceptInvitation, refuseInvitation } from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import Pagination from '../Layout/Pagination';
import './Invitations.css';

const PAGE_SIZE = 6;

function Demandes({ currentUser, onInvitationAccepted }) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // à incrémenter pour recharger la page courante

    // Le backend ne renvoie que les invitations en attente : on pagine donc directement le résultat.
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchInvitations = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getInvitations(currentUser.id, page, PAGE_SIZE);
                setInvitations(data.content);
                setTotalPages(data.totalPages);

                // Page devenue hors limite
                if (data.totalPages > 0 && page > data.totalPages - 1) {
                    setPage(data.totalPages - 1);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchInvitations();
    }, [currentUser, page, refreshTrigger]);

    // Clé compose côté back
    const invitationKey = (inv) => `${inv.idUser}-${inv.idUserTarget}-${inv.idChannel}`;

    // Accepte l'invitation, recharge la page et prévient le parent pour rafraîchir les chats.
    const handleAccept = async (inv) => {
        try {
            await acceptInvitation(inv.idUser, inv.idUserTarget, inv.idChannel);
            setRefreshTrigger((t) => t + 1);
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
            setRefreshTrigger((t) => t + 1);
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
                <>
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

                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </>
    );
}

export default Demandes;
