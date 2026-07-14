import { NextResponse } from "next/server";
import { getStock } from "../../lib/stock";

export async function GET() {
  try {
    const stock = await getStock();

    return NextResponse.json(stock);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "No se pudo leer el Google Sheets" },
      { status: 500 }
    );
  }
}