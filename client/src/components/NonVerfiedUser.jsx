import axios from 'axios'
import React from 'react'
import { Button } from 'react-bootstrap'
import { FaSync } from 'react-icons/fa'
import { findUserRoute } from '../utils/ApiRoutes'
import { useAuthContext } from "../hooks/useAuthContext";
import { refreshToastOptions } from '../utils/toasOptions'
import { toast } from 'react-toastify'

export const NonVerfiedUser = ({ status }) => {

  const { user, dispatch } = useAuthContext();

  const updateUser = async () => {
    try { 
      const { data } = await axios.get(`${findUserRoute}`, { params: { id: user?._id } }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      // console.log(data.users);
      dispatch({ type: 'UPDATE_USER', payload: { ...data } });
    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message, refreshToastOptions);
    }
  };

  return (
    <>
      <div className='d-flex gap-2 align-items-center'>
        <p> Your status is not verified. Sync your status</p>
        <Button className='mb-2' variant="outline-primary" title='sync' size='sm' onClick={updateUser} ><FaSync /></Button> 
      </div>
      <p>Current status is <strong className='text-danger text-capitalize'>{status}</strong>.</p>
      <p>Contact your admin to get yourselves verified.</p>
    </>
  )
}
