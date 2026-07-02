import { createProjectAction } from "@/lib/actions";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Nuevo proyecto</h1>
      <ProjectForm action={createProjectAction} submitLabel="Crear proyecto" />
    </div>
  );
}
