// AddItemForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import './AddItemForm.css';

const AddItemForm = ({ onItemAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category');
        setCategories(response.data.map(category => ({ label: category.name, value: category.cid })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async (selectedOption) => {
    setSelectedCategory(selectedOption);
    // Fetch subcategories based on selected category
    if (selectedOption) {
      fetchSubCategories(selectedOption.value);
    } else {
      setSubCategories([]);
    }
  };

  const fetchSubCategories = async (cid) => {
    try {
      const response = await axios.get(`http://localhost:5000/category/${cid}/subcat`);
      setSubCategories(response.data.map(subCategory => ({ label: subCategory.name, value: subCategory.scid })));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCreateCategory = async (inputValue) => {
    try {
      const response = await axios.post('http://localhost:5000/category', { name: inputValue });
      const newCategory = { label: response.data.name, value: response.data.cid };
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleCreateSubCategory = async (inputValue) => {
    try {
      const response = await axios.post(`http://localhost:5000/category/${selectedCategory.value}/subcat`, { name: inputValue });
      const newSubCategory = { label: response.data.name, value: response.data.scid };
      setSubCategories([...subCategories, newSubCategory]);
      setSelectedSubCategory(newSubCategory);
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubCategory) {
      setErrorMessage('Please select both category and subcategory');
      return;
    }
    try {
      await axios.post('http://localhost:5000/items', {
        name,
        price,
        toggle,
        subcat_id: selectedSubCategory.value
      });
      setSuccessMessage('Item added successfully');
      setErrorMessage('');
      setName('');
      setPrice('');
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setToggle(false);
      onItemAdded(); // Trigger the parent component to fetch the updated list
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error adding item. Please try again.');
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="add-item-form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          Category:
          <CreatableSelect
            isClearable
            value={selectedCategory}
            onChange={handleCategoryChange}
            onCreateOption={handleCreateCategory}
            options={categories}
            placeholder="Select or create category"
          />
        </label>
        <label>
          Subcategory:
          <CreatableSelect
            isClearable
            value={selectedSubCategory}
            onChange={setSelectedSubCategory}
            onCreateOption={handleCreateSubCategory}
            options={subCategories}
            placeholder="Select or create subcategory"
          />
        </label>
        <label className="toggle-label">
          Toggle:
          <input type="checkbox" checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
        </label>
        <button type="submit" className="submit-button">Add Item</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default AddItemForm;
