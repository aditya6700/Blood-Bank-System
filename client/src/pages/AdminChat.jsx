import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useChatContext } from '../hooks/useChatContext'

export const AdminChat = () => {

  const { userChats, isUserChatsLoading, userChatsError } = useChatContext();
  console.log(userChats, isUserChatsLoading, userChatsError);

  return (
    <>
      <Container className='p-5 d-flex flex-column ' style={{ height: '100vh', overflowY: 'hidden' }} >
        <Row>
          <h3 className="text-left fs-1 mb-3 text-capitalize">Live Chat</h3>
        </Row>
        <Row className='admin-chat-wrapper h-100'>
          <Col md={3} className='admin-chat-user-list-wrapper'>
            <div className="admin-chat-user-list">
              
            </div>
          </Col>
          <Col md={7} className='admin-chat-message-container-wrapper'>
            <div className="admin-chat-message-container">

            </div>
          </Col>
        </Row>
      </Container>  
    </> 
  )
}
