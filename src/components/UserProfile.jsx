import React from 'react';
import Age from '../assets/age.svg';
import Height from '../assets/height.svg';
import USerLocation from '../assets/userlocation.svg';
import Leo from '../assets/leo.svg';
import UserInterface from '../assets/user-inerface.svg';
import Smoking from '../assets/smoking.svg';
import Drink from '../assets/drink.svg';
 

export default function UserProfile() { 
  return (
    <>
       <div className='event-info'>
          <div className='event-info-img'>
             <img className="event-img" src="https://via.placeholder.com/150" />
          </div>
          <div className='event-info-text'> 
              <div className='event-heading'> 
                 <h2>One Life</h2>
              </div>
              <p>I get it from my mama.</p>
              <p>It's a good day to have a good day.</p>
              <div className='ingredients-list'>
                 <div className='item-data'>
                    <img src={Age} alt='' />
                    <span>25</span>
                 </div>
                 <div className='item-data'>
                    <img src={Height} alt='' />
                    <span>180</span>
                 </div>
                 <div className='item-data'>
                    <img src={USerLocation} alt='' />
                    <span>Eiffel Tower</span>
                 </div>
                 <div className='item-data'>
                    <img src={Leo} alt='' />
                    <span>Leo</span>
                 </div>
                 <div className='item-data'>
                    <img src={UserInterface} alt='' />
                 </div>
              </div>
              <div className='heading-data'>
                 <h6>Job</h6>
                 <h4>Job Title</h4>
              </div>
              <div className='heading-data'>
                 <h6>Languages</h6>
                 <div className='language-option'>
                     <div className='language-list'>
                        English
                     </div>
                     <div className='language-list'>
                       French
                     </div>
                 </div>
              </div>
              <div className='waring-box'>
                 <div className='warring-list'> 
                     <img src={Drink} alt='Drink' />
                     Prefer Not to Say
                 </div>
                 <div className='warring-list'>
                     <img src={Smoking} alt='Smoking' />
                     Prefer Not to Say
                 </div>
              </div>
          </div>
      </div>
    </>
  )
}
