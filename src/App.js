import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  // Start at a random temperature within the range instead of always 650
  const [crackerTemp, setCrackerTemp] = useState(() => {
    return Math.round((650 + Math.random() * 100) * 10) / 10; // Random between 650-750
  });
  // Start pressure around 1.0 bar with slight variation
  const [crackerPressure, setCrackerPressure] = useState(() => {
    return Math.round((0.9 + Math.random() * 0.2) * 10) / 10; // Random between 0.9-1.1
  });
  const [cycleStartTime, setCycleStartTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tempTimer = setInterval(() => {
      console.log('Temperature update triggered at:', new Date().toLocaleTimeString()); // Debug log
      const now = Date.now();
      const elapsed = now - cycleStartTime; // Time elapsed in milliseconds
      const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      
      // Reset cycle after 3 hours
      if (elapsed >= threeHours) {
        setCycleStartTime(now);
        return;
      }
      
      // Calculate position in the 3-hour cycle (0 to 1)
      const cycleProgress = elapsed / threeHours;
      
      // Create multiple overlapping sine waves for more complex fluctuation
      const primaryWave = Math.sin(cycleProgress * 6 * Math.PI); // 3 complete cycles over 3 hours
      const secondaryWave = Math.sin(cycleProgress * 14 * Math.PI) * 0.3; // Faster smaller fluctuations
      const tertiaryWave = Math.cos(cycleProgress * 22 * Math.PI) * 0.15; // Even faster micro-fluctuations
      
      // Combine waves for complex, realistic fluctuation pattern
      const combinedWave = primaryWave + secondaryWave + tertiaryWave;
      
      // Map combined wave to temperature range (650 to 750)
      const baseTemp = 700; // Middle of range
      const tempRange = 45; // ±45 degrees from base (slightly reduced for more realistic bounds)
      const targetTemp = baseTemp + (combinedWave * tempRange);
      
      // Ensure target temperature stays within bounds
      const clampedTargetTemp = Math.max(650, Math.min(750, targetTemp));
      
      // Gradual change towards target - max 0.4 degree change per update
      setCrackerTemp(prevTemp => {
        const difference = clampedTargetTemp - prevTemp;
        const maxChange = 0.4; // Maximum degrees change per 2-second interval
        
        let change;
        if (Math.abs(difference) <= maxChange) {
          change = difference; // If close enough, go directly to target
        } else {
          change = difference > 0 ? maxChange : -maxChange; // Gradual approach
        }
        
        // Add tiny random variation (±0.08 degrees) for realism
        const randomVariation = (Math.random() - 0.5) * 0.16;
        const newTemp = prevTemp + change + randomVariation;
        
        // Final bounds check and round to 1 decimal place
        const finalTemp = Math.max(650, Math.min(750, newTemp));
        return Math.round(finalTemp * 10) / 10;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(tempTimer);
  }, [cycleStartTime]);

  const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const products = ['PETROL', 'DIESEL', 'KEROSENE', 'PARAFFIN'];

  return (
    <div className="control-interface">
      {/* Header */}
      <div className="header">
        <div className="header-left">
        </div>
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
                
        {/* Fifth circle with CRACKER label and dynamic temperature and pressure */}
        <div className="product-column">
          <div className="product-label">CRACKER</div>
          <div className="product-circle">
            <div className="measurement-boxes">
              <div className="measurement-box temperature">
                <span className="measurement-value">{crackerTemp}</span>
                <span className="measurement-unit">°C</span>
              </div>
              <div className="measurement-box pressure">
                <span className="measurement-value">{crackerPressure.toFixed(1)}</span>
                <span className="measurement-unit">bar</span>
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