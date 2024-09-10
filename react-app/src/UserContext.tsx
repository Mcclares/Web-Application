// UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentRole } from './Utils/auth';

interface UserContextType {
  role: string | null;
  setRole: (role: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Предположим, что роль пользователя хранится в токене в куках
    const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
    if (token) {
     
        const userRole = getCurrentRole(token);
        setRole(userRole);
    }
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}