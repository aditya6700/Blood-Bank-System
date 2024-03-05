import React from 'react'
import { useFetchRecipientUser } from '../hooks/useFetchRecipientUser'
import { Stack } from 'react-bootstrap';
import { useChatContext } from '../hooks/useChatContext';

export const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user); 
  const { onlineUsers } = useChatContext();

  const isOnline = onlineUsers?.some(user => user?.userId === recipientUser?._id);

  return (
    <>
      <Stack direction='horizontal' gap={3} className='chat-user-card align-items-center p-2 mx-2 justify-content-between' role='button'>
        <div className='d-flex'>
          <div className='me-2'>
              S 
          </div>
          <div className="chat-text-content">
            <div className="name"> {recipientUser?.name} </div>
            <div className="text"> Hi </div>
          </div>
        </div>
        <div className="chat-audit-info d-flex flex-column align-items-end">
          <div className="date">03/03/2024</div>
          <div className="this-user-notifications">2</div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </Stack>
    </>
  )
}
