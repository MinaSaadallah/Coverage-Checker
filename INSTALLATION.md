# Coverage Checker v2.0.0 - Installation & Setup Guide

## 🚀 Complete Autonomous Coverage Checker System

This guide will help you set up and install the fully autonomous Coverage Checker system in Google Apps Script.

---

## 📋 Prerequisites

- Google Account with access to Google Sheets
- Google Apps Script project
- Email address for receiving reports (default: mina.saadallah@transcom.com)

---

## 📁 Required Files

Upload all these `.gs` files to your Google Apps Script project:

### Core System Files
1. **Config.gs** - Centralized configuration (⚙️ CONFIGURE FIRST)
2. **Code.gs** - Main backend functions
3. **CountryNames.gs** - Full country name mappings (250+ countries)
4. **CountryLogic.gs** - Country analytics logic (keep existing)
5. **import.gs** - Fallback operator data (keep existing)
6. **index.html** - Web interface (keep unchanged)

### New Autonomous System Files
7. **Logger.gs** - Comprehensive logging system
8. **SmartCache.gs** - 4-tier caching system
9. **DataFetcher.gs** - Auto-fetch GSMA, nPerf, Countries data
10. **SelfHealing.gs** - Auto-detection and repair system
11. **MasterTriggers.gs** - Smart trigger management
12. **EmailReports.gs** - Daily/weekly/monthly reports
13. **Analytics.gs** - Dashboard calculations
14. **Security.gs** - Input validation and security

---

## ⚙️ Step 1: Configure the System

### Edit Config.gs

1. Open `Config.gs` in your Google Apps Script project
2. Update the following settings:

```javascript
// Line 18: Set your Spreadsheet ID
SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',

// Line 84: Set your email address
EMAIL_RECIPIENT: 'your.email@example.com',
```

**How to find your Spreadsheet ID:**
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
- Copy the long string between `/d/` and `/edit`

---

## 🎯 Step 2: One-Click Installation

### Run the Installer Function

1. In Google Apps Script, click on **MasterTriggers.gs**
2. Select the function: `INSTALL_COVERAGE_CHECKER_SYSTEM`
3. Click the **▶️ Run** button
4. **Authorize the script** when prompted (first time only)
5. Wait for completion (takes ~30 seconds)

### What the Installer Does

✅ Cleans up any old triggers  
✅ Installs all required triggers  
✅ Creates missing sheets (System_Logs, Dashboard, etc.)  
✅ Runs initial health check  
✅ Warms up cache  
✅ Sends confirmation email

### Expected Result

You should receive a confirmation email that says:
```
✓ Coverage Checker System Installed Successfully
```

---

## 📊 Step 3: Verify Installation

### Check Installed Triggers

1. In Google Apps Script, click on **⏰ Triggers** (left sidebar)
2. You should see 7 triggers installed:

| Trigger | Frequency | Purpose |
|---------|-----------|---------|
| onEditTrigger | On edit | Instant analytics refresh (debounced) |
| quickHealthCheckTrigger | Every 15 minutes | Quick health pulse |
| hourlyDataCheckTrigger | Every hour | Data refresh check |
| analyticsRecalculationTrigger | Every 6 hours | Full analytics recalc |
| dailyReportTrigger | Daily at 8 AM | Daily email report |
| weeklyMaintenanceTrigger | Sunday at 3 AM | Weekly data sync |
| monthlyArchiveTrigger | 1st of month at 4 AM | Monthly archive |

### Check Created Sheets

Your spreadsheet should now have these additional sheets:

- **System_Logs** - Error and activity logs
- **System_Health** - Health check history
- **Dashboard** - Visual statistics
- **Countries** - Country name database
- **GSMA_Raw** - Raw GSMA data (populated after first sync)

---

## 🔧 Step 4: Initial Data Fetch (Optional)

The system will automatically fetch data during the first weekly maintenance (Sunday 3 AM). If you want to fetch data immediately:

### Manual Data Fetch

```javascript
// Run this function manually:
fetchAllData()
```

**Note:** This may take several minutes due to API rate limiting.

---

## 📧 Email Reports

### Daily Report (8 AM)
- System health score
- Today's coverage checks
- Top 5 countries
- Cache performance

### Weekly Report (Sunday)
- Week's activity summary
- Trending countries
- System health history
- Data quality score

### Monthly Report (1st of month)
- Monthly statistics
- Unique countries
- Operator counts
- Average health score

### Alert Emails
Sent immediately when:
- System health drops below 50%
- Critical errors occur

**Quiet Hours:** No alerts sent between 10 PM - 7 AM

---

## 🛠️ System Features

### 🤖 Self-Healing
The system automatically:
- Creates missing sheets
- Reinstalls missing triggers
- Rebuilds corrupted cache
- Validates data integrity
- Runs health checks every 15 minutes

### 💾 Smart Caching
4-tier caching system:
1. **Memory** (fastest, temporary)
2. **Script Cache** (6-hour TTL)
3. **Script Properties** (persistent)
4. **Sheet-based** (permanent)

### 📝 Comprehensive Logging
- 5 log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Automatic old log cleanup (30 days)
- Searchable log history
- Color-coded by severity

### 🔒 Security Features
- URL validation (Google/Apple Maps only)
- Input sanitization (XSS prevention)
- Rate limiting
- Security audit functions

---

## 🔍 Monitoring & Troubleshooting

### View System Health

```javascript
// Run this to see current health status:
var health = runSystemHealthCheck(false);
Logger.log(health);
```

### View Recent Logs

```javascript
// Get last 50 log entries:
var logs = getRecentLogs(50);
Logger.log(logs);
```

### View Cache Statistics

```javascript
// Check cache performance:
var hitRate = getCacheHitRate();
Logger.log('Cache Hit Rate: ' + hitRate + '%');
```

### Manual Cache Warmup

```javascript
// If cache is empty:
warmupCache();
```

### Force Data Refresh

```javascript
// Fetch fresh data from all sources:
fetchAllData();
```

---

## 🎛️ Advanced Configuration

### Modify Trigger Schedules

Edit `Config.gs` → `TRIGGERS` section:

```javascript
TRIGGERS: {
  HEALTH_CHECK_INTERVAL: 15,    // Minutes
  DATA_CHECK_INTERVAL: 60,      // Minutes
  ANALYTICS_INTERVAL: 6,        // Hours
  DAILY_REPORT_HOUR: 8,         // Hour (24h format)
  // ... etc
}
```

After changing, **reinstall triggers**:
```javascript
cleanupAllTriggers();
installAllTriggers();
```

### Modify Cache Duration

Edit `Config.gs`:

```javascript
CACHE_DURATION_SECONDS: 21600,  // 6 hours (in seconds)
```

### Modify Log Retention

Edit `Config.gs`:

```javascript
LOG_RETENTION_DAYS: 30,  // Keep logs for 30 days
```

### Change Email Recipient

Edit `Config.gs`:

```javascript
EMAIL_RECIPIENT: 'new.email@example.com',
```

---

## 🚨 Uninstall

To remove all automation but keep your data:

```javascript
UNINSTALL_COVERAGE_CHECKER_SYSTEM();
```

This will:
- Remove all triggers
- Keep all sheets and data intact
- Send confirmation email

---

## 📊 Dashboard Usage

Access the Dashboard sheet to view:
- Total coverage checks
- Total countries
- Total operators
- System health score
- Cache hit rate
- Last data sync timestamp
- GSMA vs nPerf operator counts
- System uptime

Dashboard auto-updates every 6 hours.

---

## ❓ Troubleshooting

### "Cannot access spreadsheet"
**Fix:** Update `SPREADSHEET_ID` in Config.gs with correct ID

### Triggers not running
**Fix:** 
1. Check if triggers are installed (⏰ Triggers in sidebar)
2. Run `INSTALL_COVERAGE_CHECKER_SYSTEM()` again

### No data in operators list
**Fix:**
1. Run `fetchAllData()` manually
2. Check System_Logs sheet for errors
3. Run `warmupCache()` to reload from sheet

### Email reports not received
**Fix:**
1. Check spam folder
2. Verify `EMAIL_RECIPIENT` in Config.gs
3. Check if it's quiet hours (10 PM - 7 AM)
4. Check System_Logs for email errors

### Low cache hit rate
**Fix:**
```javascript
cacheClearAll();
warmupCache();
```

### System health below 50%
**Fix:**
```javascript
var health = runSystemHealthCheck(true);  // Auto-fix enabled
Logger.log(health);
```

---

## 🔄 Maintenance

The system is fully autonomous but you can manually:

### Weekly Maintenance
```javascript
weeklyMaintenanceTrigger();
```

### Monthly Archive
```javascript
monthlyArchiveTrigger();
```

### Clean Old Logs
```javascript
cleanupOldLogs();
```

### Clean Old Data
```javascript
clearOldData(90);  // Clear data older than 90 days
```

---

## 📞 Support

### Check System Logs
Always check `System_Logs` sheet first for error messages.

### Run Diagnostics
```javascript
var diagnostics = runFullDiagnostic();
Logger.log(diagnostics);
```

### Export Analytics
```javascript
var export_data = exportAnalyticsData();
Logger.log(export_data);
```

---

## ✨ System Capabilities

### Fully Autonomous
- ✅ Auto-fetch data from GSMA, nPerf, REST Countries APIs
- ✅ Auto-refresh analytics on every edit
- ✅ Auto-send daily/weekly/monthly reports
- ✅ Auto-detect and fix system issues
- ✅ Auto-cleanup old logs and data
- ✅ Auto-cache management

### Zero Manual Intervention Required
Once installed, the system runs completely on its own!

---

## 📈 Version Information

**Version:** 2.0.0  
**Last Updated:** 2026-01-06  
**Status:** Production Ready

---

## 🎉 You're All Set!

The Coverage Checker system is now fully autonomous and will:
- Automatically fetch and update operator data weekly
- Send you daily reports at 8 AM
- Monitor its own health every 15 minutes
- Auto-fix issues when detected
- Keep everything running smoothly 24/7

**Sit back and let the system work for you! 🚀**

---

Made with ❤️ by MinaSaadallah (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
