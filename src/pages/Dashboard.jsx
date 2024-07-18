// src/pages/Dashboard.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import GraphChart from '../components/GraphChart';
import TodayEvents from '../components/TodayEvents';
import EventsTable from '../components/EventsTable';

const Dashboard = () => {
 return (
    <>
      <div className='chart-grid-outer'>
        <div className='chart-grid-left'>
          <h2 className='h2-heading'>Number Of Events (2024)</h2>
          <GraphChart />
        </div>
        <div className='today-event-outer'>
          <h2 className='h2-heading'>Today’s Events</h2>
          <TodayEvents />
        </div>
      </div>
      <div className='upcoming-events'>
            <h2 className='h2-heading'>Upcoming Events</h2>
            <EventsTable />
      </div>
    </>
  );
};

export default Dashboard;
