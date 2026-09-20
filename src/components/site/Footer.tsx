import { Clock, MapPin, Phone } from "lucide-react";
import { CONFIG } from "@/lib/config";
import type { LegalDocId } from "@/lib/legal";
import { Reveal } from "./Reveal";

const ENLACES_LEGALES = [
  { key: "privacidad", etiqueta: "Política de privacidad" },
  { key: "terminos", etiqueta: "Términos y condiciones" },
  { key: "cookies", etiqueta: "Política de cookies" },
] as const;

export function Footer({ onOpenLegal }: { onOpenLegal: (docId: LegalDocId) => void }) {
  return (
    <footer id="contacto" className="relative overflow-hidden border-t-2 border-line2 bg-night">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <a href="#inicio" className="font-display text-3xl tracking-wide">
                <span className="text-acid">{CONFIG.logoNombre.toUpperCase()}</span>
                <span className="text-bone2">{CONFIG.logoAcento.toUpperCase()}</span>
              </a>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted2">
                Restaurante de barrio con servicio directo y sin postureo. Reserva tu mesa
                online y entra directo a tu cita.
              </p>
            </div>

            <div>
              <p className="font-display mb-4 text-base uppercase tracking-wider text-acid">
                Contacto
              </p>
              <ul className="space-y-3 text-sm text-muted2">
                <li>
                  <a
                    href={`tel:${CONFIG.telefonoEnlace}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-acid"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {CONFIG.telefono}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${CONFIG.whatsapp}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-acid"
                  >
                    <span className="font-bold text-acid">WA</span>
                    WhatsApp · {CONFIG.telefono}
                  </a>
                </li>
                <li className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <span>
                    {CONFIG.direccion}, {CONFIG.ciudad}
                    <br />
                    {CONFIG.localidad}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-display mb-4 text-base uppercase tracking-wider text-acid">
                Horario
              </p>
              <ul className="space-y-3 text-sm text-muted2">
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>
                    L–S: 10h–14h / 16h–21h
                    <br />
                    Domingo: 9h–14h
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted2">
            © {new Date().getFullYear()} {CONFIG.nombre}. Todos los derechos reservados.
          </p>
          <nav aria-label="Enlaces legales" className="flex flex-wrap gap-x-6 gap-y-2">
            {ENLACES_LEGALES.map((enlace) => (
              <button
                key={enlace.key}
                type="button"
                onClick={() => onOpenLegal(enlace.key)}
                className="text-xs text-muted2 underline underline-offset-2 transition-colors hover:text-acid"
              >
                {enlace.etiqueta}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Marca gigante de fondo */}
      <div className="select-none" aria-hidden="true">
        <p className="text-outline border-t-2 border-line2 text-center font-display text-[18vw] uppercase leading-[0.85] tracking-wider sm:text-[13vw]">
          {CONFIG.logoAcento}
        </p>
      </div>
    </footer>
  );
}