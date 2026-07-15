import { sheets, SPREADSHEET_ID } from "./googleSheets";
import { normalizeName } from "./normalize";

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

export interface OrderItem {
  producto: string;
  unidades: number;
}

export async function updateStockForOrder(items: OrderItem[]) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Hoja 1!A2:D",
  });

  const rows = response.data.values ?? [];

  const updates: { range: string; values: number[][] }[] = [];
  const notFound: string[] = [];

  items.forEach((item) => {
    const rowIndex = rows.findIndex(
      (row) => normalizeName(row[0] ?? "") === normalizeName(item.producto)
    );

    if (rowIndex === -1) {
      notFound.push(item.producto);
      return;
    }

    const currentStock = Number(rows[rowIndex][2] ?? 0);
    const newStock = Math.max(0, currentStock - item.unidades);
    const sheetRow = rowIndex + 2; // +2 porque los datos empiezan en la fila 2

    updates.push({
      range: `Hoja 1!C${sheetRow}`,
      values: [[newStock]],
    });
  });

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data: updates,
      },
    });
  }

  return { updated: updates.length, notFound };
}