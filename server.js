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

// API: Reverse Geocode - Get country code from coordinates using Nominatim
app.get('/api/geocode', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.json({ error: 'lat and lng required' });

    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                lat: lat,
                lon: lng,
                format: 'json',
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'CoverageChecker/1.0'
            },
            timeout: 5000
        });

        const data = response.data;
        if (data && data.address) {
            let countryCode = (data.address.country_code || '').toUpperCase();

            // Check for special administrative regions (Macau, Hong Kong, etc.)
            // ISO3166-2-lvl3 contains codes like "CN-MO" for Macau, "CN-HK" for Hong Kong
            const iso3166 = data.address['ISO3166-2-lvl3'] || data.address['ISO3166-2-lvl4'] || '';
            if (iso3166) {
                const parts = iso3166.split('-');
                if (parts.length >= 2) {
                    const regionCode = parts[1].toUpperCase();
                    // Known special regions that have their own operator data
                    const specialRegions = ['HK', 'MO', 'TW', 'PR', 'VI', 'GU', 'AS', 'MP'];
                    if (specialRegions.includes(regionCode)) {
                        countryCode = regionCode;
                    }
                }
            }

            const country = data.address.country || '';
            const state = data.address.state || data.address.territory || '';

            res.set('Cache-Control', 'public, max-age=86400');
            return res.json({
                countryCode: countryCode,
                country: country,
                state: state,
                displayName: data.display_name
            });
        }

        res.json({ error: 'Could not determine location' });
    } catch (e) {
        res.json({ error: e.message });
    }
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

    // Priority 1: !8m2!3d...!4d... (place marker) - get the LAST match
    const r8m2 = /!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
    let last = null;
    while ((match = r8m2.exec(url)) !== null) last = match;
    if (last) return { lat: parseFloat(last[1]), lng: parseFloat(last[2]) };

    // Priority 2: Plain !3d...!4d... - get the LAST match
    const r3d4d = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
    last = null;
    while ((match = r3d4d.exec(url)) !== null) last = match;
    if (last) return { lat: parseFloat(last[1]), lng: parseFloat(last[2]) };

    // Priority 3: Apple Maps coordinate=
    match = url.match(/[?&]coordinate=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

    // Priority 4: @ viewport (less accurate)
    match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
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
