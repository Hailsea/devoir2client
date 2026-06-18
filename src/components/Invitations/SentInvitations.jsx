// Invitations envoyees par un user
import { useState, useEffect } from 'react';
import { getSentInvitations, deleteInvitation } from '../../services/api';
import { invitationStateLabel } from '../../utils/invitationState';
import { formatDate } from '../../utils/formatDate';
import ConfirmPopup from '../Dashboard/ConfirmPopup.jsx';
import Pagination from '../Layout/Pagination';
import './Invitations.css';

const PAGE_SIZE = 6;

function SentInvitations({ currentUser }) {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null); // invitation en attente de confirmation
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // à incrémenter pour recharger la page courante

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchSent = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getSentInvitations(currentUser.id, page, PAGE_SIZE);
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
        void fetchSent();
    }, [currentUser, page, refreshTrigger]);

    // Clé compose niveau back
    const invitationKey = (inv) => `${inv.idUser}-${inv.idUserTarget}-${inv.idChannel}`;

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        setIsDeleting(true);
        try {
            await deleteInvitation(pendingDelete.idUser, pendingDelete.idUserTarget, pendingDelete.idChannel);
            setRefreshTrigger((t) => t + 1); // recharge la page pour des compteurs justes
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
                <>
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

                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
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
