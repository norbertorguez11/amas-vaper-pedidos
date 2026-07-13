type Props = {
  onBack: () => void;
};

export default function CategoryScreen({ onBack }: Props) {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-center mt-6">
          Categorías
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-8">
          Selecciona una categoría
        </p>

        <div className="space-y-4">
          <button className="w-full rounded-xl bg-white p-5 shadow text-left">
            Amás 800 Puffs
          </button>

          <button className="w-full rounded-xl bg-white p-5 shadow text-left">
            Amás Zero Nicotina 800 Puffs
          </button>

          <button className="w-full rounded-xl bg-white p-5 shadow text-left">
            Amás Zero Nicotina 30K Puffs
          </button>
        </div>

        <button
          onClick={onBack}
          className="mt-8 w-full rounded-xl bg-black py-4 text-white"
        >
          Volver
        </button>
      </div>
    </main>
  );
}