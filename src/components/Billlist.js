import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Billlist.css';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billDetails, setBillDetails] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bills');
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, []);

  const handleBillClick = async (bid) => {
    try {
      const response = await axios.get(`http://localhost:5000/bills/${bid}`);
      console.log('Selected Bill:', response.data);
      setSelectedBill(response.data[0]);
      const detailsResponse = await axios.get(`http://localhost:5000/bills/details/?bid=${bid}`, {
        // params:{bid: bid}
      });
      console.log('Bill Details:', detailsResponse.data);
      setBillDetails(detailsResponse.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedBill(null); // Reset selectedBill to hide detailed view
    setBillDetails([]); // Clear bill details
  };

  return (
    <div className="bill-list-container">
      {!selectedBill && (
        <div className="inner">
          <h2>Bills</h2>
          <table className="bill-list">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.bid} onClick={() => handleBillClick(bill.bid)}>
                  <td>{bill.bid}</td>
                  <td>{bill.amount}</td>
                  <td>{new Date(bill.transaction_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBill && (
        <div className="bill-details">
          <button className="close" onClick={handleCloseDetail}>Close</button>
          <h3>Bill Details</h3>
          {selectedBill ? (
            <>
              <p><strong>Bill ID:</strong> {selectedBill.bid}</p>
              <p><strong>Amount:</strong> {selectedBill.amount}</p>
              <p><strong>Date:</strong> {new Date(selectedBill.transaction_date).toLocaleDateString()}</p>
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
                  {billDetails.map((item) => (
                    <tr key={item.serial_number}>
                      <td>{item.serial_number}</td>
                      <td>{item.item_name}</td>
                      <td>{item.count}</td>
                      <td>{item.total}</td>
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

export default BillList;
