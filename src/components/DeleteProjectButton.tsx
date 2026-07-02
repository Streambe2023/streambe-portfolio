"use client";

import { deleteProjectAction } from "@/lib/actions";

export default function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(`¿Eliminar el proyecto "${name}"? Esta acción no se puede deshacer.`)) {
          void deleteProjectAction(id);
        }
      }}
      className="text-sm font-medium text-danger hover:underline"
    >
      Eliminar
    </button>
  );
}
