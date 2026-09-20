import { useState } from "react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";
import type { LegalDocId } from "@/lib/legal";

const FLOTANTE = "fixed bottom-5 left-5 right-5 z-[80] sm:left-auto sm:max-w-md";

export function CookieBanner({ onOpenLegal }: { onOpenLegal: (docId: LegalDocId) => void }) {
  const [oculto, setOculto] = useState(
    () => localStorage.getItem("cookie-accept") === "accepted",
  );

  const aceptar = () => {
    localStorage.setItem("cookie-accept", "accepted");
    setOculto(true);
  };

  if (oculto) return null;

  return (
    <div className={cn(FLOTANTE, "animate-[cookie-in_.4s_ease]")} role="dialog" aria-label="Aviso de cookies">
      <style>{`@keyframes cookie-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
      <div className="border-2 border-acid bg-night/95 p-5 shadow-cardglow2 backdrop-blur">
        <p className="closeable text-sm">
          <strong className="font-bold text-bone2">Cookies</strong>{" "}
          <span className="text-muted2">
            Usamos cookies técnicas (sin publicidad ni seguimiento) para que Aviso legal y
            la web funcionen bien.{" "}
          </span>
          <button
            type="button"
            onClick={() => onOpenLegal("cookies")}
            className="text-acid underline underline-offset-2 hover:text-bone2"
          >
            Más información
          </button>
          <span className="text-muted2"> · {CONFIG.nombre}.</span>
        </p>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenLegal("privacidad")}
            className="text-xs font-semibold uppercase tracking-wider text-muted2 transition-colors hover:text-bone2"
          >
            Privacidad
          </button>
          <button
            type="button"
            onClick={aceptar}
            className="bg-acid px-6 py-2.5 font-display text-base uppercase tracking-wider text-night transition-colors hover:bg-bone2"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}