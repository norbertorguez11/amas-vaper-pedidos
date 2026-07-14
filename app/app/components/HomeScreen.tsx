"use client";

import Image from "next/image";

type Props = {
  onStart: () => void;
};

export default function HomeScreen({ onStart }: Props) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">

        <Image
          src="/logo.png"
          alt="Logo Amás Vaper"
          width={180}
          height={180}
          priority
          className="mx-auto mb-6 w-[180px] h-auto"
        />

        <h1 className="text-4xl font-bold text-gray-900">
          AMÁS VAPER
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          La forma más rápida de realizar tu pedido.
        </p>

        <button
          onClick={onStart}
          className="mt-10 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-gray-800"
        >
          Comenzar pedido
        </button>

      </div>
    </main>
  );
}