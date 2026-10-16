import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="min-h-screen bg-paper">
      <section className="relative overflow-hidden bg-digital">
        {/* Luces y cuadrícula de fondo en los colores de la marca */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-tech/40 blur-3xl" />
          <div className="absolute -right-32 top-16 h-[26rem] w-[26rem] rounded-full bg-soft/25 blur-3xl" />
          <div className="hero-grid absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <header className="flex items-center justify-between py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/streambe-logo.svg" alt="Streambe" className="h-9 w-auto" />
          </header>

          <div className="pb-28 pt-14 text-center sm:pb-32 sm:pt-24">
            <span className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-action">
              <span className="h-1.5 w-1.5 rounded-full bg-soft" />
              Portfolio de proyectos
            </span>

            <h1 className="fade-up fade-up-2 mx-auto mt-8 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-7xl">
              Better tech.{" "}
              <span className="bg-gradient-to-r from-soft to-action bg-clip-text text-transparent">
                Better future.
              </span>
            </h1>

            <p className="fade-up fade-up-3 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              Plataformas, productos y soluciones tecnológicas que diseñamos y desarrollamos en
              Streambe. Explorá el portfolio y descargá los brochures.
            </p>

            <div className="fade-up fade-up-3 mt-10 flex justify-center">
              <a
                href="#proyectos"
                className="inline-flex items-center gap-2 rounded-xl bg-tech px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-tech/30 transition hover:-translate-y-0.5 hover:bg-[#1763ff]"
              >
                Ver proyectos
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="proyectos" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-medium text-ink sm:text-4xl">
          Nuestros proyectos
        </h2>

        {projects.length === 0 ? (
          <p className="text-center text-ink/60">Muy pronto vamos a mostrar acá nuestro portfolio.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-line bg-white py-8 text-center text-xs text-ink/40">
        <p>© {new Date().getFullYear()} Streambe. Todos los derechos reservados.</p>
        <a href="/admin/login" className="mt-1 inline-block hover:text-ink/60">
          Acceso administrador
        </a>
      </footer>
    </main>
  );
}
