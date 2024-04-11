import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { faqList } from '../utils/faq';

export const Faq = () => {
  

  return (
    <>
      <NavigationBar />
      <Container >
        <Row className='h-100'>
          <Col sm={12} md={10} className='mx-auto my-4'>
            <h2 className="text-center mb-3 text-capitalize">Frequently Asked Questions</h2>
            <div className="faq-container">
              <Accordion >
              {
                faqList.map((data, index) => {
                  return (
                    <Accordion.Item key={index} eventKey={index}>
                      <Accordion.Header>{data.title}</Accordion.Header>
                      <Accordion.Body>{data.body}</Accordion.Body>
                    </Accordion.Item>
                  )
                })
              }
            </Accordion>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
