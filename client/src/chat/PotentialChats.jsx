import React from 'react'
import { useChatContext } from '../hooks/useChatContext'
import { useAuthContext } from '../hooks/useAuthContext';
import { Stack } from 'react-bootstrap';

export const PotentialChats = () => {
  const { potentialChats, createChat, onlineUsers } = useChatContext();
  const { user } = useAuthContext();

  
  const getInitials = (name) => {
    return name?.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
  }
  
  return (
    <>
      <div className="bg-primary text-capitalize text-light fw-bold p-2 ps-3 fs-5 shadow"> Transfusers </div>
      <Stack className="all-users p-1 live-chat-overflow" gap={2}>
        {
          potentialChats && potentialChats.map((u, index) => {
            return (
              <div className='single-user d-flex align-items-center gap-2' key={index} onClick={() => createChat(user._id, u._id)}>
                <div className='chat-user-initials'> {getInitials(u.name)} </div>
                <div className="chat-text-content" >
                  <div className="chat-name"> {u.name} </div>
                </div>
                <span className={onlineUsers?.some(user => user?.userId === u._id) ? "user-online ms-auto" : ""}></span>
              </div>
            )
          })
        }
      </Stack>
    </>
  )
}
