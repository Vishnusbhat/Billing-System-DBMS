import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AddItemForm from './AddItemForm';
import ItemsList from './ItemsList';
import AboutPage from './AboutPage';
import Sidebar from './Sidebar';
import Modal from './Modal';
import './Main.css'; // Import the CSS file for styling

const Main = () => {
  const [items, setItems] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const location = useLocation();

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleModalClose = () => {
    setModalContent(null);
  };

  useEffect(() => {
    switch (location.pathname) {
      case '/add-item':
        setModalContent(<AddItemForm onItemAdded={fetchItems} />);
        break;
      case '/items':
        setModalContent(<ItemsList items={items} fetchItems={fetchItems} />);
        break;
      case '/about':
        setModalContent(<AboutPage />);
        break;
      default:
        setModalContent(null);
        break;
    }
  }, [location.pathname, items]);

  return (
    <div className="main-container">
      <Sidebar />
      {modalContent && (
        <Modal onClose={handleModalClose}>
          {modalContent}
        </Modal>
      )}
      <div className="content">
        {/* Routes are defined in the App component */}
      </div>
    </div>
  );
};

export default Main;
