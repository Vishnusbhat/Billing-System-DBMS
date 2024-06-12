import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';

const Statistics = () => {
  const [stores, setStores] = useState([]);
  const [bills, setBills] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    store: '',
    startDate: '',
    endDate: '',
    startPrice: 0,
    endPrice: 1000000,
  });

  // Fetch stores once on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  // Fetch bills and invoices when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billResponse, invoiceResponse] = await Promise.all([
          axios.get('http://localhost:5000/bills/filter', {
            params: {
              store: filters.store,
              startDate: filters.startDate,
              endDate: filters.endDate,
              startPrice: filters.startPrice,
              endPrice: filters.endPrice,
            },
          }),
          axios.get('http://localhost:5000/invoices/filter', {
            params: {
              store: filters.store,
              startDate: filters.startDate,
              endDate: filters.endDate,
              startPrice: filters.startPrice,
              endPrice: filters.endPrice,
            },
          }),
        ]);

        setBills(billResponse.data);
        setInvoices(invoiceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="statistics-container">
      <div className="filter-section">
        <h2>Filter Options</h2>
        <div className="filter-item">
          <label htmlFor="store">Store:</label>
          <select id="store" name="store" value={filters.store} onChange={handleFilterChange}>
            <option value="">All</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-item">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-item">
          <label>Start Price:</label>
          <input
            type="number"
            name="startPrice"
            value={filters.startPrice}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-item">
          <label>End Price:</label>
          <input
            type="number"
            name="endPrice"
            value={filters.endPrice}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="statistics-section">
        <h2>Bills</h2>
        <table className="statistics-list">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Store</th>
              <th>Location</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
          {bills.map((bill) => (
              <tr >
                <td>{bill.bid}</td>
                <td>{bill.name}</td>
                <td>{bill.location}</td>
                <td>{new Date(bill.transaction_date).toLocaleDateString()}</td>
                <td>{bill.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Invoices</h2>
        <table className="statistics-list">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Store</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.iid}>
                <td>{invoice.iid}</td>
                <td>{invoice.store}</td>
                <td>{invoice.name}</td>
                <td>{new Date(invoice.transaction_date).toLocaleDateString()}</td>
                <td>{invoice.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
