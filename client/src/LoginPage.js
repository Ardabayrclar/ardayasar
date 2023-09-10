import React, { useState } from 'react';
import './LoginPage.css'; // Stil dosyanızı eklemeyi unutmayın
import Axios from 'axios'; // Import Axios

function LoginPage({ authenticateUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = () => {
      authenticateUser(username,password);

    };

    return (
        <div className="login-page">
            <h2>Giriş Yap</h2>
            <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Giriş</button>
            <p className="error-message">{errorMessage}</p>
        </div>
    );
}

export default LoginPage;
