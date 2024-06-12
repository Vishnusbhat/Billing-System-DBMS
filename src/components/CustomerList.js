import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = async (cid) => {
    try {
      const response = await axios.get(`http://localhost:5000/customers/${cid}`);
      console.log('Selected Customer:', response.data);
      setSelectedCustomer(response.data[0]);
      const detailsResponse = await axios.get(`http://localhost:5000/customers/details/${cid}`);
      console.log('Customer Details:', detailsResponse.data);
      setCustomerDetails(detailsResponse.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedCustomer(null); // Reset selectedCustomer to hide detailed view
    setCustomerDetails([]); // Clear customer details
  };

  return (
    <div className="customer-list-container">
      {!selectedCustomer && (
        <div className="inner">
          <h2>Customers</h2>
          <table className="customer-list">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.cid} onClick={() => handleCustomerClick(customer.cid)}>
                  <td>{customer.cid}</td>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCustomer && (
        <div className="customer-detail">
          <button className="close" onClick={handleCloseDetail}>Close</button>
          <h3>Customer Details</h3>
          {selectedCustomer ? (
            <>
              <p><strong>Customer ID:</strong> {selectedCustomer.cid}</p>
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <table className="item-details">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customerDetails.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
