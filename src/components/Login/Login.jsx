import { useState } from "react";
import './Login.css'

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
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            console.log(data);
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