import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form,  } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    const { t } = useTranslation();
    const form = useRef<HTMLFormElement>(null);

    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (form.current) {
            emailjs.sendForm('service_x63a9w8', 'template_gg2eibc', form.current, {
                publicKey: 'Z_7cwUJtV_EHFSCvy',
            })
                .then((result) => {
                    alert('Message sent successfully!');
                    setFormData({ user_name: '', user_email: '', message: '' });
                }, (error) => {
                    alert('Failed to send message. Please try again later.');
                });
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{t('contact_info')}</Card.Title>
                            <Card.Text>
                                <strong>{t('address')}</strong><br />
                                <strong>{t('phone')}</strong><br />
                                <strong>{t('email1')}</strong><br />
                                <strong>{t('email2')}</strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} >
                    <Card>
                        <Card.Body>
                            <Card.Title>{t('contact_us')}</Card.Title>
                            <Form ref={form} onSubmit={handleSubmit} className='contactPageForm'>
                                <Form.Group controlId="formName">
                                    <Form.Label>{t('name')}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="user_name" 
                                        value={formData.user_name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>{t('email')}</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        name="user_email" 
                                        value={formData.user_email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group controlId="formMessage">
                                    <Form.Label>{t('message')}</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        name="message" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        rows={3} 
                                        required 
                                    />
                                </Form.Group>
                                <button className='contactPageButton' type="submit">
                                    {t('send')}
                                </button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={12} className="text-center">
                    <Card>
                        <Card.Body>
                            <div className="embed-responsive embed-responsive-16by9">
                                <iframe
                                    className="embed-responsive-item"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d880.4405893939033!2d26.724282083108225!3d58.34191686547038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eb379c0584d65b%3A0xbc4480256bc06443!2sOBD2%20Systems%20O%C3%9C!5e0!3m2!1sru!2see!4v1718396616985!5m2!1sru!2see"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    title="Google Maps"
                                ></iframe>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactPage;
