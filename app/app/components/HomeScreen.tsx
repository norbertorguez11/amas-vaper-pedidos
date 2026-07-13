type Props = {
  onStart: () => void;
};

export default function HomeScreen({ onStart }: Props) {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          AMÁS VAPER
        </h1>

        <p className="mt-4 text-gray-600">
          La forma más rápida de realizar tu pedido.
        </p>

        <button
          onClick={onStart}
          className="mt-10 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white"
        >
          Comenzar pedido
        </button>
      </div>
    </main>
  );
}