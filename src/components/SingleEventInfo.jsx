import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Ticket from '../assets/ticket.png'
import Stopwatch from '../assets/stopwatch.svg'
import Location from '../assets/location.svg'
import Tag from '../assets/tag.svg'
import { EVENT } from '../pages/Helpers/url';

export default function SingleEventInfo() {
   const { id } = useParams();
   const [event, setEvent] = useState(null);

   useEffect(() => {
      const fetchEventDetails = async () => {
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

            setEvent(response.data?.eventdata);
         } catch (error) {
            console.error('Error fetching event details:', error);
         }
      };

      fetchEventDetails();
   }, [id]);
   if (!event) {
      return;
   }
   return (
      <>
         <div className='event-info'>
            <div className='event-info-img'>
                  <img src={event.thumbnail_urls?.[0] || 'https://via.placeholder.com/500'} alt={event.event_name} />
            </div>
            <div className='event-info-text'>
               <div className='event-heading'>
                  <h2>{event?.event_name}</h2>
                  <span className='price'>
                     <img src={Ticket} alt='Ticket' /> {event?.price_type === 0 ? 'FREE' : `${event?.price_type}`}
                  </span>
               </div>
               <p>{event?.description}</p>
               <div className='time'>
                  <img src={Stopwatch} alt='Stopwatch' />  {event?.start_time} - {event?.end_time}
               </div>
               <div className='tab-box'>
                  <div className='tag-img'>
                     <img src={Tag} alt='Tag' />
                  </div>
                  <div className='tag-list'>
                     {/* {event?.music_type && event.music_type.map((music, index) => (
                        <div className='tag-box' key={index}>{music}</div>
                     ))} */}
                     {Array.isArray(event?.music_type) ?
                        (event?.music_type.map((music_type, index) => (
                           <div key={index} className='tag-box'>{music_type}</div>
                        ))
                        ) : (
                           <div className='tag-box'>{event.music_type}</div>
                        )}
                  </div>

               </div>
               <div className='location'>
                  <img src={Location} alt='Location icon' /> {event?.address}
               </div>
            </div>
         </div>
      </>
   );
}
