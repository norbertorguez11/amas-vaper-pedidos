import { sheets, SPREADSHEET_ID } from "./googleSheets";

export interface StockProduct {
  producto: string;
  categoria: string;
  stock: number;
  visible: boolean;
}

export async function getStock(): Promise<StockProduct[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Hoja 1!A2:D",
  });

  const rows = response.data.values ?? [];

  return rows.map((row) => ({
    producto: row[0] ?? "",
    categoria: row[1] ?? "",
    stock: Number(row[2] ?? 0),
    visible: (row[3] ?? "").toLowerCase() === "sí",
  }));
}