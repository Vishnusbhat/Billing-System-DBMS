import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './components/UserDashBoard';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ItemsList from './components/ItemsList';
import AddItemForm from './components/AddItemForm';
import Background from './components/Background';
import Home from './components/Home';
import AboutPage from './components/AboutPage';
import UserNavbar from './components/UserNavbar';
import SignUp from './components/SignUp';
import Sidebar from './components/Sidebar'; // Import Sidebar component

import ManagerDashboard from './components/ManagerDashboard';

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin/home" element={<Home />} />
        <Route 
          path="/add-item" 
          element={<AddItemForm onItemAdded={fetchItems} />} 
        />
        <Route 
          path="/items" 
          element={<ItemsList items={items} fetchItems={fetchItems} />} 
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/users" element={<UserNavbar />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-user" element={<div>Add User</div>} />
        <Route path="/admin" element={<Sidebar fetchItems={fetchItems} />} />
      </Routes>
    </Router>
  );
}

export default App;
