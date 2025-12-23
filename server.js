const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Cache operators data in memory
let operatorsCache = null;
let operatorsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.use(express.json());
app.use(express.static(__dirname, { maxAge: '1h' }));

// ===================================
// GAS SHIM INJECTION
// ===================================
const GAS_SHIM = `
<script>
window.google = window.google || {};
window.google.script = window.google.script || {};
window.google.script.run = {
    withSuccessHandler: function(success) { this._success = success; return this; },
    withFailureHandler: function(failure) { this._failure = failure; return this; },
    getOperators: function() {
        fetch('/api/operators')
            .then(r => r.json())
            .then(data => { if(this._success) this._success(data); })
            .catch(err => { if(this._failure) this._failure(err); });
    },
    getTerritories: function() {
        fetch('/api/territories')
            .then(r => r.json())
            .then(data => { if(this._success) this._success(data); })
            .catch(() => { if(this._success) this._success({}); });
    },
    expandUrl: function(url) {
        fetch('/api/expand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        })
        .then(r => r.json())
        .then(data => { if(this._success) this._success(data); })
        .catch(err => { if(this._failure) this._failure(err); });
    }
};
</script>
`;

// ===================================
// ROUTES
// ===================================

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Get Operators (with memory caching)
app.get('/api/operators', (req, res) => {
    try {
        const now = Date.now();
        if (operatorsCache && (now - operatorsCacheTime) < CACHE_DURATION) {
            res.set('Cache-Control', 'public, max-age=300');
            return res.json(operatorsCache);
        }

        const dataPath = path.join(__dirname, 'operators.json');
        if (fs.existsSync(dataPath)) {
            const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            operatorsCache = data;
            operatorsCacheTime = now;
            res.set('Cache-Control', 'public, max-age=300');
            res.json(data);
        } else {
            res.json([]);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API: Get Territories
app.get('/api/territories', (req, res) => {
    // Return default territories for now, or read from territories.json
    const defaults = {
        PR: { name: "Puerto Rico", parent: "US", bbox: [17.883, -67.942, 18.515, -65.22] },
        VI: { name: "U.S. Virgin Islands", parent: "US", bbox: [17.636, -65.091, 18.579, -64.33] },
        HK: { name: "Hong Kong", parent: "CN", bbox: [22.1, 113.8, 22.6, 114.5] },
        MO: { name: "Macau", parent: "CN", bbox: [22.1, 113.5, 22.25, 113.6] },
        AW: { name: "Aruba", parent: "NL", bbox: [12.373, -70.132, 12.64, -69.8] },
        CW: { name: "Curaçao", parent: "NL", bbox: [12.0, -69.2, 12.3, -68.6] },
        GP: { name: "Guadeloupe", parent: "FR", bbox: [15.8, -61.9, 16.7, -61.0] },
        MQ: { name: "Martinique", parent: "FR", bbox: [14.39, -61.3, 15.02, -60.7] }
    };
    res.json(defaults);
});

// API: Expand URL
app.post('/api/expand', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.json({ error: 'No URL provided' });

    try {
        let targetUrl = url;
        try {
            const response = await axios.head(url, { maxRedirects: 10, validateStatus: null, timeout: 5000 });
            if (response.request.res.responseUrl) {
                targetUrl = response.request.res.responseUrl;
            }
        } catch (e) { /* Use original URL */ }

        const coords = extractCoords(targetUrl);
        if (coords) return res.json({ expandedUrl: targetUrl, coords });

        const bodyRes = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });
        const htmlCoords = extractCoordsFromHtml(bodyRes.data);
        if (htmlCoords) return res.json({ expandedUrl: targetUrl, coords: htmlCoords });

        return res.json({ expandedUrl: targetUrl, error: 'Could not find coordinates' });
    } catch (e) {
        res.json({ error: e.message });
    }
});

function extractCoords(url) {
    if (!url) return null;
    let match;

    // Apple Maps coordinate=
    match = url.match(/[?&]coordinate=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

    // Google @lat,lng
    match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

    // Google !3d!4d
    match = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

    return null;
}

function extractCoordsFromHtml(html) {
    // Basic regex for apple maps meta tags
    const latMatch = html.match(/property=["']place:location:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
    const lngMatch = html.match(/property=["']place:location:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
    if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };

    // Center regex
    const centerMatch = html.match(/"center":\s*\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/);
    if (centerMatch) return { lat: parseFloat(centerMatch[1]), lng: parseFloat(centerMatch[2]) };

    return null;
}

app.listen(PORT, () => {
    console.log(`\n✅ Local Coverage Server Running!`);
    console.log(`Open http://localhost:${PORT} in your browser.`);
});
