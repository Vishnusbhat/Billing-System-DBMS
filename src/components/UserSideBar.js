import React, { useState } from 'react';
import Modal from 'react-modal'; // Import Modal
import './UserSideBar.css'; // Import CSS for sidebar styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon from react-fontawesome
import { faPlus, faList, faInfoCircle, faBox, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import required FontAwesome icons
import ItemsList from './ItemsList';
import AddItemForm from './AddItemForm'; // Import the component for "Add Item" form
import axios from 'axios'; // Import axios for HTTP requests
import AboutPage from './AboutPage';
import Box from './Box';
import NewBill from './Newbill';
import NewInvoice from './NewInvoice';

const UserSideBar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
  const [selectedModal, setSelectedModal] = useState(null); // State to track selected modal content

  // Function to fetch items from the server
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return []; // Return an empty array if there's an error
    }
  };

  // Function to open modal and set selected modal content
  const openModal = (modalContent) => {
    setSelectedModal(modalContent);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedModal(null); // Clear selected modal content
    setModalIsOpen(false);
  };

  return (
    <div className="sidebar">
      <ul>
        {/* List item with FontAwesome icon for "Add Item" button */}

        {/* List item with FontAwesome icon for "Items List" button */}
        <li>
          <button className="sidebar-button" onClick={() => openModal('itemsList')}>
            <FontAwesomeIcon icon={faList} className="icon" />
            Items List
          </button>
        </li>
        {/* List item with FontAwesome icon for "About Page" button */}
        <li>
          <button className="sidebar-button" onClick={() => openModal('aboutPage')}>
            <FontAwesomeIcon icon={faInfoCircle} className="icon" />
            About
          </button>
        </li>
        {/* List item with FontAwesome icon for "Box" button */}
        <li>
          <button className="sidebar-button" onClick={() => openModal('addBill')}>
            <FontAwesomeIcon icon={faBox} className="icon" />
            Add Bill
          </button>
        </li>
        <li>
          <button className="sidebar-button" onClick={() => openModal('addInvoice')}>
            <FontAwesomeIcon icon={faBox} className="icon" />
            Add Invoice
          </button>
        </li>
      </ul>

      {/* Modal Component */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <div className="modal-content">
          <button onClick={closeModal} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {selectedModal === 'itemsList' && <ItemsList fetchItems={fetchItems} />}
          {selectedModal === 'aboutPage' && <AboutPage />}
          {selectedModal === 'boxPage' && <Box />}
          {selectedModal === 'addBill' && <NewBill />}
          {selectedModal === 'addInvoice' && <NewInvoice />}
        </div>
      </Modal>
    </div>
  );
};

export default UserSideBar;
