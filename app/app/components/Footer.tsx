import Image from "next/image";

export default function Footer() {
  return (
    <div className="w-full text-center py-3 px-4 text-gray-400 text-sm bg-white border-t border-gray-200 mt-8">
      <p>¿Quieres automatizar algo de tu negocio?</p>
<a
        href="https://wa.me/34685127658"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 underline"
      >
        +34 685 12 76 58
      </a>

      <div className="flex items-center justify-center gap-1.5 mt-1">
        <span>Made by</span>
        <Image
          src="/branding/logoJN.png"
          alt="Logo"
          width={40}
          height={40}
          className="h-6 w-auto opacity-70"
        />
      </div>
    </div>
  );
}