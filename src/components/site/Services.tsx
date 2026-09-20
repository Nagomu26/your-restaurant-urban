import { ArrowRight } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { SERVICIOS } from "@/data/services";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="servicios" className="relative overflow-hidden border-t border-line2 bg-night">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-3 font-display text-base uppercase tracking-wider text-blood">
              Los clásicos
            </p>
            <h2 className="font-display text-5xl uppercase leading-none text-bone2 sm:text-6xl">
              La Carta
            </h2>
          </div>
          <a
            href="#reserva"
            className="hidden items-center gap-2 font-display text-lg uppercase tracking-wider text-acid transition-colors hover:text-bone2 sm:inline-flex"
          >
            Reservar mesa
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </Reveal>

        <div className="border-t-2 border-line2">
          {SERVICIOS.map((servicio, i) => (
            <Reveal key={servicio.id} delay={i * 60}>
              <div className="group grid grid-cols-1 gap-4 border-b-2 border-line2 py-9 transition-colors duration-300 sm:grid-cols-12 sm:items-center sm:gap-6 sm:px-4 hover:bg-coal2">
                <span className="font-display text-5xl text-outline sm:col-span-2" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="sm:col-span-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-3xl uppercase leading-none text-bone2 transition-colors duration-300 group-hover:text-acid sm:text-4xl">
                      {servicio.nombre}
                    </h3>
                    {servicio.destacado && (
                      <span className="inline-flex items-center gap-1.5 bg-blood px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-night">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-night"></span>
                        Más pedido
                      </span>
                    )}
                  </div>
                  <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-muted2 sm:block">
                    {servicio.descripcion}
                  </p>
                </div>

                <p className="font-display text-3xl text-acid sm:col-span-2 sm:text-right">
                  {servicio.precio} €
                </p>

                <div className="sm:col-span-2 sm:text-right">
                  <a
                    href="#reserva"
                    aria-label={`Reservar ${servicio.nombre}`}
                    className="inline-flex items-center gap-2 font-display text-base uppercase tracking-wider text-muted2 transition-colors duration-300 hover:text-acid"
                  >
                    Reservar
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-sm text-muted2">
            ¿No tienes claro qué necesitas? Escríbenos por WhatsApp al{" "}
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              className="font-semibold text-acid transition-colors hover:text-bone2"
            >
              {CONFIG.telefono}
            </a>{" "}
            y te aconsejamos sin compromiso.
          </p>
        </Reveal>
      </div>
    </section>
  );
}