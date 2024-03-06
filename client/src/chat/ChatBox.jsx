import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../hooks/useChatContext'
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetchRecipientUser } from '../hooks/useFetchRecipientUser';
import { Stack } from 'react-bootstrap';
import moment from 'moment';
import InputEmoji from 'react-input-emoji'
import { MdSend } from "react-icons/md";
import Welcome from '../components/Welcome';
import LoadingSpinner from '../components/LoadingSpinner';

export const ChatBox = () => {
  const { user } = useAuthContext();
  const { messages, isMessagesLoading, currentChat, sendTextMessage } = useChatContext();
  const { recipientUser } = useFetchRecipientUser(currentChat, user);  
  const [textMessage, setTextMessage] = useState("");

  const scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  },[messages])

  if (!recipientUser) {
    return <Welcome username={user?.name} />
  }

  if (isMessagesLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <div className="chat-header bg-primary text-capitalize text-light fw-bold p-2 ps-3 fs-5 shadow">
        <strong>{recipientUser.name}</strong>
      </div>
      <Stack className='chat-box live-chat-overflow' gap={1}>
        <Stack className='chat-messages live-chat-overflow p-3' gap={3}>
          {
            messages && messages.map((message, index) => {
              return (
                <Stack className={`${message?.senderId === user?._id
                  ? "chat-message self-chat align-self-end flex-grow-0"
                  : "chat-message align-self-start flex-grow-0"}`} key={index}
                  ref={scroll}
                >
                  <span>{message.text}</span>
                  <span className='chat-msg-date'>{moment(message.createdAt).calendar()}</span>
                </Stack>
              )
            })
          }
        </Stack>
        <Stack className='chat-input flex-grow-0 px-3 py-2' direction='horizontal'>
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            onEnter={() => sendTextMessage(textMessage, user._id, currentChat._id, setTextMessage)}
            borderColor='blue' />
          <button className="live-chat-send-btn" type='submit' onClick={() => sendTextMessage(textMessage, user._id, currentChat._id, setTextMessage)} >
            <MdSend />
          </button>
        </Stack>
      </Stack>
    </>
  )
}
