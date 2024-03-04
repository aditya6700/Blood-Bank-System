import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { findUserRoute } from "../utils/ApiRoutes";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    // console.log(" in use fetch recipientuser");
    // console.log(chat);
    // console.log(" end use fetch recipientuser");
    const recipientId = chat?.members.find((id) => id !== user._id);

    const getUser = useCallback(async () => {
        if (!recipientId) return null
        try { 
            const { data } = await axios.get(`${findUserRoute}`, { params: { id: recipientId } }, {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json"
                }
              });
            // console.log(data.users);
            setRecipientUser(data.users);
        }
        catch (error) {
            console.log(error)
            setError(error.response.data.message);
        }
    // eslint-disable-next-line
    },[])

    useEffect(() => {
        getUser();
    }, [getUser])
    
    return { recipientUser };
}