# Oil Separation Refinery Interface

A real-time industrial control interface for monitoring an oil distillation refinery system. Built with React, this application displays dynamic temperature and pressure readings for different petroleum products with realistic fluctuation patterns.

## Features

- **Real-time Clock**: Live date/time display in the header
- **Dynamic Measurements**: All products show realistic temperature and pressure fluctuations
- **Staggered Updates**: Different products update at offset intervals for realistic industrial behavior
- **3-Hour Cycles**: All readings follow a complete 3-hour simulation cycle
- **Professional UI**: Industrial-style interface with measurement boxes and process flow visualization

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/taliablain/pressure-flow-ui.git>
```

2. Install dependencies:
```bash
npm install
```

3. Install development tools (ESLint and Prettier):
```bash
npm run install-dev-tools
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run install-dev-tools`
Installs ESLint and Prettier for code formatting and linting.

### `npm run lint`
Runs ESLint to check for code issues.

### `npm run lint:fix`
Automatically fixes ESLint issues where possible.

### `npm run format`
Formats code using Prettier.

## System Configuration

### Temperature and Pressure Settings

| Product | Temperature Range | Pressure Range | Update Timing | Special Behavior |
|---------|------------------|----------------|---------------|------------------|
| **CRACKER** | 650-750°C | 0.5-1.5 bar | Immediate (0ms) | Complex sine wave patterns |
| **PARAFFIN** | 300-320°C (spikes to 350°C) | ~1.0 bar (0.85-1.15) | 500ms delay | 5% chance of temperature spikes |
| **KEROSENE** | 250-300°C | 0.5-1.5 bar | 1000ms delay | Moderate fluctuation patterns |
| **DIESEL** | 150-250°C | 0.5-1.5 bar | 1500ms delay | Out-of-sync with other products |
| **PETROL** | 30-40°C | 0.9-1.1 bar | 2000ms delay | Very stable pressure around 1.0 |

### Update Intervals

- **Main Timer**: 4-second intervals
- **Temperature Changes**: Maximum 0.2-0.4°C per update (varies by product)
- **Pressure Changes**: Maximum 0.005-0.02 bar per update (varies by product)
- **Cycle Duration**: 3 hours before reset

### Fluctuation Patterns

Each product uses multiple overlapping sine waves with different frequencies to create realistic industrial fluctuations:

- **Primary Wave**: Main temperature trend over the 3-hour cycle
- **Secondary Wave**: Mid-frequency variations for natural fluctuation
- **Tertiary Wave**: High-frequency micro-fluctuations for realism
- **Random Variation**: Small random changes added to each update

## Project Structure

```
src/
├── App.js          # Main application component with all logic
├── App.css         # Styling for the industrial interface
└── index.js        # Application entry point
```

## Customization

To modify temperature ranges, pressure settings, or update intervals, edit the calculation sections in `App.js`:

- Search for product-specific calculation blocks (e.g., "CRACKER TEMPERATURE CALCULATION")
- Adjust `baseTemp`, `tempRange`, `basePressure`, and `pressureRange` values
- Modify `maxChange` values to control update rates

## Technologies Used

- **React 18**: Frontend framework
- **CSS3**: Styling
- **JavaScript ES6+**: Modern JavaScript features
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).