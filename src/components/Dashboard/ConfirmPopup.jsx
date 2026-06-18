function ConfirmPopup({
    title,
    error,
    onConfirm,
    onClose,
    isLoading = false,
}) {
    return (
        // Clic sur le fond = fermeture
        // stopPropagation empeche un clic dans la fenetre de la fermer
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>

                <div className="modal-body">
                    {error && <div className="error-box">ERREUR : {error}</div>}

                    <div className="modal-actions modal-actions-column">
                        <button
                            type="button"
                            className="modal-btn modal-btn-send"
                            onClick={onConfirm}
                            disabled={isLoading}>
                            {isLoading ? '[ Suprression ]' : '[ Supprimer ]'}
                        </button>
                        <button
                            type="button"
                            className="modal-btn modal-btn-close"
                            onClick={onClose}
                            disabled={isLoading}>
                            [ Annuler ]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPopup;
