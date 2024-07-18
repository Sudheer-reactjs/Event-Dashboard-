import React, { useState, useEffect } from 'react';
import Block from '../assets/block.svg' 
import UserDelete from '../assets/user-delete.svg'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Modal from 'react-modal';
import { BLOCKACCOUNT, DEACTIVATEACCOUNT, GETUSERS } from './Helpers/url';

const customStyles = {
  content: {
    width: '500px',
    height: 'auto',
    position: 'absolute',
    padding: '70px 30px !important',


  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

Modal.setAppElement('#root'); // Set the app root element for accessibility

export default function Users() {
  const [users, setUsers] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null); // State to hold the user ID for deletion
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(GETUSERS, {
        headers: {
          "Authorization": `Bearer ${JSON.parse(token)}`
        }
      });

      setUsers(response.data?.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        BLOCKACCOUNT,
        { userId, status: currentStatus === '0' ? '1' : '0' },
        {
          headers: {
            "Authorization": `Bearer ${JSON.parse(token)}`
          }
        }
      );

      if (response.status === 200) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteToggle = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        DEACTIVATEACCOUNT,
        { userId: deleteUserId },
        {
          headers: {
            "Authorization": `Bearer ${JSON.parse(token)}`
          }
        }
      );

      if (response.status === 200) {
        setIsDeleteModalOpen(false); // Close the modal after successful deletion
        setDeleteSuccessMessage('User deleted successfully!');
        fetchUsers(); // Refresh the user list after deletion
        setTimeout(() => {
          setDeleteSuccessMessage('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const filteredUsers = users ? users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const pageOptions = [...Array(pageCount).keys()];

  const currentUsers = filteredUsers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const previousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const nextPage = () => {
    if (pageIndex < pageCount - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const gotoPage = (index) => {
    setPageIndex(index);
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const visiblePages = 5;
    const halfVisible = Math.floor(visiblePages / 2);
    const startPage = Math.max(0, pageIndex - halfVisible);
    const endPage = Math.min(pageCount, pageIndex + halfVisible + 1);

    for (let i = startPage; i < endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => gotoPage(i)}
          className={pageIndex === i ? 'active' : ''}
        >
          {i + 1}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <>
      <div className='user-heading'>
        <h2 className="h2-heading">Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className='user-grid'>
        {currentUsers.map((user, index) => (
          <div className='user-list' key={index}>
            <div className='postion-relative'>
              <img className='event-img'  src={user?.picture ? user.picture : 'https://via.placeholder.com/500'} alt='Event' />
              <div className='postion-botom'>
              <button onClick={() => handleBlockToggle(user._id, user.status)}>
                {user.status === '0' ? (
                  <>
                     <img src={Block} alt={Block} /> Block
                  </>
                ) : (
                  <>
                   <img src={Block} alt={Block} /> Unblock
                  </>
                )}
              </button>
              <button onClick={() => openDeleteModal(user._id)}><img src={UserDelete} alt={UserDelete} /> Delete</button>
            </div>
            </div>
            <h4 onClick={() => handleUserClick(user._id)}>{user?.full_name}</h4>
           
          </div>
        ))}
      </div>

      <div className="pagination user-pagination">
        <div className='pagination-right'>
          <button onClick={previousPage} disabled={pageIndex === 0}>
            Prev
          </button>
          {renderPageNumbers()}
          <button onClick={nextPage} disabled={pageIndex === pageCount - 1}>
            Next
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        style={customStyles}
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className="delete-modal"
      >
        <p>Are you sure you want to delete this user?</p>
        <div className='delete-buttons'>
          <button onClick={handleDeleteToggle}>Delete</button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </div>
      </Modal>

      {deleteSuccessMessage && (
        <div className="success-message">{deleteSuccessMessage}</div>
      )}
    </>
  );
}
