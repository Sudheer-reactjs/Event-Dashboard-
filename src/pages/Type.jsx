import React, { useState} from 'react'
import EventTab from '../components/EventTab';
import EventVenu from '../components/EventVenu';
import EventMusic from '../components/EventMusic';


export default function Type() {
    const [activeTab, setActiveTab] = useState('tab-1');
  


    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
    return (
        <>
            <h2 className="h2-heading">Number Of Events (2024)</h2>
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
                                Event
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
                                Venue
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
                                Music
                            </button>
                        </li>
                    </ul>  
                </nav>
                <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" className={`tab-panel ${activeTab === 'tab-1' ? 'tab-panel--active' : ''}`}>
                    <EventTab />
                </div>
                <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" className={`tab-panel ${activeTab === 'tab-2' ? 'tab-panel--active' : ''}`}>
                    <EventVenu />
                </div>
                <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" className={`tab-panel ${activeTab === 'tab-3' ? 'tab-panel--active' : ''}`}>
                    <EventMusic />
                </div>
            </div>
        </>
    )
}
