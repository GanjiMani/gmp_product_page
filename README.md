# GMP Dashboard - FDA 483 Observations Analytics Platform

A comprehensive, professional dashboard for analyzing FDA 483 observations from 2007 to 2025. This platform provides intelligent insights into GMP compliance data across multiple program areas and systems.

## Features

### 📊 Dashboard Analytics
- **Program Area Distribution**: Visual breakdown of observations across Drugs, Food, Cosmetics, Biologics, Medical Devices, and more
- **System-wise Analysis**: Detailed breakdown of observations by cGMP systems (Quality, Laboratory Control, Material, Packaging & Labeling, Production, Facilities & Equipment)
- **Top Investigators**: Leaderboard of FDA investigators with their observation counts
- **Trend Analysis**: Time-series visualization of observations by system from 2007-2025
- **Key Metrics**: Total observations (261,811) and total companies inspected

### 🏠 Home Page
- Comprehensive explanation of GMP (Good Manufacturing Practice)
- Project overview and focus areas
- Feature highlights

### 📅 Request Demo
- Professional demo request form
- Contact information

### 🔐 Login
- Secure login interface
- Social login options (Google, LinkedIn)
- Demo mode available

## Technology Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Beautiful, responsive charts
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
gmp_dashboard/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation component
│   ├── pages/
│   │   ├── Home.jsx            # Home page with GMP info
│   │   ├── Dashboard.jsx       # Main analytics dashboard
│   │   ├── RequestDemo.jsx     # Demo request form
│   │   └── Login.jsx           # Login page
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Global styles
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Data Overview

The dashboard is designed to work with **real inspection data** served from a backend API (FastAPI + SQL Server).  
Key metrics and charts (total observations, total cites inspected, observations by program area, inspection classifications, country-wise counts, and the Program Area / System Year-wise 483 trend) are all driven by backend routes and database tables, not by dummy data.

## Features in Detail

### 1. Program Area Analysis
- Bar chart and pie chart showing distribution of observations across program areas
- Interactive visualizations with color-coded categories

### 2. System-wise Breakdown
- Filterable by program area
- Horizontal bar chart showing observations per system within selected program area

### 3. Top Investigators
- Top 10 FDA investigators ranked by number of observations
- Visual progress bars showing relative counts

### 4. System Trends
- Area chart showing trends over time (2007-2025)
- Multiple systems overlaid for comparison
- Gradient fills for visual appeal

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.

## Contact

For demo requests or inquiries, use the "Request a Demo" page in the application.


