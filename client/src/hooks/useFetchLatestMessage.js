import axios from "axios";
import { useEffect, useState } from "react"
import { messageRoute } from "../utils/ApiRoutes";
import { useChatContext } from "./useChatContext";

export const useFetchLatestMessage = (chat) => {
    const [latestMessage, setLatestMessage] = useState(null);
    const { newMessage, notifications } = useChatContext();

    useEffect(() => {
        const getMessages = async () => {
            try {
                const { data } = await axios.get(`${messageRoute}/${chat?._id}`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log(data.messages);
                const lastMessage = data.messages[data.messages?.length - 1];
                setLatestMessage(lastMessage);
            }
            catch (error) {
                console.log(error);
            }
           
        };
        getMessages();
        //eslint-disable-next-line
    }, [newMessage, notifications]);

    return {latestMessage}
}