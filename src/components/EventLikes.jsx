import React, { useState, useEffect } from 'react';
import Age from '../assets/age.svg';
import Height from '../assets/height.svg';
import UserLocation from '../assets/userlocation.svg';
import Leo from '../assets/leo.svg';
import UserInterface from '../assets/user-inerface.svg';
import Smoking from '../assets/smoking.svg';
import Drink from '../assets/drink.svg';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { EVENT } from '../pages/Helpers/url';

export default function EventLikes() {
    const { id } = useParams();
    const [likes, setLikes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLike, setSelectedLike] = useState(null);

    useEffect(() => {
        const fetchLikes = async () => {
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

                setLikes(response.data?.eventdata?.likes);
                setLoading(false);
            } catch (error) {
                setError('Error fetching event details');
                console.error('Error fetching event details:', error);
            }
        };

        fetchLikes();
    }, [id]);

    const openLikeProfile = (like) => {
        setSelectedLike(like);
    };

    const closeLikeProfile = () => {
        setSelectedLike(null);
    };

    return (
        <>
            <h2 className="h2-heading">Likes <span className='count'>{likes?.length || 0}</span></h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {likes && (
                likes.length === 0 ? (
                    <p>No Likes</p>
                ) : (
                    <div className='comment-list-outer scroll-bar'>
                        {likes.map((like, index) => (
                            <div key={index} className='comment-list-inner'>
                                <div className='comment-img-heading'>
                                    <img
                                        className="event-img"
                                        src={like.picture[0] || 'https://via.placeholder.com/500'}
                                        alt={like.name}

                                    />
                                    <h4>{like.name}</h4>
                                </div>
                                <a className="profile-link" onClick={() => openLikeProfile(like)}>View Profile</a>
                            </div>
                        ))}
                    </div>
                )
            )}
            {selectedLike && (
                <LikePopup like={selectedLike} onClose={closeLikeProfile} />
            )}
        </>
    );
}

function LikePopup({ like, onClose }) {
    return (
        <div className="popup">
            <div className="popup-inner member-popup">
                <button className="close-btn" onClick={onClose}>X</button>

                <div className='event-info'>
                <div className='event-info-img'>
                        <img className="profile-img" src={like?.picture[0] || 'https://via.placeholder.com/500'} alt={`Profile of ${like?.name}`} />
                    </div>
                    <div className='event-info-text'>
                    <h2>{like?.name}</h2>
                    <p>{like?.description}</p>
                        
                    <div className='ingredients-list'>
                            <div className='item-data'>
                                <img src={Age} alt='' />
                                <span>{like?.age ? like.age : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={Height} alt='' />
                                <span>{like?.height ? like.height : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={UserLocation} alt='' />
                                <span>{like?.address ? like.address : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={Leo} alt='' />
                                <span>{like?.zodiac_sign ? like.zodiac_sign : '-'}</span>
                            </div>
                            <div className='item-data'>
                                <img src={UserInterface} alt='' />
                            </div>
                        </div>
                        <div className='heading-data'>
                            <h6>Job</h6>
                            <h4>{like?.job_title ? like.job_title : '-'}</h4>
                        </div>
                        <div className='heading-data'>
                            <h6>Languages</h6>
                            <div className='language-option'>
                                {/* <div className='language-list'> {Array.isArray(like.language) ? like.language.join(', ') : like.language}</div> */}
                                {Array.isArray(like?.language) ?
                                    (like?.language.map((language, index) => (
                                        <div key={index} className='tag-box'>{language}</div>
                                    ))
                                    ) : (
                                        <div className='tag-box'>{like.language}</div>
                                    )}
                            </div>
                        </div>
                        <div className='waring-box'>
                            <div className='warring-list'>
                                <img src={Drink} alt='Drink' />
                                {like?.drinking ? like.drinking : '-'}
                            </div>
                            <div className='warring-list'>
                                <img src={Smoking} alt='Smoking' />
                                {like?.smoking ? like.smoking : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
