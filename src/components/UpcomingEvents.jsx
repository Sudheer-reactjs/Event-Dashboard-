import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Ticket from '../assets/ticket.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Stopwatch from '../assets/stopwatch.svg';
import Location from '../assets/location.svg';
import Tag from '../assets/tag.svg';
import { USERTABING } from '../pages/Helpers/url';

export default function UpcomingEvents({ userId }) {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('Token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`${USERTABING}?filter=upcoming&userId=${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                });

                // Assuming your API returns an array of events under `data`
                if (response.data?.events) {
                    setEvents(response.data?.events);
                } else {
                    console.error('No data returned from API');
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEvents();
    }, [userId]);

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className='main-event-page user-history'>
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className='event-card' onClick={() => openModal(event)}>
                            <img className='event-img' src={event.thumbnail_urls || 'https://via.placeholder.com/500'} alt={event.event_name} />
                            <div className='event-text-grid'>
                                <h4>{event.event_name}</h4>
                                <span className='price'><img src={Ticket} alt='Ticket' /> {event.price_type === 0 ? 'FREE' : `$${event.price_type}`}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Event Information"
            >
                {selectedEvent && (
                    <div className='event-info'>
                        <div className='event-info-img'>
                            <img className='event-img' src={selectedEvent.thumbnail_urls || 'https://via.placeholder.com/500'} alt={selectedEvent.event_name} />
                        </div>
                        <div className='event-info-text'>
                            <div className='event-heading'>
                                <h2>{selectedEvent.event_name}</h2>
                                <span className='price'>
                                    <img src={Ticket} alt='Ticket' />
                                    {selectedEvent?.price_type === 0 ? 'FREE' : `$${selectedEvent?.price_type}`}
                                </span>
                            </div>
                            <p>{selectedEvent.description}</p>

                            <div className='time'>
                                <img src={Stopwatch} alt='Stopwatch' />  {selectedEvent?.start_time} - {selectedEvent?.end_time}
                            </div>

                            <div className='tab-box'>
                                <div className='tag-img'>
                                    <img src={Tag} alt='Tag' />
                                </div>
                                <div className='tag-list'>
                                    {Array.isArray(selectedEvent.music_type) ? (
                                        selectedEvent.music_type.map((musicType, index) => (
                                            <div key={index} className='tag-box'>{musicType}</div>
                                        ))
                                    ) : (
                                        <div className='tag-box'>{selectedEvent.music_type}</div>
                                    )}
                                </div>
                            </div>
                            <div className='location'>
                                <img src={Location} alt='Location icon' />{selectedEvent?.address}
                            </div>
                            <button className='close-button' onClick={closeModal}>X</button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}
