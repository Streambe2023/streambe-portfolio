import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Proyectos ({projects.length})
        </h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-tech px-4 py-2 text-sm font-semibold text-white hover:bg-digital"
        >
          + Nuevo proyecto
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-ink/60">Todavía no cargaste ningún proyecto.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-ink/60">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="h-12 w-16 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{project.name}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-tech">
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      {project.projectUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">{project.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-sm font-medium text-tech hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteProjectButton id={project.id} name={project.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
