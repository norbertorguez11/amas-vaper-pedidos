import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full flex justify-center py-4 bg-white border-b">
      <Image
        src="/logo.png"
        alt="Logo Amás Vaper"
        width={1645}
        height={402}
        priority
        className="w-auto h-8"
      />
    </div>
  );
}