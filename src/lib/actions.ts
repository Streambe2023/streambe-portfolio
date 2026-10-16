"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setSessionCookie, clearSessionCookie, requireSession } from "@/lib/session";
import { createSignedUpload } from "@/lib/storage";

/**
 * Login del panel admin. Restringido a correos @streambe.com.
 * En caso de error, redirige a /admin/login?error=... para no depender
 * de hooks experimentales de formularios.
 */
export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email.endsWith("@streambe.com")) {
    redirect("/admin/login?error=domain");
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    redirect("/admin/login?error=invalid");
  }

  await setSessionCookie(email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
const IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const BROCHURE_MAX_BYTES = 30 * 1024 * 1024; // 30 MB

/**
 * Pide una URL firmada para que el navegador suba el archivo directo a Supabase.
 * Solo funciona con sesión de admin iniciada.
 */
export async function createUploadAction(
  kind: "image" | "brochure",
  fileName: string,
  contentType: string,
  size: number
): Promise<{ uploadUrl: string; publicUrl: string } | { error: string }> {
  await requireSession();

  if (kind === "image") {
    if (!IMAGE_TYPES.includes(contentType)) {
      return { error: "La imagen tiene que ser PNG, JPG, WebP, GIF o SVG." };
    }
    if (size > IMAGE_MAX_BYTES) {
      return { error: "La imagen pesa más de 10 MB." };
    }
  } else {
    if (contentType !== "application/pdf") {
      return { error: "El brochure tiene que ser un PDF." };
    }
    if (size > BROCHURE_MAX_BYTES) {
      return { error: "El PDF pesa más de 30 MB." };
    }
  }

  try {
    return await createSignedUpload(kind === "image" ? "images" : "brochures", fileName);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo preparar la subida." };
  }
}

function readProjectFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const projectUrl = String(formData.get("projectUrl") || "").trim();
  const brochureRaw = String(formData.get("brochureUrl") || "").trim();
  const fitRaw = String(formData.get("imageFit") || "contain");
  const order = Number(formData.get("order") || 0);

  if (!name || !imageUrl || !projectUrl) {
    throw new Error("Nombre, imagen y URL del proyecto son obligatorios.");
  }

  return {
    name,
    description,
    imageUrl,
    projectUrl,
    brochureUrl: brochureRaw || null,
    imageFit: fitRaw === "cover" ? "cover" : "contain",
    order: Number.isFinite(order) ? order : 0,
  };
}

export async function createProjectAction(formData: FormData): Promise<void> {
  await requireSession();
  const data = readProjectFields(formData);

  await prisma.project.create({ data });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProjectAction(id: string, formData: FormData): Promise<void> {
  await requireSession();
  const data = readProjectFields(formData);

  await prisma.project.update({ where: { id }, data });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await requireSession();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
