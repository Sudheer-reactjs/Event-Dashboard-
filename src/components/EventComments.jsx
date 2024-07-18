import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { EVENT } from '../pages/Helpers/url';

export default function EventComments() {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
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

                setComments(response.data?.eventdata?.comments || []);
                setLoading(false);
            } catch (error) {
                setError('Error fetching event details');
                console.error('Error fetching event details:', error);
            }
        };

        fetchComments();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <h2 className="h2-heading">Comments</h2>
            {comments.length > 0 ? (
                <div className='comment-list-outer scroll-bar'>
                    {comments.map((comment, index) => (
                        <div key={index} className='comment-list-inner'>
                            <div className='comment-img-heading'>
                                <img
                                    className="event-img"
                                    src={comment.pictures?.[0] || "https://via.placeholder.com/150"}
                                    alt="Comment"
                                />
                                <div className='comment-list'>
                                    <h4>{comment.name}</h4>
                                    <p>{comment.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> 
            ) : (
                <div>No comments available</div>
            )}
        </>
    );
}
