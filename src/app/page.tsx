import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="min-h-screen bg-paper">
      <section className="bg-digital">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/streambe-logo.svg" alt="Streambe" className="mx-auto h-12" />
          <h1 className="mt-8 font-display text-4xl font-semibold text-white sm:text-5xl">
            Mejor tecnología. Mejor futuro.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Conocé los proyectos en los que estamos trabajando en Streambe.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
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
