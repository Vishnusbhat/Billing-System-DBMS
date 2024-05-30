// src/components/AboutPage.js
import AddItemForm from './AddItemForm';
import React from 'react';
import './AboutPage.css'; // Import the CSS file for the AboutPage component

const AboutPage = () => {
  return (
    <div className="about-page"> {/* Apply the CSS class */}
      <h2>About Us</h2>
      <p>This is the About page. Add your content here.</p>
      <AddItemForm/>
    </div>
  );
};

export default AboutPage;
