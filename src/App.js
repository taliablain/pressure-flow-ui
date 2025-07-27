import { useState, useEffect } from "react";
import "./App.css";
import smallLogo from "./small-logo.jpeg";

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
  // Start paraffin temperature between 300-320
  const [paraffinTemp, setParaffinTemp] = useState(() => {
    return Math.round((300 + Math.random() * 20) * 10) / 10; // Random between 300-320
  });
  // Start paraffin pressure at 1.0 bar (stays mostly constant)
  const [paraffinPressure, setParaffinPressure] = useState(1.0);
  // Start kerosene temperature between 250-300
  const [keroseneTemp, setKeroseneTemp] = useState(() => {
    return Math.round((250 + Math.random() * 50) * 10) / 10; // Random between 250-300
  });
  // Start kerosene pressure around 1.0 bar
  const [kerosenePressure, setKerosenePressure] = useState(() => {
    return Math.round((0.9 + Math.random() * 0.2) * 10) / 10; // Random between 0.9-1.1
  });
  // Start diesel temperature between 150-250
  const [dieselTemp, setDieselTemp] = useState(() => {
    return Math.round((150 + Math.random() * 100) * 10) / 10; // Random between 150-250
  });
  // Start diesel pressure around 1.0 bar
  const [dieselPressure, setDieselPressure] = useState(() => {
    return Math.round((0.9 + Math.random() * 0.2) * 10) / 10; // Random between 0.9-1.1
  });
  // Start petrol temperature between 30-40
  const [petrolTemp, setPetrolTemp] = useState(() => {
    return Math.round((30 + Math.random() * 10) * 10) / 10; // Random between 30-40
  });
  // Start petrol pressure around 1.0 bar
  const [petrolPressure, setPetrolPressure] = useState(() => {
    return Math.round((0.95 + Math.random() * 0.1) * 10) / 10; // Random between 0.95-1.05
  });
  const [cycleStartTime, setCycleStartTime] = useState(Date.now());

  const [dieselFlowRate, setDieselFlowRate] = useState(30);
  const [keroseneFlowRate, setKeroseneFlowRate] = useState(15);
  const [paraffinFlowRate, setParaffinFlowRate] = useState(6);
  const [petrolFlowRate, setPetrolFlowRate] = useState(12);

  // Function to check and adjust pressures to prevent more than 2 identical values
  const adjustPressuresForCollisions = (newPressures) => {
    const pressureValues = Object.values(newPressures);
    const pressureCounts = {};

    // Count occurrences of each pressure value
    pressureValues.forEach((pressure) => {
      const key = pressure.toFixed(1);
      pressureCounts[key] = (pressureCounts[key] || 0) + 1;
    });

    // Find pressures that appear more than twice
    const problematicPressures = Object.keys(pressureCounts).filter(
      (pressure) => pressureCounts[pressure] > 2,
    );

    if (problematicPressures.length === 0) {
      return newPressures;
    }

    // Create adjusted pressures
    const adjustedPressures = { ...newPressures };

    // For each problematic pressure, adjust some instances
    problematicPressures.forEach((problematicPressure) => {
      const pressureValue = parseFloat(problematicPressure);
      const keys = Object.keys(adjustedPressures).filter(
        (key) => adjustedPressures[key].toFixed(1) === problematicPressure,
      );

      // Keep only 2 instances, adjust the rest
      const keysToAdjust = keys.slice(2);

      keysToAdjust.forEach((key, index) => {
        let adjustmentAttempts = 0;
        let newValue;

        do {
          // Try small adjustments first, then larger ones if needed
          const baseAdjustment = adjustmentAttempts < 5 ? 0.1 : 0.2;
          const adjustment = (Math.random() - 0.5) * baseAdjustment * 2;
          newValue = pressureValue + adjustment;

          // Apply bounds based on the key (component type)
          switch (key) {
            case "cracker":
              newValue = Math.max(0.5, Math.min(1.5, newValue));
              break;
            case "paraffin":
              newValue = Math.max(0.85, Math.min(1.15, newValue));
              break;
            case "kerosene":
              newValue = Math.max(0.5, Math.min(1.5, newValue));
              break;
            case "diesel":
              newValue = Math.max(0.5, Math.min(1.5, newValue));
              break;
            case "petrol":
              newValue = Math.max(0.9, Math.min(1.1, newValue));
              break;
            default:
              newValue = Math.max(0.5, Math.min(1.5, newValue));
          }

          newValue = Math.round(newValue * 10) / 10;
          adjustmentAttempts++;
        } while (
          Object.values(adjustedPressures).filter(
            (p) => p.toFixed(1) === newValue.toFixed(1),
          ).length >= 2 &&
          adjustmentAttempts < 10
        );

        adjustedPressures[key] = newValue;
      });
    });

    return adjustedPressures;
  };

  // Function to enforce temperature hierarchy: Cracker > Paraffin > Kerosene > Diesel > Petrol
  const enforceTemperatureHierarchy = (temperatures) => {
    const adjustedTemps = { ...temperatures };
    const minGap = 0.5; // Minimum temperature difference between levels

    // Sort components by hierarchy (highest to lowest)
    const hierarchy = ["cracker", "paraffin", "kerosene", "diesel", "petrol"];

    // Enforce hierarchy from top to bottom
    for (let i = 1; i < hierarchy.length; i++) {
      const current = hierarchy[i];
      const above = hierarchy[i - 1];

      // If current temp is >= above temp, adjust it down
      if (adjustedTemps[current] >= adjustedTemps[above]) {
        adjustedTemps[current] = adjustedTemps[above] - minGap;

        // Apply component-specific bounds after adjustment
        switch (current) {
          case "paraffin":
            adjustedTemps[current] = Math.max(
              300,
              Math.min(350, adjustedTemps[current]),
            );
            break;
          case "kerosene":
            adjustedTemps[current] = Math.max(
              250,
              Math.min(300, adjustedTemps[current]),
            );
            break;
          case "diesel":
            adjustedTemps[current] = Math.max(
              150,
              Math.min(250, adjustedTemps[current]),
            );
            break;
          case "petrol":
            adjustedTemps[current] = Math.max(
              30,
              Math.min(40, adjustedTemps[current]),
            );
            break;
        }

        // Round to 1 decimal place
        adjustedTemps[current] = Math.round(adjustedTemps[current] * 10) / 10;
      }
    }

    return adjustedTemps;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tempTimer = setInterval(() => {
      console.log(
        "Temperature update triggered at:",
        new Date().toLocaleTimeString(),
      ); // Debug log
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

      // CRACKER TEMPERATURE CALCULATION
      // Create multiple overlapping sine waves for more complex fluctuation
      const primaryWave = Math.sin(cycleProgress * 6 * Math.PI); // 3 complete cycles over 3 hours
      const secondaryWave = Math.sin(cycleProgress * 14 * Math.PI) * 0.3; // Faster smaller fluctuations
      const tertiaryWave = Math.cos(cycleProgress * 22 * Math.PI) * 0.15; // Even faster micro-fluctuations

      // Combine waves for complex, realistic fluctuation pattern
      const combinedWave = primaryWave + secondaryWave + tertiaryWave;

      // Map combined wave to temperature range (650 to 750)
      const baseTemp = 700; // Middle of range
      const tempRange = 45; // ±45 degrees from base (slightly reduced for more realistic bounds)
      const targetTemp = baseTemp + combinedWave * tempRange;

      // Ensure target temperature stays within bounds
      const clampedTargetTemp = Math.max(650, Math.min(750, targetTemp));

      // CRACKER PRESSURE CALCULATION
      // Very slow fluctuation - one complete cycle over 3 hours, stays mostly around 1.0 bar
      const pressureWave = Math.sin(cycleProgress * 2 * Math.PI) * 0.8; // Slow sine wave
      const pressureMicroWave = Math.sin(cycleProgress * 8 * Math.PI) * 0.1; // Small variations

      // Target pressure between 0.5 and 1.5 bar, but biased toward 1.0 bar
      const basePressure = 1.0;
      const pressureRange = 0.3; // ±0.3 from base, but we'll add bias
      const targetPressure =
        basePressure +
        pressureWave * pressureRange +
        pressureMicroWave * pressureRange;

      // Ensure pressure stays within bounds (0.5 to 1.5)
      const clampedTargetPressure = Math.max(
        0.5,
        Math.min(1.5, targetPressure),
      );

      // PARAFFIN TEMPERATURE CALCULATION (using same pattern as cracker)
      // Create multiple overlapping sine waves for paraffin (different frequencies)
      const paraffinPrimaryWave = Math.sin(cycleProgress * 4 * Math.PI); // 2 complete cycles over 3 hours
      const paraffinSecondaryWave =
        Math.sin(cycleProgress * 12 * Math.PI) * 0.3; // Faster smaller fluctuations
      const paraffinTertiaryWave =
        Math.cos(cycleProgress * 18 * Math.PI) * 0.15; // Even faster micro-fluctuations

      // Combine waves for complex, realistic fluctuation pattern
      const paraffinCombinedWave =
        paraffinPrimaryWave + paraffinSecondaryWave + paraffinTertiaryWave;

      // Map combined wave to paraffin temperature range (300 to 320, occasionally up to 350)
      const paraffinBaseTemp = 310; // Middle of range
      const paraffinTempRange = 8; // ±8 degrees from base (302-318 typical)
      let paraffinTargetTemp =
        paraffinBaseTemp + paraffinCombinedWave * paraffinTempRange;

      // Occasionally allow spikes (5% chance)
      if (Math.random() < 0.05) {
        paraffinTargetTemp += Math.random() * 25; // Add 0-25 degrees for spike
      }

      // Ensure paraffin temperature stays within bounds
      const clampedParaffinTargetTemp = Math.max(
        300,
        Math.min(350, paraffinTargetTemp),
      );

      // KEROSENE TEMPERATURE CALCULATION
      // Create multiple overlapping sine waves for kerosene (different frequencies)
      const kerosenePrimaryWave = Math.sin(cycleProgress * 3 * Math.PI); // 1.5 complete cycles over 3 hours
      const keroseneSecondaryWave =
        Math.sin(cycleProgress * 11 * Math.PI) * 0.3; // Faster smaller fluctuations
      const keroseneTertiaryWave =
        Math.cos(cycleProgress * 17 * Math.PI) * 0.15; // Even faster micro-fluctuations

      // Combine waves for complex, realistic fluctuation pattern
      const keroseneCombinedWave =
        kerosenePrimaryWave + keroseneSecondaryWave + keroseneTertiaryWave;

      // Map combined wave to kerosene temperature range (250 to 300)
      const keroseneBaseTemp = 275; // Middle of range
      const keroseneTempRange = 20; // ±20 degrees from base (255-295 typical)
      const keroseneTargetTemp =
        keroseneBaseTemp + keroseneCombinedWave * keroseneTempRange;

      // Ensure kerosene temperature stays within bounds
      const clampedKeroseneTargetTemp = Math.max(
        250,
        Math.min(300, keroseneTargetTemp),
      );

      // KEROSENE PRESSURE CALCULATION
      // Similar to cracker but different frequency
      const kerosenePressureWave =
        Math.sin(cycleProgress * 1.5 * Math.PI) * 0.7; // Slow sine wave
      const kerosenePressureMicroWave =
        Math.sin(cycleProgress * 7 * Math.PI) * 0.1; // Small variations

      // Target pressure between 0.5 and 1.5 bar
      const keroseneBasePressure = 1.0;
      const kerosenePressureRange = 0.4; // ±0.4 from base
      const keroseneTargetPressure =
        keroseneBasePressure +
        kerosenePressureWave * kerosenePressureRange +
        kerosenePressureMicroWave * kerosenePressureRange;

      // Ensure kerosene pressure stays within bounds (0.5 to 1.5)
      const clampedKeroseneTargetPressure = Math.max(
        0.5,
        Math.min(1.5, keroseneTargetPressure),
      );

      // DIESEL TEMPERATURE CALCULATION
      // Create multiple overlapping sine waves for diesel (different frequencies)
      const dieselPrimaryWave = Math.sin(cycleProgress * 2.5 * Math.PI); // 1.25 complete cycles over 3 hours
      const dieselSecondaryWave = Math.sin(cycleProgress * 10 * Math.PI) * 0.3; // Faster smaller fluctuations
      const dieselTertiaryWave = Math.cos(cycleProgress * 15 * Math.PI) * 0.15; // Even faster micro-fluctuations

      // Combine waves for complex, realistic fluctuation pattern
      const dieselCombinedWave =
        dieselPrimaryWave + dieselSecondaryWave + dieselTertiaryWave;

      // Map combined wave to diesel temperature range (150 to 250)
      const dieselBaseTemp = 200; // Middle of range
      const dieselTempRange = 40; // ±40 degrees from base (160-240 typical)
      const dieselTargetTemp =
        dieselBaseTemp + dieselCombinedWave * dieselTempRange;

      // Ensure diesel temperature stays within bounds
      const clampedDieselTargetTemp = Math.max(
        150,
        Math.min(250, dieselTargetTemp),
      );

      // DIESEL PRESSURE CALCULATION
      // Similar to others but with different frequency for out-of-sync behavior
      const dieselPressureWave = Math.sin(cycleProgress * 1.8 * Math.PI) * 0.6; // Slow sine wave
      const dieselPressureMicroWave =
        Math.sin(cycleProgress * 6.5 * Math.PI) * 0.1; // Small variations

      // Target pressure between 0.5 and 1.5 bar
      const dieselBasePressure = 1.0;
      const dieselPressureRange = 0.35; // ±0.35 from base
      const dieselTargetPressure =
        dieselBasePressure +
        dieselPressureWave * dieselPressureRange +
        dieselPressureMicroWave * dieselPressureRange;

      // Ensure diesel pressure stays within bounds (0.5 to 1.5)
      const clampedDieselTargetPressure = Math.max(
        0.5,
        Math.min(1.5, dieselTargetPressure),
      );

      // PETROL TEMPERATURE CALCULATION
      // Create multiple overlapping sine waves for petrol (different frequencies)
      const petrolPrimaryWave = Math.sin(cycleProgress * 2 * Math.PI); // 1 complete cycle over 3 hours
      const petrolSecondaryWave = Math.sin(cycleProgress * 9 * Math.PI) * 0.3; // Faster smaller fluctuations
      const petrolTertiaryWave = Math.cos(cycleProgress * 13 * Math.PI) * 0.15; // Even faster micro-fluctuations

      // Combine waves for complex, realistic fluctuation pattern
      const petrolCombinedWave =
        petrolPrimaryWave + petrolSecondaryWave + petrolTertiaryWave;

      // Map combined wave to petrol temperature range (30 to 40)
      const petrolBaseTemp = 35; // Middle of range
      const petrolTempRange = 4; // ±4 degrees from base (31-39 typical)
      const petrolTargetTemp =
        petrolBaseTemp + petrolCombinedWave * petrolTempRange;

      // Ensure petrol temperature stays within bounds
      const clampedPetrolTargetTemp = Math.max(
        30,
        Math.min(40, petrolTargetTemp),
      );

      // PETROL PRESSURE CALCULATION
      // Very stable around 1.0 bar with tiny fluctuations
      const petrolPressureWave = Math.sin(cycleProgress * 1.2 * Math.PI) * 0.3; // Very slow sine wave
      const petrolPressureMicroWave =
        Math.sin(cycleProgress * 5 * Math.PI) * 0.05; // Very small variations

      // Target pressure very close to 1.0 bar
      const petrolBasePressure = 1.0;
      const petrolPressureRange = 0.08; // ±0.08 from base (very small range)
      const petrolTargetPressure =
        petrolBasePressure +
        petrolPressureWave * petrolPressureRange +
        petrolPressureMicroWave * petrolPressureRange;

      // Ensure petrol pressure stays within tight bounds around 1.0
      const clampedPetrolTargetPressure = Math.max(
        0.9,
        Math.min(1.1, petrolTargetPressure),
      );

      console.log("Paraffin target temp:", clampedParaffinTargetTemp); // Debug log
      console.log("Kerosene target temp:", clampedKeroseneTargetTemp); // Debug log
      console.log("Diesel target temp:", clampedDieselTargetTemp); // Debug log
      console.log("Petrol target temp:", clampedPetrolTargetTemp); // Debug log
      console.log("Petrol target pressure:", clampedPetrolTargetPressure); // Debug log

      // Update cracker temperature with gradual change
      setCrackerTemp((prevTemp) => {
        const difference = clampedTargetTemp - prevTemp;
        const maxChange = 0.4; // Maximum degrees change per 4-second interval

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

      // Update cracker pressure with very gradual change
      setCrackerPressure((prevPressure) => {
        const difference = clampedTargetPressure - prevPressure;
        const maxChange = 0.02; // Very small pressure changes per 4-second interval

        let change;
        if (Math.abs(difference) <= maxChange) {
          change = difference; // If close enough, go directly to target
        } else {
          change = difference > 0 ? maxChange : -maxChange; // Very gradual approach
        }

        // Add tiny random variation (±0.005 bar) for realism
        const randomVariation = (Math.random() - 0.5) * 0.01;
        const newPressure = prevPressure + change + randomVariation;

        // Final bounds check and round to 1 decimal place
        const finalPressure = Math.max(0.5, Math.min(1.5, newPressure));
        return Math.round(finalPressure * 10) / 10;
      });

      // Update paraffin temperature with gradual change (delayed by 500ms)
      setTimeout(() => {
        setParaffinTemp((prevTemp) => {
          const difference = clampedParaffinTargetTemp - prevTemp;
          const maxChange = 0.3; // Maximum degrees change per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Gradual approach
          }

          // Add tiny random variation (±0.05 degrees) for realism
          const randomVariation = (Math.random() - 0.5) * 0.1;
          const newTemp = prevTemp + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalTemp = Math.max(300, Math.min(350, newTemp));
          return Math.round(finalTemp * 10) / 10;
        });

        // Update paraffin pressure with very slight fluctuation
        setParaffinPressure((prevPressure) => {
          // Very rarely allow pressure to drift (2% chance per update = roughly 1-2 times per hour)
          if (Math.random() < 0.02) {
            // Occasionally drift to 0.9 or 1.1
            const targetPressure = Math.random() < 0.5 ? 0.9 : 1.1;
            const difference = targetPressure - prevPressure;
            const change = difference > 0 ? 0.01 : -0.01; // Very small change toward target
            const newPressure = prevPressure + change;
            return Math.round(newPressure * 10) / 10;
          } else {
            // Most of the time, very tiny random fluctuation around current value
            const microVariation = (Math.random() - 0.5) * 0.02; // ±0.01 bar
            const newPressure = prevPressure + microVariation;
            // Gently pull back toward 1.0 if drifting too far
            const pullToCenter = (1.0 - newPressure) * 0.05;
            const finalPressure = newPressure + pullToCenter;
            // Clamp between 0.85 and 1.15 to prevent extreme drift
            const clampedPressure = Math.max(
              0.85,
              Math.min(1.15, finalPressure),
            );
            return Math.round(clampedPressure * 10) / 10;
          }
        });
      }, 500); // 500ms delay for paraffin updates

      // Update kerosene temperature and pressure (delayed by 1000ms)
      setTimeout(() => {
        setKeroseneTemp((prevTemp) => {
          const difference = clampedKeroseneTargetTemp - prevTemp;
          const maxChange = 0.3; // Maximum degrees change per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Gradual approach
          }

          // Add tiny random variation (±0.05 degrees) for realism
          const randomVariation = (Math.random() - 0.5) * 0.1;
          const newTemp = prevTemp + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalTemp = Math.max(250, Math.min(300, newTemp));
          return Math.round(finalTemp * 10) / 10;
        });

        // Update kerosene pressure with gradual change
        setKerosenePressure((prevPressure) => {
          const difference = clampedKeroseneTargetPressure - prevPressure;
          const maxChange = 0.015; // Small pressure changes per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Gradual approach
          }

          // Add tiny random variation (±0.005 bar) for realism
          const randomVariation = (Math.random() - 0.5) * 0.01;
          const newPressure = prevPressure + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalPressure = Math.max(0.5, Math.min(1.5, newPressure));
          return Math.round(finalPressure * 10) / 10;
        });
      }, 1000); // 1000ms delay for kerosene updates

      // Update diesel temperature and pressure (delayed by 1500ms for out-of-sync behavior)
      setTimeout(() => {
        setDieselTemp((prevTemp) => {
          const difference = clampedDieselTargetTemp - prevTemp;
          const maxChange = 0.3; // Maximum degrees change per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Gradual approach
          }

          // Add tiny random variation (±0.05 degrees) for realism
          const randomVariation = (Math.random() - 0.5) * 0.1;
          const newTemp = prevTemp + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalTemp = Math.max(150, Math.min(250, newTemp));
          return Math.round(finalTemp * 10) / 10;
        });

        // Update diesel pressure with gradual change
        setDieselPressure((prevPressure) => {
          const difference = clampedDieselTargetPressure - prevPressure;
          const maxChange = 0.018; // Small pressure changes per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Gradual approach
          }

          // Add tiny random variation (±0.005 bar) for realism
          const randomVariation = (Math.random() - 0.5) * 0.01;
          const newPressure = prevPressure + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalPressure = Math.max(0.5, Math.min(1.5, newPressure));
          return Math.round(finalPressure * 10) / 10;
        });
      }, 1500); // 1500ms delay for diesel updates (out of sync)

      // Update petrol temperature and pressure (delayed by 2000ms for final timing)
      setTimeout(() => {
        setPetrolTemp((prevTemp) => {
          const difference = clampedPetrolTargetTemp - prevTemp;
          const maxChange = 0.2; // Small temperature changes per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Gradual approach
          }

          // Add tiny random variation (±0.03 degrees) for realism
          const randomVariation = (Math.random() - 0.5) * 0.06;
          const newTemp = prevTemp + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalTemp = Math.max(30, Math.min(40, newTemp));
          return Math.round(finalTemp * 10) / 10;
        });

        // Update petrol pressure with very slight fluctuation around 1.0
        setPetrolPressure((prevPressure) => {
          const difference = clampedPetrolTargetPressure - prevPressure;
          const maxChange = 0.005; // Very small pressure changes per 4-second interval

          let change;
          if (Math.abs(difference) <= maxChange) {
            change = difference; // If close enough, go directly to target
          } else {
            change = difference > 0 ? maxChange : -maxChange; // Very gradual approach
          }

          // Add tiny random variation (±0.002 bar) for realism
          const randomVariation = (Math.random() - 0.5) * 0.004;
          const newPressure = prevPressure + change + randomVariation;

          // Final bounds check and round to 1 decimal place
          const finalPressure = Math.max(0.9, Math.min(1.1, newPressure));
          return Math.round(finalPressure * 10) / 10;
        });

        // After all pressure updates are complete, check for collisions and adjust if needed
        setTimeout(() => {
          // Get current pressure values
          const currentPressures = {
            cracker: crackerPressure,
            paraffin: paraffinPressure,
            kerosene: kerosenePressure,
            diesel: dieselPressure,
            petrol: petrolPressure,
          };

          // Get current temperature values
          const currentTemperatures = {
            cracker: crackerTemp,
            paraffin: paraffinTemp,
            kerosene: keroseneTemp,
            diesel: dieselTemp,
            petrol: petrolTemp,
          };

          // Check and adjust for pressure collisions
          const adjustedPressures =
            adjustPressuresForCollisions(currentPressures);

          // Enforce temperature hierarchy
          const adjustedTemperatures =
            enforceTemperatureHierarchy(currentTemperatures);

          // Update pressure state if adjustments were made
          if (adjustedPressures.cracker !== currentPressures.cracker) {
            setCrackerPressure(adjustedPressures.cracker);
          }
          if (adjustedPressures.paraffin !== currentPressures.paraffin) {
            setParaffinPressure(adjustedPressures.paraffin);
          }
          if (adjustedPressures.kerosene !== currentPressures.kerosene) {
            setKerosenePressure(adjustedPressures.kerosene);
          }
          if (adjustedPressures.diesel !== currentPressures.diesel) {
            setDieselPressure(adjustedPressures.diesel);
          }
          if (adjustedPressures.petrol !== currentPressures.petrol) {
            setPetrolPressure(adjustedPressures.petrol);
          }

          // Update temperature state if adjustments were made
          if (adjustedTemperatures.cracker !== currentTemperatures.cracker) {
            setCrackerTemp(adjustedTemperatures.cracker);
          }
          if (adjustedTemperatures.paraffin !== currentTemperatures.paraffin) {
            setParaffinTemp(adjustedTemperatures.paraffin);
          }
          if (adjustedTemperatures.kerosene !== currentTemperatures.kerosene) {
            setKeroseneTemp(adjustedTemperatures.kerosene);
          }
          if (adjustedTemperatures.diesel !== currentTemperatures.diesel) {
            setDieselTemp(adjustedTemperatures.diesel);
          }
          if (adjustedTemperatures.petrol !== currentTemperatures.petrol) {
            setPetrolTemp(adjustedTemperatures.petrol);
          }
        }, 100); // Small delay to ensure all pressure updates are complete
      }, 2000); // 2000ms delay for petrol updates
    }, 4000); // Update every 4 seconds

    return () => clearInterval(tempTimer);
  }, [
    cycleStartTime,
    crackerPressure,
    paraffinPressure,
    kerosenePressure,
    dieselPressure,
    petrolPressure,
    crackerTemp,
    paraffinTemp,
    keroseneTemp,
    dieselTemp,
    petrolTemp,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDieselFlowRate((prev) => {
        const next = prev + 0.1;
        return next > 100 ? 100 : next; // cap at 100%
      });
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setKeroseneFlowRate((prev) => {
        const next = prev + 0.1;
        return next > 100 ? 100 : next; // cap at 100%
      });
    }, 120000); // 120000 ms = 2 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParaffinFlowRate((prev) => {
        const next = prev + 0.1;
        return next > 100 ? 100 : next; // cap at 100%
      });
    }, 480000); // 8 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPetrolFlowRate((prev) => {
        const next = prev + 0.1;
        return next > 100 ? 100 : next; // Cap at 100%
      });
    }, 150000); // 2.5 minutes in milliseconds

    return () => clearInterval(interval);
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
        <div className="header-left">
          {/* You can remove the logo here or keep something else */}
        </div>

        <div className="header-center">
          <img src={smallLogo} alt="Logo" className="logo-image" />
          <h1>OIL SEPARATION REFINERY</h1>
          <img src={smallLogo} alt="Right Logo" className="logo-image" />
        </div>

        <div className="header-right">
          <div className="datetime">{formatDateTime(currentTime)}</div>
        </div>
      </div>

      {/* Main Distillation Layout */}
      <div className="distillation-container">
        <div className="fixed-layout-wrapper">
          {products.map((product, index) => (
            <div key={product} className="product-column">
              <div className="product-label">{product}</div>
              <div
                className={
                  product === "PETROL"
                    ? "petrol-circle"
                    : product === "DIESEL"
                      ? "diesel-circle"
                      : product === "KEROSENE"
                        ? "kerosene-circle"
                        : product === "PARAFFIN"
                          ? "paraffin-circle"
                          : "product-circle"
                }
              >
                <div className="measurement-boxes">
                  <div className="measurement-box temperature">
                    <span className="measurement-value">
                      {product === "PARAFFIN"
                        ? paraffinTemp.toFixed(1)
                        : product === "KEROSENE"
                          ? keroseneTemp.toFixed(1)
                          : product === "DIESEL"
                            ? dieselTemp.toFixed(1)
                            : product === "PETROL"
                              ? petrolTemp.toFixed(1)
                              : "25.0"}
                    </span>
                    <span className="measurement-unit">°C</span>
                  </div>

                  <div className="measurement-box pressure">
                    <span className="measurement-value">
                      {product === "PARAFFIN"
                        ? paraffinPressure.toFixed(1)
                        : product === "KEROSENE"
                          ? kerosenePressure.toFixed(1)
                          : product === "DIESEL"
                            ? dieselPressure.toFixed(1)
                            : product === "PETROL"
                              ? petrolPressure.toFixed(1)
                              : "1.2"}
                    </span>
                    <span className="measurement-unit">bar</span>
                  </div>

                  <div
                    className={
                      product === "PETROL"
                        ? "measurement-box flow-rate petrol-flow-rate-up"
                        : "measurement-box flow-rate"
                    }
                  >
                    <span className="measurement-value">
                      {product === "PARAFFIN"
                        ? paraffinFlowRate.toFixed(1)
                        : product === "KEROSENE"
                          ? keroseneFlowRate.toFixed(1)
                          : product === "DIESEL"
                            ? dieselFlowRate.toFixed(1)
                            : product === "PETROL"
                              ? petrolFlowRate.toFixed(1)
                              : "0.0"}
                    </span>
                    <span className="measurement-unit">%</span>
                  </div>
                </div>
              </div>

              <div className="connection-line">
                <div className="arrow-down"></div>
              </div>

              <div className="collection-trap">
                <div className="trap-label">PRODUCT BUFFER STORAGE TANK</div>
              </div>
            </div>
          ))}

          {/* Cracker cylinder - separate from products array */}
          <div className="product-column cracker-column">
            <div className="product-label">CRACKER</div>
            <div className="simple-cylinder">
              <div className="cylinder-top-cap"></div>
              <div className="cylinder-main-body">
                <div className="measurement-boxes">
                  <div className="measurement-box temperature">
                    <span className="measurement-value">
                      {crackerTemp.toFixed(1)}
                    </span>
                    <span className="measurement-unit">°C</span>
                  </div>
                  <div className="measurement-box pressure">
                    <span className="measurement-value">
                      {crackerPressure.toFixed(1)}
                    </span>
                    <span className="measurement-unit">bar</span>
                  </div>
                </div>
              </div>
              <div className="cylinder-bottom-cap"></div>
              {/* Cracker Entry Line */}
              <div className="cracker-exit-line"></div>
              {/* Vertical line with arrow */}
              <div className="cracker-vertical-line">
                <div className="arrow-down"></div>
              </div>
              {/* Pyrolysis oil input label */}
              <div className="pyrolysis-label">PYROLYSIS OIL INPUT</div>
            </div>
          </div>

          {/* Connection lines within the fixed wrapper */}
          <div className="paraffin-cracker-connection">
            <div className="arrow-left"></div>
          </div>
          <div className="kerosene-paraffin-connection">
            <div className="arrow-left"></div>
          </div>
          <div className="kerosene-diesel-connection">
            <div className="arrow-left"></div>
          </div>
          <div className="diesel-petrol-connection">
            <div className="arrow-left"></div>
          </div>

          {/* Small vertical lines coming out of the top of circles */}
          <div className="diesel-top-line"></div>
          <div className="kerosene-diesel-top-line"></div>
          <div className="kerosene-paraffin-top-line"></div>
          <div className="kerosene-top-line"></div>
          <div className="paraffin-top-line"></div>
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
