/// Navigation.tsx
import { useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { getCurrentRole } from '../../../Utils/auth';
import { useState } from 'react';
import { getCookie } from '../../../Utils/cookie';
import logo from '../Assets/Images/Logo.png'



function Navigation() {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  useEffect(() => {
    const accessToken = getCookie('jwt');
    if (accessToken) {
        const role = getCurrentRole(accessToken);
      setCurrentRole(role);
    }
  }, []);



  const logout = async () => {
    try {
      // Очистите токен в localStorage
      document.cookie = 'jwt=; Max-Age=-1; path=/;'; // Установка срока действия куки на прошедшее время
      // Дополнительно, если вы используете localStorage, то можно очистить токен оттуда:
      // localStorage.removeItem('accessToken');
      setCurrentRole(null);  
      // Перенаправляем пользователя на страницу входа или на другую страницу
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Navbar bg="dark" expand="lg" className="bg-body-tertiary">
      <Container>
           <Navbar.Brand href="/Home">
          <img
            src={logo}
            alt="Company Logo"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          OBD2 DataBase
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(currentRole === 'ADMINISTRATOR' || currentRole === "ACCOUNTER") && <Nav.Link href="/AccountTable">Table</Nav.Link>}
            {(currentRole === 'ADMINISTRATOR' || currentRole === "USER") && <Nav.Link href="/Folders">Folders</Nav.Link>}
            {currentRole === 'ADMINISTRATOR' && <Nav.Link href="/MyAccount">My account</Nav.Link>}
            <Nav.Link onClick={logout}>Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;

