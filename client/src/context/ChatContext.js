import { createContext, useCallback, useEffect, useState } from 'react';
import { createChatRoute, findUserRoute, userChatsRoute, messageRoute, sendMessageRoute, socketConnection } from '../utils/ApiRoutes';
import axios from 'axios';
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setsendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("onlineusers: ", onlineUsers);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    console.log("new socket connection", newSocket);
    return () => {
      newSocket.disconnect();
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("addNewUser", user && user._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    //eslint-disable-next-line
  }, [socket]);

  const getUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${findUserRoute}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });

      const pChats = data.users.filter((u) => {
        let isChatCreated = false;
        if (user._id === u._id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => chat.members[0] === u._id || chat.members[1] === u._id);
        }
        return !isChatCreated;
      });

      setPotentialChats(pChats);
    }
    catch (error) {
      console.log(error)
      setUserChatsError(error.response.data.message);
    }
    //eslint-disable-next-line
  }, [userChats]);
  
  useEffect(() => {
    getUsers();
  }, [getUsers])

  const getUserChats = useCallback(async () => {
    if (user?._id) {
      try {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        
        const { data } = await axios.get(`${userChatsRoute}/${user?._id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        // console.log(data.chat)
        setUserChats(data.chat);
      }
      catch (error) {
        console.log(error)
        setUserChatsError(error.response.data.message);
      }
      finally {
        setIsUserChatsLoading(false);
      }
      
    }
  }, [user]);

  useEffect(() => {
    getUserChats();
  }, [getUserChats])

  const getMessages = useCallback(async () => {
    try {
      setIsMessagesLoading(true);
      setMessageError(null);
        
      const { data } = await axios.get(`${messageRoute}/${currentChat?._id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(data.messages)
      setMessages(data.messages);
    }
    catch (error) {
      console.log(error)
      setMessageError(error.response.data.message);
    }
    finally {
      setIsMessagesLoading(false);
    }
      
  }, [currentChat]);

  useEffect(() => {
    getMessages();
  }, [getMessages])

  const createChat = useCallback(async (firstId, secondId) => {
    try {
      const { data } = await axios.post(createChatRoute,
        { firstId, secondId },
        { withCredentials: true }
      );
      setUserChats((prev) => [...prev, data.chat]);
    }
    catch (error) {
      console.log(error);
    }
  }, [])
  
  const updateCurrentChat = useCallback(async (chat) => {
    setCurrentChat(chat)
  }, []);

  const sendTextMessage = useCallback(async (text, senderId, chatId, setTextMessage) => {
    if (!text) return console.log("type something to send...");
    try {
      const { data } = await axios.post(sendMessageRoute,
        { chatId, senderId, text },
        { withCredentials: true });
      setNewMessage(data.messages);
      setTextMessage("");
      setMessages((prev) => [...prev, data.messages]);
    }
    catch (error) {
      console.log(error);
      return setsendTextMessageError(error.response.data.message);
    }
  },[])

  return (
    <ChatContext.Provider value={{
      userChats,
      isUserChatsLoading,
      userChatsError,
      potentialChats,
      createChat,
      updateCurrentChat,
      messages,
      isMessagesLoading,
      messageError,
      currentChat,
      sendTextMessage
    }}>
      {children}
    </ChatContext.Provider>
  )
}