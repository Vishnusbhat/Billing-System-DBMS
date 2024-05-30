// UserNavbar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import Modal from 'react-modal'; // Import Modal
import './UserNavbar.css'; // Import the UserNavbar CSS file
import AddItemForm from './AddItemForm';

const UserNavbar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <nav className="user-navbar">
      <ul className="navbar-list">
        <li>
          <button className="user-icon" onClick={openModal}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        </li>
      </ul>
      {/* Modal for user details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Details Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button className="close-button" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {/* Render user details content */}
        <div className="user-details">
          <h2>User Details</h2>
          {/* Add user details content here */}
        </div>
      </Modal>
    </nav>
  );
};

export default UserNavbar;
