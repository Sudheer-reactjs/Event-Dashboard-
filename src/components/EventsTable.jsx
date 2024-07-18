import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Ticket from '../assets/ticket.png';
import Stopwatch from '../assets/stopwatch.svg';
import Location from '../assets/location.svg';
import Tag from '../assets/tag.svg';
import View from '../assets/view.svg';
import Delete from '../assets/delete.svg';
import { useTable, usePagination } from 'react-table';
import { HOMEDATA } from '../pages/Helpers/url';

const customStyles = {
    content: {
        width: '500px',
        height: 'auto',
        padding: '70px 30px !important',

    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};

const EventsTable = () => {
    const [data, setData] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEventToDelete, setSelectedEventToDelete] = useState(null);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('Token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(HOMEDATA, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    }
                });

                setData(response.data.upcomingEvents);
            } catch (error) {
                console.error('Error fetching events data:', error);
            }
        };

        fetchEvents();
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: 'Event ID', accessor: '_id' },
            { Header: 'Name of Event', accessor: 'event_name' },
            { Header: 'Capacity', accessor: 'capacity' },
            { Header: 'Ticket Price/Free', accessor: 'price_type', Cell: ({ value }) => value === 0 ? 'Free' : `$${value}` },
            { Header: 'Date', accessor: 'date' },
            {
                Header: 'Action',
                Cell: ({ row }) => (
                    <>
                        <button onClick={() => handleView(row.original)}><img src={View} alt="View icon" /></button>
                        <button onClick={() => openDeleteModal(row.original)}><img src={Delete} alt="Delete icon" /></button>
                    </>
                )
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        pageOptions,
        state: { pageIndex }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }
        },
        usePagination
    );

    const openDeleteModal = (event) => {
        setSelectedEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedEventToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (selectedEventToDelete) {
            try {
                const token = localStorage.getItem('Token');
                if (!token) {
                    throw new Error('No token found');
                }
    
                await axios.get(`http://13.49.70.247:3002/admin/deleteevent?id=${selectedEventToDelete?._id}`, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(token)}`
                    } 
                });
    
                // Update local data state to remove the deleted event
                setData(data.filter(event => event._id !== selectedEventToDelete._id));
                
                // Show success message
                setDeleteSuccessMessage(true);
                setTimeout(() => {
                    setDeleteSuccessMessage(false); 
                }, 1000);
    
                // Close the delete modal
                closeDeleteModal();
            } catch (error) {
                // Error handling
                console.error('Error deleting event:', error);
            }
        }
    };


    const handleView = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <table className='table-outer' {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td key={cell.column.id} {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>


            <div className="pagination">
                <div className='pagination-right'>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Prev
                    </button>
                    {pageOptions.map((_, index) => (
                        <button key={index} onClick={() => gotoPage(index)} className={pageIndex === index ? 'active' : ''}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Event Information"
            >
                {selectedEvent && (
                    <div className='event-info'>
                        <div className='event-info-img'>
                             <img src={selectedEvent?.pictures?.[0] || 'https://via.placeholder.com/500' } alt={selectedEvent.event_name} />
                        </div> 
                        <div className='event-info-text'>
                            <div className='event-heading'>
                                <h2>{selectedEvent.event_name}</h2>
                                <span className='price'>
                                    <img src={Ticket} alt='Ticket' />
                                    {selectedEvent?.price_type === 0 ? 'FREE' : `$${selectedEvent?.price_type}`}
                                </span>
                            </div>
                            <p>{selectedEvent.description}</p>

                            <div className='time'>
                                <img src={Stopwatch} alt='Stopwatch' />  {selectedEvent?.start_time} - {selectedEvent?.end_time}
                            </div>

                            <div className='tab-box'>
                                <div className='tag-img'>
                                    <img src={Tag} alt='Tag' />
                                </div>
                                <div className='tag-list'>
                                {Array.isArray(selectedEvent?.music_types) ?
                                    (selectedEvent?.music_types.map((music_types, index) => (
                                        <div key={index} className='tag-box'>{music_types}</div>
                                    ))
                                    ) : (
                                        <div className='tag-box'>{selectedEvent.music_types}</div>
                                    )}
                                
                                </div>
                            </div>
                            <div className='location'>
                                <img src={Location} alt='Location icon' />{selectedEvent?.address}
                            </div>
                            <button className='close-button' onClick={closeModal}>X</button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                style={customStyles}
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
        </>
    );
};

export default EventsTable;
