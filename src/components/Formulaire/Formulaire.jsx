import { useState } from "react";
import "./Formulaire.css";
import { createChannel, updateChannel } from "../../services/api";

const toInputDateTime = (value) => (value ? value.slice(0, 16) : '');

function Formulaire({ currentUser, setCurrentPage, onChannelCreated, channelToEdit }) {
    const isEdit = Boolean(channelToEdit);

    const [title, setTitle] = useState(channelToEdit?.title || '');
    const [description, setDescription] = useState(channelToEdit?.description || '');
    const [startChannel, setStartChannel] = useState(toInputDateTime(channelToEdit?.startChannel));
    const [endChannel, setEndChannel] = useState(toInputDateTime(channelToEdit?.endChannel));

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const start = new Date(startChannel);
        const end = new Date(endChannel);

        if (start >= end) {
            setError("La date de fin doit être strictement après la date de début.");
            return;
        }

        setIsLoading(true);

        try {
            const channel = {
                title,
                description,
                startChannel,
                endChannel,
                ownerId: currentUser.id,
            };

            if (isEdit) {
                await updateChannel(channelToEdit.id, channel);
            } else {
                await createChannel(channel);
            }
            setSuccess(true);

            if (onChannelCreated) {
                onChannelCreated();
            }

            setTimeout(() => {
                setCurrentPage('home');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <div className="form-window">
                <div className="form-header">
                    <h2>{isEdit ? '[ Modifier_le_salon ]' : '[ Planifier_discussion_SR03 ]'}</h2>
                </div>

                <div className="form-body">
                    {error && (
                        <div className="error-box">ERREUR : {error}</div>
                    )}

                    {success && (
                        <div className="success-box">
                            {isEdit ? 'Salon modifié ! Redirection...' : 'Redirection...'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="plan-form">
                        <div className="form-group">
                            <label htmlFor="title">&gt; Titre de la discussion</label>
                            <input
                                type="text"
                                id="title"
                                placeholder="ex: Révision examen final"
                                maxLength={50}
                                value={title}
                                required
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">&gt; Description / Objectif</label>
                            <textarea
                                id="description"
                                placeholder="Précisez le sujet du salon..."
                                value={description}
                                rows={4}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="date-group-row">
                            <div className="form-group">
                                <label htmlFor="startChannel">&gt; Date & Heure de début</label>
                                <input
                                    type="datetime-local"
                                    id="startChannel"
                                    value={startChannel}
                                    required
                                    onChange={(e) => setStartChannel(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endChannel">&gt; Date & Heure de fin</label>
                                <input
                                    type="datetime-local"
                                    id="endChannel"
                                    value={endChannel}
                                    required
                                    onChange={(e) => setEndChannel(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={isLoading}>
                                {isLoading
                                    ? '[ Enregistrement... ]'
                                    : (isEdit ? '[ Enregistrer ]' : '[ Créer le salon ]')}
                            </button>
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setCurrentPage('home')}
                                disabled={isLoading}
                            >
                                [ Annuler ]
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Formulaire;
