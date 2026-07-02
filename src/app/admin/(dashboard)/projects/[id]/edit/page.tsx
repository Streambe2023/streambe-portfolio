import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProjectAction } from "@/lib/actions";
import ProjectForm from "@/components/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    notFound();
  }

  const boundUpdateAction = updateProjectAction.bind(null, project.id);

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Editar proyecto</h1>
      <ProjectForm action={boundUpdateAction} submitLabel="Guardar cambios" defaultValues={project} />
    </div>
  );
}
