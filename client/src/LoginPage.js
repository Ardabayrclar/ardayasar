import React, { useState } from 'react';
import './LoginPage.css'; // Stil dosyanızı eklemeyi unutmayın

function LoginPage({ authenticateUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = () => {
        // Basitçe kullanıcı adı ve şifre kontrolü yapalım
        if (username === 'employee' && password === 'employeepass') {
            authenticateUser('employee', 'employee');
        } else if (username === 'admin' && password === 'adminpass') {
            authenticateUser('admin', 'admin');
        } else if (username === 'teamlead' && password === 'teamleadpass') {
            authenticateUser('teamlead', 'teamlead');
        }else {
            setErrorMessage('Hatalı kullanıcı adı veya şifre');
        }
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