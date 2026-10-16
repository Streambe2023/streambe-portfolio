import FileUploadField from "@/components/FileUploadField";

type ProjectDefaults = {
  name?: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  brochureUrl?: string | null;
  imageFit?: string;
  order?: number;
};

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30";

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
    <form action={action} className="space-y-5 rounded-xl border border-line bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Nombre del proyecto</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Descripción corta</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className={inputClass}
        />
      </div>

      <FileUploadField
        name="imageUrl"
        label="Imagen de la tarjeta"
        kind="image"
        required
        defaultValue={defaultValues?.imageUrl}
        help="PNG, JPG, WebP, GIF o SVG, hasta 10 MB. Podés subirla desde tu computadora o pegar un link."
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Cómo ajustar la imagen</label>
        <select
          name="imageFit"
          defaultValue={defaultValues?.imageFit ?? "contain"}
          className={inputClass}
        >
          <option value="contain">Mostrar completa (sin recortar, con fondo difuminado)</option>
          <option value="cover">Llenar toda la tarjeta (puede recortar los bordes)</option>
        </select>
      </div>

      <FileUploadField
        name="brochureUrl"
        label="Brochure (opcional)"
        kind="brochure"
        defaultValue={defaultValues?.brochureUrl}
        help="Subí un PDF (botón «Descargar brochure») o pegá el link de una página web o PDF externo (botón «Ver brochure»). Dejalo vacío para no mostrar botón."
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">URL del proyecto</label>
        <input
          type="url"
          name="projectUrl"
          required
          placeholder="https://..."
          defaultValue={defaultValues?.projectUrl}
          className={inputClass}
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
