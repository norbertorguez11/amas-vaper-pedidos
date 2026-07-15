"use client";

import { useState } from "react";
import { catalog } from "../data/catalog";

type Props = {
  cart: Record<string, number>;
  onBack: () => void;
};

export default function SummaryScreen({ cart, onBack }: Props) {
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [sending, setSending] = useState(false);

  const totalBoxes = Object.values(cart).reduce((a, b) => a + b, 0);

  let totalUnits = 0;

  async function sendWhatsApp() {
    if (!shopName.trim()) {
      alert("Introduce el nombre del establecimiento.");
      return;
    }

    if (!city.trim()) {
      alert("Introduce la localidad.");
      return;
    }

    setSending(true);

    let totalUnitsMessage = 0;

    let message = `*${shopName.toUpperCase()}*%0A`;
    message += `${city}%0A%0A`;
    message += "━━━━━━━━━━━━━━%0A%0A";

    const items: { producto: string; unidades: number }[] = [];

    catalog.forEach((category) => {
      const products = category.products.filter(
        (product) => (cart[product] || 0) > 0
      );

      if (products.length === 0) return;

      message += `📦 *${category.title}*%0A%0A`;

      products.forEach((product) => {
        const boxes = cart[product];
        const units = boxes * category.unitsPerBox;

        totalUnitsMessage += units;

        items.push({ producto: product, unidades: units });

        message += `• ${product} × ${boxes} ${
          boxes === 1 ? "caja" : "cajas"
        } (${units} uds)%0A`;
      });

      message += "%0A";
    });

    message += "━━━━━━━━━━━━━━%0A%0A";
    message += `📦 *TOTAL:* ${totalBoxes} cajas · ${totalUnitsMessage} unidades`;

    try {
      const response = await fetch("/api/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        console.error("No se pudo actualizar el stock en Google Sheets.");
      }
    } catch (error) {
      console.error("Error de conexión al actualizar el stock:", error);
    }

    setSending(false);

    window.open(
      `https://wa.me/34744787695?text=${message}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 pb-32">
      <div className="mx-auto max-w-md">

        <h1 className="text-3xl font-bold mb-8">
          Resumen del pedido
        </h1>

        {catalog.map((category) => {
          const products = category.products.filter(
            (product) => (cart[product] || 0) > 0
          );

          if (products.length === 0) return null;

          return (
            <div key={category.id} className="mb-8">

              <h2 className="text-xl font-bold mb-3">
                {category.title}
              </h2>

              <div className="space-y-3">

                {products.map((product) => {
                  const boxes = cart[product];
                  const units = boxes * category.unitsPerBox;

                  totalUnits += units;

                  return (
                    <div
                      key={product}
                      className="bg-white rounded-xl shadow p-4"
                    >
                      <div className="font-semibold">
                        {product}
                      </div>

                      <div className="text-gray-600 mt-1">
                        {boxes} {boxes === 1 ? "caja" : "cajas"} · {units} unidades
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          );
        })}

        <div className="bg-white rounded-xl shadow p-5 mt-8">

          <div className="flex justify-between text-lg">
            <span>Total cajas</span>
            <strong>{totalBoxes}</strong>
          </div>

          <div className="flex justify-between text-lg mt-2">
            <span>Total unidades</span>
            <strong>{totalUnits}</strong>
          </div>

        </div>

        <div className="mt-8 space-y-4">

          <input
            type="text"
            placeholder="Nombre del establecimiento"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full rounded-xl border bg-white p-4"
          />

          <input
            type="text"
            placeholder="Localidad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border bg-white p-4"
          />

        </div>

        <button
          onClick={onBack}
          className="mt-8 w-full rounded-xl bg-gray-300 py-4"
        >
          Volver
        </button>

        <button
          onClick={sendWhatsApp}
          disabled={sending}
          className="mt-4 w-full rounded-xl bg-black py-4 text-white disabled:opacity-50"
        >
          {sending ? "Enviando..." : "Enviar pedido"}
        </button>

      </div>
    </main>
  );
}