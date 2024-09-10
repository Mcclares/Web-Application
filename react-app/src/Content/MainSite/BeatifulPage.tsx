import React from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { GiMechanicGarage, GiMechanicalArm } from "react-icons/gi";
import { MdComputer } from "react-icons/md";
import { BiSolidCarMechanic } from "react-icons/bi";
import { IoCarSport } from "react-icons/io5";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { GrCloudComputer } from "react-icons/gr";
import { MdOutlineStars } from "react-icons/md";
import { GiAutoRepair } from "react-icons/gi";
import { AiOutlineWechat } from "react-icons/ai";
import { GiAbstract098 } from "react-icons/gi";
import { RiCustomerService2Line } from "react-icons/ri";
import { FaBusinessTime } from "react-icons/fa";
import { AiOutlineSolution } from "react-icons/ai";
import { MdHighQuality } from "react-icons/md";

import photo from './Images/Equipment.png';
import { BsFillTelephoneFill } from "react-icons/bs";

const BeautifulPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: '3px', paddingBottom: '20px' }}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={12} className="text-center" style={{ color: 'white' }}>
            <h1 className="mb-4"><b>{t('welcome')}</b></h1>
            <p className="mb-4">{t('description')}</p>
            <Image style={{ textAlign: 'center' }} src={photo} fluid rounded className="mb-4" />
            <Card className="mt-4">
              <Card.Body style={{ textAlign: 'left', color: '#333' }}>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>{t('about_us_title')}</Card.Title>
                <Card.Text style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '10px' }}><GrCloudComputer style={{ color: '#000000', marginRight: '10px' }} />{t('about_us_list1')}</li>
                    <li style={{ marginBottom: '10px' }}><MdOutlineStars style={{ color: '#000000', marginRight: '10px' }} />{t('about_us_list2')}</li>
                    <li style={{ marginBottom: '10px' }}><HiOutlineWrenchScrewdriver style={{ color: '#000000', marginRight: '10px' }} />{t('about_us_list3')}</li>
                    <li style={{ marginBottom: '10px' }}><GiAutoRepair style={{ color: '#000000', marginRight: '10px' }} />{t('about_us_list4')}</li>
                    <li style={{ marginBottom: '10px' }}><GiAbstract098 style={{ color: '#000000', marginRight: '10px' }} />{t('about_us_list5')}</li>
                    <li style={{ marginBottom: '10px' }}><RiCustomerService2Line style={{ color: '#000000', marginRight: '10px' }} />{t('about_us_list6')}</li>
                  </ul>
                  <p style={{ color: '#000000', fontWeight: 'bold' }}>{t('about_us_conclusion')}</p>
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mt-4">
              <Card.Body style={{ textAlign: 'left', color: '#333' }}>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#545553' }}>{t('works_we_do')}</Card.Title>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}><BiSolidCarMechanic style={{ color: '#545553', marginRight: '10px' }} />{t('work1')}</li>
                  <li style={{ marginBottom: '10px' }}><MdComputer style={{ color: '#545553', marginRight: '10px' }} />{t('work2')}</li>
                  <li style={{ marginBottom: '10px' }}><GiMechanicalArm style={{ color: '#545553', marginRight: '10px' }} />{t('work3')}</li>
                  <li style={{ marginBottom: '10px' }}><GiMechanicGarage style={{ color: '#545553', marginRight: '10px' }} />{t('work4')}</li>
                  <li style={{ marginBottom: '10px' }}><IoCarSport  style={{ color: '#545553', marginRight: '10px' }} />{t('work5')}</li>
                </ul>
              </Card.Body>
            </Card>
            <Card className="mt-4">
              <Card.Body style={{ textAlign: 'left', color: '#333' }}>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>{t('customer_care')}</Card.Title>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}><AiOutlineWechat style={{ color: '#007bff', marginRight: '10px' }} />{t('customer_care_text1')}</li>
                  <li style={{ marginBottom: '10px' }}><FaBusinessTime style={{ color: '#007bff', marginRight: '10px' }} />{t('customer_care_text2')}</li>
                  <li style={{ marginBottom: '10px' }}><AiOutlineSolution style={{ color: '#007bff', marginRight: '10px' }} />{t('customer_care_text3')}</li>
                  <li style={{ marginBottom: '10px' }}><BsFillTelephoneFill style={{ color: '#007bff', marginRight: '10px' }} />{t('customer_care_text4')}</li>
                  <li style={{ marginBottom: '10px' }}><MdHighQuality style={{ color: '#007bff', marginRight: '10px' }} />{t('customer_care_text5')}</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BeautifulPage;

