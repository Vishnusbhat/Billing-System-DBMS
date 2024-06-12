import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './SignUp.css'; // Import the CSS file
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook instead of useHistory

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users/signup', {
        username,
        password,
        phoneNumber,
        email
      });
      console.log(response.data);
      navigate('/'); // Redirect to the login page after successful signup
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.'); // Display error message if signup fails
    }
  };

  return (
    <div className="cover">
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="signup_button">Sign Up</button>
      </form>
    </div>
    </div>
  );
};

export default SignUp;
