import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import axios from 'axios';
import {getCookie} from '../Utils/cookie';
import {getCurrentRole} from '../Utils/auth';
import config from "../config"; 

interface PrivateRouteProps {
    children: React.ReactNode;
    roles: string[]; // Разрешенные роли для доступа к странице
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children, roles}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = getCookie('jwt');

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                if (!token) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${config.apiBaseUrl}/authenticate/check-auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setCurrentRole(getCurrentRole(token)); // Извлекаем текущую роль пользователя
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to authenticate');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkTokenValidity();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const hasRequiredRole = roles.includes(currentRole || '');

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    if (!hasRequiredRole) {
        return <Navigate to="/access-denied"/>;
    }

    return <>{children}</>;
};

export default PrivateRoute;