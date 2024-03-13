import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { UsersChatList } from '../chat/UsersChatList';
import { PotentialChats } from '../chat/PotentialChats';
import { ChatBox } from '../chat/ChatBox';

export const AdminChat = () => {

  return (
    <>
      <Container className='p-4 d-flex flex-column ' style={{ height: '100vh', overflowY: 'hidden' }} >
        <Row>
          <h3 className="text-left fs-1 mb-3 text-capitalize">Live Chat</h3>
        </Row>
        <Row className='admin-chat-wrapper'>
          <Col md={3} className='bg-light p-0 shadow'>
            <UsersChatList />
          </Col>
          <Col md={5} className='bg-light p-0 shadow'>
            <ChatBox />
          </Col>
          <Col md={3} className='bg-light p-0 shadow'>
            <PotentialChats />
          </Col>
        </Row>
      </Container>  
    </> 
  )
}
