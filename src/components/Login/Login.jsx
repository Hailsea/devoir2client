import { useState } from "react";
import './Login.css'
import { login } from "../../services/api";

function Login({onLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(email, password);
            onLogin(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        {error && (
            <div>
                ERREUR : {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
            <div>
                <label>&gt; Email</label>
                <input
                    type="email"
                    placeholder="jean@jean.com"
                    name="email"
                    id="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label>&gt; Mot de passe</label>
                <input
                    type="password"
                    placeholder="********"
                    name="password"
                    id="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit" disabled={isLoading}>{isLoading ? '[ Connexion... ]' : '[ Se connecter ]'}</button>
            <div>
                <a href="/resetPassword">Mot de passe oublié</a>
            </div>
        </form>
        </>
    );
}

export default Login;