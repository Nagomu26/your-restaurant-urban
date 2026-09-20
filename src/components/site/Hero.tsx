import { Phone } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { Reveal } from "./Reveal";

const HORARIOS = [
  { dias: "L–S", horas: "13h–16h / 20h–23h" },
  { dias: "DOM", horas: "13h–16h" },
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-night">
      {/* Semitonos y rayo diagonal de acento */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-0 opacity-60"></div>
        <div
          className="absolute -right-32 -top-24 h-[560px] w-[560px] -rotate-45 bg-acid/10 blur-3xl"
          style={{ borderRadius: "9999px" }}
        ></div>
        <div className="absolute top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blood/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-6 inline-flex items-center gap-3 font-display text-base tracking-wide text-muted2">
                <span className="inline-block h-3 w-3 bg-blood" aria-hidden="true"></span>
                RESTAURANTES EN {CONFIG.zona.toUpperCase()}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display text-6xl uppercase leading-[0.95] sm:text-7xl lg:text-8xl">
                <span className="block text-bone2">Tu mesa</span>
                <span className="block text-bone2">perfecta</span>
                <span className="block text-acid">
                  SIN ESPERAS<span className="text-blood">.</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted2">
                Comida de verdad en tu barrio. Echa un ojo a la carta y reserva
                tu mesa sin esperas.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#reserva"
                  className="bg-acid px-9 py-4 font-display text-xl uppercase tracking-wider text-night transition-colors hover:bg-bone2"
                >
                  Reservar mesa
                </a>
                <a
                  href={`tel:${CONFIG.telefonoEnlace}`}
                  className="inline-flex items-center justify-center border-2 border-line2 bg-transparent px-8 py-4 text-sm font-semibold uppercase text-bone2 transition-colors hover:border-acid hover:text-acid"
                >
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  Llamar · {CONFIG.telefono}
                </a>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-14 max-w-2xl border-t-2 border-line2 pt-8">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                  {HORARIOS.map((slot) => (
                    <div key={slot.dias}>
                      <p className="font-display text-2xl text-acid">{slot.dias}</p>
                      <p className="mt-1 text-sm text-muted2">{slot.horas}</p>
                    </div>
                  ))}
                  <div className="col-span-2 sm:col-span-1">
                    <p className="font-display text-2xl text-bone2">{CONFIG.ciudad}</p>
                    <p className="mt-1 text-sm text-muted2">{CONFIG.direccion}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Imagen con cinta inclinada */}
          <Reveal delay={200} className="lg:col-span-5">
            <div className="relative">
              <div
                className="absolute -inset-1 rotate-2 border-2 border-acid/60"
                aria-hidden="true"
              ></div>
              <div className="relative overflow-hidden bg-coal2">
                <img
                  src="img/hero-cut.jpg"
                  alt="Cocinero trabajando"
                  className="h-[440px] w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 bg-acid px-5 py-3 font-display text-base uppercase tracking-wider text-night">
                  Est. 2026 · {CONFIG.zona.toUpperCase()}
                </div>
              </div>
              <p
                className="text-outline-acid absolute -bottom-6 right-0 font-display text-6xl uppercase"
                aria-hidden="true"
              >
                01
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Cinta ácida */}
      <div className="relative overflow-hidden border-y-2 border-night bg-acid py-3">
        <div className="marquee-track items-center gap-8 font-display text-lg uppercase tracking-wider text-night">
          {Array.from({ length: 2 }).map((_, copia) => (
            <span key={copia} className="flex items-center gap-8">
              <span>Cocina de mercado</span>
              <span className="bg-night text-bone2 px-2 py-0.5">★</span>
              <span>Menú del día</span>
              <span className="bg-night text-bone2 px-2 py-0.5">★</span>
              <span>Producto fresco</span>
              <span className="bg-night text-bone2 px-2 py-0.5">★</span>
              <span>Tapeo y raciones</span>
              <span className="bg-night text-bone2 px-2 py-0.5">★</span>
              <span>Tapeo</span>
              <span className="bg-night text-bone2 px-2 py-0.5">★</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}