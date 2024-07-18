import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ticket from '../assets/ticket.png';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

export default function EventsCard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [events, setEvents] = useState([]);

  const selectCountry = (val) => {
    setCountry(val);
    setRegion(''); // reset region when country changes
  };

  const selectRegion = (val) => {
    setRegion(val);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          throw new Error('No token found');
        }
  
        const response = await axios.get('http://13.49.70.247:3002/admin/getevent', {
          headers: {
            "Authorization": `Bearer ${JSON.parse(token)}`
          }
        });
    console.log(response.data,"response.data") 
        setEvents(response.data?.data);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };
  
    fetchEvents();
  }, []);

  // Filter events based on searchTerm, country, and region
  const filteredEvents = Array.isArray(events) ? events.filter(event =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (country === '' || event.country === country) &&
    (region === '' || event.state === region)
  ) : [];

  return (
    <>
      
    </>
  );
}
