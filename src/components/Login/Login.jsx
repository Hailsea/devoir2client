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
        <div className="login-wrapper">
            <div className="login-window">
                <div className="login-header">
                    <h2>[ Connexion_SR03 ]</h2>
                </div>

                <div className="login-body">
                    {error && (
                        <div className="login-error">ERREUR : {error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
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

                        <div className="form-group">
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

                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? '[ Connexion... ]' : '[ Se connecter ]'}
                        </button>

                        <div className="login-footer">
                            <a href="http://localhost:8080/resetPassword" className="forgot-link">Mot de passe oublié</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
