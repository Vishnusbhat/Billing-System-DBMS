import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import './NewInvoice.css';

const NewInvoice = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedStore, setSelectedStore] = useState(null); // New state for selected store
  const [stores, setStores] = useState([]); // New state for stores

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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/stores`);
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  

  const handleCustomerChange = async (newValue) => {
    setSelectedCustomer(newValue);

    if (newValue && newValue.__isNew__) {
      setCustomerPhone('');
      setCustomerEmail('');
    } else if (newValue) {
      try {
        const response = await axios.get(`http://localhost:5000/customers/${newValue.value}`);
        const customer = response.data;
        setCustomerPhone(customer.phone);
        setCustomerEmail(customer.email);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    } else {
      setCustomerPhone('');
      setCustomerEmail('');
    }
  };

  const handleCustomerSearch = async (inputValue) => {
    try {
      const response = await axios.get(`http://localhost:5000/customers/search?query=${inputValue}`);
      return response.data.map(customer => ({
        value: customer.cid,
        label: customer.name,
      }));
    } catch (error) {
      console.error('Error searching for customers:', error);
      return [];
    }
  };

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

      const customerDetails = selectedCustomer ? {
        id: selectedCustomer.value,
        name: selectedCustomer.label,
        phone: customerPhone,
        email: customerEmail
      } : {
        name: selectedCustomer ? selectedCustomer.label : '',
        phone: customerPhone,
        email: customerEmail
      };

      await axios.post('http://localhost:5000/invoices', {
        transaction_date: currentDate,
        amount,
        items: itemsToSend,
        customer: customerDetails,
        store: selectedStore // Add the selected store to the request
      });

      setSuccessMessage('Invoice added successfully');
      setErrorMessage('');
      setSearchQuery('');
      setSearchResults([]);
      setSelectedItems([]);
      setTotalCost(0);
      setQuantity(1);
      setSelectedCustomer(null);
      setCustomerPhone('');
      setCustomerEmail('');
      setSelectedStore(null); // Reset selected store after submission
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error adding invoice. Please try again.');
      console.error('Error adding invoice:', error);
    }
  };

  const handleAddItem = (item) => {
    const existingItemIndex = selectedItems.findIndex(selectedItem => selectedItem.iid === item.iid);

    if (existingItemIndex !== -1) {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[existingItemIndex].quantity += quantity;
      setSelectedItems(updatedSelectedItems);
    } else {
      const newItem = { ...item, quantity, price: item.price, iid: item.iid };
      setSelectedItems([...selectedItems, newItem]);
    }

    const updatedTotalCost = selectedItems.reduce((total, selectedItem) => total + (selectedItem.price * selectedItem.quantity), 0);
    setTotalCost(updatedTotalCost + item.price * quantity);

    setQuantity(1);
  };

  return (
    <div className="new-invoice-container">
      <div className="customer-details">
        <h2>Customer Details</h2>
        <CreatableSelect
          isClearable
          onChange={handleCustomerChange}
          loadOptions={handleCustomerSearch}
          value={selectedCustomer}
          placeholder="Search for a customer..."
        />
        {selectedCustomer && selectedCustomer.__isNew__ && (
          <div className="new-customer-details">
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone"
            />
            <input
              type="text"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        )}
      </div>
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
          className="store-select"
        >
          <option value="" >Select Store</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
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
                <tr key={item.iid}>
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
      <div className="selected-items">
        <h2>Selected Items</h2>
        <table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Item</th>
              <th>Units/Quantity</th>
              <th>Cost per Unit</th>
              <th>Total Item Cost</th>
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
        <h3>Total Cost: {totalCost}</h3>
      </div>
      <button className="invoice-button" onClick={handleSubmit}>Submit Invoice</button>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default NewInvoice;
