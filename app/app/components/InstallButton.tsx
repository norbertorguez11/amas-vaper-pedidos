"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua);
    setIsIOS(iOS);

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  async function handleClick() {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowIOSInstructions(true);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="mt-4 w-full rounded-xl border-2 border-black py-3 text-sm font-semibold text-gray-900"
      >
        📲 Añadir a pantalla de inicio
      </button>

      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">
              Añadir a pantalla de inicio
            </h3>

            <ol className="space-y-3 text-sm text-gray-700">
              <li>1. Toca el botón compartir ⬆️ abajo en Safari</li>
              <li>2. Desliza y toca "Añadir a pantalla de inicio"</li>
              <li>3. ¡Listo! Ya tienes el acceso directo</li>
            </ol>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-6 w-full rounded-xl bg-black py-3 text-white font-semibold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}