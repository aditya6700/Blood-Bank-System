import React from 'react'
import { useChatContext } from '../hooks/useChatContext';
import { Stack } from 'react-bootstrap';
import { UserChat } from './UserChat';
import { useAuthContext } from '../hooks/useAuthContext';

export const UsersChatList = () => {
  const { user } = useAuthContext();
  const { userChats, isUserChatsLoading, updateCurrentChat } = useChatContext();

  return (
    <>
      <div className="bg-primary text-light text-capitalize fw-bold p-2 ps-3 fs-5 shadow"> My Chats </div>
      {userChats?.length < 1 ? 'No Chats' : (
        <Stack className='admin-chat-user-list live-chat-overflow pt-1 flex-grow-0' direction='horizantal' gap={2}>
          {isUserChatsLoading && <p> Loading chats...</p>}
          {
            userChats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user} />
                </div>
              )
            })
          }
        </Stack>
      )}
    </>
  )
}
