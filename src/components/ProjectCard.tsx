type Project = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  brochureUrl?: string | null;
  imageFit?: string;
};

/** En URLs de Supabase, ?download fuerza la descarga en vez de abrir el PDF en el navegador. */
function downloadHref(url: string): string {
  return url.includes("/storage/v1/object/public/") ? `${url}?download=` : url;
}

export default function ProjectCard({ project }: { project: Project }) {
  const fillCard = project.imageFit === "cover";
  // PDF → "Descargar brochure"; cualquier otro link (página web/HTML) → "Ver brochure"
  const brochureIsPdf = project.brochureUrl ? /\.pdf($|\?)/i.test(project.brochureUrl) : false;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-video w-full overflow-hidden bg-digital">
        {fillCard ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.imageUrl}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Copia difuminada de la misma imagen como fondo: nunca quedan franjas vacías */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.name}
              loading="lazy"
              className="relative h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
            />
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-ink">{project.name}</h3>
        {project.description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{project.description}</p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          {/* Link "estirado": hace clickeable toda la tarjeta sin anidar enlaces */}
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-tech after:absolute after:inset-0 after:content-[''] group-hover:underline"
          >
            Ver proyecto →
          </a>

          {project.brochureUrl && (
            <a
              href={brochureIsPdf ? downloadHref(project.brochureUrl) : project.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 rounded-lg border border-tech/30 px-3 py-1.5 text-xs font-semibold text-tech transition hover:bg-tech hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                {brochureIsPdf ? (
                  <>
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </>
                ) : (
                  <>
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </>
                )}
              </svg>
              {brochureIsPdf ? "Descargar brochure" : "Ver brochure"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
