"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/cours", label: "Cours" },
  { href: "/pratique", label: "Pratique Algo" },
  { href: "/methodes", label: "Méthodes Num." },
  { href: "/exercices", label: "Exercices" },
  { href: "/apropos", label: "À propos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#04aa6d] text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12">
        <Link href="/" className="font-bold text-xl tracking-tight">
          E-DEVY
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  active
                    ? "bg-white text-[#04aa6d] font-semibold"
                    : "hover:bg-[#088a5b]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#088a5b] px-4 pb-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm border-b border-[#04aa6d]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
