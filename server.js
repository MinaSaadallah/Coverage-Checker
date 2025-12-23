const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // For URL expansion if needed
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// ===================================
// GAS SHIM INJECTION
// ===================================
const GAS_SHIM = `
<script>
console.log("Injecting GAS Shim for Local Development...");
window.google = window.google || {};
window.google.script = window.google.script || {};
window.google.script.run = {
    withSuccessHandler: function(success) {
        this._success = success;
        return this;
    },
    withFailureHandler: function(failure) {
        this._failure = failure;
        return this;
    },
    getOperators: function() {
        console.log("Fetching operators locally...");
        fetch('/api/operators')
            .then(r => r.json())
            .then(data => {
                if(this._success) this._success(data);
            })
            .catch(err => {
                console.error(err);
                if(this._failure) this._failure(err);
            });
    },
    getTerritories: function() {
        fetch('/api/territories')
            .then(r => r.json())
            .then(data => {
                 if(this._success) this._success(data);
            })
            .catch(e => {
                 // Fallback to empty if not implemented yet
                 if(this._success) this._success({});
            });
    },
    expandUrl: function(url) {
        console.log("Expanding URL locally:", url);
        fetch('/api/expand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        })
        .then(r => r.json())
        .then(data => {
            if(this._success) this._success(data);
        })
        .catch(err => {
             if(this._failure) this._failure(err);
        });
    }
};
console.log("GAS Shim ready.");
</script>
`;

// ===================================
// ROUTES
// ===================================

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Get Operators
app.get('/api/operators', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'operators.json');
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            res.set('Cache-Control', 'no-store');
            res.json(JSON.parse(data));
        } else {
            // If no data, return empty or try to trigger fetch
            console.warn("operators.json not found. Run 'node data-fetcher.js' first.");
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

// API: Expand URL (Simplified version of Code.gs)
app.post('/api/expand', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.json({ error: 'No URL provided' });

    try {
        console.log(`Expanding: ${url}`);

        let targetUrl = url;
        // Basic redirect following
        try {
            const response = await axios.head(url, { maxRedirects: 10, validateStatus: null });
            if (response.request.res.responseUrl) {
                targetUrl = response.request.res.responseUrl;
            }
        } catch (e) {
            // If HEAD fails, try GET or just use original
            console.log("HEAD failed, trying generic logic");
        }

        // Use a simple coordinate extraction regex on the final URL
        // Matches @lat,lng or !3dlat!4dlng or coordinate=lat,lng
        const coords = extractCoords(targetUrl);

        if (coords) {
            return res.json({ expandedUrl: targetUrl, coords });
        }

        // If still no coords, fetch body and regex
        const bodyRes = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' }
        });
        const html = bodyRes.data;

        // Try to find coords in HTML (Apple Maps uses meta tags often)
        const htmlCoords = extractCoordsFromHtml(html);
        if (htmlCoords) {
            return res.json({ expandedUrl: targetUrl, coords: htmlCoords });
        }

        return res.json({ expandedUrl: targetUrl, error: 'Could not find coordinates' });

    } catch (e) {
        console.error(e);
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
