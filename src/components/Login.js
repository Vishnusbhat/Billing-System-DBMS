import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './Login.css'; // Import the CSS file
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook instead of useHistory

  const fetchRole = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/role/${username}`);
      console.log(response.data[0].role);
      if (password !== response.data[0].password){
        console.log("wrong password!");
        return null;
      }
      return response.data[0].role; // Assuming the response contains the role information
    } catch (error) {
      console.error('Error fetching user user:', error);
      return null; // Return null if there's an error
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    const userRole = await fetchRole(username);
    console.log(userRole);
  
    if (userRole === ('Admin' || 'admin')) {
      navigate('/admin');
    } else if (userRole === ('Manager' || 'manager') ) {
      navigate('/manager');
    } else if (userRole === ('user' || 'User')) {
      navigate('/user');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Login;
