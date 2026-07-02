type ProjectDefaults = {
  name?: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  order?: number;
};

export default function ProjectForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: ProjectDefaults;
}) {
  return (
    <form action={action} className="space-y-4 rounded-xl border border-line bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Nombre del proyecto</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Descripción corta</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">URL de la imagen</label>
        <input
          type="url"
          name="imageUrl"
          required
          placeholder="https://..."
          defaultValue={defaultValues?.imageUrl}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
        <p className="mt-1 text-xs text-ink/50">
          Pegá el link directo a una imagen (jpg, png o webp) ya subida a algún servicio como
          Google Drive (compartido públicamente), Imgur o el propio sitio del proyecto.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">URL del proyecto</label>
        <input
          type="url"
          name="projectUrl"
          required
          placeholder="https://..."
          defaultValue={defaultValues?.projectUrl}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Orden (menor número aparece primero)
        </label>
        <input
          type="number"
          name="order"
          defaultValue={defaultValues?.order ?? 0}
          className="w-32 rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-tech px-5 py-2.5 text-sm font-semibold text-white hover:bg-digital"
      >
        {submitLabel}
      </button>
    </form>
  );
}
