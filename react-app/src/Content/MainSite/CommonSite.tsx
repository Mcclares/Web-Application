import React from "react";
import { Container, Navbar, Nav, Tabs, Tab, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import SceneViewer from "../Components/Three.js/modelViewer"; // Ensure correct path to SceneViewer component
import './CommonSite.css';
import BeatifulPage from "./BeatifulPage";
import PartnersPage from "./PartnersPage";
import ContactPage from "./ContactPage";
import logo from '../Components/Assets/Images/Logo.png';

export default function CommonSite() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };


        const textStyle = {
        fontSize: '20px',
        display: 'block',
        marginBottom: '10px',
        color: 'white'
    };
{t('navbar_brand')}
    return (
        <div>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/Home">
                        <img
                            src={logo} // Абсолютный путь из публичной директории
                            alt="Company Logo"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        {t('navbar_brand')}
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/login">{t('login')}</Nav.Link>
                        {/* <Nav.Link onClick={handleShow}>Menu</Nav.Link> */}
                    </Nav>
                    <Form.Select onChange={changeLanguage} defaultValue={i18n.language} style={{ width: '150px' }}>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="et">Eesti</option>
                    </Form.Select>
                </Container>
            </Navbar>
            <div style={{margin: '20px'}}>
                <Tabs className="mb-3" >
                    <Tab eventKey="3D model" title={t('3d_model')} >
                        {/* <div style={{height:"600px"}}>
                            <span style={textStyle}><b>{t('dear_website_visitors')}</b></span>
                            <span style={textStyle}>{t('maintenance_message')}</span>
                            <span style={textStyle}>{t('thank_you')}</span>
                            <span style={textStyle}><b>{t('best_regards')}</b></span>
                        </div> */}
                        <div>
                            <SceneViewer/>
                        </div>
                    </Tab>
                    <Tab eventKey="About us" title={t('about_us')}>
                        <div style={{ margin: 'auto', width: '100%', height: '70hv' }}>
                            <BeatifulPage/>
                        </div>
                    </Tab>
                    <Tab eventKey="Partnership" title={t('partnership')}>
                    <div className="partnerShip-tab">
                            <PartnersPage />
                        </div>
                    </Tab>
                    <Tab eventKey="Contacts" title={t('contacts')}>
                          <div className="contact-tab">
                            <ContactPage />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <Footer />
        </div>
    );
}
