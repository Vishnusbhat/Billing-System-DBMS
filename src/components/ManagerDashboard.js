import React, { useState } from 'react';
import UserNavbar from './UserNavbar';
import Background from './Background';
import InvoiceList from './Invoicelist';
import StorageList from './StorageList';
import Modal from 'react-modal';
import StoreList from './Storelist';
import CustomerList from './CustomerList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faFileInvoice, faStore, faWarehouse, faPercent, faUsers, faShoppingCart, faChartBar, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ManagerDashboard.css'; // Import CSS for ManagerDashboard
import BillList from './Billlist'; // Import BillList component
import Statistics from './Statistics';
import UserList from './UserList';
import ManagSideBar from './ManagSideBar';


// Set app element for accessibility
Modal.setAppElement('#root');

const ManagerDashboard = () => {
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
    <div className="manager-dashboard">
      <Background />
      <ManagSideBar />
      <UserNavbar /> 
      <div className="dashboard-content">
        <main>
          {/* Card */}
          <h1 className="dashboard-heading">Welcome, Manager!</h1>
          {/* New Row */}
          <div className="dashboard-card-container">
          <div className="dashboard-add-item-container" onClick={() => openModal(<BillList />)}> {/* Render BillList component */}
              <FontAwesomeIcon icon={faFileInvoiceDollar} size="3x" />
              <h2>Bills</h2>
            </div>
            <div className="dashboard-add-item-container" onClick={() => openModal(<InvoiceList />)}>
              <FontAwesomeIcon icon={faFileInvoice} size="3x" />
              <h2>Invoices</h2>
            </div>
            <div className="dashboard-add-item-container" onClick={() => openModal(<CustomerList/>)}>
              <FontAwesomeIcon icon={faUsers} size="3x" />
              <h2>Customers</h2>
            </div>
            <div className="dashboard-add-item-container" onClick={() => openModal(<Statistics/>)}>
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
        className="ManagerModal"
        overlayClassName="ManagerOverlay"
      >
        <button className="close-button-md" onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <div>{modalContent}</div>
      </Modal>
    </div>
  );
}

export default ManagerDashboard;
