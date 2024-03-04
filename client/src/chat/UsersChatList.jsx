import React from 'react'
import { useChatContext } from '../hooks/useChatContext';
import { Stack } from 'react-bootstrap';
import { UserChat } from './UserChat';
import { useAuthContext } from '../hooks/useAuthContext';

export const UsersChatList = () => {
  const { user } = useAuthContext();
  const { userChats, isUserChatsLoading, userChatsError } = useChatContext();
  // console.log("in userchats list");
  // console.log(userChats, isUserChatsLoading, userChatsError);
  // console.log("end userchats list");

  return (
    <>
      {userChats?.length < 1 ? 'No Chats' : (
        <Stack className='admin-chat-user-list pt-1 flex-grow-0' direction='horizantal' gap={2}>
          {isUserChatsLoading && <p> Loading chats...</p>}
          {
            userChats?.map((chat, index) => {
              return (
                <div key={index}>
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
