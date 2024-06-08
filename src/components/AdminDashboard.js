import React, { useState } from 'react';
import Sidebar from './Sidebar';
import UserNavbar from './UserNavbar';
import Background from './Background';
import InvoiceList from './Invoicelist';
import StorageList from './StorageList';
import Modal from 'react-modal';
import StoreList from './Storelist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faFileInvoice, faStore, faWarehouse, faPercent, faUsers, faShoppingCart, faChartBar, faTimes } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css'; // Import CSS for AdminDashboard
import BillList from './Billlist'; // Import BillList component


// Set app element for accessibility
Modal.setAppElement('#root');

const AdminDashboard = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <Background />
      <Sidebar />
      <UserNavbar /> 
      <div className="content">
        <main>
          {/* Card */}
          <div className="card-container">
            <div className="add-item-container" onClick={() => openModal(<BillList />)}> {/* Render BillList component */}
              <FontAwesomeIcon icon={faFileInvoiceDollar} size="3x" />
              <h2>Bills</h2>
            </div>
            <div className="add-item-container" onClick={() => openModal(<InvoiceList />)}>
              <FontAwesomeIcon icon={faFileInvoice} size="3x" />
              <h2>Invoices</h2>
            </div>
            <div className="add-item-container" onClick={() => openModal(<StoreList/>)}>
              <FontAwesomeIcon icon={faStore} size="3x" />
              <h2>Stores</h2>
            </div>
            <div className="add-item-container" onClick={() => openModal(<StorageList/>)}>
              <FontAwesomeIcon icon={faWarehouse} size="3x" />
              <h2>Storage</h2>
            </div>
          </div>

          {/* New Row */}
          <div className="card-container row-2">
            <div className="add-item-container" onClick={() => openModal('Discounts Content')}>
              <FontAwesomeIcon icon={faPercent} size="3x" />
              <h2>Discounts</h2>
            </div>
            <div className="add-item-container" onClick={() => openModal('Users Content')}>
              <FontAwesomeIcon icon={faUsers} size="3x" />
              <h2>Users</h2>
            </div>
            <div className="add-item-container" onClick={() => openModal('Orders Content')}>
              <FontAwesomeIcon icon={faShoppingCart} size="3x" />
              <h2>Orders</h2>
            </div>
            <div className="add-item-container" onClick={() => openModal('Statistics Content')}>
              <FontAwesomeIcon icon={faChartBar} size="3x" />
              <h2>Statistics</h2>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Content Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-button" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <div>{modalContent}</div>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
