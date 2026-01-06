# Coverage Checker v2.0.0 - Autonomous System

A fully autonomous mobile network coverage checker that runs entirely within Google Apps Script with **zero manual intervention**. The system automatically fetches data from GSMA and nPerf, sends scheduled reports, monitors its own health, and self-heals issues.

## ✨ What's New in v2.0

### 🤖 **Fully Autonomous**
- Auto-fetches data from GSMA, nPerf, and REST Countries APIs
- Self-healing system that detects and fixes issues automatically
- Smart trigger system with 7 automated schedules
- One-click installation with `INSTALL_COVERAGE_CHECKER_SYSTEM()`

### 📊 **Complete Analytics**
- Auto-refreshing dashboard with real-time statistics
- Daily email reports at 8 AM
- Weekly maintenance reports (Sundays)
- Monthly archive reports

### 💾 **Advanced Caching**
- 4-tier caching system (memory → script cache → properties → sheet)
- Automatic cache warming and statistics tracking
- Large data chunking support (handles datasets > 100KB)

### 🔒 **Security & Monitoring**
- Comprehensive logging with 5 severity levels
- Input validation and XSS prevention
- Rate limiting and security audits
- System health scoring (0-100)

### 🌍 **Full Country Support**
- 250+ countries with full official names (no abbreviations)
- Complete ISO 3166-1 mapping
- Auto-sync country data from REST Countries API

## Key Features

- **Location-Based Detection**: Paste any map link (Google Maps, Apple Maps) to detect location
- **Comprehensive Operator Database**: 1360+ mobile network operators across 190+ countries
- **Multiple Data Sources**: nPerf coverage maps + GSMA operator information
- **Smart Coordinate Extraction**: Automatically extracts coordinates from various URL formats
- **Interactive Map**: Visual location selection with Leaflet
- **Autonomous Operation**: Runs 24/7 with zero manual intervention after installation
- **Self-Healing**: Automatically detects and repairs system issues
- **Email Reports**: Daily, weekly, and monthly automated reports

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Data Sources](#data-sources)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Installation

### For Google Apps Script (v2.0 Autonomous System) ⭐ RECOMMENDED

See **[INSTALLATION.md](INSTALLATION.md)** for complete setup instructions.

**Quick Setup:**
1. Upload all `.gs` files to your Google Apps Script project
2. Update `Config.gs` with your Spreadsheet ID and email
3. Run `INSTALL_COVERAGE_CHECKER_SYSTEM()` function
4. Done! System runs autonomously 24/7

### For Local Development (Node.js Server)

#### Prerequisites
- Node.js 14.0.0 or higher
- npm (comes with Node.js)

#### Steps

1. Clone the repository:
```bash
git clone https://github.com/MinaSaadallah/coverage-checker.git
cd coverage-checker
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create environment configuration:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Quick Start

### Using the Web Interface

1. **Enter a Location**: Paste a map link (Google Maps or Apple Maps) into the "Location link" field
2. **Select Country**: The country will be auto-detected, or you can manually select one
3. **Choose Coverage Source**: Toggle between nPerf Map or GSMA Info
4. **Select Operator**: Choose a mobile network operator from the dropdown
5. **Check Coverage**: Click the "Check Coverage" button to open the coverage map

### Example Map Links

```
Google Maps: https://maps.google.com/?q=40.7128,-74.0060
Apple Maps: https://maps.apple.com/?ll=40.7128,-74.0060
Short URL: https://goo.gl/maps/abc123
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Cache Configuration  
CACHE_DURATION=300000
OPERATORS_CACHE_DURATION=300000

# External API Configuration
GSMA_FEED_URL=https://www.gsma.com/wp-content/uploads/feed.csv
NPERF_API_URL=https://www.nperf.com/en/map/get-isp-list-by-country

# Rate Limiting
REQUEST_TIMEOUT=5000
API_DELAY=50

# CORS Configuration
CORS_ORIGIN=*
```

### Configuration Options

- **PORT**: Server port number (default: 3000)
- **NODE_ENV**: Environment mode (development/production)
- **CACHE_DURATION**: General cache duration in milliseconds
- **OPERATORS_CACHE_DURATION**: How long to cache operator data
- **REQUEST_TIMEOUT**: Timeout for external API requests
- **API_DELAY**: Delay between nPerf API requests to avoid rate limiting

## API Documentation

### GET /health

Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-02T10:00:00.000Z",
  "uptime": 123.456
}
```

### GET /health/detailed

Detailed health check with dependency validation

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-02T10:00:00.000Z",
  "uptime": 123.456,
  "checks": {
    "operatorsData": "ok"
  }
}
```

### GET /api/operators

Retrieves the list of mobile network operators

**Response:**
```json
[
  {
    "countryCode": "US",
    "operatorId": "1234",
    "operatorName": "Verizon",
    "link": "https://www.nperf.com/en/map/US/-/1234.Verizon/signal",
    "gsmaId": "567"
  }
]
```

### GET /api/geocode

Reverse geocodes coordinates to determine country

**Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude

**Example:**
```
GET /api/geocode?lat=40.7128&lng=-74.0060
```

**Response:**
```json
{
  "countryCode": "US",
  "country": "United States",
  "state": "New York",
  "displayName": "New York, NY, United States"
}
```

### POST /api/expand

Expands shortened URLs and extracts coordinates

**Request Body:**
```json
{
  "url": "https://goo.gl/maps/abc123"
}
```

**Response:**
```json
{
  "expandedUrl": "https://maps.google.com/?q=40.7128,-74.0060",
  "coords": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

## Data Sources

### GSMA (Global System for Mobile Communications Association)

- **Purpose**: Official mobile operator registry
- **Data**: Operator names, country associations, and GSMA IDs
- **URL**: https://www.gsma.com/wp-content/uploads/feed.csv
- **Update Frequency**: Run `npm run refresh` to update data

### nPerf

- **Purpose**: Network performance testing and coverage visualization
- **Data**: Coverage maps, signal strength, operator performance
- **URL**: https://www.nperf.com
- **Features**: Interactive coverage maps with signal strength indicators

### OpenStreetMap Nominatim

- **Purpose**: Reverse geocoding service
- **Data**: Country codes, administrative regions, location names
- **API**: https://nominatim.openstreetmap.org
- **Rate Limits**: Please respect the usage policy

## Development

### Project Structure

```
coverage-checker/
├── config/
│   └── index.js           # Configuration management
├── middleware/
│   └── errorHandler.js    # Error handling middleware
├── routes/
│   ├── operators.js       # Operators API routes
│   ├── geocode.js         # Geocoding API routes
│   ├── expand.js          # URL expansion routes
│   └── health.js          # Health check routes
├── utils/
│   ├── coordinates.js     # Coordinate extraction utilities
│   └── logger.js          # Logging utilities
├── server.js              # Main Express server
├── data-fetcher.js        # Data update script
├── index.html             # Frontend UI
├── operators.json         # Cached operator data
└── package.json           # Project dependencies
```

### Scripts

- `npm start` - Start the server
- `npm run refresh` - Update operator data from GSMA and nPerf
- `npm run dev` - Start server in development mode

### Adding New Features

1. **New API Route**: Add a new file in `/routes` directory
2. **New Utility**: Add a new file in `/utils` directory
3. **Configuration**: Update `/config/index.js` and `.env.example`
4. **Documentation**: Update this README with new features

### Code Style

- Use JSDoc comments for all functions
- Follow ES6+ syntax
- Use async/await for asynchronous operations
- Implement proper error handling
- Add logging for important operations

## Deployment

### Local Deployment

Simply run `npm start` and the server will be available at `http://localhost:3000`

### For Google Apps Script Deployment ⭐ RECOMMENDED

1. Copy all `.gs` files to a new Google Apps Script project
2. Copy `index.html` to an HTML file in the project
3. Update `Config.gs` with your configuration
4. Run `INSTALL_COVERAGE_CHECKER_SYSTEM()` to set up automation
5. Deploy as a web app

**See [INSTALLATION.md](INSTALLATION.md) for detailed instructions.**

### For Local Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t coverage-checker .
docker run -p 3000:3000 coverage-checker
```

## Troubleshooting

### Server Won't Start

**Issue**: Error: `EADDRINUSE: address already in use`
**Solution**: Another process is using port 3000. Change the PORT in `.env` or stop the other process.

```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### No Operator Data

**Issue**: Empty operator dropdown
**Solution**: Run the data fetcher script to populate operators.json

```bash
npm run refresh
```

### Geocoding Errors

**Issue**: "Geocoding service unavailable"
**Solution**: The OpenStreetMap Nominatim API may be rate-limited or down. Wait a few minutes and try again.

### Coordinate Extraction Fails

**Issue**: "Could not find coordinates"
**Solution**: Ensure the map URL contains coordinates. Supported formats:
- Google Maps: URLs with `!3d` or `@` coordinates
- Apple Maps: URLs with `coordinate=` or `ll=` parameters

### Missing Dependencies

**Issue**: Module not found errors
**Solution**: Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Areas

- Add support for more map services
- Improve coordinate extraction algorithms
- Add more data sources
- Enhance UI/UX
- Add automated tests
- Improve documentation
- Fix bugs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **GSMA** for providing the official mobile operator registry
- **nPerf** for network coverage data and maps
- **OpenStreetMap** and **Nominatim** for geocoding services
- **Leaflet** for the interactive map
- All contributors who have helped improve this project

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/MinaSaadallah/coverage-checker/issues)
3. Open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

## Roadmap

### ✅ v2.0.0 (Current) - Autonomous System
- [x] Full autonomous operation with zero manual intervention
- [x] Smart trigger system with 7 automated schedules
- [x] Self-healing system with auto-detection and repair
- [x] 4-tier caching system
- [x] Comprehensive logging (5 severity levels)
- [x] Daily/weekly/monthly email reports
- [x] Auto-fetch from GSMA, nPerf, REST Countries APIs
- [x] Security features (validation, sanitization, rate limiting)
- [x] Real-time dashboard with health scoring
- [x] 250+ countries with full official names
- [x] One-click installation system

### 🔮 Future Enhancements
- [ ] Add automated testing suite
- [ ] Implement historical trend analysis
- [ ] Add coverage comparison features
- [ ] Create mobile app version
- [ ] Add user authentication and multi-user support
- [ ] Implement data export (CSV, JSON, PDF reports)
- [ ] Add custom alert thresholds
- [ ] Create admin dashboard web interface

---

## 📚 Additional Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Complete setup and installation guide for v2.0
- **[README.md](README.md)** - This file (overview and quick start)

---

## 🆕 What's New in v2.0

The Coverage Checker has been completely transformed into a fully autonomous system:

### Before (v1.x)
- Manual data updates
- Manual trigger setup
- No health monitoring
- No automated reports
- Basic caching
- ~95 countries

### After (v2.0)
- **Fully autonomous** - runs 24/7 with zero intervention
- **Self-healing** - detects and fixes issues automatically
- **Smart triggers** - 7 automated schedules
- **Email reports** - daily, weekly, monthly
- **Advanced caching** - 4-tier system with statistics
- **Health monitoring** - continuous scoring (0-100)
- **250+ countries** - full official names
- **One-click setup** - install with a single function call

---

Made with ❤️ by [MinaSaadallah](https://github.com/MinaSaadallah)
