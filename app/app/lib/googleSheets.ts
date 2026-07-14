import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    process.cwd(),
    "credentials",
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE || "amas-vaper-0d2b55d62615.json"
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({
  version: "v4",
  auth,
});

export const SPREADSHEET_ID =
  "13nStjpYV7sxsxcgLR8mgVquWBoVqxjiRbXp-HV6iB6s";