import React from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import './PartnerPage.css'

// Пример логотипов партнеров
import partner1 from './Images/Jalakaauto.png';
import partner2 from './Images/Chip.png';
import partner3 from './Images/tajua.png';
import { useTranslation } from "react-i18next";




const partners = [
    {src: partner1, alt: 'Jalakaauto', name: 'Jalakaauto', url: 'https://jalakaauto.ee'},
    {src: partner2, alt: 'Chip-liga', name: 'Chip-liga', url: 'https://chip-liga.com'},
    {src: partner3, alt: 'Tajua', name: 'Tajua', url: 'https://tajua.com'},
];

const PartnersPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} className="text-center" style={{ color: 'white' }}>
                    <h1 className="mb-4">{t('partners')}</h1>
                    <p className="mb-4">
                        <b>{t('proud')}</b>
                    </p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {partners.map((partner, index) => (
                    <Col key={index} xs={6} md={4} lg={3} className="mb-4 text-center d-flex">
                        <a href={partner.url} target="_blank" rel="noopener noreferrer" className='partnerPageLinks' style={{ textDecoration: 'none', width: '100%', backgroundColor:'none' }}>
                            <Card className="h-100 d-flex flex-column">
                                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                    <Image src={partner.src} alt={partner.alt} fluid className="mb-3"/>
                                    <Card.Title>{partner.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </a>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
export default PartnersPage;
