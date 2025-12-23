/**
 * Data Import Script for Coverage Checker
 * 
 * AUTO-GENERATED - Contains 608 operators and 17 territories
 * 
 * HOW TO USE:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Create a new file called "Import" (not Import.gs, just Import)
 * 4. Paste this entire content
 * 5. Run importAllData() from the toolbar (Select function > Run)
 * 6. Authorize when prompted
 */

// ============================================================
// MAIN IMPORT FUNCTION
// ============================================================

function importAllData() {
  importOperators();
  importTerritories();
  SpreadsheetApp.getUi().alert('✅ Import Complete!\n\nCreated sheets:\n• Operators (' + OPERATORS_DATA.length + ' records)\n• Territories (' + Object.keys(TERRITORIES_DATA).length + ' records)');
}

// ============================================================
// OPERATORS IMPORT
// ============================================================

function importOperators() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Operators');
  
  if (!sheet) {
    sheet = ss.insertSheet('Operators');
  } else {
    sheet.clear();
  }
  
  // Set headers
  sheet.appendRow(['countryCode', 'operatorId', 'operatorName', 'link', 'gsmaId']);
  
  // Format headers
  var headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#22c55e');
  headerRange.setFontColor('#ffffff');
  
  // Add data in batches
  var batchSize = 100;
  for (var i = 0; i < OPERATORS_DATA.length; i += batchSize) {
    var batch = OPERATORS_DATA.slice(i, i + batchSize);
    var data = batch.map(function(op) {
      return [
        op.countryCode || '',
        op.operatorId || '',
        op.operatorName || '',
        op.link || '',
        op.gsmaId || ''
      ];
    });
    sheet.getRange(i + 2, 1, data.length, 5).setValues(data);
  }
  
  sheet.autoResizeColumns(1, 5);
  sheet.setFrozenRows(1);
  
  Logger.log('Imported ' + OPERATORS_DATA.length + ' operators');
}

// ============================================================
// TERRITORIES IMPORT
// ============================================================

function importTerritories() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Territories');
  
  if (!sheet) {
    sheet = ss.insertSheet('Territories');
  } else {
    sheet.clear();
  }
  
  sheet.appendRow(['code', 'name', 'parent', 'bboxMinLat', 'bboxMinLng', 'bboxMaxLat', 'bboxMaxLng', 'aliases']);
  
  var headerRange = sheet.getRange(1, 1, 1, 8);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#22c55e');
  headerRange.setFontColor('#ffffff');
  
  var data = [];
  for (var code in TERRITORIES_DATA) {
    var t = TERRITORIES_DATA[code];
    data.push([
      code,
      t.name || '',
      t.parent || '',
      t.bbox ? t.bbox[0] : '',
      t.bbox ? t.bbox[1] : '',
      t.bbox ? t.bbox[2] : '',
      t.bbox ? t.bbox[3] : '',
      t.aliases ? t.aliases.join(', ') : ''
    ]);
  }
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 8).setValues(data);
  }
  
  sheet.autoResizeColumns(1, 8);
  sheet.setFrozenRows(1);
  
  Logger.log('Imported ' + data.length + ' territories');
}

// ============================================================
// OPERATORS DATA (608 operators)
// ============================================================

var OPERATORS_DATA = [
  {
    "countryCode": "AD",
    "operatorId": 2019562,
    "operatorName": "Andorra Mobile",
    "link": "https://www.nperf.com/en/map/AD/-/2019562.Andorra-Mobile/signal",
    "gsmaId": 677,
    "gsmaName": "Andorra Telecom"
  },
  {
    "countryCode": "AE",
    "operatorId": 233827,
    "operatorName": "du Mobile",
    "link": "https://www.nperf.com/en/map/AE/-/233827.du-Mobile/signal",
    "gsmaId": 1067,
    "gsmaName": "du"
  },
  {
    "countryCode": "AE",
    "operatorId": 183761,
    "operatorName": "Etisalat Mobile",
    "link": "https://www.nperf.com/en/map/AE/-/183761.Etisalat-Mobile/signal",
    "gsmaId": 643,
    "gsmaName": "Etisalat (e&)"
  },
  {
    "countryCode": "AF",
    "operatorId": 1995883,
    "operatorName": "Afghan Wireless",
    "link": "https://www.nperf.com/en/map/AF/-/1995883.Afghan-Wireless/signal",
    "gsmaId": 7,
    "gsmaName": "Afghan Wireless (TSI)"
  },
  {
    "countryCode": "AF",
    "operatorId": 1995885,
    "operatorName": "Etisalat Mobile",
    "link": "https://www.nperf.com/en/map/AF/-/1995885.Etisalat-Mobile/signal",
    "gsmaId": 1431,
    "gsmaName": "Etisalat"
  },
  {
    "countryCode": "AF",
    "operatorId": 1995884,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/AF/-/1995884.MTN-Mobile/signal",
    "gsmaId": 1017,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "AF",
    "operatorId": 24423,
    "operatorName": "Roshan",
    "link": "https://www.nperf.com/en/map/AF/-/24423.Roshan/signal",
    "gsmaId": 487,
    "gsmaName": "Roshan (TDCA)"
  },
  {
    "countryCode": "AF",
    "operatorId": 24424,
    "operatorName": "Salaam",
    "link": "https://www.nperf.com/en/map/AF/-/24424.Salaam/signal",
    "gsmaId": 1788,
    "gsmaName": "Salaam (Afghan Telecom)"
  },
  {
    "countryCode": "AL",
    "operatorId": 208118,
    "operatorName": "One Mobile",
    "link": "https://www.nperf.com/en/map/AL/-/208118.One-Mobile/signal",
    "gsmaId": 554,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "AL",
    "operatorId": 208120,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/AL/-/208120.Vodafone-Mobile/signal",
    "gsmaId": 554,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "AM",
    "operatorId": 1995867,
    "operatorName": "Beeline Mobile",
    "link": "https://www.nperf.com/en/map/AM/-/1995867.Beeline-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "AM",
    "operatorId": 1995873,
    "operatorName": "Ucom Mobile",
    "link": "https://www.nperf.com/en/map/AM/-/1995873.Ucom-Mobile/signal",
    "gsmaId": 2074,
    "gsmaName": "Ucom"
  },
  {
    "countryCode": "AM",
    "operatorId": 1995870,
    "operatorName": "Viva MTS Mobile",
    "link": "https://www.nperf.com/en/map/AM/-/1995870.Viva-MTS-Mobile/signal",
    "gsmaId": 927,
    "gsmaName": "Viva-MTS"
  },
  {
    "countryCode": "AO",
    "operatorId": 2019555,
    "operatorName": "Africell Mobile",
    "link": "https://www.nperf.com/en/map/AO/-/2019555.Africell-Mobile/signal",
    "gsmaId": 8759,
    "gsmaName": "Africell"
  },
  {
    "countryCode": "AO",
    "operatorId": 220839,
    "operatorName": "Movicel Mobile",
    "link": "https://www.nperf.com/en/map/AO/-/220839.Movicel-Mobile/signal",
    "gsmaId": 689,
    "gsmaName": "Movicel"
  },
  {
    "countryCode": "AO",
    "operatorId": 220836,
    "operatorName": "Unitel Mobile",
    "link": "https://www.nperf.com/en/map/AO/-/220836.Unitel-Mobile/signal",
    "gsmaId": 542,
    "gsmaName": "Unitel"
  },
  {
    "countryCode": "AR",
    "operatorId": 152383,
    "operatorName": "Claro Móvil",
    "link": "https://www.nperf.com/en/map/AR/-/152383.Claro-Mvil/signal",
    "gsmaId": 132,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "AR",
    "operatorId": 152392,
    "operatorName": "Movistar Móvil",
    "link": "https://www.nperf.com/en/map/AR/-/152392.Movistar-Mvil/signal",
    "gsmaId": 497,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "AR",
    "operatorId": 152394,
    "operatorName": "Personal Móvil",
    "link": "https://www.nperf.com/en/map/AR/-/152394.Personal-Mvil/signal",
    "gsmaId": 489,
    "gsmaName": "Personal (Telecom Argentina)"
  },
  {
    "countryCode": "AT",
    "operatorId": 63446,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/AT/-/63446.A1-Mobile/signal",
    "gsmaId": 300,
    "gsmaName": "A1 Telekom"
  },
  {
    "countryCode": "AT",
    "operatorId": 187889,
    "operatorName": "Drei Mobile",
    "link": "https://www.nperf.com/en/map/AT/-/187889.Drei-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "AT",
    "operatorId": 2106706,
    "operatorName": "Magenta Mobile",
    "link": "https://www.nperf.com/en/map/AT/-/2106706.Magenta-Mobile/signal",
    "gsmaId": 461,
    "gsmaName": "Magenta Telekom (Deutsche Telekom)"
  },
  {
    "countryCode": "AU",
    "operatorId": 2106709,
    "operatorName": "Optus Mobile",
    "link": "https://www.nperf.com/en/map/AU/-/2106709.Optus-Mobile/signal",
    "gsmaId": 429,
    "gsmaName": "Optus (Singtel)"
  },
  {
    "countryCode": "AU",
    "operatorId": 2106712,
    "operatorName": "Telstra Mobile",
    "link": "https://www.nperf.com/en/map/AU/-/2106712.Telstra-Mobile/signal",
    "gsmaId": 515,
    "gsmaName": "Telstra"
  },
  {
    "countryCode": "AU",
    "operatorId": 2106714,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/AU/-/2106714.Vodafone-Mobile/signal",
    "gsmaId": 210,
    "gsmaName": "Vodafone (TPG Telecom)"
  },
  {
    "countryCode": "AW",
    "operatorId": 2003920,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/AW/-/2003920.Digicel-Mobile/signal",
    "gsmaId": 793,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "AW",
    "operatorId": 2003918,
    "operatorName": "Setar Mobile",
    "link": "https://www.nperf.com/en/map/AW/-/2003918.Setar-Mobile/signal",
    "gsmaId": 419,
    "gsmaName": "SETAR"
  },
  {
    "countryCode": "AZ",
    "operatorId": 1995877,
    "operatorName": "Azercell Mobile",
    "link": "https://www.nperf.com/en/map/AZ/-/1995877.Azercell-Mobile/signal",
    "gsmaId": 33,
    "gsmaName": "Azercell (Azintelecom)"
  },
  {
    "countryCode": "AZ",
    "operatorId": 1995879,
    "operatorName": "Bakcell Mobile",
    "link": "https://www.nperf.com/en/map/AZ/-/1995879.Bakcell-Mobile/signal",
    "gsmaId": 233,
    "gsmaName": "Bakcell"
  },
  {
    "countryCode": "AZ",
    "operatorId": 1995880,
    "operatorName": "Nar Mobile",
    "link": "https://www.nperf.com/en/map/AZ/-/1995880.Nar-Mobile/signal",
    "gsmaId": 1224,
    "gsmaName": "Nar (Azerfon)"
  },
  {
    "countryCode": "AZ",
    "operatorId": 1995882,
    "operatorName": "Naxtel Mobile",
    "link": "https://www.nperf.com/en/map/AZ/-/1995882.Naxtel-Mobile/signal",
    "gsmaId": 5885,
    "gsmaName": "Naxtel; Nakhchivan"
  },
  {
    "countryCode": "BA",
    "operatorId": 208115,
    "operatorName": "BH Mobile",
    "link": "https://www.nperf.com/en/map/BA/-/208115.BH-Mobile/signal",
    "gsmaId": 44,
    "gsmaName": "BH Telecom"
  },
  {
    "countryCode": "BA",
    "operatorId": 208109,
    "operatorName": "HT-Eronet Mobile",
    "link": "https://www.nperf.com/en/map/BA/-/208109.HT-Eronet-Mobile/signal",
    "gsmaId": 173,
    "gsmaName": "HT Eronet (HT Mostar)"
  },
  {
    "countryCode": "BA",
    "operatorId": 208112,
    "operatorName": "m:tel Mobile",
    "link": "https://www.nperf.com/en/map/BA/-/208112.mtel-Mobile/signal",
    "gsmaId": 408,
    "gsmaName": "m:tel (Telekom Srpske)"
  },
  {
    "countryCode": "BD",
    "operatorId": 5900,
    "operatorName": "Banglalink",
    "link": "https://www.nperf.com/en/map/BD/-/5900.Banglalink/signal",
    "gsmaId": 422,
    "gsmaName": "banglalink (VEON)"
  },
  {
    "countryCode": "BD",
    "operatorId": 11131,
    "operatorName": "GrameenPhone",
    "link": "https://www.nperf.com/en/map/BD/-/11131.GrameenPhone/signal",
    "gsmaId": 195,
    "gsmaName": "Grameenphone (Telenor)"
  },
  {
    "countryCode": "BD",
    "operatorId": 11597,
    "operatorName": "Robi/Airtel",
    "link": "https://www.nperf.com/en/map/BD/-/11597.RobiAirtel/signal",
    "gsmaId": 673,
    "gsmaName": "Robi (Axiata)"
  },
  {
    "countryCode": "BD",
    "operatorId": 14226,
    "operatorName": "TeleTalk",
    "link": "https://www.nperf.com/en/map/BD/-/14226.TeleTalk/signal",
    "gsmaId": 956,
    "gsmaName": "Teletalk"
  },
  {
    "countryCode": "BE",
    "operatorId": 201612,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/BE/-/201612.Orange-Mobile/signal",
    "gsmaId": 304,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "BE",
    "operatorId": 1999754,
    "operatorName": "Proximus",
    "link": "https://www.nperf.com/en/map/BE/-/1999754.Proximus/signal",
    "gsmaId": 41,
    "gsmaName": "Proximus"
  },
  {
    "countryCode": "BE",
    "operatorId": 154476,
    "operatorName": "Telenet Mobile",
    "link": "https://www.nperf.com/en/map/BE/-/154476.Telenet-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BF",
    "operatorId": 1993616,
    "operatorName": "Moov Africa Mobile",
    "link": "https://www.nperf.com/en/map/BF/-/1993616.Moov-Africa-Mobile/signal",
    "gsmaId": 695,
    "gsmaName": "Moov Africa (Maroc Telecom)"
  },
  {
    "countryCode": "BF",
    "operatorId": 220673,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/BF/-/220673.Orange-Mobile/signal",
    "gsmaId": 87,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "BF",
    "operatorId": 220674,
    "operatorName": "Telecel Mobile",
    "link": "https://www.nperf.com/en/map/BF/-/220674.Telecel-Mobile/signal",
    "gsmaId": 696,
    "gsmaName": "Telecel Faso (Planor afrique)"
  },
  {
    "countryCode": "BG",
    "operatorId": 196721,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/BG/-/196721.A1-Mobile/signal",
    "gsmaId": 301,
    "gsmaName": "A1"
  },
  {
    "countryCode": "BG",
    "operatorId": 86759,
    "operatorName": "Bulsatcom Mobile",
    "link": "https://www.nperf.com/en/map/BG/-/86759.Bulsatcom-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BG",
    "operatorId": 7933,
    "operatorName": "Ti.com",
    "link": "https://www.nperf.com/en/map/BG/-/7933.Ticom/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BG",
    "operatorId": 196718,
    "operatorName": "Vivacom Mobile",
    "link": "https://www.nperf.com/en/map/BG/-/196718.Vivacom-Mobile/signal",
    "gsmaId": 837,
    "gsmaName": "VIVACOM (United)"
  },
  {
    "countryCode": "BG",
    "operatorId": 196723,
    "operatorName": "Yettel Mobile",
    "link": "https://www.nperf.com/en/map/BG/-/196723.Yettel-Mobile/signal",
    "gsmaId": 125,
    "gsmaName": "Yettel (PPF)"
  },
  {
    "countryCode": "BH",
    "operatorId": 2106717,
    "operatorName": "Batelco Mobile",
    "link": "https://www.nperf.com/en/map/BH/-/2106717.Batelco-Mobile/signal",
    "gsmaId": 690,
    "gsmaName": "Batelco"
  },
  {
    "countryCode": "BH",
    "operatorId": 2106719,
    "operatorName": "STC Mobile",
    "link": "https://www.nperf.com/en/map/BH/-/2106719.STC-Mobile/signal",
    "gsmaId": 1945,
    "gsmaName": "STC"
  },
  {
    "countryCode": "BH",
    "operatorId": 2106720,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/BH/-/2106720.Zain-Mobile/signal",
    "gsmaId": 316,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "BI",
    "operatorId": 223564,
    "operatorName": "Econet Mobile",
    "link": "https://www.nperf.com/en/map/BI/-/223564.Econet-Mobile/signal",
    "gsmaId": 698,
    "gsmaName": "Econet Wireless"
  },
  {
    "countryCode": "BI",
    "operatorId": 223574,
    "operatorName": "Lumitel Mobile",
    "link": "https://www.nperf.com/en/map/BI/-/223574.Lumitel-Mobile/signal",
    "gsmaId": 5760,
    "gsmaName": "Lumitel (Viettel)"
  },
  {
    "countryCode": "BI",
    "operatorId": 223569,
    "operatorName": "Onatel Mobile",
    "link": "https://www.nperf.com/en/map/BI/-/223569.Onatel-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BI",
    "operatorId": 223572,
    "operatorName": "Smart Mobile",
    "link": "https://www.nperf.com/en/map/BI/-/223572.Smart-Mobile/signal",
    "gsmaId": 1797,
    "gsmaName": "Smart"
  },
  {
    "countryCode": "BJ",
    "operatorId": 2023189,
    "operatorName": "Celtiis Mobile",
    "link": "https://www.nperf.com/en/map/BJ/-/2023189.Celtiis-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BJ",
    "operatorId": 220680,
    "operatorName": "Moov Africa Mobile",
    "link": "https://www.nperf.com/en/map/BJ/-/220680.Moov-Africa-Mobile/signal",
    "gsmaId": 481,
    "gsmaName": "Moov Africa (Maroc Telecom)"
  },
  {
    "countryCode": "BJ",
    "operatorId": 220675,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/BJ/-/220675.MTN-Mobile/signal",
    "gsmaId": 446,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "BL",
    "operatorId": 122554,
    "operatorName": "Dauphin Mobile",
    "link": "https://www.nperf.com/en/map/BL/-/122554.Dauphin-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BL",
    "operatorId": 122563,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/BL/-/122563.Digicel-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BL",
    "operatorId": 2009738,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/BL/-/2009738.Free-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BL",
    "operatorId": 122551,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/BL/-/122551.Orange-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BO",
    "operatorId": 167642,
    "operatorName": "Entel Mobile",
    "link": "https://www.nperf.com/en/map/BO/-/167642.Entel-Mobile/signal",
    "gsmaId": 168,
    "gsmaName": "Entel"
  },
  {
    "countryCode": "BO",
    "operatorId": 167640,
    "operatorName": "Tigo Mobile",
    "link": "https://www.nperf.com/en/map/BO/-/167640.Tigo-Mobile/signal",
    "gsmaId": 692,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "BO",
    "operatorId": 5288,
    "operatorName": "Viva Mobile",
    "link": "https://www.nperf.com/en/map/BO/-/5288.Viva-Mobile/signal",
    "gsmaId": 340,
    "gsmaName": "VIVA (Balesia Technologies)"
  },
  {
    "countryCode": "BQ",
    "operatorId": 2003927,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/BQ/-/2003927.Digicel-Mobile/signal",
    "gsmaId": 134,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "BQ",
    "operatorId": 2003933,
    "operatorName": "Flow Mobile",
    "link": "https://www.nperf.com/en/map/BQ/-/2003933.Flow-Mobile/signal",
    "gsmaId": 811,
    "gsmaName": "Flow (Liberty Latin America)"
  },
  {
    "countryCode": "BQ",
    "operatorId": 2003930,
    "operatorName": "Kla Mobile",
    "link": "https://www.nperf.com/en/map/BQ/-/2003930.Kla-Mobile/signal",
    "gsmaId": 5806,
    "gsmaName": "Kla Mobile (Telbo)"
  },
  {
    "countryCode": "BR",
    "operatorId": 197861,
    "operatorName": "Algar Mobile",
    "link": "https://www.nperf.com/en/map/BR/-/197861.Algar-Mobile/signal",
    "gsmaId": 675,
    "gsmaName": "Algar Telecom"
  },
  {
    "countryCode": "BR",
    "operatorId": 2089108,
    "operatorName": "Brisanet Mobile",
    "link": "https://www.nperf.com/en/map/BR/-/2089108.Brisanet-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "BR",
    "operatorId": 169094,
    "operatorName": "Claro Mobile",
    "link": "https://www.nperf.com/en/map/BR/-/169094.Claro-Mobile/signal",
    "gsmaId": 630,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "BR",
    "operatorId": 161679,
    "operatorName": "Oi Mobile",
    "link": "https://www.nperf.com/en/map/BR/-/161679.Oi-Mobile/signal",
    "gsmaId": 649,
    "gsmaName": "Oi"
  },
  {
    "countryCode": "BR",
    "operatorId": 161694,
    "operatorName": "TIM Mobile",
    "link": "https://www.nperf.com/en/map/BR/-/161694.TIM-Mobile/signal",
    "gsmaId": 881,
    "gsmaName": "TIM (Telecom Italia)"
  },
  {
    "countryCode": "BR",
    "operatorId": 161704,
    "operatorName": "Vivo Mobile",
    "link": "https://www.nperf.com/en/map/BR/-/161704.Vivo-Mobile/signal",
    "gsmaId": 620,
    "gsmaName": "Vivo (Telefonica)"
  },
  {
    "countryCode": "BT",
    "operatorId": 2026859,
    "operatorName": "B-Mobile",
    "link": "https://www.nperf.com/en/map/BT/-/2026859.B-Mobile/signal",
    "gsmaId": 34,
    "gsmaName": "B-Mobile (Bhutan Telecom)"
  },
  {
    "countryCode": "BT",
    "operatorId": 2026861,
    "operatorName": "TashiCell",
    "link": "https://www.nperf.com/en/map/BT/-/2026861.TashiCell/signal",
    "gsmaId": 1804,
    "gsmaName": "TashiCell"
  },
  {
    "countryCode": "BW",
    "operatorId": 220819,
    "operatorName": "BTC Mobile",
    "link": "https://www.nperf.com/en/map/BW/-/220819.BTC-Mobile/signal",
    "gsmaId": 1806,
    "gsmaName": "btc"
  },
  {
    "countryCode": "BW",
    "operatorId": 220816,
    "operatorName": "Mascom Mobile",
    "link": "https://www.nperf.com/en/map/BW/-/220816.Mascom-Mobile/signal",
    "gsmaId": 271,
    "gsmaName": "Mascom (MTN)"
  },
  {
    "countryCode": "BW",
    "operatorId": 220817,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/BW/-/220817.Orange-Mobile/signal",
    "gsmaId": 356,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "BY",
    "operatorId": 188922,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/BY/-/188922.A1-Mobile/signal",
    "gsmaId": 650,
    "gsmaName": "A1"
  },
  {
    "countryCode": "BY",
    "operatorId": 5401,
    "operatorName": "Life:)",
    "link": "https://www.nperf.com/en/map/BY/-/5401.Life/signal",
    "gsmaId": 973,
    "gsmaName": "life:) (Turkcell)"
  },
  {
    "countryCode": "BY",
    "operatorId": 2106722,
    "operatorName": "MTS Mobile",
    "link": "https://www.nperf.com/en/map/BY/-/2106722.MTS-Mobile/signal",
    "gsmaId": 648,
    "gsmaName": "MTS"
  },
  {
    "countryCode": "BZ",
    "operatorId": 169640,
    "operatorName": "DigiCell",
    "link": "https://www.nperf.com/en/map/BZ/-/169640.DigiCell/signal",
    "gsmaId": 885,
    "gsmaName": "DigiCell (Digi)"
  },
  {
    "countryCode": "BZ",
    "operatorId": 2106724,
    "operatorName": "Smart Mobile",
    "link": "https://www.nperf.com/en/map/BZ/-/2106724.Smart-Mobile/signal",
    "gsmaId": 1410,
    "gsmaName": "Smart (Speednet)"
  },
  {
    "countryCode": "CA",
    "operatorId": 5564,
    "operatorName": "Bell Mobility",
    "link": "https://www.nperf.com/en/map/CA/-/5564.Bell-Mobility/signal",
    "gsmaId": 631,
    "gsmaName": "Bell (BCE)"
  },
  {
    "countryCode": "CA",
    "operatorId": 2106731,
    "operatorName": "Bell MTS Mobile",
    "link": "https://www.nperf.com/en/map/CA/-/2106731.Bell-MTS-Mobile/signal",
    "gsmaId": 631,
    "gsmaName": "Bell (BCE)"
  },
  {
    "countryCode": "CA",
    "operatorId": 2106728,
    "operatorName": "EastLink Mobile",
    "link": "https://www.nperf.com/en/map/CA/-/2106728.EastLink-Mobile/signal",
    "gsmaId": 3261,
    "gsmaName": "EastLink (Bragg Communications)"
  },
  {
    "countryCode": "CA",
    "operatorId": 9272,
    "operatorName": "Freedom Mobile",
    "link": "https://www.nperf.com/en/map/CA/-/9272.Freedom-Mobile/signal",
    "gsmaId": 1951,
    "gsmaName": "Freedom Mobile (Shaw Communications)"
  },
  {
    "countryCode": "CA",
    "operatorId": 5651,
    "operatorName": "Rogers Wireless",
    "link": "https://www.nperf.com/en/map/CA/-/5651.Rogers-Wireless/signal",
    "gsmaId": 406,
    "gsmaName": "Rogers"
  },
  {
    "countryCode": "CA",
    "operatorId": 2106735,
    "operatorName": "SaskTel Mobile",
    "link": "https://www.nperf.com/en/map/CA/-/2106735.SaskTel-Mobile/signal",
    "gsmaId": 896,
    "gsmaName": "SaskTel"
  },
  {
    "countryCode": "CA",
    "operatorId": 331,
    "operatorName": "Telus Mobility",
    "link": "https://www.nperf.com/en/map/CA/-/331.Telus-Mobility/signal",
    "gsmaId": 614,
    "gsmaName": "Telus"
  },
  {
    "countryCode": "CA",
    "operatorId": 19589,
    "operatorName": "Videotron/Fizz",
    "link": "https://www.nperf.com/en/map/CA/-/19589.VideotronFizz/signal",
    "gsmaId": 1954,
    "gsmaName": "Videotron (Quebecor Media)"
  },
  {
    "countryCode": "CD",
    "operatorId": 51732,
    "operatorName": "Africell",
    "link": "https://www.nperf.com/en/map/CD/-/51732.Africell/signal",
    "gsmaId": 1958,
    "gsmaName": "Africell (Lintel)"
  },
  {
    "countryCode": "CD",
    "operatorId": 10496,
    "operatorName": "Airtel",
    "link": "https://www.nperf.com/en/map/CD/-/10496.Airtel/signal",
    "gsmaId": 89,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "CD",
    "operatorId": 5932,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/CD/-/5932.Orange-Mobile/signal",
    "gsmaId": 865,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "CD",
    "operatorId": 168,
    "operatorName": "Vodacom",
    "link": "https://www.nperf.com/en/map/CD/-/168.Vodacom/signal",
    "gsmaId": 550,
    "gsmaName": "Vodacom"
  },
  {
    "countryCode": "CF",
    "operatorId": 220809,
    "operatorName": "Moov Mobile",
    "link": "https://www.nperf.com/en/map/CF/-/220809.Moov-Mobile/signal",
    "gsmaId": 702,
    "gsmaName": "Moov (Maroc Telecom)"
  },
  {
    "countryCode": "CF",
    "operatorId": 220812,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/CF/-/220812.Orange-Mobile/signal",
    "gsmaId": 1805,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "CF",
    "operatorId": 220811,
    "operatorName": "Telecel Mobile",
    "link": "https://www.nperf.com/en/map/CF/-/220811.Telecel-Mobile/signal",
    "gsmaId": 1870,
    "gsmaName": "Telecel"
  },
  {
    "countryCode": "CG",
    "operatorId": 220721,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/CG/-/220721.Airtel-Mobile/signal",
    "gsmaId": 89,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "CG",
    "operatorId": 220722,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/CG/-/220722.MTN-Mobile/signal",
    "gsmaId": 599,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "CH",
    "operatorId": 152726,
    "operatorName": "Salt Mobile",
    "link": "https://www.nperf.com/en/map/CH/-/152726.Salt-Mobile/signal",
    "gsmaId": 362,
    "gsmaName": "Salt (NJJ)"
  },
  {
    "countryCode": "CH",
    "operatorId": 152732,
    "operatorName": "Sunrise Mobile",
    "link": "https://www.nperf.com/en/map/CH/-/152732.Sunrise-Mobile/signal",
    "gsmaId": 474,
    "gsmaName": "Sunrise (Liberty Global)"
  },
  {
    "countryCode": "CH",
    "operatorId": 152755,
    "operatorName": "Swisscom Mobile",
    "link": "https://www.nperf.com/en/map/CH/-/152755.Swisscom-Mobile/signal",
    "gsmaId": 457,
    "gsmaName": "Swisscom"
  },
  {
    "countryCode": "CI",
    "operatorId": 2000260,
    "operatorName": "Moov Africa Mobile",
    "link": "https://www.nperf.com/en/map/CI/-/2000260.Moov-Africa-Mobile/signal",
    "gsmaId": 1211,
    "gsmaName": "Unitel T+"
  },
  {
    "countryCode": "CI",
    "operatorId": 2000262,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/CI/-/2000262.MTN-Mobile/signal",
    "gsmaId": 265,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "CI",
    "operatorId": 153084,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/CI/-/153084.Orange-Mobile/signal",
    "gsmaId": 631,
    "gsmaName": "Bell (BCE)"
  },
  {
    "countryCode": "CL",
    "operatorId": 163636,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/CL/-/163636.Claro-Movil/signal",
    "gsmaId": 676,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "CL",
    "operatorId": 163635,
    "operatorName": "Entel Movil",
    "link": "https://www.nperf.com/en/map/CL/-/163635.Entel-Movil/signal",
    "gsmaId": 167,
    "gsmaName": "Entel"
  },
  {
    "countryCode": "CL",
    "operatorId": 4069,
    "operatorName": "Movistar Movil",
    "link": "https://www.nperf.com/en/map/CL/-/4069.Movistar-Movil/signal",
    "gsmaId": 494,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "CL",
    "operatorId": 277917,
    "operatorName": "WOM Movil",
    "link": "https://www.nperf.com/en/map/CL/-/277917.WOM-Movil/signal",
    "gsmaId": 1456,
    "gsmaName": "WOM (Novator)"
  },
  {
    "countryCode": "CM",
    "operatorId": 2106740,
    "operatorName": "Camtel / Blue Mobile",
    "link": "https://www.nperf.com/en/map/CM/-/2106740.Camtel--Blue-Mobile/signal",
    "gsmaId": 1643,
    "gsmaName": "CamTel"
  },
  {
    "countryCode": "CM",
    "operatorId": 2106741,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/CM/-/2106741.MTN-Mobile/signal",
    "gsmaId": 318,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "CM",
    "operatorId": 12606,
    "operatorName": "Nexttel",
    "link": "https://www.nperf.com/en/map/CM/-/12606.Nexttel/signal",
    "gsmaId": 5667,
    "gsmaName": "Nexttel (Viettel)"
  },
  {
    "countryCode": "CM",
    "operatorId": 153100,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/CM/-/153100.Orange-Mobile/signal",
    "gsmaId": 359,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "CN",
    "operatorId": 2106744,
    "operatorName": "China Mobile",
    "link": "https://www.nperf.com/en/map/CN/-/2106744.China-Mobile/signal",
    "gsmaId": 101,
    "gsmaName": "China Mobile"
  },
  {
    "countryCode": "CN",
    "operatorId": 7204,
    "operatorName": "China Telecom Mobile",
    "link": "https://www.nperf.com/en/map/CN/-/7204.China-Telecom-Mobile/signal",
    "gsmaId": 101,
    "gsmaName": "China Mobile"
  },
  {
    "countryCode": "CN",
    "operatorId": 2106747,
    "operatorName": "China Unicom Mobile",
    "link": "https://www.nperf.com/en/map/CN/-/2106747.China-Unicom-Mobile/signal",
    "gsmaId": 101,
    "gsmaName": "China Mobile"
  },
  {
    "countryCode": "CO",
    "operatorId": 198197,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/CO/-/198197.Claro-Movil/signal",
    "gsmaId": 119,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "CO",
    "operatorId": 163596,
    "operatorName": "ETB Movil (MVNO)",
    "link": "https://www.nperf.com/en/map/CO/-/163596.ETB-Movil-MVNO/signal",
    "gsmaId": 5662,
    "gsmaName": "ETB"
  },
  {
    "countryCode": "CO",
    "operatorId": 7239,
    "operatorName": "Movistar Movil",
    "link": "https://www.nperf.com/en/map/CO/-/7239.Movistar-Movil/signal",
    "gsmaId": 641,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "CO",
    "operatorId": 11016,
    "operatorName": "Tigo Movil",
    "link": "https://www.nperf.com/en/map/CO/-/11016.Tigo-Movil/signal",
    "gsmaId": 112,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "CO",
    "operatorId": 28929,
    "operatorName": "WOM / Avantel",
    "link": "https://www.nperf.com/en/map/CO/-/28929.WOM--Avantel/signal",
    "gsmaId": 1957,
    "gsmaName": "Avantel (Novator)"
  },
  {
    "countryCode": "CR",
    "operatorId": 198186,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/CR/-/198186.Claro-Movil/signal",
    "gsmaId": 4078,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "CR",
    "operatorId": 198185,
    "operatorName": "Kolbi Movil",
    "link": "https://www.nperf.com/en/map/CR/-/198185.Kolbi-Movil/signal",
    "gsmaId": 221,
    "gsmaName": "kolbi (ICE)"
  },
  {
    "countryCode": "CR",
    "operatorId": 2848,
    "operatorName": "Liberty Movil",
    "link": "https://www.nperf.com/en/map/CR/-/2848.Liberty-Movil/signal",
    "gsmaId": 4079,
    "gsmaName": "Liberty (Liberty Latin America)"
  },
  {
    "countryCode": "CU",
    "operatorId": 1995978,
    "operatorName": "Cubacel",
    "link": "https://www.nperf.com/en/map/CU/-/1995978.Cubacel/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "CV",
    "operatorId": 2036230,
    "operatorName": "CVMovel",
    "link": "https://www.nperf.com/en/map/CV/-/2036230.CVMovel/signal",
    "gsmaId": 68,
    "gsmaName": "CVMovel (Cabo Verde Telecom)"
  },
  {
    "countryCode": "CV",
    "operatorId": 2036232,
    "operatorName": "Unitel T+",
    "link": "https://www.nperf.com/en/map/CV/-/2036232.Unitel-T/signal",
    "gsmaId": 1211,
    "gsmaName": "Unitel T+"
  },
  {
    "countryCode": "CW",
    "operatorId": 2003937,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/CW/-/2003937.Digicel-Mobile/signal",
    "gsmaId": 1837,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "CW",
    "operatorId": 2003938,
    "operatorName": "Flow Mobile",
    "link": "https://www.nperf.com/en/map/CW/-/2003938.Flow-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "CY",
    "operatorId": 169674,
    "operatorName": "Cyta-Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/CY/-/169674.Cyta-Vodafone-Mobile/signal",
    "gsmaId": 838,
    "gsmaName": "Cytamobile-Vodafone"
  },
  {
    "countryCode": "CY",
    "operatorId": 169673,
    "operatorName": "Epic Mobile",
    "link": "https://www.nperf.com/en/map/CY/-/169673.Epic-Mobile/signal",
    "gsmaId": 414,
    "gsmaName": "epic"
  },
  {
    "countryCode": "CY",
    "operatorId": 169676,
    "operatorName": "PrimeTel Mobile",
    "link": "https://www.nperf.com/en/map/CY/-/169676.PrimeTel-Mobile/signal",
    "gsmaId": 5694,
    "gsmaName": "PrimeTel"
  },
  {
    "countryCode": "CZ",
    "operatorId": 7795,
    "operatorName": "O2 Mobile",
    "link": "https://www.nperf.com/en/map/CZ/-/7795.O2-Mobile/signal",
    "gsmaId": 175,
    "gsmaName": "O2 (PPF)"
  },
  {
    "countryCode": "CZ",
    "operatorId": 164049,
    "operatorName": "T-Mobile",
    "link": "https://www.nperf.com/en/map/CZ/-/164049.T-Mobile/signal",
    "gsmaId": 462,
    "gsmaName": "T-Mobile (Deutsche Telekom)"
  },
  {
    "countryCode": "CZ",
    "operatorId": 164040,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/CZ/-/164040.Vodafone-Mobile/signal",
    "gsmaId": 98,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "DE",
    "operatorId": 187893,
    "operatorName": "O2 Mobile",
    "link": "https://www.nperf.com/en/map/DE/-/187893.O2-Mobile/signal",
    "gsmaId": 341,
    "gsmaName": "O2 (Telefonica)"
  },
  {
    "countryCode": "DE",
    "operatorId": 187895,
    "operatorName": "Telekom Mobile",
    "link": "https://www.nperf.com/en/map/DE/-/187895.Telekom-Mobile/signal",
    "gsmaId": 463,
    "gsmaName": "Telekom (Deutsche Telekom)"
  },
  {
    "countryCode": "DE",
    "operatorId": 169022,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/DE/-/169022.Vodafone-Mobile/signal",
    "gsmaId": 555,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "DJ",
    "operatorId": 223621,
    "operatorName": "Evatis Mobile",
    "link": "https://www.nperf.com/en/map/DJ/-/223621.Evatis-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "DK",
    "operatorId": 2980,
    "operatorName": "3 Tre",
    "link": "https://www.nperf.com/en/map/DK/-/2980.3-Tre/signal",
    "gsmaId": 203,
    "gsmaName": "3 (CK Hutchison)"
  },
  {
    "countryCode": "DK",
    "operatorId": 2107064,
    "operatorName": "Norlys Mobile",
    "link": "https://www.nperf.com/en/map/DK/-/2107064.Norlys-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "DK",
    "operatorId": 146241,
    "operatorName": "TDC Mobile",
    "link": "https://www.nperf.com/en/map/DK/-/146241.TDC-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "DK",
    "operatorId": 146242,
    "operatorName": "Telenor Mobile",
    "link": "https://www.nperf.com/en/map/DK/-/146242.Telenor-Mobile/signal",
    "gsmaId": 441,
    "gsmaName": "Telenor"
  },
  {
    "countryCode": "DO",
    "operatorId": 176282,
    "operatorName": "Altice Mobile",
    "link": "https://www.nperf.com/en/map/DO/-/176282.Altice-Mobile/signal",
    "gsmaId": 363,
    "gsmaName": "Altice"
  },
  {
    "countryCode": "DO",
    "operatorId": 176284,
    "operatorName": "Claro Mobile",
    "link": "https://www.nperf.com/en/map/DO/-/176284.Claro-Mobile/signal",
    "gsmaId": 708,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "DO",
    "operatorId": 2107070,
    "operatorName": "Viva Mobile",
    "link": "https://www.nperf.com/en/map/DO/-/2107070.Viva-Mobile/signal",
    "gsmaId": 707,
    "gsmaName": "Viva (Telemicro)"
  },
  {
    "countryCode": "DZ",
    "operatorId": 1226,
    "operatorName": "Djezzy",
    "link": "https://www.nperf.com/en/map/DZ/-/1226.Djezzy/signal",
    "gsmaId": 597,
    "gsmaName": "Djezzy"
  },
  {
    "countryCode": "DZ",
    "operatorId": 18787,
    "operatorName": "Mobilis ATM",
    "link": "https://www.nperf.com/en/map/DZ/-/18787.Mobilis-ATM/signal",
    "gsmaId": 17,
    "gsmaName": "Mobilis (Algerie Telecom)"
  },
  {
    "countryCode": "DZ",
    "operatorId": 57,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/DZ/-/57.Ooredoo-Mobile/signal",
    "gsmaId": 574,
    "gsmaName": "Ooredoo (NMTC)"
  },
  {
    "countryCode": "EC",
    "operatorId": 8263,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/EC/-/8263.Claro-Movil/signal",
    "gsmaId": 121,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "EC",
    "operatorId": 163678,
    "operatorName": "CNT Movil",
    "link": "https://www.nperf.com/en/map/EC/-/163678.CNT-Movil/signal",
    "gsmaId": 882,
    "gsmaName": "CNT"
  },
  {
    "countryCode": "EC",
    "operatorId": 11134,
    "operatorName": "Movistar Movil",
    "link": "https://www.nperf.com/en/map/EC/-/11134.Movistar-Movil/signal",
    "gsmaId": 709,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "EE",
    "operatorId": 2107082,
    "operatorName": "Elisa Mobile",
    "link": "https://www.nperf.com/en/map/EE/-/2107082.Elisa-Mobile/signal",
    "gsmaId": 401,
    "gsmaName": "Elisa"
  },
  {
    "countryCode": "EE",
    "operatorId": 2107079,
    "operatorName": "Tele2 Mobile",
    "link": "https://www.nperf.com/en/map/EE/-/2107079.Tele2-Mobile/signal",
    "gsmaId": 480,
    "gsmaName": "Tele2"
  },
  {
    "countryCode": "EE",
    "operatorId": 2107073,
    "operatorName": "Telia Mobile",
    "link": "https://www.nperf.com/en/map/EE/-/2107073.Telia-Mobile/signal",
    "gsmaId": 26,
    "gsmaName": "Telia"
  },
  {
    "countryCode": "EG",
    "operatorId": 153097,
    "operatorName": "Etisalat Mobile",
    "link": "https://www.nperf.com/en/map/EG/-/153097.Etisalat-Mobile/signal",
    "gsmaId": 1215,
    "gsmaName": "Etisalat"
  },
  {
    "countryCode": "EG",
    "operatorId": 153088,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/EG/-/153088.Orange-Mobile/signal",
    "gsmaId": 632,
    "gsmaName": "Orange (ECMS)"
  },
  {
    "countryCode": "EG",
    "operatorId": 153090,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/EG/-/153090.Vodafone-Mobile/signal",
    "gsmaId": 556,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "EG",
    "operatorId": 153098,
    "operatorName": "WE",
    "link": "https://www.nperf.com/en/map/EG/-/153098.WE/signal",
    "gsmaId": 5438,
    "gsmaName": "We (Telecom Egypt)"
  },
  {
    "countryCode": "ES",
    "operatorId": 168904,
    "operatorName": "MasMovil/Yoigo Movil",
    "link": "https://www.nperf.com/en/map/ES/-/168904.MasMovilYoigo-Movil/signal",
    "gsmaId": 1147,
    "gsmaName": "Yoigo (Masmovil)"
  },
  {
    "countryCode": "ES",
    "operatorId": 168910,
    "operatorName": "Movistar Movil",
    "link": "https://www.nperf.com/en/map/ES/-/168910.Movistar-Movil/signal",
    "gsmaId": 499,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "ES",
    "operatorId": 115116,
    "operatorName": "Orange Movil",
    "link": "https://www.nperf.com/en/map/ES/-/115116.Orange-Movil/signal",
    "gsmaId": 404,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "ES",
    "operatorId": 168912,
    "operatorName": "Vodafone Movil",
    "link": "https://www.nperf.com/en/map/ES/-/168912.Vodafone-Movil/signal",
    "gsmaId": 557,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "ET",
    "operatorId": 223603,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/ET/-/223603.MTN-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "ET",
    "operatorId": 2018396,
    "operatorName": "Safaricom Mobile",
    "link": "https://www.nperf.com/en/map/ET/-/2018396.Safaricom-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "FI",
    "operatorId": 2107084,
    "operatorName": "DNA Mobile",
    "link": "https://www.nperf.com/en/map/FI/-/2107084.DNA-Mobile/signal",
    "gsmaId": 185,
    "gsmaName": "DNA"
  },
  {
    "countryCode": "FI",
    "operatorId": 3572,
    "operatorName": "Elisa Mobile",
    "link": "https://www.nperf.com/en/map/FI/-/3572.Elisa-Mobile/signal",
    "gsmaId": 161,
    "gsmaName": "Elisa"
  },
  {
    "countryCode": "FI",
    "operatorId": 47702,
    "operatorName": "Telia",
    "link": "https://www.nperf.com/en/map/FI/-/47702.Telia/signal",
    "gsmaId": 440,
    "gsmaName": "Telia"
  },
  {
    "countryCode": "FJ",
    "operatorId": 2026846,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/FJ/-/2026846.Digicel-Mobile/signal",
    "gsmaId": 1859,
    "gsmaName": "Digicel (Telstra)"
  },
  {
    "countryCode": "FJ",
    "operatorId": 2026844,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/FJ/-/2026844.Vodafone-Mobile/signal",
    "gsmaId": 558,
    "gsmaName": "Vodafone (ATH)"
  },
  {
    "countryCode": "FO",
    "operatorId": 196516,
    "operatorName": "Foroya Tele Mobile",
    "link": "https://www.nperf.com/en/map/FO/-/196516.Foroya-Tele-Mobile/signal",
    "gsmaId": 182,
    "gsmaName": "Foroya Tele"
  },
  {
    "countryCode": "FO",
    "operatorId": 196518,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/FO/-/196518.Vodafone-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "FR",
    "operatorId": 13642,
    "operatorName": "Bouygues Mobile",
    "link": "https://www.nperf.com/en/map/FR/-/13642.Bouygues-Mobile/signal",
    "gsmaId": 50,
    "gsmaName": "Bouygues Telecom"
  },
  {
    "countryCode": "FR",
    "operatorId": 25,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/FR/-/25.Free-Mobile/signal",
    "gsmaId": 3051,
    "gsmaName": "Free Mobile (Iliad)"
  },
  {
    "countryCode": "FR",
    "operatorId": 21,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/FR/-/21.Orange-Mobile/signal",
    "gsmaId": 364,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "FR",
    "operatorId": 10029,
    "operatorName": "SFR Mobile",
    "link": "https://www.nperf.com/en/map/FR/-/10029.SFR-Mobile/signal",
    "gsmaId": 421,
    "gsmaName": "SFR (Altice Europe)"
  },
  {
    "countryCode": "GA",
    "operatorId": 220720,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/GA/-/220720.Airtel-Mobile/signal",
    "gsmaId": 90,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "GA",
    "operatorId": 220718,
    "operatorName": "MOOV Africa GT Mobile",
    "link": "https://www.nperf.com/en/map/GA/-/220718.MOOV-Africa-GT-Mobile/signal",
    "gsmaId": 714,
    "gsmaName": "Moov Africa (Maroc Telecom)"
  },
  {
    "countryCode": "GB",
    "operatorId": 24751,
    "operatorName": "EE Mobile",
    "link": "https://www.nperf.com/en/map/GB/-/24751.EE-Mobile/signal",
    "gsmaId": 460,
    "gsmaName": "EE (BT)"
  },
  {
    "countryCode": "GB",
    "operatorId": 2012852,
    "operatorName": "O2 Mobile",
    "link": "https://www.nperf.com/en/map/GB/-/2012852.O2-Mobile/signal",
    "gsmaId": 342,
    "gsmaName": "Virgin Media O2 (Telefonica/Liberty Global)"
  },
  {
    "countryCode": "GB",
    "operatorId": 2012851,
    "operatorName": "Three Mobile",
    "link": "https://www.nperf.com/en/map/GB/-/2012851.Three-Mobile/signal",
    "gsmaId": 460,
    "gsmaName": "EE (BT)"
  },
  {
    "countryCode": "GB",
    "operatorId": 164526,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/GB/-/164526.Vodafone-Mobile/signal",
    "gsmaId": 563,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "GE",
    "operatorId": 237295,
    "operatorName": "Beeline",
    "link": "https://www.nperf.com/en/map/GE/-/237295.Beeline/signal",
    "gsmaId": 1145,
    "gsmaName": "Beeline"
  },
  {
    "countryCode": "GE",
    "operatorId": 237291,
    "operatorName": "Geocell",
    "link": "https://www.nperf.com/en/map/GE/-/237291.Geocell/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "GE",
    "operatorId": 237294,
    "operatorName": "Magti Mobile",
    "link": "https://www.nperf.com/en/map/GE/-/237294.Magti-Mobile/signal",
    "gsmaId": 267,
    "gsmaName": "MagtiCom"
  },
  {
    "countryCode": "GF",
    "operatorId": 19388,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/GF/-/19388.Digicel/signal",
    "gsmaId": 74,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "GF",
    "operatorId": 2009737,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/GF/-/2009737.Free-Mobile/signal",
    "gsmaId": 6451,
    "gsmaName": "Free Mobile (Iliad)"
  },
  {
    "countryCode": "GF",
    "operatorId": 17464,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/GF/-/17464.Orange-Mobile/signal",
    "gsmaId": 199,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "GF",
    "operatorId": 17461,
    "operatorName": "SFR Caraïbe Mobile",
    "link": "https://www.nperf.com/en/map/GF/-/17461.SFR-Carabe-Mobile/signal",
    "gsmaId": 985,
    "gsmaName": "SFR (Outremer Telecom)"
  },
  {
    "countryCode": "GH",
    "operatorId": 220685,
    "operatorName": "AirtelTigo",
    "link": "https://www.nperf.com/en/map/GH/-/220685.AirtelTigo/signal",
    "gsmaId": 282,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "GH",
    "operatorId": 220686,
    "operatorName": "Glo Mobile",
    "link": "https://www.nperf.com/en/map/GH/-/220686.Glo-Mobile/signal",
    "gsmaId": 1970,
    "gsmaName": "Glo Mobile (Globacom)"
  },
  {
    "countryCode": "GH",
    "operatorId": 220681,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/GH/-/220681.MTN-Mobile/signal",
    "gsmaId": 415,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "GH",
    "operatorId": 220682,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/GH/-/220682.Vodafone-Mobile/signal",
    "gsmaId": 717,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "GL",
    "operatorId": 2066961,
    "operatorName": "Tusass Mobile",
    "link": "https://www.nperf.com/en/map/GL/-/2066961.Tusass-Mobile/signal",
    "gsmaId": 718,
    "gsmaName": "Tusass"
  },
  {
    "countryCode": "GM",
    "operatorId": 207891,
    "operatorName": "Africell Mobile",
    "link": "https://www.nperf.com/en/map/GM/-/207891.Africell-Mobile/signal",
    "gsmaId": 8,
    "gsmaName": "Africell (Lintel)"
  },
  {
    "countryCode": "GM",
    "operatorId": 207892,
    "operatorName": "Comium Mobile",
    "link": "https://www.nperf.com/en/map/GM/-/207892.Comium-Mobile/signal",
    "gsmaId": 1113,
    "gsmaName": "Comium"
  },
  {
    "countryCode": "GM",
    "operatorId": 207889,
    "operatorName": "Gamcel Mobile",
    "link": "https://www.nperf.com/en/map/GM/-/207889.Gamcel-Mobile/signal",
    "gsmaId": 188,
    "gsmaName": "Gamcel (Gamtel)"
  },
  {
    "countryCode": "GM",
    "operatorId": 207895,
    "operatorName": "QCell Mobile",
    "link": "https://www.nperf.com/en/map/GM/-/207895.QCell-Mobile/signal",
    "gsmaId": 1969,
    "gsmaName": "QCell"
  },
  {
    "countryCode": "GN",
    "operatorId": 220693,
    "operatorName": "Cellcom Mobile",
    "link": "https://www.nperf.com/en/map/GN/-/220693.Cellcom-Mobile/signal",
    "gsmaId": 1836,
    "gsmaName": "Cellcom"
  },
  {
    "countryCode": "GN",
    "operatorId": 220690,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/GN/-/220690.MTN-Mobile/signal",
    "gsmaId": 1018,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "GN",
    "operatorId": 220688,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/GN/-/220688.Orange-Mobile/signal",
    "gsmaId": 1809,
    "gsmaName": "Orange (Sonatel)"
  },
  {
    "countryCode": "GP",
    "operatorId": 340,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/GP/-/340.Digicel/signal",
    "gsmaId": 805,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "GP",
    "operatorId": 2009735,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/GP/-/2009735.Free-Mobile/signal",
    "gsmaId": 6452,
    "gsmaName": "Free Mobile (Iliad)"
  },
  {
    "countryCode": "GP",
    "operatorId": 72,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/GP/-/72.Orange-Mobile/signal",
    "gsmaId": 807,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "GP",
    "operatorId": 17445,
    "operatorName": "SFR Caraïbe Mobile",
    "link": "https://www.nperf.com/en/map/GP/-/17445.SFR-Carabe-Mobile/signal",
    "gsmaId": 1385,
    "gsmaName": "SFR (Outremer Telecom)"
  },
  {
    "countryCode": "GQ",
    "operatorId": 220715,
    "operatorName": "Muni",
    "link": "https://www.nperf.com/en/map/GQ/-/220715.Muni/signal",
    "gsmaId": 1965,
    "gsmaName": "MUNI (Green Com)"
  },
  {
    "countryCode": "GQ",
    "operatorId": 220713,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/GQ/-/220713.Orange-Mobile/signal",
    "gsmaId": 1809,
    "gsmaName": "Orange (Sonatel)"
  },
  {
    "countryCode": "GR",
    "operatorId": 7814,
    "operatorName": "Cosmote Mobile",
    "link": "https://www.nperf.com/en/map/GR/-/7814.Cosmote-Mobile/signal",
    "gsmaId": 128,
    "gsmaName": "Cosmote (OTE)"
  },
  {
    "countryCode": "GR",
    "operatorId": 164028,
    "operatorName": "Nova Mobile",
    "link": "https://www.nperf.com/en/map/GR/-/164028.Nova-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "GR",
    "operatorId": 164025,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/GR/-/164025.Vodafone-Mobile/signal",
    "gsmaId": 570,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "GT",
    "operatorId": 198155,
    "operatorName": "Claro Mobile",
    "link": "https://www.nperf.com/en/map/GT/-/198155.Claro-Mobile/signal",
    "gsmaId": 416,
    "gsmaName": "Claro/Movistar (America Movil)"
  },
  {
    "countryCode": "GT",
    "operatorId": 198153,
    "operatorName": "Tigo Mobile",
    "link": "https://www.nperf.com/en/map/GT/-/198153.Tigo-Mobile/signal",
    "gsmaId": 113,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "GW",
    "operatorId": 220695,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/GW/-/220695.MTN-Mobile/signal",
    "gsmaId": 1018,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "GW",
    "operatorId": 220696,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/GW/-/220696.Orange-Mobile/signal",
    "gsmaId": 1809,
    "gsmaName": "Orange (Sonatel)"
  },
  {
    "countryCode": "GY",
    "operatorId": 2107085,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/GY/-/2107085.Digicel-Mobile/signal",
    "gsmaId": 942,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "GY",
    "operatorId": 167644,
    "operatorName": "GT&T Mobile",
    "link": "https://www.nperf.com/en/map/GY/-/167644.GTT-Mobile/signal",
    "gsmaId": 941,
    "gsmaName": "GTT (ATN)"
  },
  {
    "countryCode": "HK",
    "operatorId": 357,
    "operatorName": "3 Three",
    "link": "https://www.nperf.com/en/map/HK/-/357.3-Three/signal",
    "gsmaId": 216,
    "gsmaName": "3 (CK Hutchison)"
  },
  {
    "countryCode": "HK",
    "operatorId": 2106749,
    "operatorName": "China Mobile",
    "link": "https://www.nperf.com/en/map/HK/-/2106749.China-Mobile/signal",
    "gsmaId": 102,
    "gsmaName": "China Mobile"
  },
  {
    "countryCode": "HK",
    "operatorId": 13221,
    "operatorName": "CSL Mobile",
    "link": "https://www.nperf.com/en/map/HK/-/13221.CSL-Mobile/signal",
    "gsmaId": 454,
    "gsmaName": "csl (HKT)"
  },
  {
    "countryCode": "HK",
    "operatorId": 2106752,
    "operatorName": "SmarTone Mobile",
    "link": "https://www.nperf.com/en/map/HK/-/2106752.SmarTone-Mobile/signal",
    "gsmaId": 435,
    "gsmaName": "SmarTone"
  },
  {
    "countryCode": "HN",
    "operatorId": 169646,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/HN/-/169646.Claro-Movil/signal",
    "gsmaId": 277,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "HN",
    "operatorId": 169643,
    "operatorName": "Tigo Movil",
    "link": "https://www.nperf.com/en/map/HN/-/169643.Tigo-Movil/signal",
    "gsmaId": 939,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "HR",
    "operatorId": 161490,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/HR/-/161490.A1-Mobile/signal",
    "gsmaId": 548,
    "gsmaName": "A1"
  },
  {
    "countryCode": "HR",
    "operatorId": 7915,
    "operatorName": "Hrvatski Telekom Mobile",
    "link": "https://www.nperf.com/en/map/HR/-/7915.Hrvatski-Telekom-Mobile/signal",
    "gsmaId": 841,
    "gsmaName": "Hrvatski Telekom (Deutsche Telekom)"
  },
  {
    "countryCode": "HR",
    "operatorId": 9827,
    "operatorName": "TELE2",
    "link": "https://www.nperf.com/en/map/HR/-/9827.TELE2/signal",
    "gsmaId": 981,
    "gsmaName": "Telemach (United)"
  },
  {
    "countryCode": "HT",
    "operatorId": 1995975,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/HT/-/1995975.Digicel/signal",
    "gsmaId": 1036,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "HT",
    "operatorId": 1995977,
    "operatorName": "Natcom Mobile",
    "link": "https://www.nperf.com/en/map/HT/-/1995977.Natcom-Mobile/signal",
    "gsmaId": 4066,
    "gsmaName": "Natcom (Viettel)"
  },
  {
    "countryCode": "HU",
    "operatorId": 404,
    "operatorName": "One",
    "link": "https://www.nperf.com/en/map/HU/-/404.One/signal",
    "gsmaId": 559,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "HU",
    "operatorId": 187864,
    "operatorName": "Telekom Mobile",
    "link": "https://www.nperf.com/en/map/HU/-/187864.Telekom-Mobile/signal",
    "gsmaId": 464,
    "gsmaName": "Magyar Telekom"
  },
  {
    "countryCode": "HU",
    "operatorId": 2213,
    "operatorName": "Yettel",
    "link": "https://www.nperf.com/en/map/HU/-/2213.Yettel/signal",
    "gsmaId": 381,
    "gsmaName": "Yettel (PPF)"
  },
  {
    "countryCode": "ID",
    "operatorId": 15411,
    "operatorName": "IM3",
    "link": "https://www.nperf.com/en/map/ID/-/15411.IM3/signal",
    "gsmaId": 1044,
    "gsmaName": "3 (CK Hutchison)"
  },
  {
    "countryCode": "ID",
    "operatorId": 25110,
    "operatorName": "Smartfren",
    "link": "https://www.nperf.com/en/map/ID/-/25110.Smartfren/signal",
    "gsmaId": 848,
    "gsmaName": "Smartfren"
  },
  {
    "countryCode": "ID",
    "operatorId": 5119,
    "operatorName": "Telkomsel",
    "link": "https://www.nperf.com/en/map/ID/-/5119.Telkomsel/signal",
    "gsmaId": 615,
    "gsmaName": "Telkomsel (Telkom Indonesia)"
  },
  {
    "countryCode": "ID",
    "operatorId": 2992,
    "operatorName": "XL Axiata",
    "link": "https://www.nperf.com/en/map/ID/-/2992.XL-Axiata/signal",
    "gsmaId": 176,
    "gsmaName": "XL (Axiata)"
  },
  {
    "countryCode": "IE",
    "operatorId": 5328,
    "operatorName": "eir Mobile",
    "link": "https://www.nperf.com/en/map/IE/-/5328.eir-Mobile/signal",
    "gsmaId": 278,
    "gsmaName": "eir"
  },
  {
    "countryCode": "IE",
    "operatorId": 185503,
    "operatorName": "Three Mobile",
    "link": "https://www.nperf.com/en/map/IE/-/185503.Three-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "IE",
    "operatorId": 185499,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/IE/-/185499.Vodafone-Mobile/signal",
    "gsmaId": 560,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "IL",
    "operatorId": 2107086,
    "operatorName": "Cellcom Mobile",
    "link": "https://www.nperf.com/en/map/IL/-/2107086.Cellcom-Mobile/signal",
    "gsmaId": 78,
    "gsmaName": "Cellcom"
  },
  {
    "countryCode": "IL",
    "operatorId": 7652,
    "operatorName": "HOT Mobile",
    "link": "https://www.nperf.com/en/map/IL/-/7652.HOT-Mobile/signal",
    "gsmaId": 1035,
    "gsmaName": "HOT Mobile (Altice Europe)"
  },
  {
    "countryCode": "IL",
    "operatorId": 2103,
    "operatorName": "Partner Mobile",
    "link": "https://www.nperf.com/en/map/IL/-/2103.Partner-Mobile/signal",
    "gsmaId": 382,
    "gsmaName": "Partner"
  },
  {
    "countryCode": "IL",
    "operatorId": 1664,
    "operatorName": "Pelephone",
    "link": "https://www.nperf.com/en/map/IL/-/1664.Pelephone/signal",
    "gsmaId": 637,
    "gsmaName": "Pelephone (Bezeq)"
  },
  {
    "countryCode": "IN",
    "operatorId": 1991549,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/IN/-/1991549.Airtel-Mobile/signal",
    "gsmaId": 47,
    "gsmaName": "Airtel (Bharti Airtel)"
  },
  {
    "countryCode": "IN",
    "operatorId": 1991543,
    "operatorName": "BSNL Mobile",
    "link": "https://www.nperf.com/en/map/IN/-/1991543.BSNL-Mobile/signal",
    "gsmaId": 45,
    "gsmaName": "BSNL"
  },
  {
    "countryCode": "IN",
    "operatorId": 1991548,
    "operatorName": "Jio Mobile",
    "link": "https://www.nperf.com/en/map/IN/-/1991548.Jio-Mobile/signal",
    "gsmaId": 3677,
    "gsmaName": "Reliance Jio (Reliance Industries)"
  },
  {
    "countryCode": "IN",
    "operatorId": 1991528,
    "operatorName": "Vi Mobile",
    "link": "https://www.nperf.com/en/map/IN/-/1991528.Vi-Mobile/signal",
    "gsmaId": 222,
    "gsmaName": "Vi"
  },
  {
    "countryCode": "IQ",
    "operatorId": 223640,
    "operatorName": "Asiacell Mobile",
    "link": "https://www.nperf.com/en/map/IQ/-/223640.Asiacell-Mobile/signal",
    "gsmaId": 27,
    "gsmaName": "Asiacell (Ooredoo)"
  },
  {
    "countryCode": "IQ",
    "operatorId": 223642,
    "operatorName": "Korek Mobile",
    "link": "https://www.nperf.com/en/map/IQ/-/223642.Korek-Mobile/signal",
    "gsmaId": 251,
    "gsmaName": "Korek Telecom"
  },
  {
    "countryCode": "IQ",
    "operatorId": 24422,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/IQ/-/24422.Zain-Mobile/signal",
    "gsmaId": 30,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "IR",
    "operatorId": 12954,
    "operatorName": "Hamrahe Aval (MCI)",
    "link": "https://www.nperf.com/en/map/IR/-/12954.Hamrahe-Aval-MCI/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "IR",
    "operatorId": 1795,
    "operatorName": "IranCell",
    "link": "https://www.nperf.com/en/map/IR/-/1795.IranCell/signal",
    "gsmaId": 1141,
    "gsmaName": "MTN Irancell"
  },
  {
    "countryCode": "IS",
    "operatorId": 208135,
    "operatorName": "Nova Mobile",
    "link": "https://www.nperf.com/en/map/IS/-/208135.Nova-Mobile/signal",
    "gsmaId": 1255,
    "gsmaName": "Nova"
  },
  {
    "countryCode": "IS",
    "operatorId": 208130,
    "operatorName": "Siminn Mobile",
    "link": "https://www.nperf.com/en/map/IS/-/208130.Siminn-Mobile/signal",
    "gsmaId": 779,
    "gsmaName": "Siminn"
  },
  {
    "countryCode": "IS",
    "operatorId": 208132,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/IS/-/208132.Vodafone-Mobile/signal",
    "gsmaId": 347,
    "gsmaName": "Vodafone (sýn)"
  },
  {
    "countryCode": "IT",
    "operatorId": 151100,
    "operatorName": "Fastweb Mobile",
    "link": "https://www.nperf.com/en/map/IT/-/151100.Fastweb-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "IT",
    "operatorId": 143640,
    "operatorName": "Iliad Mobile",
    "link": "https://www.nperf.com/en/map/IT/-/143640.Iliad-Mobile/signal",
    "gsmaId": 6313,
    "gsmaName": "Iliad"
  },
  {
    "countryCode": "IT",
    "operatorId": 230,
    "operatorName": "TIM Mobile",
    "link": "https://www.nperf.com/en/map/IT/-/230.TIM-Mobile/signal",
    "gsmaId": 488,
    "gsmaName": "TIM (Telecom Italia)"
  },
  {
    "countryCode": "IT",
    "operatorId": 169042,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/IT/-/169042.Vodafone-Mobile/signal",
    "gsmaId": 566,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "IT",
    "operatorId": 103902,
    "operatorName": "Wind Tre Mobile",
    "link": "https://www.nperf.com/en/map/IT/-/103902.Wind-Tre-Mobile/signal",
    "gsmaId": 200,
    "gsmaName": "Wind Tre (CK Hutchison)"
  },
  {
    "countryCode": "JM",
    "operatorId": 1995981,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/JM/-/1995981.Digicel/signal",
    "gsmaId": 313,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "JM",
    "operatorId": 1995984,
    "operatorName": "Flow Mobile",
    "link": "https://www.nperf.com/en/map/JM/-/1995984.Flow-Mobile/signal",
    "gsmaId": 63,
    "gsmaName": "Flow (Liberty Latin America)"
  },
  {
    "countryCode": "JO",
    "operatorId": 219376,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/JO/-/219376.Orange-Mobile/signal",
    "gsmaId": 646,
    "gsmaName": "Orange (Jordan Telecom)"
  },
  {
    "countryCode": "JO",
    "operatorId": 219375,
    "operatorName": "Umniah Mobile",
    "link": "https://www.nperf.com/en/map/JO/-/219375.Umniah-Mobile/signal",
    "gsmaId": 959,
    "gsmaName": "Umniah (Batelco)"
  },
  {
    "countryCode": "JO",
    "operatorId": 219373,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/JO/-/219373.Zain-Mobile/signal",
    "gsmaId": 237,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "JP",
    "operatorId": 187901,
    "operatorName": "au by KDDI",
    "link": "https://www.nperf.com/en/map/JP/-/187901.au-by-KDDI/signal",
    "gsmaId": 634,
    "gsmaName": "KDDI"
  },
  {
    "countryCode": "JP",
    "operatorId": 187898,
    "operatorName": "NTT DoCoMo",
    "link": "https://www.nperf.com/en/map/JP/-/187898.NTT-DoCoMo/signal",
    "gsmaId": 338,
    "gsmaName": "NTT DOCOMO"
  },
  {
    "countryCode": "JP",
    "operatorId": 178641,
    "operatorName": "Rakuten Mobile",
    "link": "https://www.nperf.com/en/map/JP/-/178641.Rakuten-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "JP",
    "operatorId": 27305,
    "operatorName": "Y!Mobile",
    "link": "https://www.nperf.com/en/map/JP/-/27305.YMobile/signal",
    "gsmaId": 4683,
    "gsmaName": "Wireless City Planning"
  },
  {
    "countryCode": "KE",
    "operatorId": 10360,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/KE/-/10360.Airtel-Mobile/signal",
    "gsmaId": 246,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "KE",
    "operatorId": 2107089,
    "operatorName": "Faiba Mobile",
    "link": "https://www.nperf.com/en/map/KE/-/2107089.Faiba-Mobile/signal",
    "gsmaId": 6658,
    "gsmaName": "Faiba (Jamii Telecom)"
  },
  {
    "countryCode": "KE",
    "operatorId": 2107093,
    "operatorName": "Safaricom Mobile",
    "link": "https://www.nperf.com/en/map/KE/-/2107093.Safaricom-Mobile/signal",
    "gsmaId": 409,
    "gsmaName": "Safaricom"
  },
  {
    "countryCode": "KE",
    "operatorId": 2107095,
    "operatorName": "Telkom Mobile",
    "link": "https://www.nperf.com/en/map/KE/-/2107095.Telkom-Mobile/signal",
    "gsmaId": 1480,
    "gsmaName": "Telkom Kenya"
  },
  {
    "countryCode": "KG",
    "operatorId": 208145,
    "operatorName": "Beeline Mobile",
    "link": "https://www.nperf.com/en/map/KG/-/208145.Beeline-Mobile/signal",
    "gsmaId": 48,
    "gsmaName": "Beeline (VEON)"
  },
  {
    "countryCode": "KG",
    "operatorId": 208148,
    "operatorName": "MegaCom Mobile",
    "link": "https://www.nperf.com/en/map/KG/-/208148.MegaCom-Mobile/signal",
    "gsmaId": 1038,
    "gsmaName": "Mega (Alfa Telecom)"
  },
  {
    "countryCode": "KG",
    "operatorId": 208149,
    "operatorName": "O! Mobile",
    "link": "https://www.nperf.com/en/map/KG/-/208149.O-Mobile/signal",
    "gsmaId": 1039,
    "gsmaName": "Sapatcom (Winline)"
  },
  {
    "countryCode": "KH",
    "operatorId": 208639,
    "operatorName": "Cellcard Mobile",
    "link": "https://www.nperf.com/en/map/KH/-/208639.Cellcard-Mobile/signal",
    "gsmaId": 71,
    "gsmaName": "Cellcard (MobiTel)"
  },
  {
    "countryCode": "KH",
    "operatorId": 208643,
    "operatorName": "Metfone Mobile",
    "link": "https://www.nperf.com/en/map/KH/-/208643.Metfone-Mobile/signal",
    "gsmaId": 1801,
    "gsmaName": "MetFone (Viettel)"
  },
  {
    "countryCode": "KH",
    "operatorId": 208642,
    "operatorName": "Smart Mobile",
    "link": "https://www.nperf.com/en/map/KH/-/208642.Smart-Mobile/signal",
    "gsmaId": 1802,
    "gsmaName": "Smart (Axiata)"
  },
  {
    "countryCode": "KH",
    "operatorId": 208646,
    "operatorName": "Yes Mobile",
    "link": "https://www.nperf.com/en/map/KH/-/208646.Yes-Mobile/signal",
    "gsmaId": 5959,
    "gsmaName": "Yes Seatel"
  },
  {
    "countryCode": "KM",
    "operatorId": 2026854,
    "operatorName": "Huri Mobile",
    "link": "https://www.nperf.com/en/map/KM/-/2026854.Huri-Mobile/signal",
    "gsmaId": 437,
    "gsmaName": "Huri (Comores Telecom)"
  },
  {
    "countryCode": "KM",
    "operatorId": 2026856,
    "operatorName": "Yas",
    "link": "https://www.nperf.com/en/map/KM/-/2026856.Yas/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "KR",
    "operatorId": 2107101,
    "operatorName": "KT Mobile",
    "link": "https://www.nperf.com/en/map/KR/-/2107101.KT-Mobile/signal",
    "gsmaId": 431,
    "gsmaName": "SK Telecom"
  },
  {
    "countryCode": "KR",
    "operatorId": 7359,
    "operatorName": "SK Telecom",
    "link": "https://www.nperf.com/en/map/KR/-/7359.SK-Telecom/signal",
    "gsmaId": 431,
    "gsmaName": "SK Telecom"
  },
  {
    "countryCode": "KR",
    "operatorId": 2107102,
    "operatorName": "U+ Mobile",
    "link": "https://www.nperf.com/en/map/KR/-/2107102.U-Mobile/signal",
    "gsmaId": 636,
    "gsmaName": "LG Uplus"
  },
  {
    "countryCode": "KW",
    "operatorId": 219366,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/KW/-/219366.Ooredoo-Mobile/signal",
    "gsmaId": 324,
    "gsmaName": "Ooredoo (NMTC)"
  },
  {
    "countryCode": "KW",
    "operatorId": 219369,
    "operatorName": "STC Mobile",
    "link": "https://www.nperf.com/en/map/KW/-/219369.STC-Mobile/signal",
    "gsmaId": 1991,
    "gsmaName": "STC"
  },
  {
    "countryCode": "KW",
    "operatorId": 219365,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/KW/-/219365.Zain-Mobile/signal",
    "gsmaId": 293,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "KZ",
    "operatorId": 208218,
    "operatorName": "Beeline Mobile",
    "link": "https://www.nperf.com/en/map/KZ/-/208218.Beeline-Mobile/signal",
    "gsmaId": 243,
    "gsmaName": "Beeline (VEON)"
  },
  {
    "countryCode": "KZ",
    "operatorId": 208220,
    "operatorName": "Kcell",
    "link": "https://www.nperf.com/en/map/KZ/-/208220.Kcell/signal",
    "gsmaId": 645,
    "gsmaName": "Kcell (Kazakhtelecom)"
  },
  {
    "countryCode": "KZ",
    "operatorId": 208226,
    "operatorName": "Tele2/Altel",
    "link": "https://www.nperf.com/en/map/KZ/-/208226.Tele2Altel/signal",
    "gsmaId": 1389,
    "gsmaName": "Tele2 / ALTEL"
  },
  {
    "countryCode": "LA",
    "operatorId": 208649,
    "operatorName": "ETL Mobile",
    "link": "https://www.nperf.com/en/map/LA/-/208649.ETL-Mobile/signal",
    "gsmaId": 831,
    "gsmaName": "ETL"
  },
  {
    "countryCode": "LA",
    "operatorId": 208647,
    "operatorName": "LaoTel Mobile",
    "link": "https://www.nperf.com/en/map/LA/-/208647.LaoTel-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "LA",
    "operatorId": 208654,
    "operatorName": "Tplus Mobile",
    "link": "https://www.nperf.com/en/map/LA/-/208654.Tplus-Mobile/signal",
    "gsmaId": 283,
    "gsmaName": "TPLUS"
  },
  {
    "countryCode": "LA",
    "operatorId": 208651,
    "operatorName": "Unitel Mobile",
    "link": "https://www.nperf.com/en/map/LA/-/208651.Unitel-Mobile/signal",
    "gsmaId": 1894,
    "gsmaName": "Unitel (Star Telecom)"
  },
  {
    "countryCode": "LB",
    "operatorId": 207885,
    "operatorName": "Alfa Mobile",
    "link": "https://www.nperf.com/en/map/LB/-/207885.Alfa-Mobile/signal",
    "gsmaId": 187,
    "gsmaName": "Alfa"
  },
  {
    "countryCode": "LB",
    "operatorId": 207886,
    "operatorName": "Touch Mobile",
    "link": "https://www.nperf.com/en/map/LB/-/207886.Touch-Mobile/signal",
    "gsmaId": 314,
    "gsmaName": "Touch"
  },
  {
    "countryCode": "LK",
    "operatorId": 2107105,
    "operatorName": "Dialog/Airtel Mobile",
    "link": "https://www.nperf.com/en/map/LK/-/2107105.DialogAirtel-Mobile/signal",
    "gsmaId": 319,
    "gsmaName": "Dialog (Axiata)"
  },
  {
    "countryCode": "LK",
    "operatorId": 7008,
    "operatorName": "Hutch",
    "link": "https://www.nperf.com/en/map/LK/-/7008.Hutch/signal",
    "gsmaId": 218,
    "gsmaName": "Hutch (CK Hutchison)"
  },
  {
    "countryCode": "LK",
    "operatorId": 2107108,
    "operatorName": "Mobitel Mobile",
    "link": "https://www.nperf.com/en/map/LK/-/2107108.Mobitel-Mobile/signal",
    "gsmaId": 307,
    "gsmaName": "Mobitel (Sri Lanka Telecom)"
  },
  {
    "countryCode": "LR",
    "operatorId": 220710,
    "operatorName": "Lonestar Cell MTN",
    "link": "https://www.nperf.com/en/map/LR/-/220710.Lonestar-Cell-MTN/signal",
    "gsmaId": 264,
    "gsmaName": "LonestarCell MTN"
  },
  {
    "countryCode": "LR",
    "operatorId": 220709,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/LR/-/220709.Orange-Mobile/signal",
    "gsmaId": 76,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "LS",
    "operatorId": 223540,
    "operatorName": "Econet Mobile",
    "link": "https://www.nperf.com/en/map/LS/-/223540.Econet-Mobile/signal",
    "gsmaId": 157,
    "gsmaName": "Econet Telecom Lesotho"
  },
  {
    "countryCode": "LS",
    "operatorId": 223535,
    "operatorName": "Vodacom Mobile",
    "link": "https://www.nperf.com/en/map/LS/-/223535.Vodacom-Mobile/signal",
    "gsmaId": 552,
    "gsmaName": "Vodacom"
  },
  {
    "countryCode": "LT",
    "operatorId": 8453,
    "operatorName": "Bite",
    "link": "https://www.nperf.com/en/map/LT/-/8453.Bite/signal",
    "gsmaId": 535,
    "gsmaName": "Bite (Providence)"
  },
  {
    "countryCode": "LT",
    "operatorId": 54041,
    "operatorName": "Tele2 Mobile",
    "link": "https://www.nperf.com/en/map/LT/-/54041.Tele2-Mobile/signal",
    "gsmaId": 536,
    "gsmaName": "Tele2"
  },
  {
    "countryCode": "LT",
    "operatorId": 169670,
    "operatorName": "Telia Mobile",
    "link": "https://www.nperf.com/en/map/LT/-/169670.Telia-Mobile/signal",
    "gsmaId": 352,
    "gsmaName": "Telia"
  },
  {
    "countryCode": "LU",
    "operatorId": 2045709,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/LU/-/2045709.Orange-Mobile/signal",
    "gsmaId": 572,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "LU",
    "operatorId": 2106704,
    "operatorName": "POST Mobile",
    "link": "https://www.nperf.com/en/map/LU/-/2106704.POST-Mobile/signal",
    "gsmaId": 833,
    "gsmaName": "POST Luxembourg"
  },
  {
    "countryCode": "LU",
    "operatorId": 2106702,
    "operatorName": "Tango Mobile",
    "link": "https://www.nperf.com/en/map/LU/-/2106702.Tango-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "LV",
    "operatorId": 1999743,
    "operatorName": "Bite Mobile",
    "link": "https://www.nperf.com/en/map/LV/-/1999743.Bite-Mobile/signal",
    "gsmaId": 1043,
    "gsmaName": "Bite (Providence)"
  },
  {
    "countryCode": "LV",
    "operatorId": 1999745,
    "operatorName": "LMT Mobile",
    "link": "https://www.nperf.com/en/map/LV/-/1999745.LMT-Mobile/signal",
    "gsmaId": 257,
    "gsmaName": "LMT (Telia)"
  },
  {
    "countryCode": "LV",
    "operatorId": 1999751,
    "operatorName": "Tele2 Mobile",
    "link": "https://www.nperf.com/en/map/LV/-/1999751.Tele2-Mobile/signal",
    "gsmaId": 479,
    "gsmaName": "Tele2"
  },
  {
    "countryCode": "MA",
    "operatorId": 20809,
    "operatorName": "Inwi Mobile",
    "link": "https://www.nperf.com/en/map/MA/-/20809.Inwi-Mobile/signal",
    "gsmaId": 1265,
    "gsmaName": "inwi (Wana)"
  },
  {
    "countryCode": "MA",
    "operatorId": 26,
    "operatorName": "Maroc Telecom Mobile",
    "link": "https://www.nperf.com/en/map/MA/-/26.Maroc-Telecom-Mobile/signal",
    "gsmaId": 600,
    "gsmaName": "Maroc Telecom (e&)"
  },
  {
    "countryCode": "MA",
    "operatorId": 225611,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/MA/-/225611.Orange-Mobile/signal",
    "gsmaId": 612,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "MC",
    "operatorId": 176130,
    "operatorName": "Monaco Telecom Mobile",
    "link": "https://www.nperf.com/en/map/MC/-/176130.Monaco-Telecom-Mobile/signal",
    "gsmaId": 311,
    "gsmaName": "Monaco Telecom (NJJ)"
  },
  {
    "countryCode": "MD",
    "operatorId": 180400,
    "operatorName": "IDC",
    "link": "https://www.nperf.com/en/map/MD/-/180400.IDC/signal",
    "gsmaId": 843,
    "gsmaName": "IDC (Interdnestrkom); Transnistria"
  },
  {
    "countryCode": "MD",
    "operatorId": 2118,
    "operatorName": "Moldcell",
    "link": "https://www.nperf.com/en/map/MD/-/2118.Moldcell/signal",
    "gsmaId": 310,
    "gsmaName": "Moldcell"
  },
  {
    "countryCode": "MD",
    "operatorId": 1994616,
    "operatorName": "Moldtelecom Mobile",
    "link": "https://www.nperf.com/en/map/MD/-/1994616.Moldtelecom-Mobile/signal",
    "gsmaId": 310,
    "gsmaName": "Moldcell"
  },
  {
    "countryCode": "MD",
    "operatorId": 1994612,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/MD/-/1994612.Orange-Mobile/signal",
    "gsmaId": 573,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "ME",
    "operatorId": 208103,
    "operatorName": "Crnogorski Telekom",
    "link": "https://www.nperf.com/en/map/ME/-/208103.Crnogorski-Telekom/signal",
    "gsmaId": 312,
    "gsmaName": "Crnogorski Telekom"
  },
  {
    "countryCode": "ME",
    "operatorId": 208104,
    "operatorName": "Mtel Mobile",
    "link": "https://www.nperf.com/en/map/ME/-/208104.Mtel-Mobile/signal",
    "gsmaId": 1430,
    "gsmaName": "m:tel (Telekom Srbija)"
  },
  {
    "countryCode": "ME",
    "operatorId": 208102,
    "operatorName": "One",
    "link": "https://www.nperf.com/en/map/ME/-/208102.One/signal",
    "gsmaId": 392,
    "gsmaName": "one (antenna Hungaria)"
  },
  {
    "countryCode": "MF",
    "operatorId": 122558,
    "operatorName": "Dauphin Mobile",
    "link": "https://www.nperf.com/en/map/MF/-/122558.Dauphin-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "MF",
    "operatorId": 122561,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/MF/-/122561.Digicel-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "MF",
    "operatorId": 2009739,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/MF/-/2009739.Free-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "MF",
    "operatorId": 122556,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/MF/-/122556.Orange-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "MG",
    "operatorId": 4851,
    "operatorName": "Airtel",
    "link": "https://www.nperf.com/en/map/MG/-/4851.Airtel/signal",
    "gsmaId": 266,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "MG",
    "operatorId": 1862,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/MG/-/1862.Orange-Mobile/signal",
    "gsmaId": 365,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "MG",
    "operatorId": 153087,
    "operatorName": "Yas Mobile",
    "link": "https://www.nperf.com/en/map/MG/-/153087.Yas-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "MK",
    "operatorId": 208129,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/MK/-/208129.A1-Mobile/signal",
    "gsmaId": 1445,
    "gsmaName": "A1 Macedonia"
  },
  {
    "countryCode": "MK",
    "operatorId": 208126,
    "operatorName": "T-Mobile",
    "link": "https://www.nperf.com/en/map/MK/-/208126.T-Mobile/signal",
    "gsmaId": 302,
    "gsmaName": "Makedonski Telekom"
  },
  {
    "countryCode": "ML",
    "operatorId": 220730,
    "operatorName": "Malitel Mobile",
    "link": "https://www.nperf.com/en/map/ML/-/220730.Malitel-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "ML",
    "operatorId": 220727,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/ML/-/220727.Orange-Mobile/signal",
    "gsmaId": 224,
    "gsmaName": "Orange (Sonatel)"
  },
  {
    "countryCode": "ML",
    "operatorId": 220733,
    "operatorName": "Telecel Mobile",
    "link": "https://www.nperf.com/en/map/ML/-/220733.Telecel-Mobile/signal",
    "gsmaId": 5338,
    "gsmaName": "Telecel (Atel)"
  },
  {
    "countryCode": "MM",
    "operatorId": 17442,
    "operatorName": "ATOM Mobile",
    "link": "https://www.nperf.com/en/map/MM/-/17442.ATOM-Mobile/signal",
    "gsmaId": 5576,
    "gsmaName": "ATOM"
  },
  {
    "countryCode": "MM",
    "operatorId": 4980,
    "operatorName": "MPT Mobile",
    "link": "https://www.nperf.com/en/map/MM/-/4980.MPT-Mobile/signal",
    "gsmaId": 323,
    "gsmaName": "MPT"
  },
  {
    "countryCode": "MM",
    "operatorId": 137098,
    "operatorName": "Mytel",
    "link": "https://www.nperf.com/en/map/MM/-/137098.Mytel/signal",
    "gsmaId": 5647,
    "gsmaName": "MyTel"
  },
  {
    "countryCode": "MM",
    "operatorId": 20581,
    "operatorName": "Ooredoo",
    "link": "https://www.nperf.com/en/map/MM/-/20581.Ooredoo/signal",
    "gsmaId": 5575,
    "gsmaName": "Ooredoo"
  },
  {
    "countryCode": "MN",
    "operatorId": 1995890,
    "operatorName": "Mobicom Mobile",
    "link": "https://www.nperf.com/en/map/MN/-/1995890.Mobicom-Mobile/signal",
    "gsmaId": 286,
    "gsmaName": "MobiCom"
  },
  {
    "countryCode": "MN",
    "operatorId": 1995887,
    "operatorName": "Unitel Mobile",
    "link": "https://www.nperf.com/en/map/MN/-/1995887.Unitel-Mobile/signal",
    "gsmaId": 1103,
    "gsmaName": "Unitel"
  },
  {
    "countryCode": "MO",
    "operatorId": 2066957,
    "operatorName": "3 Mobile",
    "link": "https://www.nperf.com/en/map/MO/-/2066957.3-Mobile/signal",
    "gsmaId": 854,
    "gsmaName": "3 (CK Hutchison)"
  },
  {
    "countryCode": "MO",
    "operatorId": 2066954,
    "operatorName": "China Telecom Mobile",
    "link": "https://www.nperf.com/en/map/MO/-/2066954.China-Telecom-Mobile/signal",
    "gsmaId": 1124,
    "gsmaName": "China Telecom"
  },
  {
    "countryCode": "MO",
    "operatorId": 2066952,
    "operatorName": "CTM Mobile",
    "link": "https://www.nperf.com/en/map/MO/-/2066952.CTM-Mobile/signal",
    "gsmaId": 730,
    "gsmaName": "CTM (CITIC Telecom)"
  },
  {
    "countryCode": "MO",
    "operatorId": 2066953,
    "operatorName": "SmarTone Mobile",
    "link": "https://www.nperf.com/en/map/MO/-/2066953.SmarTone-Mobile/signal",
    "gsmaId": 732,
    "gsmaName": "SmarTone"
  },
  {
    "countryCode": "MQ",
    "operatorId": 75,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/MQ/-/75.Digicel/signal",
    "gsmaId": 821,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "MQ",
    "operatorId": 2009732,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/MQ/-/2009732.Free-Mobile/signal",
    "gsmaId": 6453,
    "gsmaName": "Free Mobile (Iliad)"
  },
  {
    "countryCode": "MQ",
    "operatorId": 58,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/MQ/-/58.Orange-Mobile/signal",
    "gsmaId": 360,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "MQ",
    "operatorId": 17454,
    "operatorName": "SFR Caraïbe Mobile",
    "link": "https://www.nperf.com/en/map/MQ/-/17454.SFR-Carabe-Mobile/signal",
    "gsmaId": 1840,
    "gsmaName": "SFR (Outremer Telecom)"
  },
  {
    "countryCode": "MR",
    "operatorId": 1785,
    "operatorName": "Chinguitel",
    "link": "https://www.nperf.com/en/map/MR/-/1785.Chinguitel/signal",
    "gsmaId": 1787,
    "gsmaName": "Chinguitel (Sudatel)"
  },
  {
    "countryCode": "MR",
    "operatorId": 3918,
    "operatorName": "Mattel",
    "link": "https://www.nperf.com/en/map/MR/-/3918.Mattel/signal",
    "gsmaId": 736,
    "gsmaName": "Mattel (Tunisie Telecom)"
  },
  {
    "countryCode": "MR",
    "operatorId": 171770,
    "operatorName": "Moov Mauritel Mobile",
    "link": "https://www.nperf.com/en/map/MR/-/171770.Moov-Mauritel-Mobile/signal",
    "gsmaId": 272,
    "gsmaName": "Moov Mauritel (Maroc Telecom)"
  },
  {
    "countryCode": "MT",
    "operatorId": 230517,
    "operatorName": "Epic Mobile",
    "link": "https://www.nperf.com/en/map/MT/-/230517.Epic-Mobile/signal",
    "gsmaId": 564,
    "gsmaName": "epic"
  },
  {
    "countryCode": "MT",
    "operatorId": 230522,
    "operatorName": "GO Mobile",
    "link": "https://www.nperf.com/en/map/MT/-/230522.GO-Mobile/signal",
    "gsmaId": 1792,
    "gsmaName": "Go (Tunisie Telecom)"
  },
  {
    "countryCode": "MT",
    "operatorId": 16702,
    "operatorName": "Melita Mobile",
    "link": "https://www.nperf.com/en/map/MT/-/16702.Melita-Mobile/signal",
    "gsmaId": 1997,
    "gsmaName": "Melita"
  },
  {
    "countryCode": "MU",
    "operatorId": 1999739,
    "operatorName": "Chili Mobile",
    "link": "https://www.nperf.com/en/map/MU/-/1999739.Chili-Mobile/signal",
    "gsmaId": 1889,
    "gsmaName": "CHILI (MTML)"
  },
  {
    "countryCode": "MU",
    "operatorId": 1999729,
    "operatorName": "Emtel Mobile",
    "link": "https://www.nperf.com/en/map/MU/-/1999729.Emtel-Mobile/signal",
    "gsmaId": 165,
    "gsmaName": "Emtel (Currimjee)"
  },
  {
    "countryCode": "MU",
    "operatorId": 1999736,
    "operatorName": "My.T Mobile",
    "link": "https://www.nperf.com/en/map/MU/-/1999736.MyT-Mobile/signal",
    "gsmaId": 79,
    "gsmaName": "my.t (Mauritius Telecom)"
  },
  {
    "countryCode": "MV",
    "operatorId": 2066964,
    "operatorName": "Dhiraagu Mobile",
    "link": "https://www.nperf.com/en/map/MV/-/2066964.Dhiraagu-Mobile/signal",
    "gsmaId": 139,
    "gsmaName": "Dhiraagu (Batelco)"
  },
  {
    "countryCode": "MV",
    "operatorId": 2066965,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/MV/-/2066965.Ooredoo-Mobile/signal",
    "gsmaId": 946,
    "gsmaName": "Ooredoo (NMTC)"
  },
  {
    "countryCode": "MW",
    "operatorId": 223549,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/MW/-/223549.Airtel-Mobile/signal",
    "gsmaId": 91,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "MW",
    "operatorId": 223548,
    "operatorName": "TNM Mobile",
    "link": "https://www.nperf.com/en/map/MW/-/223548.TNM-Mobile/signal",
    "gsmaId": 501,
    "gsmaName": "TNM"
  },
  {
    "countryCode": "MX",
    "operatorId": 128539,
    "operatorName": "Altan Redes",
    "link": "https://www.nperf.com/en/map/MX/-/128539.Altan-Redes/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "MX",
    "operatorId": 9921,
    "operatorName": "AT&T / Unefon",
    "link": "https://www.nperf.com/en/map/MX/-/9921.ATT--Unefon/signal",
    "gsmaId": 644,
    "gsmaName": "AT&T"
  },
  {
    "countryCode": "MX",
    "operatorId": 6516,
    "operatorName": "Movistar",
    "link": "https://www.nperf.com/en/map/MX/-/6516.Movistar/signal",
    "gsmaId": 611,
    "gsmaName": "Movistar (Telefonica) (MNO: AT&T)"
  },
  {
    "countryCode": "MX",
    "operatorId": 2004799,
    "operatorName": "Telcel Mobile",
    "link": "https://www.nperf.com/en/map/MX/-/2004799.Telcel-Mobile/signal",
    "gsmaId": 402,
    "gsmaName": "Telcel (America Movil)"
  },
  {
    "countryCode": "MY",
    "operatorId": 2080357,
    "operatorName": "CelcomDigi Mobile",
    "link": "https://www.nperf.com/en/map/MY/-/2080357.CelcomDigi-Mobile/signal",
    "gsmaId": 75,
    "gsmaName": "Celcom (Axiata)"
  },
  {
    "countryCode": "MY",
    "operatorId": 2080359,
    "operatorName": "Maxis Mobile",
    "link": "https://www.nperf.com/en/map/MY/-/2080359.Maxis-Mobile/signal",
    "gsmaId": 273,
    "gsmaName": "Maxis"
  },
  {
    "countryCode": "MY",
    "operatorId": 2080364,
    "operatorName": "U Mobile",
    "link": "https://www.nperf.com/en/map/MY/-/2080364.U-Mobile/signal",
    "gsmaId": 1647,
    "gsmaName": "U Mobile"
  },
  {
    "countryCode": "MY",
    "operatorId": 2080362,
    "operatorName": "Unifi Mobile",
    "link": "https://www.nperf.com/en/map/MY/-/2080362.Unifi-Mobile/signal",
    "gsmaId": 1647,
    "gsmaName": "U Mobile"
  },
  {
    "countryCode": "MY",
    "operatorId": 126418,
    "operatorName": "Yes",
    "link": "https://www.nperf.com/en/map/MY/-/126418.Yes/signal",
    "gsmaId": 3712,
    "gsmaName": "Yes (YTL Communications)"
  },
  {
    "countryCode": "MZ",
    "operatorId": 220829,
    "operatorName": "Movitel Mobile",
    "link": "https://www.nperf.com/en/map/MZ/-/220829.Movitel-Mobile/signal",
    "gsmaId": 3958,
    "gsmaName": "Movitel (Viettel)"
  },
  {
    "countryCode": "MZ",
    "operatorId": 220823,
    "operatorName": "Tmcel",
    "link": "https://www.nperf.com/en/map/MZ/-/220823.Tmcel/signal",
    "gsmaId": 309,
    "gsmaName": "Tmcel"
  },
  {
    "countryCode": "MZ",
    "operatorId": 220831,
    "operatorName": "Vodacom Mobile",
    "link": "https://www.nperf.com/en/map/MZ/-/220831.Vodacom-Mobile/signal",
    "gsmaId": 549,
    "gsmaName": "Vodacom"
  },
  {
    "countryCode": "NA",
    "operatorId": 220841,
    "operatorName": "MTC Mobile",
    "link": "https://www.nperf.com/en/map/NA/-/220841.MTC-Mobile/signal",
    "gsmaId": 315,
    "gsmaName": "MTC"
  },
  {
    "countryCode": "NA",
    "operatorId": 220842,
    "operatorName": "TN Mobile",
    "link": "https://www.nperf.com/en/map/NA/-/220842.TN-Mobile/signal",
    "gsmaId": 1822,
    "gsmaName": "TN Mobile (Telecom Namibia)"
  },
  {
    "countryCode": "NC",
    "operatorId": 5221,
    "operatorName": "OPT Mobilis",
    "link": "https://www.nperf.com/en/map/NC/-/5221.OPT-Mobilis/signal",
    "gsmaId": 354,
    "gsmaName": "OPT"
  },
  {
    "countryCode": "NE",
    "operatorId": 220800,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/NE/-/220800.Airtel-Mobile/signal",
    "gsmaId": 92,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "NE",
    "operatorId": 220801,
    "operatorName": "Moov Mobile",
    "link": "https://www.nperf.com/en/map/NE/-/220801.Moov-Mobile/signal",
    "gsmaId": 482,
    "gsmaName": "Moov (Maroc Telecom)"
  },
  {
    "countryCode": "NE",
    "operatorId": 220798,
    "operatorName": "Niger Telecoms Mobile",
    "link": "https://www.nperf.com/en/map/NE/-/220798.Niger-Telecoms-Mobile/signal",
    "gsmaId": 410,
    "gsmaName": "Niger Telecoms"
  },
  {
    "countryCode": "NE",
    "operatorId": 220796,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/NE/-/220796.Orange-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "NG",
    "operatorId": 6569,
    "operatorName": "9mobile",
    "link": "https://www.nperf.com/en/map/NG/-/6569.9mobile/signal",
    "gsmaId": 1872,
    "gsmaName": "9mobile (Teleology)"
  },
  {
    "countryCode": "NG",
    "operatorId": 3196,
    "operatorName": "Airtel",
    "link": "https://www.nperf.com/en/map/NG/-/3196.Airtel/signal",
    "gsmaId": 92,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "NG",
    "operatorId": 2107386,
    "operatorName": "Glo Mobile",
    "link": "https://www.nperf.com/en/map/NG/-/2107386.Glo-Mobile/signal",
    "gsmaId": 192,
    "gsmaName": "Glo Mobile (Globacom)"
  },
  {
    "countryCode": "NG",
    "operatorId": 169661,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/NG/-/169661.MTN-Mobile/signal",
    "gsmaId": 320,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "NG",
    "operatorId": 146841,
    "operatorName": "ntel",
    "link": "https://www.nperf.com/en/map/NG/-/146841.ntel/signal",
    "gsmaId": 334,
    "gsmaName": "ntel (NatCom)"
  },
  {
    "countryCode": "NI",
    "operatorId": 169658,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/NI/-/169658.Claro-Movil/signal",
    "gsmaId": 163,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "NI",
    "operatorId": 16812,
    "operatorName": "Tigo Movil",
    "link": "https://www.nperf.com/en/map/NI/-/16812.Tigo-Movil/signal",
    "gsmaId": 777,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "NL",
    "operatorId": 10391,
    "operatorName": "KPN Mobile",
    "link": "https://www.nperf.com/en/map/NL/-/10391.KPN-Mobile/signal",
    "gsmaId": 252,
    "gsmaName": "KPN"
  },
  {
    "countryCode": "NL",
    "operatorId": 2079629,
    "operatorName": "Odido Mobile",
    "link": "https://www.nperf.com/en/map/NL/-/2079629.Odido-Mobile/signal",
    "gsmaId": 465,
    "gsmaName": "Odido"
  },
  {
    "countryCode": "NL",
    "operatorId": 2079631,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/NL/-/2079631.Vodafone-Mobile/signal",
    "gsmaId": 562,
    "gsmaName": "VodafoneZiggo (Liberty Global / Vodafone)"
  },
  {
    "countryCode": "NO",
    "operatorId": 3179,
    "operatorName": "Ice Sweden",
    "link": "https://www.nperf.com/en/map/NO/-/3179.Ice-Sweden/signal",
    "gsmaId": 1839,
    "gsmaName": "Ice"
  },
  {
    "countryCode": "NO",
    "operatorId": 164116,
    "operatorName": "Telenor Mobile",
    "link": "https://www.nperf.com/en/map/NO/-/164116.Telenor-Mobile/signal",
    "gsmaId": 505,
    "gsmaName": "Telenor"
  },
  {
    "countryCode": "NO",
    "operatorId": 406884,
    "operatorName": "Telia Mobile",
    "link": "https://www.nperf.com/en/map/NO/-/406884.Telia-Mobile/signal",
    "gsmaId": 329,
    "gsmaName": "Telia"
  },
  {
    "countryCode": "NP",
    "operatorId": 13071,
    "operatorName": "Ncell",
    "link": "https://www.nperf.com/en/map/NP/-/13071.Ncell/signal",
    "gsmaId": 788,
    "gsmaName": "Ncell Axiata"
  },
  {
    "countryCode": "NP",
    "operatorId": 2036226,
    "operatorName": "NTC Mobile",
    "link": "https://www.nperf.com/en/map/NP/-/2036226.NTC-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "NP",
    "operatorId": 2036228,
    "operatorName": "SmartCell",
    "link": "https://www.nperf.com/en/map/NP/-/2036228.SmartCell/signal",
    "gsmaId": 4439,
    "gsmaName": "Smart Cell (Smart Telecom)"
  },
  {
    "countryCode": "NZ",
    "operatorId": 164194,
    "operatorName": "2degrees Mobile",
    "link": "https://www.nperf.com/en/map/NZ/-/164194.2degrees-Mobile/signal",
    "gsmaId": 995,
    "gsmaName": "2degrees"
  },
  {
    "countryCode": "NZ",
    "operatorId": 164191,
    "operatorName": "One Mobile",
    "link": "https://www.nperf.com/en/map/NZ/-/164191.One-Mobile/signal",
    "gsmaId": 565,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "NZ",
    "operatorId": 164193,
    "operatorName": "Spark Mobile",
    "link": "https://www.nperf.com/en/map/NZ/-/164193.Spark-Mobile/signal",
    "gsmaId": 608,
    "gsmaName": "Spark"
  },
  {
    "countryCode": "OM",
    "operatorId": 223624,
    "operatorName": "Omantel Mobile",
    "link": "https://www.nperf.com/en/map/OM/-/223624.Omantel-Mobile/signal",
    "gsmaId": 746,
    "gsmaName": "Omantel"
  },
  {
    "countryCode": "OM",
    "operatorId": 223627,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/OM/-/223627.Ooredoo-Mobile/signal",
    "gsmaId": 960,
    "gsmaName": "Ooredoo"
  },
  {
    "countryCode": "OM",
    "operatorId": 2109599,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/OM/-/2109599.Vodafone-Mobile/signal",
    "gsmaId": 289,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "PA",
    "operatorId": 198190,
    "operatorName": "+Móvil",
    "link": "https://www.nperf.com/en/map/PA/-/198190.Mvil/signal",
    "gsmaId": 64,
    "gsmaName": "Cable & Wireless"
  },
  {
    "countryCode": "PA",
    "operatorId": 15567,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/PA/-/15567.Digicel/signal",
    "gsmaId": 1860,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "PA",
    "operatorId": 1778174,
    "operatorName": "Tigo Mobile",
    "link": "https://www.nperf.com/en/map/PA/-/1778174.Tigo-Mobile/signal",
    "gsmaId": 749,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "PE",
    "operatorId": 163664,
    "operatorName": "Bitel Movil",
    "link": "https://www.nperf.com/en/map/PE/-/163664.Bitel-Movil/signal",
    "gsmaId": 4144,
    "gsmaName": "Bitel (Viettel)"
  },
  {
    "countryCode": "PE",
    "operatorId": 163661,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/PE/-/163661.Claro-Movil/signal",
    "gsmaId": 521,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "PE",
    "operatorId": 163668,
    "operatorName": "Entel Movil",
    "link": "https://www.nperf.com/en/map/PE/-/163668.Entel-Movil/signal",
    "gsmaId": 971,
    "gsmaName": "Entel"
  },
  {
    "countryCode": "PE",
    "operatorId": 163659,
    "operatorName": "Movistar Movil",
    "link": "https://www.nperf.com/en/map/PE/-/163659.Movistar-Movil/signal",
    "gsmaId": 613,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "PF",
    "operatorId": 2003998,
    "operatorName": "Ora Mobile",
    "link": "https://www.nperf.com/en/map/PF/-/2003998.Ora-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "PF",
    "operatorId": 2003999,
    "operatorName": "Vini Mobile",
    "link": "https://www.nperf.com/en/map/PF/-/2003999.Vini-Mobile/signal",
    "gsmaId": 519,
    "gsmaName": "Vini (OPT)"
  },
  {
    "countryCode": "PF",
    "operatorId": 2083023,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/PF/-/2083023.Vodafone-Mobile/signal",
    "gsmaId": 2075,
    "gsmaName": "Vodafone (Pacific Mobile Telecom)"
  },
  {
    "countryCode": "PG",
    "operatorId": 227659,
    "operatorName": "Bmobile",
    "link": "https://www.nperf.com/en/map/PG/-/227659.Bmobile/signal",
    "gsmaId": 376,
    "gsmaName": "bmobile-Vodafone"
  },
  {
    "countryCode": "PG",
    "operatorId": 227660,
    "operatorName": "Digicel Mobile",
    "link": "https://www.nperf.com/en/map/PG/-/227660.Digicel-Mobile/signal",
    "gsmaId": 1128,
    "gsmaName": "Digicel (Telstra)"
  },
  {
    "countryCode": "PG",
    "operatorId": 227666,
    "operatorName": "Telikom Mobile",
    "link": "https://www.nperf.com/en/map/PG/-/227666.Telikom-Mobile/signal",
    "gsmaId": 5598,
    "gsmaName": "Telikom"
  },
  {
    "countryCode": "PH",
    "operatorId": 1999183,
    "operatorName": "Dito Mobile",
    "link": "https://www.nperf.com/en/map/PH/-/1999183.Dito-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "PH",
    "operatorId": 1999179,
    "operatorName": "Globe Mobile",
    "link": "https://www.nperf.com/en/map/PH/-/1999179.Globe-Mobile/signal",
    "gsmaId": 193,
    "gsmaName": "Globe Telecom"
  },
  {
    "countryCode": "PH",
    "operatorId": 1999180,
    "operatorName": "Smart/Sun/TNT Mobile",
    "link": "https://www.nperf.com/en/map/PH/-/1999180.SmartSunTNT-Mobile/signal",
    "gsmaId": 433,
    "gsmaName": "Smart (PLDT)"
  },
  {
    "countryCode": "PK",
    "operatorId": 2033161,
    "operatorName": "Jazz Mobile",
    "link": "https://www.nperf.com/en/map/PK/-/2033161.Jazz-Mobile/signal",
    "gsmaId": 297,
    "gsmaName": "Jazz (VEON)"
  },
  {
    "countryCode": "PK",
    "operatorId": 8564,
    "operatorName": "Telenor",
    "link": "https://www.nperf.com/en/map/PK/-/8564.Telenor/signal",
    "gsmaId": 506,
    "gsmaName": "Telenor"
  },
  {
    "countryCode": "PK",
    "operatorId": 19024,
    "operatorName": "Ufone",
    "link": "https://www.nperf.com/en/map/PK/-/19024.Ufone/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "PK",
    "operatorId": 13743,
    "operatorName": "Zong",
    "link": "https://www.nperf.com/en/map/PK/-/13743.Zong/signal",
    "gsmaId": 378,
    "gsmaName": "Zong (China Mobile)"
  },
  {
    "countryCode": "PL",
    "operatorId": 59743,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/PL/-/59743.Orange-Mobile/signal",
    "gsmaId": 398,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "PL",
    "operatorId": 2107393,
    "operatorName": "Play Mobile",
    "link": "https://www.nperf.com/en/map/PL/-/2107393.Play-Mobile/signal",
    "gsmaId": 1049,
    "gsmaName": "Play (Iliad)"
  },
  {
    "countryCode": "PL",
    "operatorId": 2107387,
    "operatorName": "Plus Mobile",
    "link": "https://www.nperf.com/en/map/PL/-/2107387.Plus-Mobile/signal",
    "gsmaId": 389,
    "gsmaName": "Plus (Cyfrowy Polsat)"
  },
  {
    "countryCode": "PL",
    "operatorId": 2107392,
    "operatorName": "T-Mobile",
    "link": "https://www.nperf.com/en/map/PL/-/2107392.T-Mobile/signal",
    "gsmaId": 390,
    "gsmaName": "T-Mobile (Deutsche Telekom)"
  },
  {
    "countryCode": "PR",
    "operatorId": 187449,
    "operatorName": "AT&T FirstNet",
    "link": "https://www.nperf.com/en/map/PR/-/187449.ATT-FirstNet/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "PR",
    "operatorId": 174373,
    "operatorName": "Claro Mobile",
    "link": "https://www.nperf.com/en/map/PR/-/174373.Claro-Mobile/signal",
    "gsmaId": 817,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "PR",
    "operatorId": 129810,
    "operatorName": "Liberty Mobile",
    "link": "https://www.nperf.com/en/map/PR/-/129810.Liberty-Mobile/signal",
    "gsmaId": 814,
    "gsmaName": "Liberty"
  },
  {
    "countryCode": "PR",
    "operatorId": 108786,
    "operatorName": "T-Mobile",
    "link": "https://www.nperf.com/en/map/PR/-/108786.T-Mobile/signal",
    "gsmaId": 814,
    "gsmaName": "Liberty"
  },
  {
    "countryCode": "PS",
    "operatorId": 2088337,
    "operatorName": "Jawwal Mobile",
    "link": "https://www.nperf.com/en/map/PS/-/2088337.Jawwal-Mobile/signal",
    "gsmaId": 1049,
    "gsmaName": "Play (Iliad)"
  },
  {
    "countryCode": "PS",
    "operatorId": 2088340,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/PS/-/2088340.Ooredoo-Mobile/signal",
    "gsmaId": 1137,
    "gsmaName": "Airtel-Vodafone (Bharti)"
  },
  {
    "countryCode": "PT",
    "operatorId": 2086381,
    "operatorName": "Digi Mobile",
    "link": "https://www.nperf.com/en/map/PT/-/2086381.Digi-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "PT",
    "operatorId": 2010696,
    "operatorName": "MEO Mobile",
    "link": "https://www.nperf.com/en/map/PT/-/2010696.MEO-Mobile/signal",
    "gsmaId": 523,
    "gsmaName": "MEO (Altice Europe)"
  },
  {
    "countryCode": "PT",
    "operatorId": 2010694,
    "operatorName": "NOS Mobile",
    "link": "https://www.nperf.com/en/map/PT/-/2010694.NOS-Mobile/signal",
    "gsmaId": 355,
    "gsmaName": "NOS"
  },
  {
    "countryCode": "PT",
    "operatorId": 2010698,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/PT/-/2010698.Vodafone-Mobile/signal",
    "gsmaId": 568,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "PY",
    "operatorId": 10525,
    "operatorName": "Claro Mobile",
    "link": "https://www.nperf.com/en/map/PY/-/10525.Claro-Mobile/signal",
    "gsmaId": 219,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "PY",
    "operatorId": 167632,
    "operatorName": "Personal Mobile",
    "link": "https://www.nperf.com/en/map/PY/-/167632.Personal-Mobile/signal",
    "gsmaId": 339,
    "gsmaName": "Personal (Telecom Argentina)"
  },
  {
    "countryCode": "PY",
    "operatorId": 167627,
    "operatorName": "Tigo Mobile",
    "link": "https://www.nperf.com/en/map/PY/-/167627.Tigo-Mobile/signal",
    "gsmaId": 820,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "PY",
    "operatorId": 38530,
    "operatorName": "VOX Mobile",
    "link": "https://www.nperf.com/en/map/PY/-/38530.VOX-Mobile/signal",
    "gsmaId": 207,
    "gsmaName": "Vox (Hola)"
  },
  {
    "countryCode": "QA",
    "operatorId": 169669,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/QA/-/169669.Ooredoo-Mobile/signal",
    "gsmaId": 605,
    "gsmaName": "Ooredoo"
  },
  {
    "countryCode": "QA",
    "operatorId": 169666,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/QA/-/169666.Vodafone-Mobile/signal",
    "gsmaId": 1274,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "RE",
    "operatorId": 116142,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/RE/-/116142.Free-Mobile/signal",
    "gsmaId": 791,
    "gsmaName": "free (Axian / Iliad)"
  },
  {
    "countryCode": "RE",
    "operatorId": 17466,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/RE/-/17466.Orange-Mobile/signal",
    "gsmaId": 368,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "RE",
    "operatorId": 17472,
    "operatorName": "SFR Mobile",
    "link": "https://www.nperf.com/en/map/RE/-/17472.SFR-Mobile/signal",
    "gsmaId": 751,
    "gsmaName": "SFR (Altice Europe)"
  },
  {
    "countryCode": "RE",
    "operatorId": 171273,
    "operatorName": "Zeop Mobile",
    "link": "https://www.nperf.com/en/map/RE/-/171273.Zeop-Mobile/signal",
    "gsmaId": 6458,
    "gsmaName": "ZEOP Mobile"
  },
  {
    "countryCode": "RO",
    "operatorId": 7539,
    "operatorName": "DiGi Mobile",
    "link": "https://www.nperf.com/en/map/RO/-/7539.DiGi-Mobile/signal",
    "gsmaId": 1132,
    "gsmaName": "Digi Mobil (RCS & RDS)"
  },
  {
    "countryCode": "RO",
    "operatorId": 171614,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/RO/-/171614.Orange-Mobile/signal",
    "gsmaId": 369,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "RO",
    "operatorId": 4245,
    "operatorName": "Telekom Mobile",
    "link": "https://www.nperf.com/en/map/RO/-/4245.Telekom-Mobile/signal",
    "gsmaId": 127,
    "gsmaName": "Telekom Romania (OTE)"
  },
  {
    "countryCode": "RO",
    "operatorId": 171617,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/RO/-/171617.Vodafone-Mobile/signal",
    "gsmaId": 289,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "RS",
    "operatorId": 2033164,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/RS/-/2033164.A1-Mobile/signal",
    "gsmaId": 1199,
    "gsmaName": "A1"
  },
  {
    "countryCode": "RS",
    "operatorId": 164126,
    "operatorName": "MTS Mobile",
    "link": "https://www.nperf.com/en/map/RS/-/164126.MTS-Mobile/signal",
    "gsmaId": 502,
    "gsmaName": "mts (Telekom Srbija)"
  },
  {
    "countryCode": "RS",
    "operatorId": 164127,
    "operatorName": "Yettel Mobile",
    "link": "https://www.nperf.com/en/map/RS/-/164127.Yettel-Mobile/signal",
    "gsmaId": 292,
    "gsmaName": "Yettel (PPF)"
  },
  {
    "countryCode": "RU",
    "operatorId": 21937,
    "operatorName": "Beeline Mobile",
    "link": "https://www.nperf.com/en/map/RU/-/21937.Beeline-Mobile/signal",
    "gsmaId": 618,
    "gsmaName": "Beeline (VEON)"
  },
  {
    "countryCode": "RU",
    "operatorId": 157254,
    "operatorName": "MegaFon Mobile",
    "link": "https://www.nperf.com/en/map/RU/-/157254.MegaFon-Mobile/signal",
    "gsmaId": 276,
    "gsmaName": "MegaFon"
  },
  {
    "countryCode": "RU",
    "operatorId": 157235,
    "operatorName": "MTS Mobile",
    "link": "https://www.nperf.com/en/map/RU/-/157235.MTS-Mobile/signal",
    "gsmaId": 295,
    "gsmaName": "MTS (Sistema)"
  },
  {
    "countryCode": "RU",
    "operatorId": 169054,
    "operatorName": "t2 Mobile",
    "link": "https://www.nperf.com/en/map/RU/-/169054.t2-Mobile/signal",
    "gsmaId": 608,
    "gsmaName": "Spark"
  },
  {
    "countryCode": "RU",
    "operatorId": 1053,
    "operatorName": "Yota",
    "link": "https://www.nperf.com/en/map/RU/-/1053.Yota/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "RW",
    "operatorId": 223576,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/RW/-/223576.Airtel-Mobile/signal",
    "gsmaId": 4659,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "RW",
    "operatorId": 223575,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/RW/-/223575.MTN-Mobile/signal",
    "gsmaId": 321,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "SA",
    "operatorId": 2107419,
    "operatorName": "Mobily Mobile",
    "link": "https://www.nperf.com/en/map/SA/-/2107419.Mobily-Mobile/signal",
    "gsmaId": 684,
    "gsmaName": "Mobily (Etihad Etisalat)"
  },
  {
    "countryCode": "SA",
    "operatorId": 2107416,
    "operatorName": "stc Mobile",
    "link": "https://www.nperf.com/en/map/SA/-/2107416.stc-Mobile/signal",
    "gsmaId": 412,
    "gsmaName": "STC"
  },
  {
    "countryCode": "SA",
    "operatorId": 2107425,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/SA/-/2107425.Zain-Mobile/signal",
    "gsmaId": 1483,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "SB",
    "operatorId": 2026867,
    "operatorName": "bMobile",
    "link": "https://www.nperf.com/en/map/SB/-/2026867.bMobile/signal",
    "gsmaId": 3045,
    "gsmaName": "bmobile-Vodafone"
  },
  {
    "countryCode": "SB",
    "operatorId": 2026865,
    "operatorName": "Our Telekom Mobile",
    "link": "https://www.nperf.com/en/map/SB/-/2026865.Our-Telekom-Mobile/signal",
    "gsmaId": 757,
    "gsmaName": "Our Telekom (Solomon Telekom)"
  },
  {
    "countryCode": "SC",
    "operatorId": 2037640,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/SC/-/2037640.Airtel-Mobile/signal",
    "gsmaId": 485,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "SC",
    "operatorId": 2037637,
    "operatorName": "C&W Mobile",
    "link": "https://www.nperf.com/en/map/SC/-/2037637.CW-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "SD",
    "operatorId": 223590,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/SD/-/223590.MTN-Mobile/signal",
    "gsmaId": 4475,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "SD",
    "operatorId": 223595,
    "operatorName": "Sudatel Mobile",
    "link": "https://www.nperf.com/en/map/SD/-/223595.Sudatel-Mobile/signal",
    "gsmaId": 1420,
    "gsmaName": "Sudani (Sudatel)"
  },
  {
    "countryCode": "SD",
    "operatorId": 223588,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/SD/-/223588.Zain-Mobile/signal",
    "gsmaId": 4682,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "SE",
    "operatorId": 8276,
    "operatorName": "Tele2 Mobile",
    "link": "https://www.nperf.com/en/map/SE/-/8276.Tele2-Mobile/signal",
    "gsmaId": 476,
    "gsmaName": "Tele2"
  },
  {
    "countryCode": "SE",
    "operatorId": 2012030,
    "operatorName": "Telenor Mobile",
    "link": "https://www.nperf.com/en/map/SE/-/2012030.Telenor-Mobile/signal",
    "gsmaId": 476,
    "gsmaName": "Tele2"
  },
  {
    "countryCode": "SE",
    "operatorId": 198948,
    "operatorName": "Telia Mobile",
    "link": "https://www.nperf.com/en/map/SE/-/198948.Telia-Mobile/signal",
    "gsmaId": 513,
    "gsmaName": "Telia"
  },
  {
    "countryCode": "SE",
    "operatorId": 2012024,
    "operatorName": "Tre Mobile",
    "link": "https://www.nperf.com/en/map/SE/-/2012024.Tre-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "SG",
    "operatorId": 2107426,
    "operatorName": "M1 Mobile",
    "link": "https://www.nperf.com/en/map/SG/-/2107426.M1-Mobile/signal",
    "gsmaId": 296,
    "gsmaName": "M1"
  },
  {
    "countryCode": "SG",
    "operatorId": 164458,
    "operatorName": "Simba Mobile",
    "link": "https://www.nperf.com/en/map/SG/-/164458.Simba-Mobile/signal",
    "gsmaId": 6522,
    "gsmaName": "TPG SIMBA"
  },
  {
    "countryCode": "SG",
    "operatorId": 18187,
    "operatorName": "SingTel Mobile",
    "link": "https://www.nperf.com/en/map/SG/-/18187.SingTel-Mobile/signal",
    "gsmaId": 428,
    "gsmaName": "Singtel"
  },
  {
    "countryCode": "SG",
    "operatorId": 14076,
    "operatorName": "Starhub Mobile",
    "link": "https://www.nperf.com/en/map/SG/-/14076.Starhub-Mobile/signal",
    "gsmaId": 449,
    "gsmaName": "StarHub"
  },
  {
    "countryCode": "SI",
    "operatorId": 188781,
    "operatorName": "A1 Mobile",
    "link": "https://www.nperf.com/en/map/SI/-/188781.A1-Mobile/signal",
    "gsmaId": 423,
    "gsmaName": "A1 (A1 Telekom Austria)"
  },
  {
    "countryCode": "SI",
    "operatorId": 2010653,
    "operatorName": "T-2 Mobile",
    "link": "https://www.nperf.com/en/map/SI/-/2010653.T-2-Mobile/signal",
    "gsmaId": 1282,
    "gsmaName": "T-2"
  },
  {
    "countryCode": "SI",
    "operatorId": 188784,
    "operatorName": "Telekom Mobile",
    "link": "https://www.nperf.com/en/map/SI/-/188784.Telekom-Mobile/signal",
    "gsmaId": 308,
    "gsmaName": "Telekom Slovenije"
  },
  {
    "countryCode": "SI",
    "operatorId": 188778,
    "operatorName": "Telemach Mobile",
    "link": "https://www.nperf.com/en/map/SI/-/188778.Telemach-Mobile/signal",
    "gsmaId": 308,
    "gsmaName": "Telekom Slovenije"
  },
  {
    "countryCode": "SK",
    "operatorId": 86539,
    "operatorName": "4ka Mobile",
    "link": "https://www.nperf.com/en/map/SK/-/86539.4ka-Mobile/signal",
    "gsmaId": 5722,
    "gsmaName": "4ka (SWAN Mobile)"
  },
  {
    "countryCode": "SK",
    "operatorId": 24786,
    "operatorName": "O2 Mobile",
    "link": "https://www.nperf.com/en/map/SK/-/24786.O2-Mobile/signal",
    "gsmaId": 1134,
    "gsmaName": "O2 (PPF)"
  },
  {
    "countryCode": "SK",
    "operatorId": 187877,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/SK/-/187877.Orange-Mobile/signal",
    "gsmaId": 370,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "SK",
    "operatorId": 187881,
    "operatorName": "Telekom Mobile",
    "link": "https://www.nperf.com/en/map/SK/-/187881.Telekom-Mobile/signal",
    "gsmaId": 174,
    "gsmaName": "Slovak Telekom (Deutsche Telekom)"
  },
  {
    "countryCode": "SL",
    "operatorId": 220704,
    "operatorName": "Africell Mobile",
    "link": "https://www.nperf.com/en/map/SL/-/220704.Africell-Mobile/signal",
    "gsmaId": 261,
    "gsmaName": "Africell (Lintel)"
  },
  {
    "countryCode": "SL",
    "operatorId": 220702,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/SL/-/220702.Orange-Mobile/signal",
    "gsmaId": 86,
    "gsmaName": "Orange (Sonatel)"
  },
  {
    "countryCode": "SL",
    "operatorId": 220706,
    "operatorName": "SierraTel Mobile",
    "link": "https://www.nperf.com/en/map/SL/-/220706.SierraTel-Mobile/signal",
    "gsmaId": 2028,
    "gsmaName": "Sierratel"
  },
  {
    "countryCode": "SN",
    "operatorId": 353,
    "operatorName": "Expresso",
    "link": "https://www.nperf.com/en/map/SN/-/353.Expresso/signal",
    "gsmaId": 1888,
    "gsmaName": "Expresso (Sudatel)"
  },
  {
    "countryCode": "SN",
    "operatorId": 153101,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/SN/-/153101.Orange-Mobile/signal",
    "gsmaId": 755,
    "gsmaName": "Orange (Sonatel)"
  },
  {
    "countryCode": "SN",
    "operatorId": 9236,
    "operatorName": "Yas",
    "link": "https://www.nperf.com/en/map/SN/-/9236.Yas/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "SO",
    "operatorId": 223612,
    "operatorName": "Golis Mobile",
    "link": "https://www.nperf.com/en/map/SO/-/223612.Golis-Mobile/signal",
    "gsmaId": 1887,
    "gsmaName": "Golis Telecom"
  },
  {
    "countryCode": "SO",
    "operatorId": 223613,
    "operatorName": "Hormuud Mobile",
    "link": "https://www.nperf.com/en/map/SO/-/223613.Hormuud-Mobile/signal",
    "gsmaId": 209,
    "gsmaName": "Hormuud Telecom"
  },
  {
    "countryCode": "SO",
    "operatorId": 223608,
    "operatorName": "SomNet Mobile",
    "link": "https://www.nperf.com/en/map/SO/-/223608.SomNet-Mobile/signal",
    "gsmaId": 5370,
    "gsmaName": "Somnet Telecom"
  },
  {
    "countryCode": "SO",
    "operatorId": 223616,
    "operatorName": "Somtel Mobile",
    "link": "https://www.nperf.com/en/map/SO/-/223616.Somtel-Mobile/signal",
    "gsmaId": 2031,
    "gsmaName": "Somtel; Somaliland"
  },
  {
    "countryCode": "SO",
    "operatorId": 223606,
    "operatorName": "Telesom Mobile",
    "link": "https://www.nperf.com/en/map/SO/-/223606.Telesom-Mobile/signal",
    "gsmaId": 5338,
    "gsmaName": "Telecel (Atel)"
  },
  {
    "countryCode": "SR",
    "operatorId": 3136,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/SR/-/3136.Digicel/signal",
    "gsmaId": 1472,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "SR",
    "operatorId": 167649,
    "operatorName": "TeleSur Mobile",
    "link": "https://www.nperf.com/en/map/SR/-/167649.TeleSur-Mobile/signal",
    "gsmaId": 509,
    "gsmaName": "Telesur"
  },
  {
    "countryCode": "SS",
    "operatorId": 223598,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/SS/-/223598.MTN-Mobile/signal",
    "gsmaId": 4475,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "SS",
    "operatorId": 223601,
    "operatorName": "Zain Mobile",
    "link": "https://www.nperf.com/en/map/SS/-/223601.Zain-Mobile/signal",
    "gsmaId": 4682,
    "gsmaName": "Zain"
  },
  {
    "countryCode": "SV",
    "operatorId": 169654,
    "operatorName": "Claro Movil",
    "link": "https://www.nperf.com/en/map/SV/-/169654.Claro-Movil/signal",
    "gsmaId": 130,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "SV",
    "operatorId": 2107428,
    "operatorName": "Digicel Movil",
    "link": "https://www.nperf.com/en/map/SV/-/2107428.Digicel-Movil/signal",
    "gsmaId": 147,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "SV",
    "operatorId": 16168,
    "operatorName": "Movistar",
    "link": "https://www.nperf.com/en/map/SV/-/16168.Movistar/signal",
    "gsmaId": 498,
    "gsmaName": "Movistar"
  },
  {
    "countryCode": "SV",
    "operatorId": 169655,
    "operatorName": "Tigo Movil",
    "link": "https://www.nperf.com/en/map/SV/-/169655.Tigo-Movil/signal",
    "gsmaId": 504,
    "gsmaName": "Tigo (Millicom)"
  },
  {
    "countryCode": "SX",
    "operatorId": 2003947,
    "operatorName": "Flow Mobile",
    "link": "https://www.nperf.com/en/map/SX/-/2003947.Flow-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "SX",
    "operatorId": 2003945,
    "operatorName": "TelEm Mobile",
    "link": "https://www.nperf.com/en/map/SX/-/2003945.TelEm-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "SY",
    "operatorId": 223653,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/SY/-/223653.MTN-Mobile/signal",
    "gsmaId": 445,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "SY",
    "operatorId": 2109649,
    "operatorName": "Rcell",
    "link": "https://www.nperf.com/en/map/SY/-/2109649.Rcell/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "SY",
    "operatorId": 223652,
    "operatorName": "Syriatel Mobile",
    "link": "https://www.nperf.com/en/map/SY/-/223652.Syriatel-Mobile/signal",
    "gsmaId": 459,
    "gsmaName": "Syriatel"
  },
  {
    "countryCode": "SZ",
    "operatorId": 223542,
    "operatorName": "Eswatini Mobile",
    "link": "https://www.nperf.com/en/map/SZ/-/223542.Eswatini-Mobile/signal",
    "gsmaId": 6579,
    "gsmaName": "Eswatini Mobile"
  },
  {
    "countryCode": "SZ",
    "operatorId": 223546,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/SZ/-/223546.MTN-Mobile/signal",
    "gsmaId": 455,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "TD",
    "operatorId": 220803,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/TD/-/220803.Airtel-Mobile/signal",
    "gsmaId": 94,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "TD",
    "operatorId": 220806,
    "operatorName": "Tigo Mobile",
    "link": "https://www.nperf.com/en/map/TD/-/220806.Tigo-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TG",
    "operatorId": 220668,
    "operatorName": "Moov ",
    "link": "https://www.nperf.com/en/map/TG/-/220668.Moov-/signal",
    "gsmaId": 483,
    "gsmaName": "Moov Africa (Maroc Telecom)"
  },
  {
    "countryCode": "TG",
    "operatorId": 220667,
    "operatorName": "Yas ",
    "link": "https://www.nperf.com/en/map/TG/-/220667.Yas-/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TH",
    "operatorId": 19345,
    "operatorName": "AIS Mobile",
    "link": "https://www.nperf.com/en/map/TH/-/19345.AIS-Mobile/signal",
    "gsmaId": 5,
    "gsmaName": "AIS"
  },
  {
    "countryCode": "TH",
    "operatorId": 1885,
    "operatorName": "dtac",
    "link": "https://www.nperf.com/en/map/TH/-/1885.dtac/signal",
    "gsmaId": 529,
    "gsmaName": "dtac (Telenor)"
  },
  {
    "countryCode": "TH",
    "operatorId": 3379,
    "operatorName": "NT Mobile",
    "link": "https://www.nperf.com/en/map/TH/-/3379.NT-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TH",
    "operatorId": 11529,
    "operatorName": "True Move H",
    "link": "https://www.nperf.com/en/map/TH/-/11529.True-Move-H/signal",
    "gsmaId": 467,
    "gsmaName": "TrueMove H (True Corporation)"
  },
  {
    "countryCode": "TJ",
    "operatorId": 1995857,
    "operatorName": "Babilon Mobile",
    "link": "https://www.nperf.com/en/map/TJ/-/1995857.Babilon-Mobile/signal",
    "gsmaId": 238,
    "gsmaName": "Babilon-Mobile"
  },
  {
    "countryCode": "TJ",
    "operatorId": 1995856,
    "operatorName": "MegaFon Mobile",
    "link": "https://www.nperf.com/en/map/TJ/-/1995856.MegaFon-Mobile/signal",
    "gsmaId": 761,
    "gsmaName": "MegaFon"
  },
  {
    "countryCode": "TJ",
    "operatorId": 1995855,
    "operatorName": "Tcell Mobile",
    "link": "https://www.nperf.com/en/map/TJ/-/1995855.Tcell-Mobile/signal",
    "gsmaId": 241,
    "gsmaName": "Tcell"
  },
  {
    "countryCode": "TJ",
    "operatorId": 1995859,
    "operatorName": "ZET Mobile",
    "link": "https://www.nperf.com/en/map/TJ/-/1995859.ZET-Mobile/signal",
    "gsmaId": 470,
    "gsmaName": "ZET Mobile"
  },
  {
    "countryCode": "TL",
    "operatorId": 1996013,
    "operatorName": "Telemor",
    "link": "https://www.nperf.com/en/map/TL/-/1996013.Telemor/signal",
    "gsmaId": 5305,
    "gsmaName": "Telemor (Viettel)"
  },
  {
    "countryCode": "TL",
    "operatorId": 1996009,
    "operatorName": "Telkomcel Mobile",
    "link": "https://www.nperf.com/en/map/TL/-/1996009.Telkomcel-Mobile/signal",
    "gsmaId": 5304,
    "gsmaName": "Telkomcel (Telin)"
  },
  {
    "countryCode": "TL",
    "operatorId": 1996012,
    "operatorName": "TT Mobile",
    "link": "https://www.nperf.com/en/map/TL/-/1996012.TT-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TM",
    "operatorId": 1995863,
    "operatorName": "TM Cell",
    "link": "https://www.nperf.com/en/map/TM/-/1995863.TM-Cell/signal",
    "gsmaId": 450,
    "gsmaName": "TMCELL (Altyn Asyr)"
  },
  {
    "countryCode": "TN",
    "operatorId": 134197,
    "operatorName": "Ooredoo Mobile",
    "link": "https://www.nperf.com/en/map/TN/-/134197.Ooredoo-Mobile/signal",
    "gsmaId": 373,
    "gsmaName": "Ooredoo (NMTC)"
  },
  {
    "countryCode": "TN",
    "operatorId": 20822,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/TN/-/20822.Orange-Mobile/signal",
    "gsmaId": 2069,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "TN",
    "operatorId": 2029496,
    "operatorName": "TT Mobile",
    "link": "https://www.nperf.com/en/map/TN/-/2029496.TT-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TR",
    "operatorId": 164410,
    "operatorName": "Türk Telekom Mobile",
    "link": "https://www.nperf.com/en/map/TR/-/164410.Trk-Telekom-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TR",
    "operatorId": 2004366,
    "operatorName": "Turkcell Mobile",
    "link": "https://www.nperf.com/en/map/TR/-/2004366.Turkcell-Mobile/signal",
    "gsmaId": 532,
    "gsmaName": "Turk Telekom"
  },
  {
    "countryCode": "TR",
    "operatorId": 29544,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/TR/-/29544.Vodafone-Mobile/signal",
    "gsmaId": 514,
    "gsmaName": "Vodafone"
  },
  {
    "countryCode": "TT",
    "operatorId": 1996000,
    "operatorName": "bmobile",
    "link": "https://www.nperf.com/en/map/TT/-/1996000.bmobile/signal",
    "gsmaId": 493,
    "gsmaName": "bmobile (TSTT)"
  },
  {
    "countryCode": "TT",
    "operatorId": 1996003,
    "operatorName": "Digicel",
    "link": "https://www.nperf.com/en/map/TT/-/1996003.Digicel/signal",
    "gsmaId": 1046,
    "gsmaName": "Digicel"
  },
  {
    "countryCode": "TW",
    "operatorId": 2000302,
    "operatorName": "Chunghwa Mobile",
    "link": "https://www.nperf.com/en/map/TW/-/2000302.Chunghwa-Mobile/signal",
    "gsmaId": 105,
    "gsmaName": "Chunghwa Telecom"
  },
  {
    "countryCode": "TW",
    "operatorId": 2000308,
    "operatorName": "Far EasTone Mobile",
    "link": "https://www.nperf.com/en/map/TW/-/2000308.Far-EasTone-Mobile/signal",
    "gsmaId": 180,
    "gsmaName": "Far EasTone"
  },
  {
    "countryCode": "TW",
    "operatorId": 2000304,
    "operatorName": "GT Mobile",
    "link": "https://www.nperf.com/en/map/TW/-/2000304.GT-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TW",
    "operatorId": 2000313,
    "operatorName": "T Star Mobile",
    "link": "https://www.nperf.com/en/map/TW/-/2000313.T-Star-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "TW",
    "operatorId": 2000303,
    "operatorName": "Taiwan Mobile",
    "link": "https://www.nperf.com/en/map/TW/-/2000303.Taiwan-Mobile/signal",
    "gsmaId": 469,
    "gsmaName": "Taiwan Mobile"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223556,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223556.Airtel-Mobile/signal",
    "gsmaId": 93,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223561,
    "operatorName": "Halotel Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223561.Halotel-Mobile/signal",
    "gsmaId": 5929,
    "gsmaName": "Halotel (Viettel)"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223563,
    "operatorName": "Smile Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223563.Smile-Mobile/signal",
    "gsmaId": 3194,
    "gsmaName": "Smile"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223551,
    "operatorName": "Tigo Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223551.Tigo-Mobile/signal",
    "gsmaId": 279,
    "gsmaName": "Tigo (AXIAN)"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223558,
    "operatorName": "TTCL Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223558.TTCL-Mobile/signal",
    "gsmaId": 1829,
    "gsmaName": "TTCL"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223555,
    "operatorName": "Vodacom Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223555.Vodacom-Mobile/signal",
    "gsmaId": 553,
    "gsmaName": "Vodacom"
  },
  {
    "countryCode": "TZ",
    "operatorId": 223553,
    "operatorName": "Zantel Mobile",
    "link": "https://www.nperf.com/en/map/TZ/-/223553.Zantel-Mobile/signal",
    "gsmaId": 591,
    "gsmaName": "Zantel (AXIAN)"
  },
  {
    "countryCode": "UA",
    "operatorId": 65222,
    "operatorName": "Kyivstar Mobile",
    "link": "https://www.nperf.com/en/map/UA/-/65222.Kyivstar-Mobile/signal",
    "gsmaId": 255,
    "gsmaName": "Kyivstar (VEON)"
  },
  {
    "countryCode": "UA",
    "operatorId": 309,
    "operatorName": "Lifecell",
    "link": "https://www.nperf.com/en/map/UA/-/309.Lifecell/signal",
    "gsmaId": 28,
    "gsmaName": "lifecell (Turkcell)"
  },
  {
    "countryCode": "UA",
    "operatorId": 146209,
    "operatorName": "Vodafone Mobile",
    "link": "https://www.nperf.com/en/map/UA/-/146209.Vodafone-Mobile/signal",
    "gsmaId": 538,
    "gsmaName": "Vodafone (NEQSOL)"
  },
  {
    "countryCode": "UG",
    "operatorId": 223583,
    "operatorName": "Africell Mobile",
    "link": "https://www.nperf.com/en/map/UG/-/223583.Africell-Mobile/signal",
    "gsmaId": 1402,
    "gsmaName": "Africell (Lintel)"
  },
  {
    "countryCode": "UG",
    "operatorId": 223580,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/UG/-/223580.Airtel-Mobile/signal",
    "gsmaId": 85,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "UG",
    "operatorId": 223581,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/UG/-/223581.MTN-Mobile/signal",
    "gsmaId": 322,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "UG",
    "operatorId": 223582,
    "operatorName": "UTL Mobile",
    "link": "https://www.nperf.com/en/map/UG/-/223582.UTL-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "US",
    "operatorId": 187448,
    "operatorName": "AT&T FirstNet",
    "link": "https://www.nperf.com/en/map/US/-/187448.ATT-FirstNet/signal",
    "gsmaId": 107,
    "gsmaName": "AT&T"
  },
  {
    "countryCode": "US",
    "operatorId": 2420,
    "operatorName": "AT&T Mobility",
    "link": "https://www.nperf.com/en/map/US/-/2420.ATT-Mobility/signal",
    "gsmaId": 107,
    "gsmaName": "AT&T"
  },
  {
    "countryCode": "US",
    "operatorId": 221457,
    "operatorName": "Boost Mobile",
    "link": "https://www.nperf.com/en/map/US/-/221457.Boost-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "US",
    "operatorId": 31493,
    "operatorName": "Carolina West Wireless",
    "link": "https://www.nperf.com/en/map/US/-/31493.Carolina-West-Wireless/signal",
    "gsmaId": 232,
    "gsmaName": "iWireless"
  },
  {
    "countryCode": "US",
    "operatorId": 39925,
    "operatorName": "Cellular One",
    "link": "https://www.nperf.com/en/map/US/-/39925.Cellular-One/signal",
    "gsmaId": 3324,
    "gsmaName": "Cellcom (Nsight)"
  },
  {
    "countryCode": "US",
    "operatorId": 85,
    "operatorName": "T-Mobile (inc. Sprint)",
    "link": "https://www.nperf.com/en/map/US/-/85.T-Mobile-inc-Sprint/signal",
    "gsmaId": 232,
    "gsmaName": "iWireless"
  },
  {
    "countryCode": "US",
    "operatorId": 47633,
    "operatorName": "U.S. Cellular",
    "link": "https://www.nperf.com/en/map/US/-/47633.US-Cellular/signal",
    "gsmaId": 900,
    "gsmaName": "US Cellular (TDS)"
  },
  {
    "countryCode": "US",
    "operatorId": 1881,
    "operatorName": "Union Wireless",
    "link": "https://www.nperf.com/en/map/US/-/1881.Union-Wireless/signal",
    "gsmaId": 232,
    "gsmaName": "iWireless"
  },
  {
    "countryCode": "US",
    "operatorId": 3255,
    "operatorName": "Verizon Wireless",
    "link": "https://www.nperf.com/en/map/US/-/3255.Verizon-Wireless/signal",
    "gsmaId": 232,
    "gsmaName": "iWireless"
  },
  {
    "countryCode": "UY",
    "operatorId": 167624,
    "operatorName": "Antel Mobile",
    "link": "https://www.nperf.com/en/map/UY/-/167624.Antel-Mobile/signal",
    "gsmaId": 22,
    "gsmaName": "Antel"
  },
  {
    "countryCode": "UY",
    "operatorId": 106269,
    "operatorName": "Claro Mobile",
    "link": "https://www.nperf.com/en/map/UY/-/106269.Claro-Mobile/signal",
    "gsmaId": 18,
    "gsmaName": "Claro (America Movil)"
  },
  {
    "countryCode": "UY",
    "operatorId": 4027,
    "operatorName": "Movistar Mobile",
    "link": "https://www.nperf.com/en/map/UY/-/4027.Movistar-Mobile/signal",
    "gsmaId": 759,
    "gsmaName": "Movistar (Telefonica)"
  },
  {
    "countryCode": "UZ",
    "operatorId": 208150,
    "operatorName": "Beeline Mobile",
    "link": "https://www.nperf.com/en/map/UZ/-/208150.Beeline-Mobile/signal",
    "gsmaId": 136,
    "gsmaName": "Beeline (VEON)"
  },
  {
    "countryCode": "UZ",
    "operatorId": 208153,
    "operatorName": "Mobiuz Mobile",
    "link": "https://www.nperf.com/en/map/UZ/-/208153.Mobiuz-Mobile/signal",
    "gsmaId": 5948,
    "gsmaName": "mobiuz"
  },
  {
    "countryCode": "UZ",
    "operatorId": 208152,
    "operatorName": "Ucell Mobile",
    "link": "https://www.nperf.com/en/map/UZ/-/208152.Ucell-Mobile/signal",
    "gsmaId": 124,
    "gsmaName": "Ucell (Telia)"
  },
  {
    "countryCode": "UZ",
    "operatorId": 208154,
    "operatorName": "UzMobile",
    "link": "https://www.nperf.com/en/map/UZ/-/208154.UzMobile/signal",
    "gsmaId": 1040,
    "gsmaName": "Uztelecom"
  },
  {
    "countryCode": "VC",
    "operatorId": 2404,
    "operatorName": "Lime",
    "link": "https://www.nperf.com/en/map/VC/-/2404.Lime/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "VE",
    "operatorId": 7454,
    "operatorName": "Digitel",
    "link": "https://www.nperf.com/en/map/VE/-/7454.Digitel/signal",
    "gsmaId": 145,
    "gsmaName": "Digitel"
  },
  {
    "countryCode": "VE",
    "operatorId": 11741,
    "operatorName": "Movilnet",
    "link": "https://www.nperf.com/en/map/VE/-/11741.Movilnet/signal",
    "gsmaId": 647,
    "gsmaName": "Movilnet (CANTV)"
  },
  {
    "countryCode": "VE",
    "operatorId": 17991,
    "operatorName": "Movistar Movil",
    "link": "https://www.nperf.com/en/map/VE/-/17991.Movistar-Movil/signal",
    "gsmaId": 647,
    "gsmaName": "Movilnet (CANTV)"
  },
  {
    "countryCode": "VI",
    "operatorId": 2019546,
    "operatorName": "Liberty Mobile",
    "link": "https://www.nperf.com/en/map/VI/-/2019546.Liberty-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "VI",
    "operatorId": 2019549,
    "operatorName": "T-Mobile",
    "link": "https://www.nperf.com/en/map/VI/-/2019549.T-Mobile/signal",
    "gsmaId": 1417,
    "gsmaName": "CCT"
  },
  {
    "countryCode": "VN",
    "operatorId": 11161,
    "operatorName": "Gmobile",
    "link": "https://www.nperf.com/en/map/VN/-/11161.Gmobile/signal",
    "gsmaId": 2066,
    "gsmaName": "Gmobile (GTEL Mobile)"
  },
  {
    "countryCode": "VN",
    "operatorId": 11387,
    "operatorName": "Mobifone",
    "link": "https://www.nperf.com/en/map/VN/-/11387.Mobifone/signal",
    "gsmaId": 547,
    "gsmaName": "Mobifone"
  },
  {
    "countryCode": "VN",
    "operatorId": 49992,
    "operatorName": "Vietnamobile",
    "link": "https://www.nperf.com/en/map/VN/-/49992.Vietnamobile/signal",
    "gsmaId": 546,
    "gsmaName": "Viettel Telecom"
  },
  {
    "countryCode": "VN",
    "operatorId": 167,
    "operatorName": "Viettel Mobile",
    "link": "https://www.nperf.com/en/map/VN/-/167.Viettel-Mobile/signal",
    "gsmaId": 546,
    "gsmaName": "Viettel Telecom"
  },
  {
    "countryCode": "VN",
    "operatorId": 21932,
    "operatorName": "Vinaphone",
    "link": "https://www.nperf.com/en/map/VN/-/21932.Vinaphone/signal",
    "gsmaId": 778,
    "gsmaName": "Vinaphone (VNPT)"
  },
  {
    "countryCode": "XK",
    "operatorId": 2026829,
    "operatorName": "Ipko Mobile",
    "link": "https://www.nperf.com/en/map/XK/-/2026829.Ipko-Mobile/signal",
    "gsmaId": 1989,
    "gsmaName": "IPKO (Telekom Slovenije)"
  },
  {
    "countryCode": "XK",
    "operatorId": 2033597,
    "operatorName": "MTS Mobile",
    "link": "https://www.nperf.com/en/map/XK/-/2033597.MTS-Mobile/signal",
    "gsmaId": 6580,
    "gsmaName": "mts (Telekom Srbija)"
  },
  {
    "countryCode": "XK",
    "operatorId": 2026828,
    "operatorName": "Vala Mobile",
    "link": "https://www.nperf.com/en/map/XK/-/2026828.Vala-Mobile/signal",
    "gsmaId": 1990,
    "gsmaName": "Vala (Kosovo Telecom)"
  },
  {
    "countryCode": "YE",
    "operatorId": 223632,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/YE/-/223632.MTN-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "YE",
    "operatorId": 223630,
    "operatorName": "Sabafon Mobile",
    "link": "https://www.nperf.com/en/map/YE/-/223630.Sabafon-Mobile/signal",
    "gsmaId": 587,
    "gsmaName": "Sabafon"
  },
  {
    "countryCode": "YE",
    "operatorId": 223634,
    "operatorName": "Y Mobile",
    "link": "https://www.nperf.com/en/map/YE/-/223634.Y-Mobile/signal",
    "gsmaId": 443,
    "gsmaName": "YOU"
  },
  {
    "countryCode": "YE",
    "operatorId": 24431,
    "operatorName": "Yemen Mobile",
    "link": "https://www.nperf.com/en/map/YE/-/24431.Yemen-Mobile/signal",
    "gsmaId": 1481,
    "gsmaName": "Y"
  },
  {
    "countryCode": "YT",
    "operatorId": 186363,
    "operatorName": "Free Mobile",
    "link": "https://www.nperf.com/en/map/YT/-/186363.Free-Mobile/signal",
    "gsmaId": null,
    "gsmaName": null
  },
  {
    "countryCode": "YT",
    "operatorId": 186360,
    "operatorName": "Maore Mobile",
    "link": "https://www.nperf.com/en/map/YT/-/186360.Maore-Mobile/signal",
    "gsmaId": 6380,
    "gsmaName": "Maore Mobile (BJT Partners)"
  },
  {
    "countryCode": "YT",
    "operatorId": 17478,
    "operatorName": "Only Mobile",
    "link": "https://www.nperf.com/en/map/YT/-/17478.Only-Mobile/signal",
    "gsmaId": 1890,
    "gsmaName": "Only (Axian / Iliad)"
  },
  {
    "countryCode": "YT",
    "operatorId": 17481,
    "operatorName": "Orange Mobile",
    "link": "https://www.nperf.com/en/map/YT/-/17481.Orange-Mobile/signal",
    "gsmaId": 1867,
    "gsmaName": "Orange"
  },
  {
    "countryCode": "YT",
    "operatorId": 109218,
    "operatorName": "SFR Mobile",
    "link": "https://www.nperf.com/en/map/YT/-/109218.SFR-Mobile/signal",
    "gsmaId": 737,
    "gsmaName": "SFR (Altice Europe)"
  },
  {
    "countryCode": "ZA",
    "operatorId": 5511,
    "operatorName": "Cell C",
    "link": "https://www.nperf.com/en/map/ZA/-/5511.Cell-C/signal",
    "gsmaId": 77,
    "gsmaName": "Cell C"
  },
  {
    "countryCode": "ZA",
    "operatorId": 22766,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/ZA/-/22766.MTN-Mobile/signal",
    "gsmaId": 317,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "ZA",
    "operatorId": 156578,
    "operatorName": "Rain",
    "link": "https://www.nperf.com/en/map/ZA/-/156578.Rain/signal",
    "gsmaId": 3825,
    "gsmaName": "Rain"
  },
  {
    "countryCode": "ZA",
    "operatorId": 2107439,
    "operatorName": "Telkom Mobile",
    "link": "https://www.nperf.com/en/map/ZA/-/2107439.Telkom-Mobile/signal",
    "gsmaId": 1922,
    "gsmaName": "Telkom"
  },
  {
    "countryCode": "ZA",
    "operatorId": 2107431,
    "operatorName": "Vodacom Mobile",
    "link": "https://www.nperf.com/en/map/ZA/-/2107431.Vodacom-Mobile/signal",
    "gsmaId": 551,
    "gsmaName": "Vodacom"
  },
  {
    "countryCode": "ZM",
    "operatorId": 220848,
    "operatorName": "Airtel Mobile",
    "link": "https://www.nperf.com/en/map/ZM/-/220848.Airtel-Mobile/signal",
    "gsmaId": 95,
    "gsmaName": "Airtel (Airtel Africa)"
  },
  {
    "countryCode": "ZM",
    "operatorId": 220850,
    "operatorName": "MTN Mobile",
    "link": "https://www.nperf.com/en/map/ZM/-/220850.MTN-Mobile/signal",
    "gsmaId": 770,
    "gsmaName": "MTN"
  },
  {
    "countryCode": "ZM",
    "operatorId": 220853,
    "operatorName": "Zamtel Mobile",
    "link": "https://www.nperf.com/en/map/ZM/-/220853.Zamtel-Mobile/signal",
    "gsmaId": 590,
    "gsmaName": "Zamtel"
  },
  {
    "countryCode": "ZW",
    "operatorId": 220864,
    "operatorName": "Econet Mobile",
    "link": "https://www.nperf.com/en/map/ZW/-/220864.Econet-Mobile/signal",
    "gsmaId": 158,
    "gsmaName": "Econet Wireless"
  },
  {
    "countryCode": "ZW",
    "operatorId": 220858,
    "operatorName": "NetOne Mobile",
    "link": "https://www.nperf.com/en/map/ZW/-/220858.NetOne-Mobile/signal",
    "gsmaId": 328,
    "gsmaName": "NetOne"
  },
  {
    "countryCode": "ZW",
    "operatorId": 220861,
    "operatorName": "Telecel Mobile",
    "link": "https://www.nperf.com/en/map/ZW/-/220861.Telecel-Mobile/signal",
    "gsmaId": 484,
    "gsmaName": "Telecel (ZARNet)"
  }
];

// ============================================================
// TERRITORIES DATA (17 territories)
// ============================================================

var TERRITORIES_DATA = {
  "PR": {
    "name": "Puerto Rico",
    "aliases": [
      "puerto rico"
    ],
    "parent": "US",
    "bbox": [
      17.883,
      -67.942,
      18.515,
      -65.22
    ]
  },
  "VI": {
    "name": "U.S. Virgin Islands",
    "aliases": [
      "virgin islands",
      "u.s. virgin islands"
    ],
    "parent": "US",
    "bbox": [
      17.636,
      -65.091,
      18.579,
      -64.33
    ]
  },
  "AW": {
    "name": "Aruba",
    "aliases": [
      "aruba"
    ],
    "parent": "NL",
    "bbox": [
      12.373,
      -70.132,
      12.64,
      -69.8
    ]
  },
  "CW": {
    "name": "Curaçao",
    "aliases": [
      "curacao"
    ],
    "parent": "NL",
    "bbox": [
      12,
      -69.2,
      12.3,
      -68.6
    ]
  },
  "BQ": {
    "name": "Bonaire, Sint Eustatius and Saba",
    "aliases": [
      "bonaire",
      "sint eustatius",
      "saba"
    ],
    "parent": "NL",
    "bbox": [
      11.7,
      -69.3,
      13,
      -64.85
    ]
  },
  "SX": {
    "name": "Sint Maarten",
    "aliases": [
      "sint maarten",
      "saint martin"
    ],
    "parent": "NL",
    "bbox": [
      18.02,
      -63.15,
      18.1,
      -62.98
    ]
  },
  "BL": {
    "name": "Saint Barthélemy",
    "aliases": [
      "saint barthelemy",
      "st barthelemy"
    ],
    "parent": "FR",
    "bbox": [
      17.85,
      -62.9,
      17.95,
      -62.75
    ]
  },
  "MF": {
    "name": "Saint Martin (French part)",
    "aliases": [
      "saint martin",
      "st martin"
    ],
    "parent": "FR",
    "bbox": [
      18.02,
      -63.15,
      18.1,
      -62.98
    ]
  },
  "GP": {
    "name": "Guadeloupe",
    "aliases": [
      "guadeloupe"
    ],
    "parent": "FR",
    "bbox": [
      15.8,
      -61.9,
      16.7,
      -61
    ]
  },
  "MQ": {
    "name": "Martinique",
    "aliases": [
      "martinique"
    ],
    "parent": "FR",
    "bbox": [
      14.39,
      -61.3,
      15.02,
      -60.7
    ]
  },
  "GF": {
    "name": "French Guiana",
    "aliases": [
      "french guiana"
    ],
    "parent": "FR",
    "bbox": [
      -6,
      -54.5,
      6.2,
      -49.5
    ]
  },
  "NC": {
    "name": "New Caledonia",
    "aliases": [
      "new caledonia"
    ],
    "parent": "FR",
    "bbox": [
      -23,
      164,
      -19,
      167.5
    ]
  },
  "PF": {
    "name": "French Polynesia",
    "aliases": [
      "french polynesia"
    ],
    "parent": "FR",
    "bbox": [
      -27,
      -154,
      -3,
      -134
    ]
  },
  "RE": {
    "name": "Réunion",
    "aliases": [
      "reunion",
      "réunion"
    ],
    "parent": "FR",
    "bbox": [
      -21.5,
      55,
      -20.5,
      55.8
    ]
  },
  "YT": {
    "name": "Mayotte",
    "aliases": [
      "mayotte"
    ],
    "parent": "FR",
    "bbox": [
      -13,
      44,
      -11,
      45
    ]
  },
  "HK": {
    "name": "Hong Kong",
    "aliases": [
      "hong kong"
    ],
    "parent": "CN",
    "bbox": [
      22.1,
      113.8,
      22.6,
      114.5
    ]
  },
  "MO": {
    "name": "Macau",
    "aliases": [
      "macau",
      "macao"
    ],
    "parent": "CN",
    "bbox": [
      22.1,
      113.5,
      22.25,
      113.6
    ]
  }
};
