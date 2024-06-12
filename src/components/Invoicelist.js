import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Invoicelist.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceClick = async (invoiceId) => {
    try {
      console.log(invoiceId);

      const response = await axios.get(`http://localhost:5000/invoices/${invoiceId}`);
      setSelectedInvoice(response.data[0]);
      console.log("Selected Invoice:", selectedInvoice);

      const detailsResponse = await axios.get(`http://localhost:5000/invoices/details`, {
        params: { Invoiceid: invoiceId }
      });
      console.log("Invoice Details:", detailsResponse.data);
      setInvoiceDetails(detailsResponse.data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedInvoice(null); // Reset selectedInvoice to hide detailed view
    setInvoiceDetails([]); // Clear invoice details
  };

  return (
    <div className="invoice-list-container">
      {!selectedInvoice ? (
        <div className="inner">
          <h2>Invoices</h2>
          <table className="invoice-list">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={invoice.invoice_id} onClick={() => handleInvoiceClick(invoice.invoice_id)}>
                  <td>{index + 1}</td>
                  <td>{invoice.invoice_id}</td>
                  <td>{new Date(invoice.transaction_date).toLocaleDateString()}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.customer_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="invoice-details">
          <button className="close" onClick={handleCloseDetail}>Close</button>
          <h3>Invoice Details</h3>
          <p><strong>Invoice ID:</strong> {selectedInvoice.iid}</p>
          <p><strong>Amount:</strong> {selectedInvoice.amount}</p>
          <p><strong>Customer ID:</strong> {selectedInvoice.cid}</p>
          <p><strong>Customer Name:</strong> {selectedInvoice.name}</p>
          <p><strong>Date:</strong> {new Date(selectedInvoice.transaction_date).toLocaleDateString()}</p>
          <p><strong>Store:</strong> {selectedInvoice.store}</p>
          <table className="item-details">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Item Name</th>
                <th>Count</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
