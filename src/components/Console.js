import React, { useState } from "react";
import "./Console.css";
import axios from "axios";

const Console = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  // Function to handle query submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/console", { text: query });
      setResult(response.data); // Update the result state with the data received from the server
    } catch (error) {
      console.error("Error fetching result:", error);
    }
  };

  // Function to handle input change
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="console-container">
      <h2>Query Console</h2>
      <div className="input-container">
        <input
          type="text"
          className="query-input"
          placeholder="Enter your SQL query here..."
          value={query}
          onChange={handleChange}
        />
        <button className="query-button" onClick={handleSubmit}>
          Execute
        </button>
      </div>
      <div className="result-container">
        {result.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(result[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-result">No result to display</p>
        )}
      </div>
    </div>
  );
};

export default Console;
