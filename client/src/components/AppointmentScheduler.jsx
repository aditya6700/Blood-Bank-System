import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';

const AppointmentScheduler = () => {
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {

    axios.get('/api/bookedSlots')
      .then(response => {
        setBookedSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching booked slots:', error);
      });
  }, []);


  const generateTimeSlots = () => {
    const timeSlots = [];
    const currentDate = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      if (isWeekday(date)) {
        for (let hour = 9; hour <= 17; hour++) {
          const slot = `${date.toISOString().split('T')[0]}T${pad(hour)}:00`;
          if (!bookedSlots.includes(slot)) {
            timeSlots.push(slot);
          }
        }
      }
    }
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
  }, [bookedSlots]);


  const handleDateTimeChange = (e) => {
    setSelectedDateTime(e.target.value);
  };

  return (
    <Form.Group as={Row} className="mb-3" controlId="quantity">
      <Form.Label column sm={3}>
          Appointment Slot
      </Form.Label>
      <Col sm={9}>
        <Form.Control
          className='border-2'
          type="datetime-local"
          id="appointmentDateTime"
          name="appointmentDateTime"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
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
