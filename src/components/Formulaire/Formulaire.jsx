// Formulaire/Formulaire.jsx
import { useState } from "react";
import "./Formulaire.css"; // Importer le CSS associé

function Formulaire({ currentUser, setCurrentPage, onChannelCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startChannel, setStartChannel] = useState('');
    const [endChannel, setEndChannel] = useState('');

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
                title: title,
                description: description,
                startChannel: startChannel,
                endChannel: endChannel,
                owner: {
                    id: currentUser.id
                }
            };

            const response = await fetch('http://localhost:8080/api/channel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(channel),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Impossible de créer la discussion.");
            }

            setSuccess(true);

            if (onChannelCreated) {
                onChannelCreated();
            }
        } catch (err) {
            setError(err.message || "Une erreur est survenue lors de la connexion à l'API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <div className="form-window">
                <div className="form-header">
                    <h2>[ Planifier_discussion_SR03 ]</h2>
                </div>

                <div className="form-body">
                    {error && (
                        <div className="error-box">
                            ! ERREUR : {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-box">
                            * Salon créé avec succès ! Redirection...
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
                                {isLoading ? '[ Enregistrement... ]' : '[ Créer le salon ]'}
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