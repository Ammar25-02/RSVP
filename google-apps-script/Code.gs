/**
 * Wedding RSVP backend (free) — Google Sheets + Apps Script.
 *
 * Setup:
 *  1. Create a Google Sheet.
 *  2. Extensions → Apps Script. Delete the sample code and paste this file.
 *  3. Deploy → New deployment → type "Web app"
 *       Execute as: Me
 *       Who has access: Anyone
 *  4. Copy the Web app URL (ends in /exec) into config.js → scriptUrl.
 *
 * After editing this script, use Deploy → Manage deployments → Edit → New version,
 * otherwise the old code keeps running.
 */

var SHEET_NAME = "RSVP";
var HEADERS = ["Timestamp", "Name", "Attending", "Guests", "Phone", "Message", "Invite (from QR)", "Device"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    var name = clean(p.name, 100);
    if (!name) return json({ ok: false, error: "Name is required" });

    var attending = p.attending === "Yes" ? "Yes" : "No";
    var guests = attending === "Yes" ? Math.max(1, Math.min(20, parseInt(p.guests, 10) || 1)) : 0;

    getSheet().appendRow([
      new Date(),
      name,
      attending,
      guests,
      clean(p.phone, 30),
      clean(p.message, 500),
      clean(p.invite, 100),
      clean(p.userAgent, 150)
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visit the /exec URL in a browser to check the deployment is live.
function doGet() {
  return json({ ok: true, message: "RSVP endpoint is live" });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

// Trim, limit length, and stop spreadsheet formula injection (=, +, -, @).
function clean(value, maxLen) {
  var s = String(value == null ? "" : value).trim().slice(0, maxLen || 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
