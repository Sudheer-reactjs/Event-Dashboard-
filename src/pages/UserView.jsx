import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PastEvents from '../components/PastEvents'; 
import OngoingEvents from '../components/OngoingEvents';
import UpcomingEvents from '../components/UpcomingEvents';
import Age from '../assets/age.svg';
import Height from '../assets/height.svg';
import USerLocation from '../assets/userlocation.svg';
import Leo from '../assets/leo.svg';
import UserInterface from '../assets/user-inerface.svg';
import Smoking from '../assets/smoking.svg';
import Drink from '../assets/drink.svg';
import { USER } from './Helpers/url';

export default function UserDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('tab-1'); // Add state for active tab

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('Token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`${USER}/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                });

                setEvent(response.data?.userdata);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEvent();
    }, [id]);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    if (!event) {
        return <div>Loading...</div>;
    }
    const LanguageOptions = ({ member }) => {
        // Ensure member.language is always an array
        const languages = Array.isArray(member.language) ? member.language : [member.language];

        return (
            <div className='language-option'>
                {languages.map((language, index) => (
                    <div className='language-list' key={index}>
                        {language}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <>
            <div className='event-info'>
                <div className='event-info-img'>
                    <img src={event.picture || 'https://via.placeholder.com/500'} alt="Event" />
                </div>
                <div className='event-info-text'>
                    <div className='event-heading'>
                        <h2>{event?.full_name}</h2>
                    </div>
                    <p>{event?.bio}</p>
                    <div className='ingredients-list'>
                        <div className='item-data'>
                            <img src={Age} alt='' />
                            <span>{event?.age ? event.age : '-'}</span>
                        </div>
                        <div className='item-data'>
                            <img src={Height} alt='' />
                            <span>{event?.agheighte ? event.height : '-'}</span>
                        </div>
                        <div className='item-data'>
                            <img src={USerLocation} alt='' />
                            <span>{event?.address ? event.address : '-'}</span>
                        </div>
                        <div className='item-data'>
                            <img src={Leo} alt='' />
                            <span>{event?.zodiac_sign ? event.zodiac_sign : '-'}</span>
                        </div>
                        <div className='item-data'>
                            <img src={UserInterface} alt='' />
                        </div>
                    </div>
                    <div className='heading-data'>
                        <h6>Job</h6>
                        <h4>{event?.job_title ? event.job_title : '-'}</h4>
                    </div>
                    <div className='heading-data'>
                        <h6>Languages</h6>
                        <div className='language-option'>
                            {Array.isArray(event.language) ? (
                                event.language.map((language, index) => (
                                    <div key={index} className='language-list'>{language}</div>
                                ))
                            ) : (
                                <div className='language-list'>{event.language}</div>
                            )}
                        </div>
                    </div>
                    <div className='waring-box'>
                        <div className='warring-list'>
                            <img src={Drink} alt='Drink' />
                            {event?.drinking ? event.drinking : '-'}
                        </div>
                        <div className='warring-list'>
                            <img src={Smoking} alt='Smoking' />
                            {event?.smoking ? event.smoking : '-'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="booked-event">
                <h2 className="h2-heading">Events</h2>
                <div className="tabs">
                    <nav className="tab-nav">
                        <ul className="tab-list">
                            <li>
                                <button
                                    role="tab"
                                    id="tab-1"
                                    aria-controls="panel-1"
                                    aria-selected={activeTab === 'tab-1'}
                                    className={`tab-btn ${activeTab === 'tab-1' ? 'tab-btn--active' : ''}`}
                                    onClick={() => handleTabClick('tab-1')}
                                >
                                    Past Events
                                </button>
                            </li>
                            <li>
                                <button
                                    role="tab"
                                    id="tab-2"
                                    aria-controls="panel-2"
                                    aria-selected={activeTab === 'tab-2'}
                                    className={`tab-btn ${activeTab === 'tab-2' ? 'tab-btn--active' : ''}`}
                                    onClick={() => handleTabClick('tab-2')}
                                >
                                    Ongoing Events
                                </button>
                            </li>
                            <li>
                                <button
                                    role="tab"
                                    id="tab-3"
                                    aria-controls="panel-3"
                                    aria-selected={activeTab === 'tab-3'}
                                    className={`tab-btn ${activeTab === 'tab-3' ? 'tab-btn--active' : ''}`}
                                    onClick={() => handleTabClick('tab-3')}
                                >
                                    Upcoming Events
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" className={`tab-panel ${activeTab === 'tab-1' ? 'tab-panel--active' : ''}`}>
                        <PastEvents userId={id} />
                    </div>
                    <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" className={`tab-panel ${activeTab === 'tab-2' ? 'tab-panel--active' : ''}`}>
                        <OngoingEvents userId={id} /> 
                    </div>
                    <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" className={`tab-panel ${activeTab === 'tab-3' ? 'tab-panel--active' : ''}`}>
                        <UpcomingEvents userId={id} />
                    </div>
                </div>
            </div>
        </>
    );
}
