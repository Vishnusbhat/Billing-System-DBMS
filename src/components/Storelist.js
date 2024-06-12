import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StoreList.css';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeDetails, setStoreDetails] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stores');
        setStores(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const handleStoreClick = async (sid) => {
    try {
      const response = await axios.get(`http://localhost:5000/stores/${sid}`);
      console.log('Selected Store:', response.data[0]);
      setSelectedStore(response.data[0]);
      const detailsResponse = await axios.get(`http://localhost:5000/stores/details/${sid}`);
      setStoreDetails(detailsResponse.data);
      console.log('Store Details:', detailsResponse.data);
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedStore(null); // Reset selectedStore to hide detailed view
    setStoreDetails([]); // Clear store details
  };

  return (
    <div className="store-list-container">
      {!selectedStore && (
        <div className="inner">
          <h2>Stores</h2>
          <table className="store-list">
            <thead>
              <tr>
                <th>Store ID</th>
                <th>Name</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.bid} onClick={() => handleStoreClick(store.bid)}>
                  <td>{store.bid}</td>
                  <td>{store.name}</td>
                  <td>{store.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStore && (
        <div className="store-details">
          <button className="close" onClick={handleCloseDetail}>Close</button>
          <h3>Store Details</h3>
          {selectedStore ? (
            <>
              <p><strong>Store ID:</strong> {selectedStore.bid}</p>
              <p><strong>Name:</strong> {selectedStore.name}</p>
              <p><strong>Location:</strong> {selectedStore.location}</p>
              <table className="item-details">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {storeDetails.map((item) => (
                    <tr key={item.bid}>
                      <td>{item.bid}</td>
                      <td>{item.amount}</td>
                      <td>{new Date(item.transaction_date).toLocaleDateString()}</td>
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

export default StoreList;
