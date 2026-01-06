/**
 * AUTOMATIC TRIGGER
 * This runs whenever you paste a link into Column D.
 */
/**
 * This runs automatically. It detects changes in Column D.
 */
function onEditTrigger(e) {
  // 1. Safety check to see if an edit actually happened
  if (!e || !e.range) return;

  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var column = range.getColumn();

  // 2. DEBUG: Logs the edit to the console so you can see if it's working
  Logger.log("Edit detected in sheet: " + sheetName + " at column: " + column);

  // 3. Trigger only for Column D (4) in the "Data" sheet
  if (sheetName === "Data" && column === 4) {
    REFRESH_COUNTRY_ANALYTICS();
  }
}

/**
 * THE MANAGER: Extracts names and ranks them in Analytics starting at G21
 */
function REFRESH_COUNTRY_ANALYTICS() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Data");
  var analyticsSheet = ss.getSheetByName("Analytics");
  
  if (!dataSheet || !analyticsSheet) return;

  var lastRow = dataSheet.getLastRow();
  if (lastRow < 2) return; 

  // Get Entered Link (Col D) and Generated Link (Col E)
  var dataValues = dataSheet.getRange(2, 4, lastRow - 1, 2).getValues(); 
  var countryCounts = {};

  for (var i = 0; i < dataValues.length; i++) {
    var enteredLink = dataValues[i][0];
    var generatedLink = dataValues[i][1];
    var countryName = "";

    // METHOD 1: Use your COUNTRY_CODE_TO_NAME dictionary via Generated Link
    var codeMatch = generatedLink.toString().match(/\/map\/([A-Z]{2})\//);
    if (codeMatch && COUNTRY_CODE_TO_NAME[codeMatch[1]]) {
      countryName = COUNTRY_CODE_TO_NAME[codeMatch[1]];
    } 
    
    // METHOD 2: Geocoding (Converts coordinates to Name)
    if ((!countryName || countryName === "") && enteredLink) {
      try {
        var response = Maps.newGeocoder().geocode(enteredLink.toString());
        if (response.status == 'OK') {
          var components = response.results[0].address_components;
          for (var j = 0; j < components.length; j++) {
            if (components[j].types.includes("country")) {
              countryName = components[j].long_name;
              break;
            }
          }
        }
      } catch (err) { continue; }
    }

    if (countryName) {
      countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
    }
  }

  // Convert object to Array and Sort by highest count
  var sortedData = Object.keys(countryCounts).map(function(name) {
    return [name, countryCounts[name]];
  });
  sortedData.sort(function(a, b) { return b[1] - a[1]; });

  // Update Analytics G2:H
  analyticsSheet.getRange("G2:H100").clearContent();
  if (sortedData.length > 0) {
    analyticsSheet.getRange(2, 7, sortedData.length, 2).setValues(sortedData);
  }
}
