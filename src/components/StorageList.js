import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StorageList.css';

const StorageList = () => {
  const [storages, setStorages] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [storageDetails, setStorageDetails] = useState([]);

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/storages');
        setStorages(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching storages:', error);
      }
    };

    fetchStorages();
  }, []);

  const handleStorageClick = async (sid) => {
    try {
      const response = await axios.get(`http://localhost:5000/storages/${sid}`);
      console.log('Selected Storage:', response.data);
      setSelectedStorage(response.data[0]);
      const detailsResponse = await axios.get(`http://localhost:5000/storage_details?sid=${sid}`);
      setStorageDetails(detailsResponse.data);
      console.log('Storage Details:', detailsResponse.data);
    } catch (error) {
      console.error('Error fetching storage details:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedStorage(null); // Reset selectedStorage to hide detailed view
    setStorageDetails([]); // Clear storage details
  };

  return (
    <div className="storage-list-container">
      {!selectedStorage && (
        <div className="inner">
          <h2>Storages</h2>
          <table className="storage-list">
            <thead>
              <tr>
                <th>Storage ID</th>
                <th>Name</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {storages.map((storage) => (
                <tr key={storage.sid} onClick={() => handleStorageClick(storage.sid)}>
                  <td>{storage.sid}</td>
                  <td>{storage.name}</td>
                  <td>{storage.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStorage && (
        <div className="storage-details">
          <button className="close" onClick={handleCloseDetail}>Close</button>
          <h3>Storage Details</h3>
          {selectedStorage ? (
            <>
              <p><strong>Storage ID:</strong> {selectedStorage.sid}</p>
              <p><strong>Name:</strong> {selectedStorage.name}</p>
              <p><strong>Location:</strong> {selectedStorage.location}</p>
              <table className="item-details">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Item Name</th>
                    <th>Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {storageDetails.map((item) => (
                    <tr key={item.serial_number}>
                      <td>{item.serial_number}</td>
                      <td>{item.item_name}</td>
                      <td>{item.stock}</td>
                      <td>{item.price}</td>
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

export default StorageList;
