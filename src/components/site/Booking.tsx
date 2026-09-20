import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";
import {
  DIAS_ANTELACION,
  NOMBRES_DIA,
  NOMBRES_MES,
  construirPayload,
  esHoraYaPasada,
  estaOcupadaDemo,
  fechaISO,
  generarHoras,
  guardarReservaEnSheet,
  obtenerHorasOcupadas,
  precargarOcupadas,
} from "@/lib/booking";
import type { OcupadasPorDia, ServiceId } from "@/lib/types";
import type { LegalDocId } from "@/lib/legal";
import { SERVICIOS } from "@/data/services";
import { Reveal } from "./Reveal";

type Mensaje = { tipo: "ok" | "error"; texto: string } | null;

function Paso({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <span className="step-badge inline-flex h-9 w-9 items-center justify-center font-display text-lg">
          {numero}
        </span>
        <p className="font-display text-base uppercase tracking-wider text-acid">{titulo}</p>
      </div>
      {children}
    </div>
  );
}

function Resumen({
  fecha,
  hora,
  servicioNombre,
  hoyISO,
}: {
  fecha: Date | null;
  hora: string | null;
  servicioNombre: string | null;
  hoyISO: string;
}) {
  if (fecha && hora && servicioNombre) {
    const esHoy = fechaISO(fecha) === hoyISO;
    const nombreDia = NOMBRES_DIA[fecha.getDay()];
    const fechaTexto = esHoy
      ? `hoy (${fecha.getDate()} de ${NOMBRES_MES[fecha.getMonth()]})`
      : `${nombreDia} ${fecha.getDate()} de ${NOMBRES_MES[fecha.getMonth()]}`;

    return (
      <p className="text-sm text-muted2">
        Vas a reservar <span className="font-semibold text-bone2">{servicioNombre}</span>{" "}
        {esHoy ? "para" : "el"}{" "}
        <span className="font-semibold text-bone2">{fechaTexto}</span> a las{" "}
        <span className="font-semibold text-acid">{hora}</span>.
      </p>
    );
  }
  return <p className="text-sm text-muted2">Todavía no has elegido día, hora o servicio.</p>;
}

export function Booking({ onOpenLegal }: { onOpenLegal: (docId: LegalDocId) => void }) {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [servicioId, setServicioId] = useState<ServiceId | null>(null);
  const [ocupadasPorDia, setOcupadasPorDia] = useState<OcupadasPorDia | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consent, setConsent] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dias = useMemo(
    () =>
      Array.from({ length: DIAS_ANTELACION }, (_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() + i);
        return d;
      }),
    [hoy],
  );

  useEffect(() => {
    void precargarOcupadas().then(setOcupadasPorDia);
  }, []);

  const servicio = SERVICIOS.find((s) => s.id === servicioId) ?? null;
  const horas = fecha ? generarHoras(fecha) : [];
  const horasOcupadas = fecha
    ? obtenerHorasOcupadas(ocupadasPorDia, fechaISO(fecha))
    : null;

  const esHoy = fecha !== null && fechaISO(fecha) === fechaISO(hoy);
  const esOcupada = (franja: string) =>
    esHoraYaPasada(fecha ?? hoy, franja) ||
    (horasOcupadas
      ? horasOcupadas.includes(franja)
      : fecha
        ? estaOcupadaDemo(fechaISO(fecha), franja)
        : false);

  const puedeEnviar =
    !!fecha &&
    !!hora &&
    !!servicio &&
    nombre.trim().length > 0 &&
    telefono.trim().length > 0 &&
    consent;

  const slotHelp = !fecha
    ? "Selecciona primero un día para ver las horas disponibles."
    : esHoy
      ? "Horas para hoy. Las horas ya pasadas o reservadas no se pueden elegir."
      : `Horas para el ${fecha.getDate()} de ${NOMBRES_MES[fecha.getMonth()]}. Las horas tachadas ya están reservadas.`;

  function seleccionarDia(dia: Date) {
    setFecha(dia);
    setHora(null);
  }

  function seleccionarHora(franja: string) {
    setHora(franja);
  }

  function seleccionarServicio(id: ServiceId) {
    setServicioId(id);
  }

  async function enviarReserva(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (String(new FormData(e.currentTarget).get("website") ?? "").length > 0) return;
    if (!puedeEnviar || enviando) return;
    if (!fecha || !hora || !servicio) return;

    const payload = construirPayload(fecha, hora, servicio, nombre, telefono);
    setEnviando(true);
    setMensaje(null);

    try {
      const resultado = await guardarReservaEnSheet(payload);
      if (!resultado.ok) {
        if (resultado.motivo === "ocupado") {
          marcarHoraOcupadaLocal(fecha, hora);
          setMensaje({
            tipo: "error",
            texto: "Lo sentimos, esa hora se acaba de reservar. Elige otra hora, por favor.",
          });
        } else if (resultado.motivo === "pasado") {
          marcarHoraOcupadaLocal(fecha, hora);
          setMensaje({
            tipo: "error",
            texto: "Esa hora ya ha pasado. Elige otra hora, por favor.",
          });
        } else {
          throw new Error("El Google Sheet no confirmó el guardado");
        }
        return;
      }

      marcarHoraOcupadaLocal(fecha, hora);
      void precargarOcupadas().then(setOcupadasPorDia);

      setMensaje({
        tipo: "ok",
        texto: "¡Reserva enviada! Te confirmaremos tu mesa muy pronto por teléfono o WhatsApp.",
      });
      setFecha(null);
      setHora(null);
      setServicioId(null);
      setNombre("");
      setTelefono("");
      setConsent(false);
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      setMensaje({
        tipo: "error",
        texto: `No hemos podido enviar tu reserva. Llámanos al ${CONFIG.telefono} y te atendemos directamente.`,
      });
    } finally {
      setEnviando(false);
    }
  }

  function marcarHoraOcupadaLocal(dia: Date, franja: string) {
    const iso = fechaISO(dia);
    setOcupadasPorDia((prev) => {
      const base = prev ?? {};
      const previas = base[iso] ?? [];
      if (previas.includes(franja)) return base;
      return { ...base, [iso]: [...previas, franja] };
    });
  }

  return (
    <section id="reserva" className="relative overflow-hidden bg-night">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -bottom-40 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-acid/5 blur-3xl"
          style={{ borderRadius: "9999px" }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-12">
          <p className="mb-3 font-display text-base uppercase tracking-wider text-blood">
            Reserva de mesa
          </p>
          <h2 className="font-display text-5xl uppercase leading-none text-bone2 sm:text-6xl">
            Reserva tu sitio
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted2">
            Elige el día, la hora libre y el servicio. Solo aceptamos reservas con hasta
            una semana de antelación.
          </p>
        </Reveal>

        <form onSubmit={enviarReserva} className="space-y-12" noValidate>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <Reveal>
            <Paso numero={1} titulo="Elige el día">
              <div
                className="flex gap-3 overflow-x-auto py-2"
                role="listbox"
                aria-label="Selecciona un día"
              >
                {dias.map((dia, i) => {
                  const activo = fecha !== null && fechaISO(fecha) === fechaISO(dia);
                  const esDiaHoy = i === 0;
                  return (
                    <button
                      key={fechaISO(dia)}
                      type="button"
                      onClick={() => seleccionarDia(dia)}
                      aria-pressed={activo}
                      className={cn(
                        "day-option flex flex-col w-16 flex-shrink-0 cursor-pointer border-2 border-line2 bg-panel2 py-3 text-center transition-colors duration-200",
                        "hover:border-acid hover:bg-coal2",
                        activo && "seleccionado",
                      )}
                    >
                      <span
                        className="block text-xs font-bold"
                        style={{ color: esDiaHoy ? "#c8ff3e" : "#9c9ca3" }}
                      >
                        {esDiaHoy ? "Hoy" : NOMBRES_DIA[dia.getDay()]}
                      </span>
                      <span className="font-display mt-1 block text-2xl text-bone2">
                        {dia.getDate()}
                      </span>
                      <span className="block text-[11px] text-muted2">
                        {NOMBRES_MES[dia.getMonth()]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <Paso numero={2} titulo="Elige la hora">
              <p className="mb-4 text-sm text-muted2">{slotHelp}</p>
              <div
                className="grid grid-cols-3 gap-2.5 sm:grid-cols-4"
                role="listbox"
                aria-label="Selecciona una hora"
              >
                {horas.map((franja) => {
                  const ocupada = esOcupada(franja);
                  const activa = hora === franja;
                  return (
                    <button
                      key={franja}
                      type="button"
                      onClick={() => seleccionarHora(franja)}
                      disabled={ocupada}
                      aria-pressed={activa}
                      className={cn(
                        "slot-option border-2 py-2.5 text-sm transition-colors duration-200",
                        ocupada
                          ? "slot-occupied cursor-not-allowed border-line2 text-muted2/40 line-through opacity-60"
                          : cn(
                              "border-line2 bg-panel2 text-bone2 transition-colors",
                              "hover:border-acid hover:bg-coal2",
                            ),
                        activa && "seleccionado",
                      )}
                    >
                      {franja}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-5 text-xs text-muted2">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 border-2 border-line2 bg-panel2"></span>
                  Libre
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 bg-acid"></span>
                  Seleccionada
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center overflow-hidden border-2 border-line2 bg-panel2">
                    <span className="slot-occupied absolute inset-0" aria-hidden="true"></span>
                  </span>
                  Ocupada
                </span>
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <Paso numero={3} titulo="Elige tu plato">
              <div
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
                role="listbox"
                aria-label="Selecciona un servicio"
              >
                {SERVICIOS.map((s) => {
                  const activo = servicioId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => seleccionarServicio(s.id)}
                      aria-pressed={activo}
                      className={cn(
                        "service-option cursor-pointer border-2 border-line2 bg-panel2 p-4 text-left transition-colors duration-200",
                        "hover:border-acid hover:bg-coal2",
                        activo && "seleccionado",
                      )}
                    >
                      <span className="block text-sm font-bold text-bone2">
                        {s.nombre}
                      </span>
                      <span className="font-display mt-1 block text-xl text-acid">
                        {s.precio} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <Paso numero={4} titulo="Tus datos">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted2"
                  >
                    Nombre y apellidos
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full border-2 border-line2 bg-panel2 px-4 py-3 text-bone2 transition-colors placeholder:text-muted2/60 focus:border-acid focus:shadow-acidglow"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted2"
                  >
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="600 000 000"
                    className="w-full border-2 border-line2 bg-panel2 px-4 py-3 text-bone2 transition-colors placeholder:text-muted2/60 focus:border-acid focus:shadow-acidglow"
                  />
                </div>
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <div className="border-t-2 border-line2 pt-8">
              <div className="mb-6 border-2 border-line2 bg-panel2 p-5">
                <label
                  htmlFor="consent"
                  className="flex cursor-pointer items-start gap-3 text-sm text-muted2"
                >
                  <input
                    id="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-describedby="consent-help"
                    className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-acid"
                  />
                  <span>
                    He leído y acepto la Política de privacidad y los Términos y condiciones.
                  </span>
                </label>
                <div
                  id="consent-help"
                  className="mt-2 space-y-1 text-xs leading-relaxed text-muted2/90"
                >
                  <p>
                    Tu nombre y teléfono se usan únicamente para gestionar tu cita. No se
                    ceden a terceros.
                  </p>
                  <p className="space-x-3">
                    {(
                      [
                        ["privacidad", "Política de privacidad"],
                        ["terminos", "Términos y condiciones"],
                        ["cookies", "Política de cookies"],
                      ] as const
                    ).map(([key, etiqueta]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onOpenLegal(key)}
                        className="text-acid underline underline-offset-2 transition-colors hover:text-bone2"
                      >
                        {etiqueta}
                      </button>
                    ))}
                  </p>
                </div>
              </div>

              <div className="mb-6 border-2 border-line2 bg-panel2 p-5">
                <Resumen
                  fecha={fecha}
                  hora={hora}
                  servicioNombre={servicio?.nombre ?? null}
                  hoyISO={fechaISO(hoy)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={!puedeEnviar || enviando}
                  className="bg-acid px-8 py-3.5 font-display text-xl uppercase tracking-wider text-night transition-colors hover:bg-bone2 disabled:pointer-events-none disabled:opacity-40"
                >
                  {enviando ? "Procesando..." : "Confirmar reserva"}
                </button>
                {mensaje && (
                  <p
                    className={cn(
                      "text-sm",
                      mensaje.tipo === "ok" ? "text-acid" : "text-blood",
                    )}
                    role="status"
                  >
                    {mensaje.texto}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </form>

        <Reveal>
          <p className="mt-8 text-sm text-muted2">
            ¿Prefieres hablar directamente? Escríbenos por WhatsApp al{" "}
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              className="font-bold text-acid transition-colors hover:text-bone2"
            >
              {CONFIG.telefono}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}