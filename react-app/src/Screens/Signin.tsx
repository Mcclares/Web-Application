import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import './Signin.css'

import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Logo from '../Content/Components/Background-images/Logo.png';
import Alert from 'react-bootstrap/Alert';
import { getCookie } from "../Utils/cookie";
import config from '../config'


export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    

        useEffect(() => {
        // Проверяем, есть ли действительный токен при загрузке страницы
        const checkTokenValidity = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/Protected`, {
                    headers: {
                        Authorization: `Bearer ${getCookie('jwt')}`, // Получаем токен из куки
                    }
                });
                // Если запрос успешен, токен действителен, перенаправляем пользователя на другую страницу
                navigate('/Home');
            } catch (error) {
                // Если запрос неуспешен или токен недействителен, пользователь остается на странице входа
            }
        };
        checkTokenValidity();
    }, []);  


const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault(); // Предотвращаем стандартное действие по умолчанию (отправку формы)
    try {
        const response = await axios.post(`${config.apiBaseUrl}/authenticate/login`, {
            Email: email,
            Password: password
        });
        console.log(response);
    
        const accessToken = response.data.AccessToken;
        if (accessToken) {
            document.cookie = `jwt=${accessToken};path=/;secure`;
            setMessage('Login successful');
            setError(null); // Clear error message on successful login
            navigate('/Home');
        } else {
            setError('Login failed: Invalid email or password.');
            setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
        }
    } catch (error: any) {
        setError('Login failed: Invalid email or password.');
        setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
        console.log(error);
    }
};

      return (
        <div style={rootDiv}>
            <Image src={Logo} thumbnail style={{ margin: '2rem' }} />
            <Form style={form} onSubmit={handleSignIn}>
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>} {/* Display Alert on error */}
                <InputGroup className="mb-3" style={{ width: "400px" }}>
                    <Form.Control
                        placeholder="Email"
                        type="text"
                        autoComplete="username" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </InputGroup>
                <InputGroup className="mb-3" style={{ width: "400px" }}>
                    <InputGroup.Text>*</InputGroup.Text>
                    <Form.Control
                        placeholder="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputGroup>

                <button className='signin-button'  type="submit">Sign In</button>
            </Form>
        </div>
    );

}

const rootDiv: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
};

const form: React.CSSProperties = {
    margin: '0px',
    padding: '0px',
    border: "0px",
    backgroundColor: '#f9f9f900'
};




