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

  const getInitials = (name) => {
    return name?.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
  }
  

  return (
    <>
      <Stack gap={1} className='chat-user-card p-2 mx-2' role='button'>
        <div className='d-flex align-items-center gap-2'>
          <div className='chat-user-initials'> {getInitials(recipientUser?.name)} </div>
          <div className="chat-text-content" >
            <div className="chat-name"> {recipientUser?.name} </div>
          </div>
            <span className={isOnline ? "user-online ms-auto" : ""}></span>
        </div>
        <div className="chat-audit-info d-flex justify-content-between">
          <div className="text fst-italic ps-2">
            {
              latestMessage?.text && (
                <span>{truncateLastMessage(latestMessage?.text)}</span>
              )
            }
          </div>
          <div className="chat-msg-date">{moment(latestMessage?.createdAt).calendar()}</div>
        </div>
      </Stack>
    </>
  )
}
