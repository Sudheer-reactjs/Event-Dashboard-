import React, { useState, useEffect } from 'react';
import Delete from '../assets/delete.svg';
import Edit from '../assets/edit.svg';
import axios from 'axios';
import Modal from 'react-modal';
import { CREATEVENTTYPES, DELETEVENTTYPE, EVENTTYPE, GETMUSICSTYLE, UPDATEVENTTYPES } from '../pages/Helpers/url';

export default function EventMusic() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '' });
  const [newEventType, setNewEventType] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(false);
  const [addSuccessMessage, setAddSuccessMessage] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(GETMUSICSTYLE, {
        headers: {
          "Authorization": `Bearer ${JSON.parse(token)}`
        }
      });

      setEvents(response.data?.musictype);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleAddClick = () => {
    setEditItem(null);
    setFormData({ title: '' });
    togglePopup();
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({ title: item.name }); // Adjusted to use item.name from the fetched data
    togglePopup();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const config = {
      headers: {
        "Authorization": `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      if (!editItem) {
        // Update event
        const url = `${EVENTTYPE}/${editItem._id}`;
        const response = await axios.get(url, { name: formData.title }, config);
        setEvents(events.map(event => event._id === editItem._id ? response.data.eventtypedata : event));
      } else {
        // Add event
        const data = {
          id: editItem?._id,
          name: formData.title
        };
        // console.log(data,"data")
        const response = await axios.post(UPDATEVENTTYPES, data, config);

        if (response.status == 200) {
          fetchEvents();
        }
        setEditSuccessMessage(true); // Show success message

        // Hide success message after 1 second
        setTimeout(() => {
          setEditSuccessMessage(false);
        }, 1000); // 1000 milliseconds = 1 second
      }
      togglePopup();
    } catch (error) {
      console.error('Error submitting event data:', error);
    }
  };


  const handleNewEventTypeChange = (e) => {
    setNewEventType(e.target.value);
  };

  const handleAddEventType = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const config = {
      headers: {
        "Authorization": `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const data = {
        typeCode: 3, // Example typeCode value, adjust as per your API requirement 
        name: newEventType
      };

      const response = await axios.post(CREATEVENTTYPES, data, config);
      fetchEvents(); // Refresh events after adding a new event type
      setAddSuccessMessage(true); // Show success message

      // Hide success message after 1 second
      setTimeout(() => {
        setAddSuccessMessage(false);
      }, 1000); // 1000 milliseconds = 1 second

      togglePopup();
    } catch (error) {
      console.error('Error adding new event type:', error);
    }
  };


  const openDeleteModal = (itemId) => {
    setDeleteItemId(itemId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    closeDeleteModal(); // Close the modal first

    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          "Authorization": `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json'
        }
      };

      const data = {
        id: deleteItemId
      };

      const response = await axios.post(DELETEVENTTYPE, data, config);
      fetchEvents(); // Refresh events after deletion
      setDeleteSuccessMessage(true); // Show success message

      // Hide success message after 1 second
      setTimeout(() => {
        setDeleteSuccessMessage(false);
      }, 1000); // 1000 milliseconds = 1 second
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  
    return (
      <>
       <div className='add-button'>
        <button className="add-btn" onClick={handleAddClick}>+ ADD</button>
      </div>

      <table className="event-table table-outer">
        <thead>
          <tr>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(event)}>
                  <img src={Edit} alt='Edit' />
                </button>
                <button className="delete-btn" onClick={() => openDeleteModal(event._id)}>
                  <img src={Delete} alt='Delete' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{editItem ? 'Edit Event Type' : 'Add New Event Type'}</h2>
            {editItem ? (
              // Edit form
              <form onSubmit={handleSubmit}>
                <label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </label>
                <div className='button-right'>
                  <button className='Cancel-button' type="button" onClick={togglePopup}>Cancel</button>
                  <button className='save-button' type="submit">Save</button>
                </div>
              </form>
            ) : (
              // Add new event type form
              <form onSubmit={handleAddEventType}>
                <label>
                  <input
                    type="text"
                    value={newEventType}
                    onChange={handleNewEventTypeChange}
                  />
                </label>
                <div className='button-right'>
                  <button className='Cancel-button' type="button" onClick={togglePopup}>Cancel</button>
                  <button className='save-button' type="submit">Save</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
      >
        <div className='delete-modal'>
          <p>Are you sure you want to delete this event?</p>
          <div className='delete-buttons'>
            <button onClick={confirmDelete}>Delete</button>
            <button onClick={closeDeleteModal}>Cancel</button>
          </div>
        </div>
      </Modal>

      {deleteSuccessMessage && (
        <div className="success-message">Event deleted successfully!</div>
      )}
      {addSuccessMessage && (
        <div className="success-message">New event added successfully!</div>
      )}

      {editSuccessMessage && (
        <div className="success-message">Event edited successfully!</div>
      )}
      </>
    );
  }
  