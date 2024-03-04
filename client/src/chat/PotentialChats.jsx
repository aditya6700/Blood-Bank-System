import React from 'react'
import { useChatContext } from '../hooks/useChatContext'
import { useAuthContext } from '../hooks/useAuthContext';
import { Stack } from 'react-bootstrap';

export const PotentialChats = () => {
  const { potentialChats, createChat } = useChatContext();
  const { user } = useAuthContext();
  
  return (
    <>
      <Stack className="all-users pt-1 live-chat-overflow" gap={2}>
        {
          potentialChats && potentialChats.map((u, index) => {
            return (
              <div className="single-user me-2" key={index} onClick={() => createChat(user._id, u._id)}>
                {u.name}
                <span className="user-online"></span>
              </div>
            )
          })
        }
      </Stack>
    </>
  )
}
