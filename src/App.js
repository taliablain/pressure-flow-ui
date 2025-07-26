import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const products = ["PETROL", "DIESEL", "KEROSENE", "PARAFFIN"];

  return (
    <div className="control-interface">
      {/* Header */}
      <div className="header">
        <div className="header-left"></div>
        <div className="header-center">
          <h1>OIL SEPARATION REFINERY</h1>
        </div>
        <div className="header-right">
          <div className="datetime">{formatDateTime(currentTime)}</div>
        </div>
      </div>

      {/* Main Distillation Layout */}
      <div className="distillation-container">
        {products.map((product, index) => (
          <div key={product} className="product-column">
            <div className="product-label">{product}</div>
            <div className="product-circle">
              <div className="measurement-boxes">
                <div className="measurement-box temperature">
                  <span className="measurement-value">25.0</span>
                  <span className="measurement-unit">°C</span>
                </div>
                <div className="measurement-box pressure">
                  <span className="measurement-value">1.2</span>
                  <span className="measurement-unit">bar</span>
                </div>
              </div>
            </div>
            <div className="connection-line">
              <div className="arrow-down"></div>
            </div>
            <div className="collection-trap"></div>
          </div>
        ))}

        {/* Fifth circle with CRACKER label */}
<div className="product-column">
  <div className="product-label">CRACKER</div>
  <div className="product-circle">
    <div className="measurement-boxes">
      <div className="measurement-box temperature">
        <span className="measurement-value">650.0</span>
        <span className="measurement-unit">°C</span>
      </div>
    </div>
  </div>
</div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="logo">
          <img src="/renovari-logo.png" alt="Renovari" className="logo-image" />
        </div>
      </div>
    </div>
  );
}

export default App;
