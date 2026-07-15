import { NextRequest, NextResponse } from "next/server";
import { updateStockForOrder, OrderItem } from "../../lib/stock";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: OrderItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No se recibieron productos válidos." },
        { status: 400 }
      );
    }

    const result = await updateStockForOrder(items);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el stock." },
      { status: 500 }
    );
  }
}