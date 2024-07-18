import React, { useState, useEffect } from 'react';
import PriceIcon from '../assets/price-icon.svg';
import axios from 'axios';

import Stopwatch from '../assets/stopwatch.svg'
import Location from '../assets/location.svg'
import Tag from '../assets/tag.svg'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal
import { HOMEDATA } from '../pages/Helpers/url';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '800px', // Adjust as needed
        width: '90%', // Adjust as needed
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backgroundColor: '#fff',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};

const TodayEvents = () => {
    const [todayEvents, setTodayEvents] = useState([]);
    const [noEventsMessage, setNoEventsMessage] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open/close
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodayEvents = async () => {
            try {
                const token = localStorage.getItem('Token');  
                if (!token) {
                    throw new Error('No token found'); 
                }
                
                const response = await axios.get(HOMEDATA, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                });

                if (response.data.todayEvents.length === 0) {
                    setNoEventsMessage('No events found for today.');
                } else {
                    setTodayEvents(response.data.todayEvents);
                }
            } catch (error) {
                console.error('Error fetching today events:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to login on unauthorized access
                } else {
                    setNoEventsMessage('An error occurred while fetching events.');
                }
            }
        };
    
        fetchTodayEvents();
    }, [navigate]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        openModal(); // Open modal when an event is clicked
    };

    return (
        <div className='today-event'>
            {noEventsMessage ? (
                <p>{noEventsMessage}</p>
            ) : (
                <div>
                    {todayEvents.map((event) => (
                        <div key={event._id} className='today-event-list' onClick={() => handleEventClick(event)}>
                            <img src={event?.pictures?.[0] || 'https://via.placeholder.com/500' } alt={event.event_name} />
                            <div className='today-event-text'>
                                <h3>{event?.event_name}</h3>
                                <p>
                                    <img src={PriceIcon} alt='' />
                                    {event?.price_type === 0 ? 'Free' : `$${event?.price_type}`}
                                </p>
                            </div> 
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Popup */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Event Information"
            >
                {selectedEvent && (
                    <div className='event-info'>
                        <div className='event-info-img'>
                        <img src={selectedEvent?.pictures?.[0] || 'https://via.placeholder.com/500' } alt={selectedEvent.event_name} />
                        </div>
                        <div className='event-info-text'>
                            <div className='event-heading'>
                                <h2>{selectedEvent.event_name}</h2>
                                <span className='price'>
                                    <img src={PriceIcon} alt='Ticket' />
                                    {selectedEvent?.price_type === 0 ? 'FREE' : `$${selectedEvent?.price_type}`}
                                </span>
                            </div>
                            <p>{selectedEvent.description}</p>

                            <div className='time'>
                                {/* Adjust as per your event data structure */}
                                <img src={Stopwatch} alt='Stopwatch' /> {selectedEvent?.start_time} - {selectedEvent?.end_time}
                            </div>

                            {/* Example of additional details */}
                            <div className='tab-box'>
                                <div className='tag-img'>
                                    <img src={Tag} alt='Tag' />
                                </div>
                                <div className='tag-list'> 
                                {Array.isArray(selectedEvent?.music_types) ?
                                    (selectedEvent?.music_types.map((music_types, index) => (
                                        <div key={index} className='tag-box'>{music_types}</div>
                                    ))
                                    ) : (
                                        <div className='tag-box'>{selectedEvent.music_types}</div>
                                    )}
                                </div>
                            </div>
                            <div className='location'>
                                <img src={Location} alt='Location icon' /> {selectedEvent?.address}
                            </div>
                            <button className='close-button' onClick={closeModal}>X</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TodayEvents;
