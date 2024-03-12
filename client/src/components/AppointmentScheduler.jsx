import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';
import { bookedSlotsRoute } from '../utils/ApiRoutes';

const AppointmentScheduler = ({handleChange, requestDetails, type}) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {

    axios.get(bookedSlotsRoute, { params: { type } }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        console.log(response.data);
        let bookedSlots = response.data.bookedSlots.map(slot => slot.appointmentSlot);
        console.log(bookedSlots);
        setBookedSlots(bookedSlots);
      })
      .catch(error => {
        console.error('Error fetching booked slots:', error);
      });
    
  }, [type]);

  const generateTimeSlots = () => {
    const timeSlots = [];
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    console.log("current date: ", currentDate)

    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      console.log("date in for loop: ", date)

      if (isWeekday(date)) {
        for (let hour = 9; hour <= 17; hour++) {
          const slot = new Date(date);
          slot.setHours(hour, 0, 0, 0);
          console.log('slot: ', slot);
          const isoString =  slot.toISOString().slice(0, 10) + "T" + slot.toTimeString().slice(0, 8) + ".000Z";
          console.log('slot in iso String', isoString);
          if (!bookedSlots.includes(isoString)) {
            timeSlots.push(`${slot.toISOString().split('T')[0]}T${pad(hour)}:00`);
          }
        }
      }
    }
    console.log(availableTimeSlots)
    setAvailableTimeSlots(timeSlots);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const pad = (num) => {
    return num.toString().padStart(2, '0');
  };

  useEffect(() => {
    generateTimeSlots();
    //eslint-disable-next-line
  }, [bookedSlots]);

  return (
    <Form.Group as={Row} className="mb-3" controlId="quantity">
      <Form.Label column sm={3}>
        Appointment Slot
      </Form.Label>
      <Col sm={9}>
        <Form.Control
          className='border-2'
          type="datetime-local"
          name="appointmentSlot"
          value={requestDetails.appointmentSlot}
          onChange={handleChange}
          min={availableTimeSlots.length > 0 ? availableTimeSlots[0] : ''}
          max={availableTimeSlots.length > 0 ? availableTimeSlots[availableTimeSlots.length - 1] : ''}
          list="timeSlots"
          required
        />
        <datalist id="timeSlots">
          {availableTimeSlots.map((slot) => (
            <option key={slot} value={slot} />
          ))}
        </datalist>
      </Col>
    </Form.Group>
  );
};

export default AppointmentScheduler;
