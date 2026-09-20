import { Reveal } from "./Reveal";

const IMAGENES = [
  { src: "img/hero-cut.jpg", alt: "La cocina en plena faena", rot: "-rotate-2" },
  { src: "img/fade.jpg", alt: "Degradado en proceso", rot: "rotate-1" },
  { src: "img/shave.jpg", alt: "Acabado de barba", rot: "-rotate-1" },
];

export function Gallery() {
  return (
    <section id="galeria" className="relative overflow-hidden border-y-2 border-line2 bg-coal2">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-12">
          <p className="mb-3 font-display text-base uppercase tracking-wider text-blood">
            El trabajo habla
          </p>
          <h2 className="font-display text-5xl uppercase leading-none text-bone2 sm:text-6xl">
            Galería
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {IMAGENES.map((img, i) => (
            <Reveal key={img.src} delay={i * 80}>
              <figure
                className={`${img.rot} group relative border-2 border-line2 bg-night p-2 transition-all duration-500 hover:rotate-0 hover:border-acid`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/5] w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  loading="lazy"
                />
                <figcaption className="flex items-center justify-between px-2 py-3 font-display text-sm uppercase tracking-wider text-muted2">
                  <span>{img.alt}</span>
                  <span className="text-acid">→</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}