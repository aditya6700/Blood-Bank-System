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

  const filteredChats = potentialChats && potentialChats.filter(u => user.userType === 'admin' ? true : u.userType === 'admin');

  
  return (
    <>
      <div className="bg-primary text-capitalize text-light fw-bold p-2 ps-3 fs-5 shadow">{user.userType !== 'admin' ? 'Admins to contact': 'Transfusers'} </div>
      <Stack className="all-users p-1 live-chat-overflow" gap={2}>
        {
          filteredChats && filteredChats.length > 0 ? (
            filteredChats.map((u, index) => (
              <div className='single-user d-flex align-items-center gap-2' key={index} onClick={() => createChat(user._id, u._id)}>
                <div className='chat-user-initials'> {getInitials(u.name)} </div>
                <div className="chat-text-content">
                  <div className="chat-name"> {u.name} </div>
                </div>
                <span className={onlineUsers?.some(user => user?.userId === u._id) ? "user-online ms-auto" : ""}></span>
              </div>
            ))
          ) : (
              <div className='single-user d-flex align-items-center gap-2'>
                <div className='chat-user-initials'> NA </div>
                <div className="chat-text-content">
                  <div className="chat-name"> No Admins Available </div>
                </div>
              </div>
          )}
      </Stack>
    </>
  )
}
