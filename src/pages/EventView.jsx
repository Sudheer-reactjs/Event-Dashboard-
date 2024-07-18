import React from 'react';
import SingleEventInfo from '../components/SingleEventInfo';
import EventMembers from '../components/EventMembers';
import EventLikes from '../components/EventLikes';
import EventComments from '../components/EventComments';

export default function EventView() {
  return (
    <>
        <SingleEventInfo /> 
       
        <div className='event-grid-outer'> 
            <div className='event-grid-outer-inner'>
              <EventMembers />
            </div>
            <div className='event-grid-outer-inner'>
               <EventLikes />
            </div>
        </div>
        <div className='event-grid-outer-inner'>
           <EventComments />
        </div>
    </> 
  )
}
