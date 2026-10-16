/**
 * Subida de archivos a Supabase Storage usando solo fetch (sin dependencias).
 * El navegador sube el archivo directo a Supabase con una URL firmada, así
 * no pasa por Vercel y no hay límite de tamaño de 4.5 MB.
 */

const BUCKET = "portfolio";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Falta configurar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (ver .env.example)."
    );
  }
  return { url, key };
}

function authHeaders(key: string): Record<string, string> {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

let bucketReady = false;

/** Crea el bucket público "portfolio" la primera vez (si ya existe, no hace nada). */
async function ensureBucket(): Promise<void> {
  if (bucketReady) return;
  const { url, key } = config();

  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: authHeaders(key),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });

  if (!res.ok) {
    const text = await res.text();
    const alreadyExists = res.status === 409 || /already exists|duplicate/i.test(text);
    if (!alreadyExists) {
      throw new Error(`No se pudo preparar el almacenamiento: ${text}`);
    }
  }
  bucketReady = true;
}

function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1) : "";
  const cleanBase =
    base
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "archivo";
  const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  return cleanExt ? `${cleanBase}.${cleanExt}` : cleanBase;
}

export async function createSignedUpload(
  folder: "images" | "brochures",
  fileName: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  await ensureBucket();
  const { url, key } = config();

  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${folder}/${unique}-${safeFileName(fileName)}`;

  const res = await fetch(`${url}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: authHeaders(key),
    body: "{}",
  });

  if (!res.ok) {
    throw new Error(`No se pudo generar la URL de subida: ${await res.text()}`);
  }

  const data = (await res.json()) as { url?: string; token?: string };
  let token = data.token ?? null;
  if (!token && data.url) {
    const full = data.url.startsWith("http") ? data.url : `${url}/storage/v1${data.url}`;
    token = new URL(full).searchParams.get("token");
  }
  if (!token) {
    throw new Error("Supabase no devolvió el token de subida.");
  }

  return {
    uploadUrl: `${url}/storage/v1/object/upload/sign/${BUCKET}/${path}?token=${token}`,
    publicUrl: `${url}/storage/v1/object/public/${BUCKET}/${path}`,
  };
}
