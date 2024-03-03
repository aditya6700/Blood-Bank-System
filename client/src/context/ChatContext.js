import { createContext, useCallback, useEffect, useState } from 'react';
import { userChatsRoute } from '../utils/ApiRoutes';
import axios from 'axios';

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

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
        console.log(data.chat)
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

  return (
    <ChatContext.Provider value={{
      userChats,
      isUserChatsLoading,
      userChatsError
    }}>
      {children}
    </ChatContext.Provider>
  )
}