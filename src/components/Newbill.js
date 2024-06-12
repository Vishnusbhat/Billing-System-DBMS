import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Newbill.css';

const NewBill = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedStore, setSelectedStore] = useState('');
  const [stores, setStores] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/items/suggestions?query=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchSuggestions();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString();
      const amount = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      const itemsToSend = selectedItems.map(item => ({
        item_id: item.iid,
        count: item.quantity,
        total: item.price * item.quantity
      }));

      await axios.post('http://localhost:5000/bills', {
        transaction_date: currentDate,
        amount,
        items: itemsToSend,
        store: selectedStore
      });

      setSuccessMessage('Bill added successfully');
      setErrorMessage('');
      setSearchQuery('');
      setSearchResults([]);
      setSelectedItems([]);
      setQuantity(1);
      setSelectedStore('');
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error adding bill. Please try again.');
      console.error('Error adding bill:', error);
    }
  };

  const handleAddItem = (item) => {
    const existingItemIndex = selectedItems.findIndex(selectedItem => selectedItem.iid === item.iid);

    if (existingItemIndex !== -1) {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[existingItemIndex].quantity += quantity;
      setSelectedItems(updatedSelectedItems);
    } else {
      const newItem = { ...item, quantity, cost: item.cost, iid: item.iid };
      setSelectedItems([...selectedItems, newItem]);
    }

    setQuantity(1);
  };

  return (
    <div className="new-bill-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          <option value="">Select a store</option>
          {stores.map(store => (
            <option key={store.bid} value={store.bid}>{store.name}</option>
          ))}
        </select>
        <button className="add-button" onClick={handleSubmit}>Bill</button>
      </div>
      <div className="selected-items">
        <h2>Selected Items</h2>
        <table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Item</th>
              <th>Units/Quantity</th>
              <th>Cost</th>
              <th>Item Cost</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="search-results">
        {searchResults.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleAddItem(item)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default NewBill;
