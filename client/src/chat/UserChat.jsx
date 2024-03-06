import React from 'react'
import { useFetchRecipientUser } from '../hooks/useFetchRecipientUser'
import { Stack } from 'react-bootstrap';
import { useChatContext } from '../hooks/useChatContext';
import { useFetchLatestMessage } from '../hooks/useFetchLatestMessage';
import moment from 'moment';

export const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user); 
  const { onlineUsers } = useChatContext();
  const { latestMessage } = useFetchLatestMessage(chat);

  const isOnline = onlineUsers?.some(user => user?.userId === recipientUser?._id);

  const truncateLastMessage = (text) => {
    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  }

  return (
    <>
      <Stack direction='horizontal' gap={3} className='chat-user-card align-items-center p-2 mx-2 justify-content-between' role='button'>
        <div className='d-flex'>
          <div className='me-2'>
              S 
          </div>
          <div className="chat-text-content">
            <div className="name"> {recipientUser?.name} </div>
            <div className="text"> {latestMessage?.text && (
              <span>{truncateLastMessage(latestMessage?.text)}</span>
            )}</div>
          </div>
        </div>
        <div className="chat-audit-info d-flex flex-column align-items-end">
          <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
          <div className="this-user-notifications">2</div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </Stack>
    </>
  )
}
