import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useChatContext } from '../hooks/useChatContext'
import { UsersChatList } from '../chat/UsersChatList';
import { PotentialChats } from '../chat/PotentialChats';
import { ChatBox } from '../chat/ChatBox';

export const AdminChat = () => {

  const { userChats, isUserChatsLoading, userChatsError } = useChatContext();
  // console.log(userChats, isUserChatsLoading, userChatsError);

  return (
    <>
      <Container className='p-5 d-flex flex-column ' style={{ height: '100vh', overflowY: 'hidden' }} >
        <Row>
          <h3 className="text-left fs-1 mb-3 text-capitalize">Live Chat</h3>
        </Row>
        <Row className='admin-chat-wrapper'>
          <Col md={2} className='admin-potential-chats-wrapper pe-0'>
            <PotentialChats />
          </Col>
          <Col md={3} className='admin-chat-user-list-wrapper'>
            <UsersChatList />
          </Col>
          <Col md={6} className='admin-chat-message-container-wrapper'>
            <ChatBox />
          </Col>
        </Row>
      </Container>  
    </> 
  )
}
