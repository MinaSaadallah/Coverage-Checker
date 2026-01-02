# Coverage Checker

A mobile network coverage checker application that helps users find mobile network operators and check their coverage for any location worldwide. The application combines data from GSMA (official mobile operator registry) and nPerf (network performance testing service) to provide comprehensive coverage information.

## Features

- **Location-Based Detection**: Paste any map link (Google Maps, Apple Maps, etc.) to automatically detect location and country
- **Comprehensive Operator Database**: Access to 1360+ mobile network operators across 190+ countries
- **Multiple Data Sources**: 
  - nPerf coverage maps with signal strength visualization
  - GSMA operator information and official data
- **Smart Coordinate Extraction**: Automatically extracts coordinates from various map URL formats
- **Reverse Geocoding**: Determines country from coordinates using OpenStreetMap Nominatim
- **Interactive Map**: Visual location selection and display
- **Google Apps Script Compatible**: Can run as both a standalone server and Google Apps Script web app

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

### Prerequisites

- Node.js 14.0.0 or higher
- npm (comes with Node.js)

### Steps

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

### Google Apps Script Deployment

1. Copy the contents of `Code.gs` to a new Google Apps Script project
2. Copy the contents of `import.gs` to the same project
3. Copy the contents of `index.html` to an HTML file in the project
4. Deploy as a web app

### Docker Deployment (Optional)

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

- [ ] Add automated testing
- [ ] Implement caching for geocoding results
- [ ] Add more coverage data sources
- [ ] Create Docker compose setup
- [ ] Add CI/CD pipeline
- [ ] Implement user authentication for Google Apps Script version
- [ ] Add coverage comparison features
- [ ] Mobile app version

---

Made with ❤️ by [MinaSaadallah](https://github.com/MinaSaadallah)
