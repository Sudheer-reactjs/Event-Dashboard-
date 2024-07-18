import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ticket from '../assets/ticket.png';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useNavigate } from 'react-router-dom';
import { EVENTSEARCH, GETEVENT } from './Helpers/url';

export default function Event() {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState(null); // Use null instead of ''
  const [events, setEvents] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const navigate = useNavigate();

  const selectCountry = (val) => {
    setCountry(val);
    setRegion(null); // Reset region to null when country changes
    setIsFiltered(true);
  };

  const selectRegion = (val) => {
    setRegion(val);
    setIsFiltered(true); // Mark as filtered when region changes
  };

  const clearFilters = () => {
    setCountry('');
    setRegion(null);
    setIsFiltered(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          throw new Error('No token found');
        }

        let apiUrl = GETEVENT;
        if (country && region !== null) { // Check if region is not null
          apiUrl = EVENTSEARCH;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            "Authorization": `Bearer ${JSON.parse(token)}`
          },
          params: {
            country: country,
            state: region
          }
        });

        setEvents(response.data?.data);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };

    fetchEvents();
  }, [country, region]); // Trigger fetch on country or region change

  // Filter events based on searchTerm, country, and region
  const filteredEvents = Array.isArray(events) ? events.filter(event =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (country === '' || event.country.trim() === country.trim()) &&
    (region === null || event.state.trim() === region.trim())
  ) : [];

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <>
      <h2 className="h2-heading">Events</h2>
      <div className='main-event-page-outer'>
        <div className='filter-bar'>
          <div className='filter-select-grid'>
            <CountryDropdown
              value={country}
              onChange={(val) => selectCountry(val)}
            />
            <RegionDropdown
              country={country}
              value={region}
              onChange={(val) => selectRegion(val)}
              blankOptionLabel="Select State" // Set the first option label
              showDefaultOption={false} // Hide the default option provided by the library
              disabled={country === ''}
            />
             {isFiltered && (
            <div className='clear-filter-grid'>
              <button onClick={clearFilters} className='clear-filter-button'>Clear Filters</button>
            </div>
          )}
          </div>
          <div className='search-grid'>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="search-input"
            />
          </div>
         
        </div>
        <div className='main-event-page'>
          {isFiltered && filteredEvents.length === 0 ? (
            <p>No event found</p>
          ) : (
            filteredEvents.map(event => (
              <div className='event-card' key={event._id} onClick={() => handleEventClick(event._id)}>
                {/* Assuming you have imageUrl field in your event data */}
                <img
                  className='event-img' 
                  src={event?.imageUrl || 'https://via.placeholder.com/500'}
                  alt={event?.event_name || 'Event'}
                />
                <div className='event-text-grid'>
                  <h4>{event?.event_name}</h4>
                  <span className='price'>
                    <img src={Ticket} alt='Ticket' />
                    {event?.price_type === 0 ? 'FREE' : `$${event?.price_type}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
