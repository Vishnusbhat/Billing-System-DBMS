import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Newbill.css';

const NewBill = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      // Automatically generate date and time
      const currentDate = new Date().toISOString();
      
      // Calculate the total amount of the bill
      const amount = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Prepare items array to be sent to the server
      const itemsToSend = selectedItems.map(item => ({
        item_id: item.iid,
        count: item.quantity,
        total: item.price * item.quantity
      }));

      // Send the bill data to the server
      await axios.post('http://localhost:5000/bills', {
        transaction_date: currentDate,
        amount,
        items: itemsToSend
      });

      setSuccessMessage('Bill added successfully');
      setErrorMessage('');
      setSearchQuery('');
      setSearchResults([]);
      setSelectedItems([]);
      setQuantity(1);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error adding bill. Please try again.');
      console.error('Error adding bill:', error);
      console.log(errorMessage);
    }
  };

  const handleAddItem = (item) => {
    // Check if the item already exists in selectedItems
    const existingItemIndex = selectedItems.findIndex(selectedItem => selectedItem.iid === item.iid);
  
    if (existingItemIndex !== -1) {
      // Item already exists, update the quantity
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[existingItemIndex].quantity += quantity;
      setSelectedItems(updatedSelectedItems);
    } else {
      // Item does not exist, add it to selectedItems
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
              <th>Discount</th>
              <th>Item Cost</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
                <td>{item.discount}</td>
                <td>{item.cost * item.quantity}</td>
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
