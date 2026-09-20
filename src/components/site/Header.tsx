import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#reserva", label: "Reserva" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur transition-all duration-300",
        scrolled ? "border-line2 bg-night/95 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]" : "border-transparent bg-night/80",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#inicio" className="font-display text-2xl tracking-wide" aria-label={CONFIG.nombre}>
          <span className="text-acid">{CONFIG.logoNombre.toUpperCase()}</span>
          <span className="text-bone2">{CONFIG.logoAcento.toUpperCase()}</span>
        </a>

        <div className="hidden items-center gap-7 text-sm font-semibold uppercase text-muted2 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center gap-1 transition-colors hover:text-acid"
            >
              <span className="text-blood transition-transform duration-300 group-hover:translate-x-0.5">/</span>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#reserva"
            className="hidden bg-acid px-5 py-2.5 font-display text-base tracking-wider text-night transition-colors hover:bg-bone2 sm:inline-flex"
          >
            Reservar
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-2 p-2 text-bone2 transition-colors hover:text-acid md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line2 bg-night md:hidden">
          <div className="flex flex-col gap-4 px-5 py-4 text-sm font-semibold uppercase text-muted2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1 py-1 transition-colors hover:text-acid"
              >
                <span className="text-blood">/</span>
                {link.label}
              </a>
            ))}
            <a
              href="#reserva"
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center bg-acid px-5 py-3 font-display text-base tracking-wider text-night transition-colors hover:bg-bone2"
            >
              Reservar cita
            </a>
          </div>
        </div>
      )}
    </header>
  );
}