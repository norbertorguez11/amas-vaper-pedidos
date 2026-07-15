"use client";

import { useEffect, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import OrderScreen from "./components/OrderScreen";
import SummaryScreen from "./components/SummaryScreen";

export type Cart = Record<string, number>;

const CART_KEY = "amas_vaper_cart";
const ORDER_SENT_KEY = "amas_vaper_order_sent";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [cart, setCart] = useState<Cart>({});
  const [orderJustSent, setOrderJustSent] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        // si el dato guardado estuviera corrupto, lo ignoramos
      }
    }

    const sentFlag = localStorage.getItem(ORDER_SENT_KEY);
    if (sentFlag === "true") {
      setOrderJustSent(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  function handleOrderSent() {
    localStorage.setItem(ORDER_SENT_KEY, "true");
    localStorage.removeItem(CART_KEY);
    setCart({});
    setOrderJustSent(true);
  }

  function handleNewOrder() {
    localStorage.removeItem(ORDER_SENT_KEY);
    setOrderJustSent(false);
    setStarted(false);
    setShowSummary(false);
  }

  if (orderJustSent) {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5 text-center">
        <div className="bg-white rounded-xl shadow p-8 max-w-md w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">
            Pedido enviado correctamente
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido se ha enviado por WhatsApp. Si necesitas hacer otro
            pedido, pulsa el botón de abajo.
          </p>
          <button
            onClick={handleNewOrder}
            className="w-full rounded-xl bg-black py-4 text-white font-semibold"
          >
            Hacer nuevo pedido
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    return <HomeScreen onStart={() => setStarted(true)} />;
  }

  if (showSummary) {
    return (
      <SummaryScreen
        cart={cart}
        onBack={() => setShowSummary(false)}
        onOrderSent={handleOrderSent}
      />
    );
  }

  return (
    <OrderScreen
      cart={cart}
      setCart={setCart}
      onContinue={() => setShowSummary(true)}
    />
  );
}