// Add imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemsList.css';

const ItemsList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/items/${itemId}`);
      // After successful deletion, fetch the updated items list
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className={`items-list-container ${items.length > 15 ? 'scrollable' : ''}`}>
      <h2>Items List</h2>
      <table className="items-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sub-category</th>
            <th>Toggle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.iid}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.category_name}</td>
              <td>{item.subcategory_name}</td>
              <td>{item.toggle ? 'True' : 'False'}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(item.iid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsList;
