# Coverage Checker

A beautiful, dark-themed web application to check mobile network coverage availability across 225+ countries and territories.

![Coverage Checker Screenshot](https://via.placeholder.com/800x400?text=Coverage+Checker+Screenshot)

## Features

- **Instant Location Detection**: Paste any Google Maps or Apple Maps link to auto-detect coordinates and country
- **Dual Data Sources**:
  - **nPerf Maps**: Interactive signal coverage maps
  - **GSMA Info**: Detailed network coverage documents
- **225+ Countries**: Coverage data for territories worldwide
- **1300+ Networks**: Comprehensive operator database
- **Premium Dark UI**: Modern glassmorphic design with Esri Hybrid satellite maps
- **Smart Filtering**: Automatically shows only networks with data for selected source

---

## 🖥️ Local Setup (Node.js)

### Prerequisites
- Node.js 16+ installed
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/coverage-checker.git
cd coverage-checker

# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Updating Operator Data

To refresh the network data from nPerf and GSMA sources:

```bash
node data-fetcher.js
```

This will regenerate `operators.json` with the latest data.

---

## 📊 Google Apps Script Setup

You can also deploy this as a Google Sheets-powered web app.

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Coverage Checker Data"

### Step 2: Add Apps Script

1. Go to **Extensions > Apps Script**
2. Delete the default code and paste the following:

```javascript
// Code.gs

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Coverage Checker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getOperators() {
  // Fetch from GSMA and nPerf APIs
  var gsmaData = fetchGSMA();
  var nperfData = fetchNPerf();
  return mergeData(gsmaData, nperfData);
}

function expandUrl(shortUrl) {
  try {
    var response = UrlFetchApp.fetch(shortUrl, {
      followRedirects: false,
      muteHttpExceptions: true
    });
    var headers = response.getAllHeaders();
    var expandedUrl = headers['Location'] || shortUrl;
    
    // Extract coords from expanded URL
    var match = expandedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return {
        expandedUrl: expandedUrl,
        coords: { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
      };
    }
    return { expandedUrl: expandedUrl, coords: null };
  } catch (e) {
    return { expandedUrl: shortUrl, coords: null };
  }
}

function fetchGSMA() {
  var url = 'https://www.gsma.com/wp-content/uploads/feed.csv';
  var response = UrlFetchApp.fetch(url);
  var csv = Utilities.parseCsv(response.getContentText());
  // Parse and return operator data
  return csv.slice(1).map(function(row) {
    return { gsmaId: row[0], name: row[1], country: row[2] };
  });
}

function fetchNPerf() {
  // Fetch nPerf data for each country
  // Implementation similar to data-fetcher.js
  return [];
}

function mergeData(gsma, nperf) {
  // Merge and deduplicate
  return nperf;
}
```

### Step 3: Add HTML File

1. In Apps Script, click **+** next to Files
2. Select **HTML** and name it `index`
3. Copy the contents of `index.html` from this repository

### Step 4: Deploy

1. Click **Deploy > New deployment**
2. Select **Web app**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone** (or "Anyone with Google account")
4. Click **Deploy**
5. Copy the web app URL

---

## 📁 Project Structure

```
coverage-checker/
├── index.html          # Main UI (works in both local and GAS)
├── server.js           # Express server for local mode
├── data-fetcher.js     # Script to update operators.json
├── operators.json      # Cached operator data
├── package.json        # Node.js dependencies
└── README.md           # This file
```

---

## 🔧 Configuration

### Environment Detection

The app automatically detects whether it's running locally or on Google Apps Script:

```javascript
var isLocal = (typeof google === 'undefined' || !google.script);
```

- **Local mode**: Uses `fetch('/api/operators')` 
- **GAS mode**: Uses `google.script.run.getOperators()`

---

## 📄 License

MIT License - feel free to use and modify.

---

## 🙏 Credits

- **nPerf** - Signal coverage maps
- **GSMA** - Network operator database
- **Esri** - World Imagery satellite tiles
- **Leaflet** - Interactive maps
- **CartoDB** - Map labels overlay

---

Made with ❤️ by Minita
