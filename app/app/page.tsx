"use client";

import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import OrderScreen from "./components/OrderScreen";
import SummaryScreen from "./components/SummaryScreen";

export type Cart = Record<string, number>;

export default function Home() {
  const [started, setStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [cart, setCart] = useState<Cart>({});

  if (!started) {
    return (
      <HomeScreen
        onStart={() => setStarted(true)}
      />
    );
  }

  if (showSummary) {
    return (
      <SummaryScreen
        cart={cart}
        onBack={() => setShowSummary(false)}
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