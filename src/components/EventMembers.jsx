import React, { useState, useEffect } from 'react';
import Age from '../assets/age.svg';
import Height from '../assets/height.svg';
import USerLocation from '../assets/userlocation.svg';
import Leo from '../assets/leo.svg';
import UserInterface from '../assets/user-inerface.svg';
import Smoking from '../assets/smoking.svg';
import Drink from '../assets/drink.svg';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { EVENT } from '../pages/Helpers/url';

export default function EventMembers() {
    const { id } = useParams();
    const [eventMembers, setEventMembers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        const fetchEventMembers = async () => {
            try {
                const token = localStorage.getItem('Token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`${EVENT}/${id}`, { 
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                });

                setEventMembers(response.data?.eventdata?.members_names);
                setLoading(false);
            } catch (error) {
                setError('Error fetching event details');
                console.error('Error fetching event details:', error);
            }
        };

        fetchEventMembers();
    }, [id]);

    const openMemberProfile = (member) => {
        setSelectedMember(member);
    };

    const closeMemberProfile = () => {
        setSelectedMember(null);
    };

    return (
        <>
            <h2 className="h2-heading">Event Members <span className='count'>{eventMembers?.length || 0}</span></h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {eventMembers && (
                eventMembers.length === 0 ? (
                    <p>No event members</p>
                ) : (
                    <div className='comment-list-outer scroll-bar'>
                        {eventMembers.map((member, index) => (
                            <div key={index} className='comment-list-inner'>
                                <div className='comment-img-heading'>
                                    <img className="event-img" src={member.pictures[0] || 'https://via.placeholder.com/500'} alt={`Event Member ${index}`} />
                                    <h4>{member.name}</h4>
                                </div>
                                <a className="profile-link" onClick={() => openMemberProfile(member)}>View Profile</a>
                            </div>
                        ))}
                    </div>
                )
            )}
            {selectedMember && (
                <MemberPopup member={selectedMember} onClose={closeMemberProfile} />
            )}
        </>
    );
}

function MemberPopup({ member, onClose }) {
    return (
        <div className="popup">
            <div className="popup-inner member-popup">
                <button className="close-btn" onClick={onClose}>X</button>

                <div className='event-info'>
                    <div className='event-info-img'>
                        <img className="profile-img" src={member?.pictures[0] || 'https://via.placeholder.com/500'} alt={`Profile of ${member?.name}`} /> 
                    </div>
                    <div className='event-info-text'>
                        <h2>{member?.name}</h2>
                        <p>{member?.description}</p>
                        <div className='ingredients-list'>
                            <div className='item-data'>
                                <img src={Age} alt='' />
                                <span>{member?.age ? member.age : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={Height} alt='' />
                                <span>{member?.height ? member.height : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={USerLocation} alt='' />
                                <span>{member?.address ? member.address : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={Leo} alt='' />
                                <span>{member?.zodiac_sign ? member.zodiac_sign : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={UserInterface} alt='' />
                            </div>
                        </div>
                        <div className='heading-data'>
                            <h6>Job</h6>
                            <h4>{member?.job_title ? member.job_title : '-'}</h4>
                        </div>
                        <div className='heading-data'>
                            <h6>Languages</h6>
                            <div className='language-option'>
                                {/* <div className='language-list'> {Array.isArray(member.language) ? member.language.join(', ') : member.language}</div> */}
                                {Array.isArray(member?.language) ?
                                    (member?.language.map((language, index) => (
                                        <div key={index} className='tag-box'>{language}</div>
                                    ))
                                    ) : (
                                        <div className='tag-box'>{member.language}</div>
                                    )}
                            </div>
                        </div>
                        <div className='waring-box'>
                            <div className='warring-list'>
                                <img src={Drink} alt='Drink' />
                                {member?.drinking ? member.drinking : '-'}
                            </div>
                            <div className='warring-list'>
                                <img src={Smoking} alt='Smoking' />
                                {member?.smoking ? member.smoking : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
