"use client";

import { useRef, useState } from "react";
import { createUploadAction } from "@/lib/actions";

type Props = {
  name: string;
  label: string;
  kind: "image" | "brochure";
  defaultValue?: string | null;
  required?: boolean;
  help?: string;
};

const ACCEPT: Record<Props["kind"], string> = {
  image: "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
  brochure: "application/pdf",
};

export default function FileUploadField({
  name,
  label,
  kind,
  defaultValue,
  required,
  help,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const signed = await createUploadAction(kind, file.name, file.type, file.size);
      if ("error" in signed) {
        setError(signed.error);
        return;
      }

      const body = new FormData();
      body.append("cacheControl", "3600");
      body.append("", file);

      const res = await fetch(signed.uploadUrl, {
        method: "PUT",
        headers: { "x-upsert": "false" },
        body,
      });

      if (!res.ok) {
        setError("No se pudo subir el archivo. Probá de nuevo.");
        return;
      }
      setValue(signed.publicUrl);
    } catch {
      setError("Falló la subida. Revisá tu conexión y probá de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-tech px-4 py-2 text-sm font-semibold text-tech transition hover:bg-tech hover:text-white disabled:opacity-60"
        >
          {uploading
            ? "Subiendo..."
            : kind === "image"
              ? "Subir imagen desde mi computadora"
              : "Subir PDF desde mi computadora"}
        </button>
        {value && !uploading && <span className="text-xs text-success">Archivo cargado ✓</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {kind === "image" && value && (
        <div className="mt-3 aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-line bg-digital">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vista previa" className="h-full w-full object-contain" />
        </div>
      )}

      <input
        type="url"
        name={name}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          kind === "image"
            ? "…o pegá el link de una imagen (https://...)"
            : "…o pegá el link de un brochure, PDF o página web (https://...)"
        }
        className="mt-3 w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-tech focus:outline-none focus:ring-2 focus:ring-tech/30"
      />

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {help && <p className="mt-1 text-xs text-ink/50">{help}</p>}
    </div>
  );
}
