"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { catalog } from "../data/catalog";
import { normalizeName } from "../lib/normalize";
import { getProductImagePath } from "../lib/productImage";
import Header from "./Header";
import Footer from "./Footer";

type Cart = Record<string, number>;

type StockProduct = {
  producto: string;
  categoria: string;
  stock: number;
  visible: boolean;
};

type Props = {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  onContinue: () => void;
};

export default function OrderScreen({
  cart,
  setCart,
  onContinue,
}: Props) {
  const [stock, setStock] = useState<StockProduct[]>([]);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const bottomMarkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadStock() {
      const res = await fetch("/api/stock");
      const data = await res.json();
      setStock(data);
    }

    loadStock();
  }, []);

  useEffect(() => {
    const marker = bottomMarkerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasReachedEnd(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(marker);

    return () => observer.disconnect();
  }, []);

  function getProductStock(product: string) {
    return stock.find(
      (p) => normalizeName(p.producto) === normalizeName(product)
    );
  }

  function add(product: string) {
    setCart((prev) => ({
      ...prev,
      [product]: (prev[product] || 0) + 1,
    }));
  }

  function remove(product: string) {
    setCart((prev) => {
      const next = { ...prev };

      if (!next[product]) return prev;

      if (next[product] === 1) {
        delete next[product];
      } else {
        next[product] -= 1;
      }

      return next;
    });
  }

  const totalBoxes = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );

  const totalUnits = useMemo(() => {
    let total = 0;

    catalog.forEach((category) => {
      category.products.forEach((product) => {
        total += (cart[product] || 0) * category.unitsPerBox;
      });
    });

    return total;
  }, [cart]);

  const canContinue = hasReachedEnd && totalBoxes >= 3;

  let buttonText: string;

  if (totalBoxes < 3) {
    buttonText = `Añade ${3 - totalBoxes} caja${
      3 - totalBoxes > 1 ? "s" : ""
    } más`;
  } else if (!hasReachedEnd) {
    buttonText = "Desliza hacia abajo para terminar el pedido";
  } else {
    buttonText = `Continuar pedido (${totalBoxes} cajas · ${totalUnits} unidades)`;
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-32">
      <Header />
      <div className="mx-auto max-w-md p-5">
        <h1 className="text-3xl font-bold text-center">
          Nuevo pedido
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Pedido mínimo: 3 cajas
        </p>

        {catalog.map((category) => (
          <div key={category.id} className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              {category.title}
            </h2>

            <div className="space-y-3">
              {category.products.map((product) => {
                const productStock = getProductStock(product);
                const sinStock = productStock?.stock === 0;

                const maxBoxes =
                  productStock !== undefined
                    ? Math.floor(productStock.stock / category.unitsPerBox)
                    : undefined;

                const limiteAlcanzado =
                  maxBoxes !== undefined &&
                  (cart[product] || 0) >= maxBoxes;

                return (
                  <div
                    key={product}
                    className="rounded-xl bg-white shadow p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={getProductImagePath(product)}
                        alt={product}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="font-medium">
                          {product}
                        </div>

                        {productStock && productStock.stock === 0 && (
                          <p className="text-sm text-red-600 font-semibold mt-1">
                            Stock no disponible
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-4">
                      <button
                        onClick={() => remove(product)}
                        className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
                      >
                        -
                      </button>

                      <div className="text-center flex-1">
                        <div className="font-semibold">
                          {cart[product] || 0}
                        </div>

                        <div className="text-xs text-gray-500">
                          {(cart[product] || 0) * category.unitsPerBox} uds
                        </div>
                      </div>

                      <button
                        onClick={() => add(product)}
                        disabled={sinStock || limiteAlcanzado}
                        className={`w-10 h-10 rounded-full text-white flex-shrink-0 ${
                          sinStock || limiteAlcanzado
                            ? "bg-gray-300"
                            : "bg-black"
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div ref={bottomMarkerRef} className="h-1" />

        <Footer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="mx-auto max-w-md">
          <button
            onClick={onContinue}
            disabled={!canContinue}
            className={`w-full rounded-xl py-4 font-semibold text-white ${
              canContinue ? "bg-black" : "bg-gray-400"
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </main>
  );
}